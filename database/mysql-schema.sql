CREATE DATABASE online_admission;
USE online_admission;

-- 1. Bảng Users
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('CANDIDATE', 'ADMIN') DEFAULT 'CANDIDATE', 
    isActive BOOLEAN DEFAULT TRUE,
    emailVerified BOOLEAN DEFAULT FALSE,                             
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,                     
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 2. Bảng Profiles
CREATE TABLE profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId CHAR(36) UNIQUE NOT NULL,                                  
    fullName VARCHAR(100) NOT NULL,
    cccd VARCHAR(20) UNIQUE,
    dateOfBirth DATE,
    gender ENUM('Nam', 'Nữ', 'Khác'),
    phone VARCHAR(20),
    address TEXT,
    priorityGroup VARCHAR(50),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);


-- 3. Bảng Universities
CREATE TABLE universities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    description TEXT,
    logoUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 4. Bảng Majors (Ngành học)
CREATE TABLE majors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    universityId CHAR(36) NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    quota INT,
    minScore DECIMAL(4,2),
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (universityId) REFERENCES universities(id) ON DELETE CASCADE,
    UNIQUE KEY uk_major (universityId, code)
);


-- 5. Bảng Admission Combinations (Tổ hợp môn)
CREATE TABLE admission_combinations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(10) UNIQUE NOT NULL,        -- A00, A01, D01...
    subjects VARCHAR(100),
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Bảng trung gian Many-to-Many giữa Ngành và Tổ hợp
CREATE TABLE major_combination (
    majorId CHAR(36) NOT NULL,
    combinationId CHAR(36) NOT NULL,
    PRIMARY KEY (majorId, combinationId),
    FOREIGN KEY (majorId) REFERENCES majors(id) ON DELETE CASCADE,
    FOREIGN KEY (combinationId) REFERENCES admission_combinations(id) ON DELETE CASCADE
);


-- 6. Bảng Admission Rounds (Đợt tuyển sinh)
CREATE TABLE admission_rounds (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    status ENUM('upcoming', 'ongoing', 'ended') DEFAULT 'upcoming',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 7. Bảng Applications (Hồ sơ đăng ký)
CREATE TABLE applications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId CHAR(36) NOT NULL,
    universityId CHAR(36) NOT NULL,
    majorId CHAR(36) NOT NULL,
    combinationId CHAR(36) NOT NULL,
    roundId CHAR(36) NOT NULL,
   
    totalScore DECIMAL(5,2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
   
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewedAt DATETIME,
    reviewedBy CHAR(36),
   
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (universityId) REFERENCES universities(id) ON DELETE CASCADE,
    FOREIGN KEY (majorId) REFERENCES majors(id) ON DELETE CASCADE,
    FOREIGN KEY (combinationId) REFERENCES admission_combinations(id) ON DELETE CASCADE,
    FOREIGN KEY (roundId) REFERENCES admission_rounds(id) ON DELETE CASCADE,
    UNIQUE KEY uk_one_application_per_round (userId, roundId, majorId)
);


-- 8. Bảng Application Documents (Tài liệu đính kèm)
CREATE TABLE application_documents (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    applicationId CHAR(36) NOT NULL,
    documentType VARCHAR(50) NOT NULL,     -- HOC_BA, CCCD, ...
    fileUrl TEXT NOT NULL,
    originalName VARCHAR(255),
    fileSize INT,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicationId) REFERENCES applications(id) ON DELETE CASCADE
);


-- 9. Bảng Status History (Lịch sử trạng thái hồ sơ)
CREATE TABLE application_status_history (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    applicationId CHAR(36) NOT NULL,
    oldStatus ENUM('pending', 'approved', 'rejected'),
    newStatus ENUM('pending', 'approved', 'rejected') NOT NULL,
    reason TEXT,
    changedBy CHAR(36),
    changedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicationId) REFERENCES applications(id) ON DELETE CASCADE
);


-- Tối ưu hóa hiệu năng truy vấn dữ liệu bằng Index
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_user ON applications(userId);
CREATE INDEX idx_applications_round ON applications(roundId);
CREATE INDEX idx_documents_application ON application_documents(applicationId);
