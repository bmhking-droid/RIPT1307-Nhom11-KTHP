import request from './request';

export async function getUniversities(params?: any) {
  return request.get('/universities', { params });
}

export async function getAllUniversities() {
  return request.get('/universities');
}

export async function createUniversity(data: any) {
  return request.post('/universities', data);
}

export async function updateUniversity(id: string, data: any) {
  return request.put(`/universities/${id}`, data);
}

export async function deleteUniversity(id: string) {
  return request.delete(`/universities/${id}`);
}