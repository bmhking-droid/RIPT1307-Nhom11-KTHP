USE online_admission;

-- =====================================================================
-- KHỞI TẠO BIẾN TẠM ĐỂ LƯU TRỮ CÁC MÃ ĐỊNH DANH (UUID) TỰ SINH
-- =====================================================================
SET @user_super_admin = UUID();
SET @user_admin_1     = UUID();
SET @user_admin_2     = UUID();
SET @user_candidate_1 = UUID();
SET @user_candidate_2 = UUID();
SET @user_candidate_3 = UUID();
SET @user_candidate_4 = UUID();
SET @user_candidate_5 = UUID();

SET @uni_ptit         = UUID();
SET @uni_hust         = UUID();

SET @major_cntt_ptit  = UUID();
SET @major_attt_ptit  = UUID();
SET @major_cntt_hust  = UUID();

SET @combo_a00        = UUID();
SET @combo_a01        = UUID();
SET @combo_d01        = UUID();

SET @round_1_2026     = UUID();
SET @round_2_2026     = UUID();

SET @app_1            = UUID();
SET @app_2            = UUID();
SET @app_3            = UUID();

-- =====================================================================
-- 1. CHÈN DỮ LIỆU BẢNG: USERS
-- =====================================================================
INSERT INTO users (id, email, password, role, isActive, emailVerified) VALUES
(@user_super_admin, 'superadmin@admission.edu.vn', '$2b$10$3VtQ4aHKvWrK8uvmawnEDOO416bC3tVotuJg3g0hyNBDqYFGZLpSe', 'ADMIN', TRUE, TRUE),
(@user_admin_1, 'hanoi.admin@admission.edu.vn', '$2b$10$3VtQ4aHKvWrK8uvmawnEDOO416bC3tVotuJg3g0hyNBDqYFGZLpSe', 'ADMIN', TRUE, TRUE),
(@user_admin_2, 'admin@admission.edu.vn', '$2b$10$3VtQ4aHKvWrK8uvmawnEDOO416bC3tVotuJg3g0hyNBDqYFGZLpSe', 'ADMIN', TRUE, TRUE),
(@user_candidate_1, 'nguyenvana@gmail.com', '$2b$10$3VtQ4aHKvWrK8uvmawnEDOO416bC3tVotuJg3g0hyNBDqYFGZLpSe', 'CANDIDATE', TRUE, TRUE),
(@user_candidate_2, 'lethib@gmail.com', '$2b$10$3VtQ4aHKvWrK8uvmawnEDOO416bC3tVotuJg3g0hyNBDqYFGZLpSe', 'CANDIDATE', TRUE, TRUE),
(@user_candidate_3, 'tranvanc@gmail.com', '$2b$10$3VtQ4aHKvWrK8uvmawnEDOO416bC3tVotuJg3g0hyNBDqYFGZLpSe', 'CANDIDATE', TRUE, FALSE),
(@user_candidate_4, 'user01@gmail.com', '$2b$10$MtpWpUxtbp3Blk6ljLp8d.xFM/MffLI1xB9Mq6HuOZHJFPgwBBFhu', 'CANDIDATE', TRUE, TRUE),
(@user_candidate_5, 'bpn141205@gmail.com', '$2b$10$eorb9p1KhOzpnrCJQLBfsO/tmXOd78aq0CM/eD/0WLNiTarGPwGey', 'CANDIDATE', TRUE, TRUE);

-- =====================================================================
-- 2. CHÈN DỮ LIỆU BẢNG: PROFILES
-- =====================================================================
INSERT INTO profiles (id, userId, fullName, cccd, dateOfBirth, gender, phone, address, priorityGroup) VALUES
(UUID(), @user_super_admin, 'Nguyễn Hệ Thống', NULL, '1990-01-01', 'Nam', '0999888777', 'Quận Cầu Giấy, Hà Nội', 'KV3'),
(UUID(), @user_admin_1, 'Trần Minh Hoàng', '001095001234', '1988-05-12', 'Nam', '0912345678', 'Quận Hai Bà Trưng, Hà Nội', 'KV3'),
(UUID(), @user_admin_2, 'Quản trị viên Hệ thống', '001095009999', '1992-10-24', 'Nam', '0922334455', 'Quận Ba Đình, Hà Nội', 'KV3'),
(UUID(), @user_candidate_1, 'Nguyễn Văn An', '001206009876', '2008-03-24', 'Nam', '0987654321', 'Huyện Thạch Thất, Hà Nội', 'KV2-NT'),
(UUID(), @user_candidate_2, 'Lê Thị Bình', '038206004567', '2008-08-15', 'Nữ', '0977112233', 'Thành phố Vinh, Nghệ An', 'KV1'),
(UUID(), @user_candidate_3, 'Trần Văn Cường', '024206001111', '2008-11-02', 'Nam', '0966554433', 'Thành phố Phủ Lý, Hà Nam', 'KV2'),
(UUID(), @user_candidate_4, 'Người dùng 01', '038206009999', '2008-05-18', 'Nữ', '0988776655', 'Thành phố Hà Tĩnh, Hà Tĩnh', 'KV2'),
(UUID(), @user_candidate_5, 'Bùi Ngọc', '038206008888', '2008-12-14', 'Nam', '0912345679', 'Hà Nội', 'KV3');

