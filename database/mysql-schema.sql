-- 1. Users
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'super_admin') DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 2. Profiles
CREATE TABLE profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    cccd VARCHAR(20) UNIQUE,
    date_of_birth DATE,
    gender ENUM('Nam', 'Nữ', 'Khác'),
    phone VARCHAR(20),
    address TEXT,
    priority_group VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- 3. Universities
CREATE TABLE universities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    description TEXT,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- 4. Majors (Ngành học)
CREATE TABLE majors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    university_id CHAR(36) NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    quota INT,
    min_score DECIMAL(4,2),
    description TEXT,
    FOREIGN KEY (university_id) REFERENCES universities(id),
    UNIQUE KEY uk_major (university_id, code)
);


-- 5. Admission Combinations (Tổ hợp)
CREATE TABLE admission_combinations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(10) UNIQUE NOT NULL,        -- A00, A01, D01...
    subjects VARCHAR(100),
    description TEXT
);


-- Bảng trung gian Many-to-Many
CREATE TABLE major_combination (
    major_id CHAR(36) NOT NULL,
    combination_id CHAR(36) NOT NULL,
    PRIMARY KEY (major_id, combination_id),
    FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE CASCADE,
    FOREIGN KEY (combination_id) REFERENCES admission_combinations(id) ON DELETE CASCADE
);


-- 6. Admission Rounds (Đợt tuyển sinh)
CREATE TABLE admission_rounds (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('upcoming', 'ongoing', 'ended') DEFAULT 'upcoming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- 7. Applications (Hồ sơ)
CREATE TABLE applications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    university_id CHAR(36) NOT NULL,
    major_id CHAR(36) NOT NULL,
    combination_id CHAR(36) NOT NULL,
    round_id CHAR(36) NOT NULL,
   
    total_score DECIMAL(5,2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
   
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewed_by CHAR(36),
   
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (university_id) REFERENCES universities(id),
    FOREIGN KEY (major_id) REFERENCES majors(id),
    FOREIGN KEY (combination_id) REFERENCES admission_combinations(id),
    FOREIGN KEY (round_id) REFERENCES admission_rounds(id),
    UNIQUE KEY uk_one_application_per_round (user_id, round_id, major_id)
);


-- 8. Application Documents
CREATE TABLE application_documents (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id CHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,     -- hoc_ba, cccd, giay_ut...
    file_url TEXT NOT NULL,
    original_name VARCHAR(255),
    file_size INT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);


-- 9. Status History
CREATE TABLE application_status_history (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id CHAR(36) NOT NULL,
    old_status ENUM('pending', 'approved', 'rejected'),
    new_status ENUM('pending', 'approved', 'rejected') NOT NULL,
    reason TEXT,
    changed_by CHAR(36),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);


-- Tạo Index quan trọng
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_round ON applications(round_id);
CREATE INDEX idx_documents_application ON application_documents(application_id);
