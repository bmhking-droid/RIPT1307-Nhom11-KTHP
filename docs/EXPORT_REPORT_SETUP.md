# 🚀 Cài Đặt Chức Năng Xuất Báo Cáo

## 📋 Điều Kiện Tiên Quyết

- Node.js >= 14.0
- npm hoặc yarn
- Database MySQL đã được cài đặt

## 📥 Các Bước Cài Đặt

### 1. Cập Nhật Dependencies

#### **Backend (Server)**
```bash
cd server
npm install
```

**Các package mới sẽ được cài:**
- `csv-stringify@^6.5.0` - Để xuất dữ liệu CSV
- `exceljs@^4.4.0` - Đã có, chỉ kiểm tra

#### **Frontend (Client)**
```bash
cd client
npm install
```

**Các package đã có:**
- `antd@^6.3.7` - UI Components
- `dayjs@^1.11.20` - Xử lý ngày tháng
- `axios@^1.16.0` - HTTP Client

### 2. Kiểm Tra File Cấu Hình

Đảm bảo các file sau tồn tại:

**Server:**
```
server/src/
├── repositories/report.repository.js      ✅
├── services/report.service.js             ✅
├── controllers/report.controller.js       ✅
├── routes/report.routes.js                ✅
└── ...
```

**Client:**
```
client/src/
├── layouts/
│   └── AdminLayout/
│       ├── index.tsx                      ✅
│       └── index.less                     ✅
├── pages/
│   └── Admin/ExportReport/
│       ├── index.tsx                      ✅
│       └── index.module.less              ✅
├── services/report.ts                     ✅
├── config/routes.ts                       ✅ (cập nhật)
└── ...
```

### 3. Cấu Hình Environment Variables

**Server (.env)**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=online_admission

# API
API_URL=http://localhost:5000

# JWT
JWT_SECRET=your_secret_key
```

**Client (.env)**
```env
UMI_APP_API_URL=http://localhost:5000/api
```

### 4. Khởi Động Ứng Dụng

#### **Terminal 1 - Server**
```bash
cd server
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

#### **Terminal 2 - Client**
```bash
cd client
npm run dev
```

Client sẽ chạy tại: `http://localhost:8000`

### 5. Truy Cập Chức Năng

1. Mở browser: `http://localhost:8000`
2. Đăng nhập bằng tài khoản **ADMIN**
3. Truy cập: `/admin/export-report`
4. Thử chức năng xuất báo cáo

## 🧪 Test Chức Năng

### **Test Xuất Excel**

1. Vào `/admin/export-report`
2. Chọn tab "Danh sách ứng viên"
3. Không cần chọn lọc gì (nếu có dữ liệu)
4. Nhấp "Xuất Excel"
5. Kiểm tra:
   - File `danh-sach-ung-vien.xlsx` tải xuống
   - Dữ liệu đầy đủ trong Excel
   - Header được format đẹp (font đậm, nền xanh)

### **Test Xuất CSV**

1. Vào `/admin/export-report`
2. Chọn tab "Thống kê theo ngành"
3. Nhấp "Xuất CSV"
4. Kiểm tra:
   - File `thong-ke-nganh.csv` tải xuống
   - Dữ liệu đầy đủ
   - Encoding UTF-8 đúng

### **Test Các Bộ Lọc**

1. Chọn tab "Danh sách ứng viên"
2. Chọn Trạng thái = "APPROVED"
3. Nhấp "Xuất Excel"
4. Kiểm tra: Chỉ có hồ sơ với trạng thái "APPROVED"

### **Test Khoảng Thời Gian**

1. Chọn tab "Danh sách ứng viên"
2. Chọn Từ ngày = "01/06/2024"
3. Chọn Đến ngày = "30/06/2024"
4. Nhấp "Xuất Excel"
5. Kiểm tra: Chỉ có hồ sơ tạo trong tháng 6/2024

## 🐛 Khắc Phục Sự Cố

### **Lỗi: "Không tìm thấy module csv-stringify"**
```bash
cd server
npm install csv-stringify
```

### **Lỗi: "CORS error"**
- Kiểm tra CORS được bật trong `server/src/app.js`
- Kiểm tra `UMI_APP_API_URL` trong `.env` của client

### **Lỗi: "Không có quyền truy cập"**
- Đảm bảo bạn đang dùng tài khoản Admin
- Kiểm tra JWT token trong browser console
- Kiểm tra `roleMiddleware` trong server

### **Lỗi: "File không tải xuống"**
- Kiểm tra cài đặt download của browser
- Xóa đi các file `.xlsx` hoặc `.csv` cũ
- Thử lại trong cửa sổ Incognito

### **Lỗi: "Dữ liệu không đầy đủ"**
- Kiểm tra database có dữ liệu hay không
- Kiểm tra các join trong query có hợp lệ không
- Xem server logs để chi tiết lỗi

## 📊 Kiểm Tra Database

### **Kiểm Tra Dữ Liệu Test**

```sql
-- Đếm ứng dụng
SELECT COUNT(*) as total_applications FROM applications;

-- Đếm theo trạng thái
SELECT status, COUNT(*) as total 
FROM applications 
GROUP BY status;

-- Đếm theo trường
SELECT u.name, COUNT(a.id) as total
FROM applications a
JOIN universities u ON a.universityId = u.id
GROUP BY u.name;
```

## ✅ Checklist Hoàn Thành

- [ ] Dependencies đã cài đặt
- [ ] Environment variables đã cấu hình
- [ ] Server khởi động thành công (port 5000)
- [ ] Client khởi động thành công (port 8000)
- [ ] Có thể đăng nhập bằng tài khoản Admin
- [ ] Có thể truy cập `/admin/export-report`
- [ ] Có thể xuất Excel thành công
- [ ] Có thể xuất CSV thành công
- [ ] Các bộ lọc hoạt động đúng
- [ ] File xuất có dữ liệu chính xác

## 📞 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. [EXPORT_REPORT_CHANGES.md](../EXPORT_REPORT_CHANGES.md) - Danh sách thay đổi chi tiết
2. [EXPORT_REPORT_GUIDE.md](./EXPORT_REPORT_GUIDE.md) - Hướng dẫn sử dụng
3. Server logs: Xem terminal server để chi tiết lỗi
4. Browser console: Nhấn F12 để xem frontend errors

---

**Phiên bản:** 1.0  
**Cập nhật:** 2024-06-05
