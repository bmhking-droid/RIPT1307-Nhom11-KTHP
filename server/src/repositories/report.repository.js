const { sequelize } = require("../models");
const {
  Application,
  University,
  Major,
  AdmissionRound,
  Profile,
  User,
} = require("../models");

// ============ STATISTICS FUNCTIONS ============

exports.countByStatus = async () => {
  const [data] = await sequelize.query(`
    SELECT 
      status,
      COUNT(*) as total
    FROM applications
    GROUP BY status
  `);

  return data;
};

exports.countByUniversity = async () => {
  const [data] = await sequelize.query(`
    SELECT 
      u.name,
      COUNT(a.id) as total
    FROM applications a
    JOIN universities u
    ON a.universityId = u.id
    GROUP BY u.name
  `);

  return data;
};

exports.countByMajor = async () => {
  const [data] = await sequelize.query(`
    SELECT 
      m.name,
      COUNT(a.id) as total
    FROM applications a
    JOIN majors m
    ON a.majorId = m.id
    GROUP BY m.name
  `);

  return data;
};

exports.countByAdmissionRound = async () => {
  const [data] = await sequelize.query(`
    SELECT 
      ar.name,
      COUNT(a.id) as total
    FROM applications a
    JOIN admission_rounds ar
    ON a.admissionRoundId = ar.id
    GROUP BY ar.name
  `);

  return data;
};

// ============ DETAILED DATA FUNCTIONS ============

/**
 * Lấy danh sách ứng dụng chi tiết với điều kiện lọc
 */
exports.getAllApplicationsDetailed = async (filters = {}) => {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.universityId) {
    where.universityId = filters.universityId;
  }

  if (filters.majorId) {
    where.majorId = filters.majorId;
  }

  if (filters.admissionRoundId) {
    where.admissionRoundId = filters.admissionRoundId;
  }

  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      [sequelize.Sequelize.Op.between]: [
        new Date(filters.startDate),
        new Date(filters.endDate),
      ],
    };
  }

  return await Application.findAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "email"],
        include: [
          {
            model: Profile,
            as: "profile",
            attributes: [
              "fullName",
              "cccd",
              "dateOfBirth",
              "gender",
              "phone",
              "address",
              "priorityGroup",
            ],
          },
        ],
      },
      {
        model: University,
        attributes: ["id", "name", "code"],
      },
      {
        model: Major,
        attributes: ["id", "name", "code"],
      },
      {
        model: AdmissionRound,
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    raw: false,
  });
};

/**
 * Lấy thống kê theo trạng thái hồ sơ
 */
exports.getApplicationStatusStatistics = async (filters = {}) => {
  const where = {};

  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      [sequelize.Sequelize.Op.between]: [
        new Date(filters.startDate),
        new Date(filters.endDate),
      ],
    };
  }

  if (filters.universityId) {
    where.universityId = filters.universityId;
  }

  const [data] = await sequelize.query(`
    SELECT 
      status,
      COUNT(*) as total,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applications), 2) as percentage
    FROM applications
    ${Object.keys(where).length > 0 ? "WHERE" : ""}
    GROUP BY status
  `);

  return data;
};

/**
 * Lấy thống kê theo ngành học
 */
exports.getApplicationByMajor = async (filters = {}) => {
  const where = {};

  if (filters.universityId) {
    where.universityId = filters.universityId;
  }

  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      [sequelize.Sequelize.Op.between]: [
        new Date(filters.startDate),
        new Date(filters.endDate),
      ],
    };
  }

  return await Application.findAll({
    attributes: [
      [sequelize.Sequelize.fn("COUNT", sequelize.Sequelize.col("id")), "total"],
    ],
    include: [
      {
        model: Major,
        attributes: ["name", "code"],
        required: true,
      },
      {
        model: University,
        attributes: ["name"],
        required: true,
      },
    ],
    where,
    group: ["majorId"],
    raw: false,
  });
};

/**
 * Lấy thống kê theo đợt tuyển sinh
 */
exports.getApplicationByAdmissionRound = async (filters = {}) => {
  const where = {};

  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      [sequelize.Sequelize.Op.between]: [
        new Date(filters.startDate),
        new Date(filters.endDate),
      ],
    };
  }

  return await Application.findAll({
    attributes: [
      [sequelize.Sequelize.fn("COUNT", sequelize.Sequelize.col("id")), "total"],
    ],
    include: [
      {
        model: AdmissionRound,
        attributes: ["name"],
        required: true,
      },
    ],
    where,
    group: ["admissionRoundId"],
    raw: false,
  });
};

/**
 * Lấy danh sách ứng dụng theo khoảng thời gian
 */
exports.getApplicationsByDateRange = async (startDate, endDate, filters = {}) => {
  const where = {
    createdAt: {
      [sequelize.Sequelize.Op.between]: [
        new Date(startDate),
        new Date(endDate),
      ],
    },
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.universityId) {
    where.universityId = filters.universityId;
  }

  if (filters.majorId) {
    where.majorId = filters.majorId;
  }

  return await Application.findAll({
    where,
    include: [
      {
        model: University,
        attributes: ["name"],
      },
      {
        model: Major,
        attributes: ["name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["email"],
        include: [
          {
            model: Profile,
            as: "profile",
            attributes: ["fullName", "phone"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};