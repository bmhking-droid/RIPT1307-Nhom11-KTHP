import request from './request';

export async function getStatistics() {
  return request.get('/reports/statistics');
}
