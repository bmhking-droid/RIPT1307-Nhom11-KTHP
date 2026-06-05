# 📊 Hướng Dẫn Chức Năng Xuất Báo Cáo Excel/CSV

## 📋 Tổng Quan Chức Năng

Chức năng **Xuất Báo Cáo Dữ Liệu (Export to Excel/CSV)** cho phép quản trị viên xuất thông tin tuyển sinh từ hệ thống thành các tệp Excel (.xlsx) hoặc CSV (.csv). Điều này hỗ trợ công tác thống kê, tổng hợp dữ liệu và lập báo cáo tuyển sinh một cách nhanh chóng, chính xác.

---

## 🎯 Các Tính Năng Chính

### 1. **Xuất Danh Sách Ứng Viên**
- Xuất toàn bộ danh sách thí sinh đăng ký xét tuyển
- **Thông tin bao gồm:**
  - Mã hồ sơ
  - Họ tên
  - Email
  - CCCD
  - Số điện thoại
  - Trường đại học
  - Ngành học
  - Đợt tuyển
  - Điểm
  - Trạng thái hồ sơ
  - Ngày tạo
- **Lọc theo:**
  - Trạng thái hồ sơ (Dự thảo, Đã nộp, Đang xét, Chấp nhận, Từ chối)
  - Trường đại học
  - Ngành học
  - Đợt tuyển sinh
  - Khoảng thời gian

### 2. **Xuất Thống Kê Trạng Thái**
- Thống kê số lượng hồ sơ theo từng trạng thái
- Hiển thị tỷ lệ phần trăm của mỗi trạng thái
- **Loại trạng thái:**
  - DRAFT (Dự thảo)
  - SUBMITTED (Đã nộp)
  - PENDING (Đang xét)
  - APPROVED (Chấp nhận)
  - REJECTED (Từ chối)

### 3. **Xuất Thống Kê Theo Ngành Học**
- Thống kê số hồ sơ cho mỗi ngành tại mỗi trường đại học
- Hỗ trợ lọc theo trường (tùy chọn)
- Hiển thị xếp hạng theo số lượng hồ sơ (giảm dần)

### 4. **Xuất Thống Kê Theo Đợt Tuyển Sinh**
- Thống kê số hồ sơ cho mỗi đợt tuyển sinh
- Xếp hạng theo số lượng hồ sơ

### 5. **Xuất Thống Kê Theo Trường Đại Học**
- Thống kê tổng số hồ sơ cho mỗi trường đại học
- Xếp hạng theo số lượng

---

## 🚀 Cách Sử Dụng

### **Bước 1: Truy Cập Chức Năng**
1. Đăng nhập tài khoản Admin
2. Nhấp vào menu **"Xuất báo cáo"** (icon 📋)
3. Trở đến trang `/admin/export-report`

### **Bước 2: Chọn Loại Báo Cáo**
- Có 5 tab tương ứng với 5 loại báo cáo:
  1. **Danh sách ứng viên** - Xuất danh sách chi tiết tất cả ứng viên
  2. **Thống kê trạng thái** - Xuất thống kê hồ sơ theo trạng thái
  3. **Thống kê theo ngành** - Xuất thống kê hồ sơ theo ngành học
  4. **Thống kê theo đợt tuyển** - Xuất thống kê hồ sơ theo đợt tuyển sinh
  5. **Thống kê theo trường** - Xuất thống kê hồ sơ theo trường đại học

### **Bước 3: Chọn Điều Kiện Lọc (Tùy Chọn)**
- **Đối với báo cáo Danh sách ứng viên:**
  - Trạng thái hồ sơ
  - Trường đại học
  - Ngành học
  - Đợt tuyển sinh
  - Khoảng thời gian (Từ ngày - Đến ngày)

- **Đối với báo cáo Thống kê theo ngành:**
  - Trường đại học (tùy chọn)

- **Các báo cáo khác:** Không cần lọc (xuất toàn bộ)

### **Bước 4: Chọn Định Dạng Xuất**
- **Xuất Excel (.xlsx):** Định dạng bảng tính, dễ dàng tính toán và chỉnh sửa
- **Xuất CSV (.csv):** Định dạng text, tương thích với nhiều ứng dụng

