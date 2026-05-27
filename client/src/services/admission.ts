import request from './request';

export async function getAdmissionRounds(params?: any) {
  return request.get('/admission-rounds', { params });
}

export async function createAdmissionRound(data: any) {
  return request.post('/admission-rounds', data);
}

export async function getCombinations() {
  return request.get('/admission-combinations');
}

export async function createCombination(data: any) {
  return request.post(
    '/admission-combinations',
    data,
  );
}