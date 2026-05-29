const repository = require("../repositories/application.repository");
const { sequelize, User, Profile, University, Major, AdmissionRound, AdmissionCombination, ApplicationDocument, ApplicationStatusHistory } = require("../models");
const mailService = require("./mail.service");
const { APPLICATION_STATUS } = require("../utils/constants");
const { getSettings } = require("../utils/settings");

exports.createApplication = async (userId, payload) => {
  const settings = getSettings();
  if (!settings.allowCandidateSubmit) {
    throw new Error("Hệ thống hiện đang đóng, không nhận hồ sơ đăng ký xét tuyển!");
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