### **Bước 5: Tải Xuống**
- Nhấp nút **"Xuất Excel"** hoặc **"Xuất CSV"**
- File sẽ tải xuống tự động với tên tệp tiếng Việt
- Mở file bằng Excel, Google Sheets, hoặc ứng dụng tương thích khác

---

## 📥 Tệp Xuất Được Tạo

### **Danh Sách Ứng Viên**
- **Excel:** `danh-sach-ung-vien.xlsx`
- **CSV:** `danh-sach-ung-vien.csv`
- **Cột dữ liệu:** 11 cột (xem phần Xuất Danh Sách Ứng Viên ở trên)

### **Thống Kê Trạng Thái**
- **Excel:** `thong-ke-trang-thai.xlsx`
- **CSV:** `thong-ke-trang-thai.csv`
- **Cột:** Trạng thái, Số lượng, Tỷ lệ (%)

### **Thống Kê Theo Ngành**
- **Excel:** `thong-ke-nganh.xlsx`
- **CSV:** `thong-ke-nganh.csv`
- **Cột:** Ngành học, Trường, Số hồ sơ

### **Thống Kê Đợt Tuyển**
- **Excel:** `thong-ke-dot-tuyen.xlsx`
- **CSV:** `thong-ke-dot-tuyen.csv`
- **Cột:** Đợt tuyển sinh, Số hồ sơ

### **Thống Kê Trường**
- **Excel:** `thong-ke-truong.xlsx`
- **CSV:** `thong-ke-truong.csv`
- **Cột:** Trường đại học, Số hồ sơ

---

## 🔧 Cấu Trúc Kỹ Thuật

### **Backend (Node.js/Express)**

#### **API Endpoints**
```
GET /api/reports/export/applications/excel?status=APPROVED&universityId=1
GET /api/reports/export/applications/csv
GET /api/reports/export/status-statistics/excel
GET /api/reports/export/major-statistics/excel
GET /api/reports/export/admission-round-statistics/excel
GET /api/reports/export/university-statistics/excel
GET /api/reports/export/statistics/csv?type=status|major|university|admissionRound
```

#### **Repositories** (`report.repository.js`)
- `getAllApplicationsDetailed(filters)` - Lấy danh sách chi tiết
- `countByStatus()` - Thống kê theo trạng thái
- `countByUniversity()` - Thống kê theo trường
- `countByMajor()` - Thống kê theo ngành
- `countByAdmissionRound()` - Thống kê theo đợt tuyển

#### **Services** (`report.service.js`)
- `exportApplicationsToExcel(filters)`
- `exportApplicationsToCSV(filters)`
- `exportStatusStatisticsToExcel(filters)`
- `exportMajorStatisticsToExcel(filters)`
- `exportAdmissionRoundStatisticsToExcel(filters)`
- `exportUniversityStatisticsToExcel(filters)`
- `exportStatisticsToCSV(type, filters)`

#### **Controllers** (`report.controller.js`)
- `exportApplicationsExcel()` - Handler
- `exportApplicationsCSV()` - Handler
- `exportStatusStatisticsExcel()` - Handler
- ... (5 handlers cho các loại thống kê)

#### **Routes** (`report.routes.js`)
- 8 routes được bảo vệ bằng `authMiddleware` và `roleMiddleware("ADMIN")`

#### **Dependencies**
- `exceljs` (v4.4.0) - Xuất Excel
- `csv-stringify` (v6.5.0) - Xuất CSV

### **Frontend (React/TypeScript)**

#### **Components**
- **AdminLayout** (`client/src/layouts/AdminLayout/`)
  - Sidebar với menu Admin
  - Topbar với thông tin user
  - Support responsive design

- **ExportReport** (`client/src/pages/Admin/ExportReport/`)
  - 5 tabs cho các loại báo cáo
  - Form lọc dữ liệu
  - Nút xuất Excel/CSV

