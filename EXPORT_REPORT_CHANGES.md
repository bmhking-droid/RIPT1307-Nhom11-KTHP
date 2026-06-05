# 📋 Tóm Tắt Các Thay Đổi - Chức Năng Xuất Báo Cáo

## 📌 Tổng Quan
Đã thêm chức năng **Xuất Báo Cáo Dữ Liệu (Export to Excel/CSV)** cho phép quản trị viên xuất thông tin tuyển sinh dưới dạng file Excel (.xlsx) hoặc CSV (.csv).

## 🔧 Backend Changes

### 1️⃣ **package.json (server)**
```json
{
  "dependencies": {
    "csv-stringify": "^6.5.0"  // Thêm mới
  }
}
```

### 2️⃣ **server/src/repositories/report.repository.js** - Mở rộng
**Hàm mới:**
- `getAllApplicationsDetailed(filters)` - Lấy danh sách ứng dụng chi tiết với include đầy đủ
- `getApplicationStatusStatistics(filters)` - Thống kê theo trạng thái
- `getApplicationByMajor(filters)` - Thống kê theo ngành
- `getApplicationByAdmissionRound(filters)` - Thống kê theo đợt tuyển
- `getApplicationsByDateRange(startDate, endDate, filters)` - Lọc theo khoảng thời gian
- `countByAdmissionRound()` - Đếm theo đợt tuyển (hàm mới)

### 3️⃣ **server/src/services/report.service.js** - Viết lại hoàn toàn
**Hàm Excel:**
- `exportApplicationsToExcel(filters)` - Xuất danh sách ứng viên
- `exportStatusStatisticsToExcel(filters)` - Xuất thống kê trạng thái
- `exportMajorStatisticsToExcel(filters)` - Xuất thống kê ngành
- `exportAdmissionRoundStatisticsToExcel(filters)` - Xuất thống kê đợt tuyển
- `exportUniversityStatisticsToExcel(filters)` - Xuất thống kê trường

**Hàm CSV:**
- `exportApplicationsToCSV(filters)` - Xuất danh sách ứng viên CSV
- `exportStatisticsToCSV(type, filters)` - Xuất thống kê CSV

### 4️⃣ **server/src/controllers/report.controller.js** - Viết lại hoàn toàn
**Handler mới:**
- `exportApplicationsExcel()` - GET handler
- `exportStatusStatisticsExcel()` - GET handler
- `exportMajorStatisticsExcel()` - GET handler
- `exportAdmissionRoundStatisticsExcel()` - GET handler
- `exportUniversityStatisticsExcel()` - GET handler
- `exportApplicationsCSV()` - GET handler
- `exportStatisticsCSV()` - GET handler

**Handler cũ:**
- `exportExcel()` - Giữ lại cho compatibility

### 5️⃣ **server/src/routes/report.routes.js** - Cập nhật
**Route mới (8 endpoints):**
```
GET /export/applications/excel
GET /export/applications/csv
GET /export/status-statistics/excel
GET /export/major-statistics/excel
GET /export/admission-round-statistics/excel
GET /export/university-statistics/excel
GET /export/statistics/csv
GET /export-excel (legacy)
```

## 🎨 Frontend Changes

### 1️⃣ **client/src/layouts/AdminLayout/index.tsx** - Tạo mới
- Component Admin Layout với sidebar và menu
- Menu items: Tổng quan, Xuất báo cáo, Thống kê

### 2️⃣ **client/src/layouts/AdminLayout/index.less** - Tạo mới
- Styling cho Admin Layout

### 3️⃣ **client/src/pages/Admin/ExportReport/index.tsx** - Tạo mới
- Component chính cho trang xuất báo cáo
- 5 tabs:
  1. Danh sách ứng viên
  2. Thống kê trạng thái
  3. Thống kê theo ngành
  4. Thống kê theo đợt tuyển
  5. Thống kê theo trường
- Form lọc dữ liệu
- Nút xuất Excel/CSV

### 4️⃣ **client/src/pages/Admin/ExportReport/index.module.less** - Tạo mới
- Styling cho trang ExportReport

