import request from './request';

export async function getCandidateApplicationDetail(id: number) {
  return request(`/api/candidate/applications/${id}`);
}

export async function uploadCandidateFile(data: FormData) {
  return request('/api/candidate/upload', {
    method: 'POST',
    data,
  });
}