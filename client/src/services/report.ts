import request from './request';

// Lấy dữ liệu biểu đồ thống kê tổng quan
export async function getStatistics() {
  return request.get('/reports/statistics');
}

// Tải file excel báo cáo số liệu hệ thống tuyển sinh
export async function exportExcelReport() {
  return request.get('/reports/export-excel', {
    responseType: 'blob', 
  });
}