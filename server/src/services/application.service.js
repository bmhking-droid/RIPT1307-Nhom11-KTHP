const repository = require("../repositories/application.repository");
const { sequelize, User, Profile, University, Major, AdmissionRound, AdmissionCombination, ApplicationDocument, ApplicationStatusHistory, Application } = require("../models");
const mailService = require("./mail.service");
const { APPLICATION_STATUS } = require("../utils/constants");
const { getSettings } = require("../utils/settings");

exports.createApplication = async (userId, payload) => {
  const settings = getSettings();
  if (!settings.allowCandidateSubmit) {
    throw new Error("Hệ thống hiện đang đóng, không nhận hồ sơ đăng ký xét tuyển!");
  }

  // Kiểm tra xem thí sinh đã nộp hồ sơ cho nguyện vọng này chưa (trùng Trường, Ngành, Đợt tuyển sinh)
  const existingApp = await Application.findOne({
    where: {
      userId,
      universityId: payload.universityId,
      majorId: payload.majorId,
      roundId: payload.roundId
    }
  });

  if (existingApp) {
    throw new Error("Bạn đã nộp hồ sơ xét tuyển cho ngành này ở đợt tuyển sinh hiện tại rồi!");
  }

  const transaction = await sequelize.transaction();

  try {
    const university = await University.findByPk(payload.universityId);
    if (!university) throw new Error("University not found");

    const major = await Major.findOne({ where: { id: payload.majorId, universityId: payload.universityId } });
    if (!major) throw new Error("Major does not belong to university");

    const round = await AdmissionRound.findByPk(payload.roundId);
    if (!round) throw new Error("Admission round not found");

    const now = new Date();
    if (now < round.startDate || now > round.endDate) throw new Error("Admission round is closed");

    const combination = await AdmissionCombination.findByPk(payload.combinationId);
    if (!combination) throw new Error("Admission combination not found");

    const application = await repository.create({ ...payload, userId, status: APPLICATION_STATUS.PENDING }, transaction);

    if (Array.isArray(payload.documents) && payload.documents.length) {
      const documents = payload.documents.map((document) => ({
        applicationId: application.id,
        documentType: String(document.documentType).toUpperCase(),
        fileUrl: document.fileUrl || document.filePath || "",
        originalName: document.originalName || document.fileName || "",
        fileSize: document.fileSize,
      }));
      await ApplicationDocument.bulkCreate(documents, { transaction });
    }

    await ApplicationStatusHistory.create({ applicationId: application.id, oldStatus: null, newStatus: APPLICATION_STATUS.PENDING, changedBy: userId }, { transaction });

    await transaction.commit();

    // Gửi email xác nhận nộp hồ sơ bất đồng bộ ở background, tránh chặn luồng HTTP khi SMTP kết nối chậm/nghẽn
    repository.findById(application.id)
      .then((fullApp) => {
        if (fullApp?.User?.email) {
          mailService.sendApplicationSubmissionEmail(fullApp.User.email, fullApp).catch((mailError) => {
            console.error("Lỗi gửi mail xác nhận nộp hồ sơ:", mailError.message);
          });
        }
      })
      .catch((err) => {
        console.error("Lỗi truy vấn hồ sơ để gửi email xác nhận:", err.message);
      });

    return application;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getMyApplications = async (userId) => {
  return await repository.findByUserId(userId);
};

exports.getAll = async (filters) => {
  return await repository.findAll(filters);
};

exports.getApplicationDetail = async (id, user) => {
  const application = await repository.findById(id);
  if (!application) throw new Error("Application not found");
  if (user.role === "CANDIDATE" && application.userId !== user.id) throw new Error("Access denied");
  return application;
};

exports.updateStatus = async (id, payload, adminId) => {
  const transaction = await sequelize.transaction();
  try {
    const application = await repository.findById(id);
    if (!application) throw new Error("Application not found");

    const allowedStatuses = [APPLICATION_STATUS.PENDING, APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED];
    if (!allowedStatuses.includes(payload.status)) throw new Error("Invalid status");

    const oldStatus = application.status;
    await repository.updateStatus(application, { 
      status: payload.status, 
      reviewedAt: new Date(), 
      reviewedBy: adminId 
    }, transaction);
    await ApplicationStatusHistory.create({ 
      applicationId: application.id, 
      oldStatus, 
      newStatus: payload.status, 
      reason: payload.rejectionReason || null, 
      changedBy: adminId 
    }, { transaction });

    await transaction.commit();

    // Gửi email thông báo trạng thái bất đồng bộ ở background, tránh chặn luồng HTTP
    repository.findById(id)
      .then((updatedApplication) => {
        if (updatedApplication?.User?.email) {
          mailService.sendApplicationStatusEmail(
            updatedApplication.User.email,
            payload.status,
            payload.rejectionReason,
            updatedApplication
          ).catch((mailError) => {
            console.error("Failed to send status email:", mailError.message);
          });
        } else if (application.user && application.user.email) {
          mailService.sendApplicationStatusEmail(
            application.user.email,
            payload.status,
            payload.rejectionReason,
            application
          ).catch((mailError) => {
            console.error("Failed to send status email:", mailError.message);
          });
        }
      })
      .catch((err) => {
        console.error("Lỗi truy vấn hồ sơ để gửi email trạng thái:", err.message);
      });

    return application;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.publicLookup = async (searchKey) => {
  if (!searchKey) throw new Error("Vui lòng cung cấp Email hoặc số CCCD!");
  
  const trimmedKey = String(searchKey).trim().toLowerCase();
  
  // 1. Tìm user theo email hoặc cccd
  const user = await User.findOne({
    include: [{
      model: Profile,
      as: "profile",
      where: {
        [sequelize.Sequelize.Op.or]: [
          sequelize.Sequelize.where(
            sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('profile.cccd')),
            trimmedKey
          ),
          sequelize.Sequelize.where(
            sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('User.email')),
            trimmedKey
          )
        ]
      }
    }]
  });
  
  if (!user) {
    // Dự phòng tìm kiếm chỉ bằng Email trong User
    const userByEmail = await User.findOne({
      where: sequelize.Sequelize.where(
        sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('email')),
        trimmedKey
      ),
      include: [{ model: Profile, as: "profile" }]
    });
    if (!userByEmail) {
      throw new Error("Không tìm thấy thông tin thí sinh khớp với từ khóa tìm kiếm!");
    }
    return await exports.getMyApplications(userByEmail.id);
  }
  
  return await exports.getMyApplications(user.id);
};

exports.exportExcel = async (filters) => {
  const ExcelJS = require("exceljs");
  const applications = await repository.findAll({ ...filters, isExport: true });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Danh sách xét tuyển");

  worksheet.columns = [
    { header: "Mã hồ sơ", key: "id", width: 25 },
    { header: "Họ và tên", key: "fullName", width: 25 },
    { header: "CCCD", key: "cccd", width: 15 },
    { header: "Ngày sinh", key: "dateOfBirth", width: 15 },
    { header: "Giới tính", key: "gender", width: 12 },
    { header: "Email", key: "email", width: 25 },
    { header: "Số điện thoại", key: "phone", width: 15 },
    { header: "Tỉnh/Thành phố", key: "province", width: 20 },
    { header: "Địa chỉ chi tiết", key: "address", width: 30 },
    { header: "Trường xét tuyển", key: "university", width: 30 },
    { header: "Ngành xét tuyển", key: "major", width: 25 },
    { header: "Đợt tuyển sinh", key: "round", width: 25 },
    { header: "Tổ hợp môn", key: "combination", width: 15 },
    { header: "Điểm xét tuyển", key: "totalScore", width: 15 },
    { header: "Trạng thái", key: "status", width: 15 },
    { header: "Ngày nộp", key: "submittedAt", width: 20 },
    { header: "Học bạ THPT", key: "docTranscript", width: 30 },
    { header: "CCCD/CMND", key: "docCccd", width: 30 },
    { header: "Chứng chỉ Tiếng Anh", key: "docEnglish", width: 30 },
    { header: "Giấy ưu tiên", key: "docPriority", width: 30 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { name: "Times New Roman", size: 12, bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1677FF" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 30;

  applications.forEach((app) => {
    const user = app.User || {};
    const profile = user.profile || {};

    const docs = app.documents || [];
    const getDocUrl = (type) => {
      const doc = docs.find((d) => d.documentType === type);
      if (!doc) return "";
      // Nếu là đường dẫn tương đối, ghép thêm host API
      if (doc.fileUrl && doc.fileUrl.startsWith("/")) {
        return `${process.env.API_URL || "https://online-admission-api.onrender.com"}${doc.fileUrl}`;
      }
      return doc.fileUrl || "";
    };

    const transcriptUrl = getDocUrl("HOC_BA");
    const cccdUrl = getDocUrl("CCCD");
    const englishUrl = getDocUrl("CHUNG_CHI_TIENG_ANH");
    const priorityUrl = getDocUrl("GIAY_UU_TIEN");

    let statusText = "Đang chờ";
    if (app.status === "approved") statusText = "Đã duyệt";
    if (app.status === "rejected") statusText = "Yêu cầu cập nhật";

    const rowData = {
      id: app.id,
      fullName: profile.fullName || "",
      cccd: profile.cccd || "",
      dateOfBirth: profile.dateOfBirth || "",
      gender: profile.gender || "",
      email: user.email || "",
      phone: profile.phone || "",
      province: profile.province || "",
      address: profile.address || "",
      university: app.University ? app.University.name : "",
      major: app.Major ? app.Major.name : "",
      round: app.AdmissionRound ? app.AdmissionRound.name : "",
      combination: app.AdmissionCombination ? app.AdmissionCombination.name : "",
      totalScore: app.totalScore ? Number(app.totalScore) : 0,
      status: statusText,
      submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "",
      docTranscript: transcriptUrl,
      docCccd: cccdUrl,
      docEnglish: englishUrl,
      docPriority: priorityUrl,
    };

    const row = worksheet.addRow(rowData);

    const statusCell = row.getCell("status");
    if (app.status === "approved") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9F7BE" } };
      statusCell.font = { color: { argb: "389E0D" }, bold: true };
    } else if (app.status === "rejected") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F0" } };
      statusCell.font = { color: { argb: "CF1322" }, bold: true };
    } else {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFBE6" } };
      statusCell.font = { color: { argb: "D46B08" }, bold: true };
    }
  });

  worksheet.eachRow((row, rowNumber) => {
    row.font = { name: "Times New Roman", size: 11 };
    row.alignment = { vertical: "middle" };
    
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "E8E8E8" } },
        left: { style: "thin", color: { argb: "E8E8E8" } },
        bottom: { style: "thin", color: { argb: "E8E8E8" } },
        right: { style: "thin", color: { argb: "E8E8E8" } },
      };
    });
  });

  return workbook;
};
