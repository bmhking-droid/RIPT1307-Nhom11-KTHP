import request from './request';

// Thí sinh nộp hồ sơ xét tuyển mới
export async function createApplication(data: any) {
  return request.post('/applications', data);
}

// Thí sinh xem danh sách hồ sơ cá nhân của mình
export async function getMyApplications() {
  return request.get('/applications/my-applications');
}

// Xem chi tiết một hồ sơ (Dùng chung cho cả Thí sinh và Admin)
export async function getApplicationDetail(id: string) {
  return request.get(`/applications/${id}`);
}

// Admin thay đổi trạng thái hồ sơ (Duyệt hoặc Từ chối)
export async function updateApplicationStatus(id: string, data: { status: string; rejectionReason?: string }) {
  return request.patch(`/applications/${id}/status`, data);
}