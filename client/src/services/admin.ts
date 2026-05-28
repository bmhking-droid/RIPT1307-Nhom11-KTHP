import request from './request';

export async function getAdminStatistics() {
  return request.get('/reports/statistics');
}

export async function getUniversities() {
  return request.get('/universities');
}

export async function createUniversity(data: any) {
  return request.post('/universities', data);
}

export async function updateUniversity(id: number, data: any) {
  return request.put(`/universities/${id}`, data);
}

export async function deleteUniversity(id: number) {
  return request.delete(`/universities/${id}`);
}

export async function getMajors(params?: { universityId?: number }) {
  return request.get('/majors', { params });
}

export async function createMajor(data: any) {
  return request.post('/majors', data);
}

export async function updateMajor(id: number, data: any) {
  return request.put(`/majors/${id}`, data);
}

export async function deleteMajor(id: number) {
  return request.delete(`/majors/${id}`);
}

export async function getAdmissionRounds(params?: { universityId?: number }) {
  return request.get('/admission-rounds', { params });
}

export async function createAdmissionRound(data: any) {
  return request.post('/admission-rounds', data);
}

export async function updateAdmissionRound(id: string, data: any) {
  return request.put(`/admission-rounds/${id}`, data);
}

export async function getApplications(params?: any) {
  return request.get('/applications', { params });
}

export async function getApplicationDetail(id: string) {
  return request.get(`/applications/${id}`);
}

export async function updateApplicationStatus(
  id: string,
  data: { status: string; rejectionReason?: string }
) {
  return request.patch(`/applications/${id}/status`, data);
}
