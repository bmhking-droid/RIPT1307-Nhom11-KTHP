online-admission-system/
│
├── client/                         # Frontend React + UmiJS + Ant 
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Public/
│   │   │   ├── Candidate/
│   │   │   └── Admin/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── access.ts
│   │   ├── app.tsx
│   │   └── global.less
│   │
│   ├── config/
│   │   ├── config.ts
│   │   ├── routes.ts
│   │   └── proxy.ts
│   │
│   ├── .env
│   ├── .env.production
│   ├── netlify.toml
│   └── package.json
│
├── server/                         # Backend NodeJS + Express + MySQL
│   ├── src/
│   │   ├── configs/
│   │   │   ├── database.js          # Kết nối MySQL
│   │   │   ├── jwt.js
│   │   │   ├── mail.js
│   │   │   └── upload.js
│   │   │
│   │   ├── models/                 # Sequelize Models
│   │   │   ├── index.js
│   │   │   ├── user.model.js
│   │   │   ├── profile.model.js
│   │   │   ├── university.model.js
│   │   │   ├── major.model.js
│   │   │   ├── admissionRound.model.js
│   │   │   ├── admissionCombination.model.js
│   │   │   ├── application.model.js
│   │   │   ├── applicationDocument.model.js
│   │   │   └── applicationStatusHistory.model.js
│   │   │
│   │   ├── migrations/             # Tạo bảng MySQL
│   │   │   ├── 001-create-users.js
│   │   │   ├── 002-create-profiles.js
│   │   │   ├── 003-create-universities.js
│   │   │   ├── 004-create-majors.js
│   │   │   ├── 005-create-admission-rounds.js
│   │   │   ├── 006-create-admission-combinations.js
│   │   │   ├── 007-create-applications.js
│   │   │   ├── 008-create-application-documents.js
│   │   │   └── 009-create-application-status-history.js
│   │   │
│   │   ├── seeders/                # Dữ liệu mẫu
│   │   │   ├── 001-admin.seeder.js
│   │   │   ├── 002-university.seeder.js
│   │   │   ├── 003-major.seeder.js
│   │   │   └── 004-combination.seeder.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── profile.controller.js
│   │   │   ├── university.controller.js
│   │   │   ├── major.controller.js
│   │   │   ├── admissionRound.controller.js
│   │   │   ├── admissionCombination.controller.js
│   │   │   ├── application.controller.js
│   │   │   ├── upload.controller.js
│   │   │   └── report.controller.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   ├── profile.service.js
│   │   │   ├── university.service.js
│   │   │   ├── major.service.js
│   │   │   ├── admissionRound.service.js
│   │   │   ├── admissionCombination.service.js
│   │   │   ├── application.service.js
│   │   │   ├── upload.service.js
│   │   │   ├── mail.service.js
│   │   │   └── report.service.js
│   │   │
│   │   ├── repositories/
│   │   │   ├── user.repository.js
│   │   │   ├── profile.repository.js
│   │   │   ├── university.repository.js
│   │   │   ├── major.repository.js
│   │   │   ├── admissionRound.repository.js
│   │   │   ├── admissionCombination.repository.js
│   │   │   ├── application.repository.js
│   │   │   └── report.repository.js
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── profile.routes.js
│   │   │   ├── university.routes.js
│   │   │   ├── major.routes.js
│   │   │   ├── admissionRound.routes.js
│   │   │   ├── admissionCombination.routes.js
│   │   │   ├── application.routes.js
│   │   │   ├── upload.routes.js
│   │   │   └── report.routes.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── notFound.middleware.js
│   │   │
│   │   ├── validations/
│   │   │   ├── auth.validation.js
│   │   │   ├── user.validation.js
│   │   │   ├── profile.validation.js
│   │   │   ├── application.validation.js
│   │   │   └── category.validation.js
│   │   │
│   │   ├── utils/
│   │   │   ├── response.js
│   │   │   ├── pagination.js
│   │   │   ├── generateToken.js
│   │   │   ├── logger.js
│   │   │   └── constants.js
│   │   │
│   │   ├── uploads/
│   │   │   ├── cccd/
│   │   │   ├── hoc-ba/
│   │   │   ├── diem-thi/
│   │   │   └── uu-tien/
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .sequelizerc
│   ├── package.json
│   └── nodemon.json
│
├── database/
│   ├── mysql-schema.sql
│   ├── mysql-seed.sql
│   ├── erd/
│   │   ├── erd.drawio
│   │   └── erd.png
│   └── backup/
│
├── docs/
│   ├── SRS/
│   ├──API/
│   ├── TESTCASE/
│   ├── MOCKUP/
│   └── DEPLOYMENT/
│
├── .gitignore
├── README.md
└── package.json