#### **Services** (`report.ts`)
- `exportApplicationsExcel(filters)`
- `exportApplicationsCSV(filters)`
- `exportStatusStatisticsExcel(filters)`
- `exportMajorStatisticsExcel(filters)`
- `exportAdmissionRoundStatisticsExcel(filters)`
- `exportUniversityStatisticsExcel(filters)`
- `exportStatisticsCSV(type, filters)`
- `exportToExcel(type, filters)` - Hàm tổng quát
- `exportToCSV(type, filters)` - Hàm tổng quát
- `downloadFile(blob, filename)` - Hàm hỗ trợ tải xuống

#### **Routes**
- `/admin/export-report` - Trang xuất báo cáo

#### **Dependencies**
- `antd` (v6.3.7) - UI Components
- `dayjs` (v1.11.20) - Xử lý ngày tháng
- `axios` (v1.16.0) - HTTP Client

---

## 🔒 Bảo Mật

### **Authentication**
- Tất cả các API endpoints yêu cầu **JWT token** (`authMiddleware`)
- Token được lưu trữ trong `localStorage` và gửi trong header `Authorization: Bearer <token>`

### **Authorization**
- Chỉ người dùng có role **ADMIN** mới có thể truy cập (`roleMiddleware("ADMIN")`)
- Các endpoint khác sẽ trả về lỗi 403 Forbidden

### **Data Validation**
- Các tham số lọc được xác thực trên server
- Chỉ các giá trị hợp lệ mới được xử lý

---

## 💡 Ví Dụ Sử Dụng

### **Ví dụ 1: Xuất Danh Sách Ứng Viên Chấp Nhận**
1. Vào `/admin/export-report`
2. Chọn tab **"Danh sách ứng viên"**
3. Chọn Trạng thái = **"Chấp nhận"**
4. Nhấp **"Xuất Excel"**
5. File `danh-sach-ung-vien.xlsx` tải xuống

### **Ví dụ 2: Xuất Thống Kê Hồ Sơ Trong Tháng 6**
1. Vào `/admin/export-report`
2. Chọn tab **"Danh sách ứng viên"**
3. Chọn Từ ngày = **01/06/2024**, Đến ngày = **30/06/2024**
4. Nhấp **"Xuất CSV"**
5. File `danh-sach-ung-vien.csv` tải xuống

### **Ví dụ 3: Xuất Thống Kê Theo Ngành**
1. Vào `/admin/export-report`
2. Chọn tab **"Thống kê theo ngành"**
3. Không cần chọn lọc (xuất tất cả)
4. Nhấp **"Xuất Excel"**
5. File `thong-ke-nganh.xlsx` tải xuống với danh sách ngành và số hồ sơ

---

## ✅ Lợi Ích Của Chức Năng

1. **⏱️ Tiết Kiệm Thời Gian:** Xuất báo cáo chỉ trong vài cú nhấp chuột
2. **📊 Dễ Phân Tích:** Dữ liệu dưới dạng bảng tính dễ dàng phân tích và tạo biểu đồ
3. **📁 Lưu Trữ Linh Hoạt:** Hỗ trợ hai định dạng Excel và CSV
4. **🔍 Lọc Chi Tiết:** Có thể lọc dữ liệu theo nhiều tiêu chí
5. **📈 Thống Kê Toàn Diện:** Hỗ trợ nhiều loại thống kê khác nhau
6. **🌍 Tương Thích:** Dữ liệu CSV tương thích với hầu hết các ứng dụng

---

## 🐛 Khắc Phục Sự Cố

### **Lỗi: "Lỗi khi xuất báo cáo"**
- Kiểm tra kết nối internet
- Đảm bảo server đang chạy
- Kiểm tra browser console (F12) để xem lỗi chi tiết

### **Lỗi: "Không có quyền truy cập"**
- Kiểm tra bạn đã đăng nhập bằng tài khoản Admin
- Kiểm tra JWT token còn hiệu lực

### **File Không Tải Xuống**
- Kiểm tra cài đặt download của browser
- Thử sử dụng browser khác
- Kiểm tra đủ dung lượng đĩa

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề hoặc có câu hỏi, vui lòng liên hệ với team quản lý hệ thống.

---

**Phiên bản:** 1.0  
**Cập nhật lần cuối:** 2024-06-05
