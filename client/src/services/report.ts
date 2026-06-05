import request from '@/service/request';

const API_BASE = '/reports';

/**
 * Xuất danh sách ứng viên dạng Excel
 */
export async function exportApplicationsExcel(filters: any = {}) {
  try {
    const response = await request.get(`${API_BASE}/export/applications/excel`, {
      params: filters,
      responseType: 'blob',
    });

    downloadFile(response, 'danh-sach-ung-vien.xlsx');
  } catch (error) {
    console.error('Error exporting applications to Excel:', error);
    throw error;
  }
}

/**
 * Xuất danh sách ứng viên dạng CSV
 */
export async function exportApplicationsCSV(filters: any = {}) {
  try {
    const response = await request.get(`${API_BASE}/export/applications/csv`, {
      params: filters,
      responseType: 'blob',
    });

    downloadFile(response, 'danh-sach-ung-vien.csv');
  } catch (error) {
    console.error('Error exporting applications to CSV:', error);
    throw error;
  }
}

/**
 * Xuất thống kê trạng thái dạng Excel
 */
export async function exportStatusStatisticsExcel(filters: any = {}) {
  try {
    const response = await request.get(
      `${API_BASE}/export/status-statistics/excel`,
      {
        params: filters,
        responseType: 'blob',
      }
    );

    downloadFile(response, 'thong-ke-trang-thai.xlsx');
  } catch (error) {
    console.error('Error exporting status statistics to Excel:', error);
    throw error;
  }
}

/**
 * Xuất thống kê ngành dạng Excel
 */
export async function exportMajorStatisticsExcel(filters: any = {}) {
  try {
    const response = await request.get(
      `${API_BASE}/export/major-statistics/excel`,
      {
        params: filters,
        responseType: 'blob',
      }
    );

    downloadFile(response, 'thong-ke-nganh.xlsx');
  } catch (error) {
    console.error('Error exporting major statistics to Excel:', error);
    throw error;
  }
}

/**
 * Xuất thống kê đợt tuyển dạng Excel
 */
export async function exportAdmissionRoundStatisticsExcel(filters: any = {}) {
  try {
    const response = await request.get(
      `${API_BASE}/export/admission-round-statistics/excel`,
      {
        params: filters,
        responseType: 'blob',
      }
    );

    downloadFile(response, 'thong-ke-dot-tuyen.xlsx');
  } catch (error) {
    console.error('Error exporting admission round statistics to Excel:', error);
    throw error;
  }
}

/**
 * Xuất thống kê trường dạng Excel
 */
export async function exportUniversityStatisticsExcel(filters: any = {}) {
  try {
    const response = await request.get(
      `${API_BASE}/export/university-statistics/excel`,
      {
        params: filters,
        responseType: 'blob',
      }
    );

    downloadFile(response, 'thong-ke-truong.xlsx');
  } catch (error) {
    console.error('Error exporting university statistics to Excel:', error);
    throw error;
  }
}

/**
 * Xuất thống kê dạng CSV
 */
export async function exportStatisticsCSV(type: string = 'status', filters: any = {}) {
  try {
    const response = await request.get(`${API_BASE}/export/statistics/csv`, {
      params: {
        type,
        ...filters,
      },
      responseType: 'blob',
    });

    downloadFile(response, `thong-ke-${type}.csv`);
  } catch (error) {
    console.error('Error exporting statistics to CSV:', error);
    throw error;
  }
}

/**
 * Hàm tổng quát xuất dữ liệu
 */
export async function exportToExcel(exportType: string, filters: any = {}) {
  switch (exportType) {
    case 'applications':
      return exportApplicationsExcel(filters);
    case 'status-statistics':
      return exportStatusStatisticsExcel(filters);
    case 'major-statistics':
      return exportMajorStatisticsExcel(filters);
    case 'admission-round-statistics':
      return exportAdmissionRoundStatisticsExcel(filters);
    case 'university-statistics':
      return exportUniversityStatisticsExcel(filters);
    default:
      throw new Error(`Unknown export type: ${exportType}`);
  }
}

/**
 * Hàm tổng quát xuất dữ liệu CSV
 */
export async function exportToCSV(exportType: string, filters: any = {}) {
  if (exportType === 'applications') {
    return exportApplicationsCSV(filters);
  } else {
    return exportStatisticsCSV(exportType, filters);
  }
}

/**
 * Hàm tải xuống file
 */
function downloadFile(blob: any, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