-- =====================================================================
-- 3. CHÈN DỮ LIỆU BẢNG: UNIVERSITIES
-- =====================================================================
INSERT INTO universities (id, code, name, address, description, logoUrl) VALUES
(@uni_ptit, 'BVH', 'Học viện Công nghệ Bưu chính Viễn thông', '96A Trần Phú, Hà Đông, Hà Nội', 'Cơ sở đào tạo trọng điểm về Công nghệ thông tin và Truyền thông.', 'https://api.admission.edu.vn/static/logos/ptit.png'),
(@uni_hust, 'BKA', 'Đại học Bách khoa Hà Nội', '1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 'Trường đại học kỹ thuật đa ngành hàng đầu tại Việt Nam.', 'https://api.admission.edu.vn/static/logos/hust.png');

-- =====================================================================
-- 4. CHÈN DỮ LIỆU BẢNG: MAJORS
-- =====================================================================
INSERT INTO majors (id, universityId, code, name, quota, minScore, description) VALUES
(@major_cntt_ptit, @uni_ptit, '7480201', 'Công nghệ thông tin', 500, 26.50, 'Đào tạo kỹ sư phần mềm, hệ thống thông tin và mạng máy tính.'),
(@major_attt_ptit, @uni_ptit, '7480202', 'An toàn thông tin', 200, 25.80, 'Chuyên sâu về bảo mật hệ thống, mật mã học và ứng dụng an toàn mạng.'),
(@major_cntt_hust, @uni_hust, 'IT1', 'Khoa học máy tính', 300, 28.20, 'Ngành học mũi nhọn về trí tuệ nhân tạo, xử lý dữ liệu lớn và thuật toán.');

-- =====================================================================
-- 5. CHÈN DỮ LIỆU BẢNG: ADMISSION COMBINATIONS
-- =====================================================================
INSERT INTO admission_combinations (id, code, subjects, description) VALUES
(@combo_a00, 'A00', 'Toán, Vật lý, Hóa học', 'Khối thi khoa học tự nhiên truyền thống'),
(@combo_a01, 'A01', 'Toán, Vật lý, Tiếng Anh', 'Tổ hợp công nghệ nâng cao năng lực ngoại ngữ'),
(@combo_d01, 'D01', 'Toán, Ngữ văn, Tiếng Anh', 'Tổ hợp khoa học xã hội và ngôn ngữ');

-- CHÈN BẢNG TRUNG GIAN (Many-to-Many): MAJOR_COMBINATION
INSERT INTO major_combination (majorId, combinationId) VALUES
(@major_cntt_ptit, @combo_a00),
(@major_cntt_ptit, @combo_a01),
(@major_attt_ptit, @combo_a00),
(@major_attt_ptit, @combo_a01),
(@major_cntt_hust, @combo_a00),
(@major_cntt_hust, @combo_a01);

-- =====================================================================
-- 6. CHÈN DỮ LIỆU BẢNG: ADMISSION ROUNDS
-- =====================================================================
INSERT INTO admission_rounds (id, name, startDate, endDate, status) VALUES
(@round_1_2026, 'Xét tuyển dựa trên học bạ THPT - Đợt 1', '2026-03-01', '2026-05-15', 'ended'),
(@round_2_2026, 'Xét tuyển kết quả thi tốt nghiệp THPT - Đợt chính thức', '2026-06-01', '2026-07-25', 'ongoing');

-- =====================================================================
-- 7. CHÈN DỮ LIỆU BẢNG: APPLICATIONS
-- =====================================================================
INSERT INTO applications (id, userId, universityId, majorId, combinationId, roundId, totalScore, status, submittedAt, reviewedAt, reviewedBy) VALUES
(@app_1, @user_candidate_1, @uni_ptit, @major_cntt_ptit, @combo_a00, @round_2_2026, 27.25, 'approved', '2026-06-02 09:15:30', '2026-06-05 14:20:00', @user_admin_1),
(@app_2, @user_candidate_2, @uni_ptit, @major_attt_ptit, @combo_a01, @round_2_2026, 24.10, 'rejected', '2026-06-03 11:40:22', '2026-06-06 10:11:15', @user_admin_1),
(@app_3, @user_candidate_3, @uni_hust, @major_cntt_hust, @combo_a00, @round_2_2026, 28.50, 'pending', '2026-06-04 16:05:00', NULL, NULL);

-- =====================================================================
-- 8. CHÈN DỮ LIỆU BẢNG: APPLICATION DOCUMENTS
-- =====================================================================
INSERT INTO application_documents (id, applicationId, documentType, fileUrl, originalName, fileSize) VALUES
(UUID(), @app_1, 'HOC_BA', 'https://api.admission.edu.vn/uploads/docs/nguyenvana_hocba.pdf', 'Học bạ THPT toàn khóa - Nguyễn Văn An.pdf', 3542100),
(UUID(), @app_1, 'CCCD', 'https://api.admission.edu.vn/uploads/docs/nguyenvana_cccd.png', 'Mặt trước sau CCCD.png', 1245000),
(UUID(), @app_2, 'HOC_BA', 'https://api.admission.edu.vn/uploads/docs/lethib_hocba.pdf', 'HocBaMinhChung_LeThiBinh.pdf', 4120800),
(UUID(), @app_3, 'HOC_BA', 'https://api.admission.edu.vn/uploads/docs/tranvanc_hocba.pdf', 'Scan_Hoc_Ba_TranVanCuong.pdf', 2890000);

-- =====================================================================
-- 9. CHÈN DỮ LIỆU BẢNG: APPLICATION STATUS HISTORY
-- =====================================================================
INSERT INTO application_status_history (id, applicationId, oldStatus, newStatus, reason, changedBy, changedAt) VALUES
(UUID(), @app_1, 'pending', 'approved', 'Hồ sơ đầy đủ tài liệu minh chứng, điểm xét tuyển đạt ngưỡng quy định.', @user_admin_1, '2026-06-05 14:20:00'),
(UUID(), @app_2, 'pending', 'rejected', 'Điểm tổng hợp tổ hợp A01 không đạt điểm sàn tối thiểu của ngành (Yêu cầu >= 25.80).', @user_admin_1, '2026-06-06 10:11:15');