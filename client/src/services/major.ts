import request from './request';

export async function getAllMajors(params?: any) {
  return request.get('/majors', { params });
}

export async function getMajors(params?: any) {
  return request.get('/majors', { params });
}

export async function createMajor(data: any) {
  return request.post('/majors', data);
}

export async function updateMajor(id: string, data: any) {
  return request.put(`/majors/${id}`, data);
}

export async function deleteMajor(id: string) {
  return request.delete(`/majors/${id}`);
}