### 5️⃣ **client/src/services/report.ts** - Tạo mới
**Hàm Excel:**
- `exportApplicationsExcel(filters)`
- `exportStatusStatisticsExcel(filters)`
- `exportMajorStatisticsExcel(filters)`
- `exportAdmissionRoundStatisticsExcel(filters)`
- `exportUniversityStatisticsExcel(filters)`

**Hàm CSV:**
- `exportApplicationsCSV(filters)`
- `exportStatisticsCSV(type, filters)`

**Hàm tổng quát:**
- `exportToExcel(type, filters)`
- `exportToCSV(type, filters)`

**Hàm hỗ trợ:**
- `downloadFile(blob, filename)`

### 6️⃣ **client/src/services/auth.ts** - Sửa lỗi
- Thêm import: `import request from '@/service/request'`
- Sửa lỗi: Thay `import axios` bằng `import request`

### 7️⃣ **client/config/routes.ts** - Cập nhật
**Route mới:**
```typescript
{
  path: '/admin',
  component: '@/layouts/AdminLayout',
  routes: [
    {
      path: '/admin/export-report',
      component: '@/pages/Admin/ExportReport',
    },
  ],
}
```

## 📁 Cấu Trúc Thư Mục Mới

```
client/
├── src/
│   ├── layouts/
│   │   └── AdminLayout/              [Mới]
│   │       ├── index.tsx
│   │       └── index.less
│   ├── pages/
│   │   └── Admin/                    [Mới]
│   │       └── ExportReport/         [Mới]
│   │           ├── index.tsx
│   │           └── index.module.less
│   └── services/
│       └── report.ts                 [Mới]

server/
└── src/
    └── (files được cập nhật)

docs/
└── EXPORT_REPORT_GUIDE.md            [Mới]
```

## 🔐 Bảo Mật

- Tất cả endpoints được bảo vệ bằng `authMiddleware`
- Chỉ Admin (`roleMiddleware("ADMIN")`) mới có thể truy cập
- JWT token được xác thực tại server

## 📊 Các Loại Báo Cáo Hỗ Trợ

1. **Danh Sách Ứng Viên (11 cột)**
   - Mã hồ sơ, Họ tên, Email, CCCD, Số điện thoại, Trường, Ngành, Đợt tuyển, Điểm, Trạng thái, Ngày tạo

2. **Thống Kê Trạng Thái (3 cột)**
   - Trạng thái, Số lượng, Tỷ lệ (%)

3. **Thống Kê Theo Ngành (3 cột)**
   - Ngành học, Trường, Số hồ sơ

4. **Thống Kê Đợt Tuyển (2 cột)**
   - Đợt tuyển sinh, Số hồ sơ

5. **Thống Kê Trường (2 cột)**
   - Trường đại học, Số hồ sơ

## 🎯 Bộ Lọc Hỗ Trợ

- **Trạng thái:** DRAFT, SUBMITTED, PENDING, APPROVED, REJECTED
- **Trường đại học:** (Danh sách từ database)
- **Ngành học:** (Danh sách từ database)
- **Đợt tuyển sinh:** (Danh sách từ database)
- **Khoảng thời gian:** Từ ngày - Đến ngày

## ✅ Cần Làm Sau

1. **Cài đặt dependencies:**
   ```bash
   # Server
   cd server && npm install
   
   # Client
   cd client && npm install
   ```

2. **Tạo trang Dashboard Admin** (nếu chưa có)

3. **Tạo trang Thống Kê Admin** (nếu chưa có)

4. **Test chức năng:**
   - Test xuất Excel
   - Test xuất CSV
   - Test các bộ lọc khác nhau
   - Test authorization (chỉ Admin)

5. **Tối ưu hóa:**
   - Thêm pagination cho danh sách lớn
   - Thêm progress bar cho tệp lớn
   - Caching dữ liệu thống kê

## 📝 Ghi Chú Quan Trọng

- Tất cả tên file xuất được tạo bằng tiếng Việt
- Format ngày tháng: DD/MM/YYYY (theo quy chuẩn Việt Nam)
- ExcelJS tự động căn chỉnh cột dữ liệu
- CSV được mã hóa UTF-8 với BOM để tương thích với Excel tiếng Việt

---

**Cập nhật:** 2024-06-05  
**Phiên bản:** 1.0
