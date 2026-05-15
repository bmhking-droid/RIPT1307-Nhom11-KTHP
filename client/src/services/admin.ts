import request from './request';

export async function getAdminStatistics() {
  return request('/api/admin/statistics');
}

export async function getUniversities() {
  return request('/api/admin/universities');
}

export async function createUniversity(data: any) {
  return request('/api/admin/universities', {
    method: 'POST',
    data,
  });
}

export async function updateUniversity(id: number, data: any) {
  return request(`/api/admin/universities/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteUniversity(id: number) {
  return request(`/api/admin/universities/${id}`, {
    method: 'DELETE',
  });
}

export async function getMajors(params?: { universityId?: number }) {
  return request('/api/admin/majors', {
    params,
  });
}

export async function createMajor(data: any) {
  return request('/api/admin/majors', {
    method: 'POST',
    data,
  });
}

export async function updateMajor(id: number, data: any) {
  return request(`/api/admin/majors/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteMajor(id: number) {
  return request(`/api/admin/majors/${id}`, {
    method: 'DELETE',
  });
}

export async function getSubjectGroups(params?: { majorId?: number }) {
  return request('/api/admin/subject-groups', {
    params,
  });
}

export async function createSubjectGroup(data: any) {
  return request('/api/admin/subject-groups', {
    method: 'POST',
    data,
  });
}

export async function updateSubjectGroup(id: number, data: any) {
  return request(`/api/admin/subject-groups/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteSubjectGroup(id: number) {
  return request(`/api/admin/subject-groups/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdmissionRounds(params?: { universityId?: number }) {
  return request('/api/admin/admission-rounds', {
    params,
  });
}

export async function createAdmissionRound(data: any) {
  return request('/api/admin/admission-rounds', {
    method: 'POST',
    data,
  });
}

export async function getApplications(params?: any) {
  return request('/api/admin/applications', {
    params,
  });
}

export async function getApplicationDetail(id: number) {
  return request(`/api/admin/applications/${id}`);
}

export async function updateApplicationStatus(
  id: number,
  status: 'pending' | 'approved' | 'rejected',
) {
  return request(`/api/admin/applications/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}

export async function sendApplicationEmail(id: number, data?: any) {
  return request(`/api/admin/applications/${id}/send-email`, {
    method: 'POST',
    data,
  });
}
export async function getAdminUsers() {
  return request('/api/admin/users');
}