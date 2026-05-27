import request from './request';

export async function getCandidateApplicationDetail(id: number) {
  return request.get(`/applications/${id}`);
}

export async function uploadCandidateFile(data: FormData) {
  return request.post('/upload/document', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
