# Hệ Thống Tuyển Sinh Xét Tuyển Học Bạ THPT Trực Tuyến

Chào mừng bạn đến với **Hệ Thống Tuyển Sinh Xét Tuyển Học Bạ THPT Trực Tuyến**. Đây là nền tảng quản lý quy trình xét tuyển học bạ đại học toàn diện, được thiết kế hiện đại, tối ưu trải nghiệm cho cả Thí sinh và Hội đồng Tuyển sinh (Admin).

Hệ thống được phát triển với kiến trúc tách biệt hoàn toàn giữa Frontend (React/UmiJS) và Backend (NodeJS/Express), tích hợp các giải pháp đám mây tối ưu để hoạt động ổn định 100% trên môi trường Production như Render và Netlify.

---

## 🌟 Tính Năng Nổi Bật

### 🧑‍🎓 Dành Cho Thí Sinh (Candidate)
* **Đăng Ký & Xác Thực Tài Khoản**: Quy trình đăng ký đơn giản, tự động gửi email chào mừng và kích hoạt tài khoản.
* **Quản Lý Hồ Sơ Cá Nhân**: Cập nhật thông tin chi tiết (Họ tên, Ngày sinh, CCCD/CMND, Số điện thoại, Địa chỉ, Tỉnh/Thành phố) và tự động đồng bộ khi nộp hồ sơ.
* **Nộp Đơn Xét Tuyển Học Bạ**:
  - Chọn Phương thức tuyển sinh, Tổ hợp môn xét tuyển, Đợt tuyển sinh.
  - Chọn Trường Đại học và Ngành học mong muốn.
  - Nhập điểm học tập và tải lên trực tiếp tài liệu minh chứng (Ảnh thẻ , Ảnh CCCD, Học bạ THPT...).
* **Theo Dõi Trạng Thái Hồ Sơ**: Xem trạng thái hồ sơ theo thời gian thực (Đang chờ duyệt, Đã duyệt, Bị từ chối) cùng lý do chi tiết từ Admin.

### 🧑‍💼 Dành Cho Hội Đồng Tuyển Sinh (Admin)
* **Bảng Điều Khiển (Dashboard)**: Thống kê số lượng hồ sơ nộp, tỷ lệ phê duyệt và biểu đồ phân bổ hồ sơ theo đợt xét tuyển.
* **Quản Lý Hồ Sơ Nộp**:
  - Xem chi tiết từng hồ sơ nộp trực tuyến kèm theo các file minh chứng gốc được mở xem trực tiếp trên trình duyệt.
  - Duyệt hoặc Từ chối hồ sơ kèm phản hồi/nhận xét cho thí sinh.
  - **Tự động gửi email thông báo**: Hệ thống tự động gửi email thông báo kết quả chi tiết cho thí sinh ngay khi Admin cập nhật trạng thái hồ sơ.
* **Tìm Kiếm Nâng Cao (Smart Search)**: Bộ lọc tối ưu hóa tìm kiếm hồ sơ theo Họ tên, Email, CCCD hoặc Mã hồ sơ (ID) với độ chính xác cao và hiệu năng mượt mà.

---

## 🛠️ Công Nghệ Sử Dụng

| Thành Phần | Công Nghệ & Thư Viện chính |
| :--- | :--- |
| **Frontend** | **ReactJS**, **UmiJS v4** (Framework chính), **TypeScript**, **Ant Design v6** (Giao diện người dùng), **Axios** (Giao tiếp API) |
| **Backend** | **NodeJS**, **ExpressJS** (RESTful API), **Sequelize ORM** (Quản lý database), **Morgan/Winston** (Logging & Monitor), **Express-Validator** (Xác thực đầu vào) |
| **Cơ Sở Dữ Liệu** | **MySQL** (Hosting trên đám mây **Aiven Cloud** với chế độ kết nối bảo mật SSL) |
| **Lưu Trữ Tệp Tin** | **Catbox.moe API Gateway** (Bộ nhớ đám mây lưu trữ tài liệu minh chứng) |
| **Hộp Thư Tự Động** | **Google Apps Script Gateway** (Cổng SMTP vượt tường lửa Render để gửi mail giao dịch ) |

---

## 🚀 Khởi Chạy Dưới Local (Local Development)

### Yêu Cầu Cài Đặt Trước:
* Node.js (phiên bản khuyến nghị `>= 16.x`)
* MySQL Database Server

### 1. Cấu Hình & Chạy Backend (Server)
1. Truy cập vào thư mục `server`:
   ```bash
   cd server
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env` trong thư mục `server` và khai báo các thông số kết nối Database, JWT:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=tuyensinh_db
   JWT_SECRET=super_secret_key
   ```
4. Khởi chạy Backend ở chế độ phát triển:
   ```bash
   npm run dev
   ```

### 2. Cấu Hình & Chạy Frontend (Client)
1. Truy cập vào thư mục `client`:
   ```bash
   cd ../client
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy Frontend dưới môi trường Local:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt truy cập: `http://localhost:8000/`

---

## 🌐 Hướng Dẫn Triển Khai Lên Đám Mây (Production)

Hệ thống đã được cấu hình tối ưu để triển khai lên Render (Backend) và Netlify (Frontend) hoàn toàn miễn phí. Để biết hướng dẫn thiết lập chi tiết từng bước, vui lòng đọc tài liệu hướng dẫn triển khai chính thức của chúng tôi tại:

👉 **[HƯỚNG DẪN TRIỂN KHAI (DEPLOYMENT.md)](./DEPLOYMENT.md)**

---

## 👥 Thành Viên Thực Hiện

Dự án được xây dựng và phát triển bởi **Nhóm 11 **. Chúc các bạn có trải nghiệm tuyệt vời khi trải nghiệm sản phẩm!
