export const universitiesMock = [
  {
    id: 1,
    name: 'Đại học Bách khoa Hà Nội',
    code: 'HUST',
  },
  {
    id: 2,
    name: 'Đại học Kinh tế Quốc dân',
    code: 'NEU',
  },
];

export const majorsMock = [
  {
    id: 1,
    universityId: 1,
    name: 'Công nghệ thông tin',
    code: 'CNTT',
  },
  {
    id: 2,
    universityId: 1,
    name: 'Kỹ thuật máy tính',
    code: 'KTMT',
  },
  {
    id: 3,
    universityId: 2,
    name: 'Quản trị kinh doanh',
    code: 'QTKD',
  },
];

export const combinationsMock = [
  {
    id: 1,
    majorId: 1,
    code: 'A00',
    subjects: ['Toán', 'Vật lý', 'Hóa học'],
  },
  {
    id: 2,
    majorId: 1,
    code: 'A01',
    subjects: ['Toán', 'Vật lý', 'Tiếng Anh'],
  },
  {
    id: 3,
    majorId: 2,
    code: 'A00',
    subjects: ['Toán', 'Vật lý', 'Hóa học'],
  },
  {
    id: 4,
    majorId: 3,
    code: 'D01',
    subjects: ['Toán', 'Ngữ văn', 'Tiếng Anh'],
  },
];

export const admissionRoundsMock = [
  {
    id: 1,
    universityId: 1,
    name: 'Đợt tuyển sinh 2026 - Đợt 1',
    startDate: '2026-05-01',
    endDate: '2026-08-30',
  },
  {
    id: 2,
    universityId: 2,
    name: 'Tuyển sinh chính quy 2026',
    startDate: '2026-06-01',
    endDate: '2026-09-15',
  },
];

export const candidateStats = [
  {
    title: 'Tổng hồ sơ',
    value: 2,
  },
  {
    title: 'Chờ duyệt',
    value: 1,
  },
  {
    title: 'Đã duyệt',
    value: 1,
  },
  {
    title: 'Từ chối',
    value: 0,
  },
];

export const recentApplications = [
  {
    id: 1,
    code: 'HS-2026-000000000001',
    universityName: 'Đại học Bách khoa Hà Nội',
    majorName: 'Công nghệ thông tin',
    combinationCode: 'A00',
    admissionRoundName: 'Đợt tuyển sinh 2026 - Đợt 1',
    status: 'pending',
    createdAt: '2026-05-13',
  },
  {
    id: 2,
    code: 'HS-2026-000000000002',
    universityName: 'Đại học Kinh tế Quốc dân',
    majorName: 'Quản trị kinh doanh',
    combinationCode: 'D01',
    admissionRoundName: 'Tuyển sinh chính quy 2026',
    status: 'approved',
    createdAt: '2026-05-12',
  },
];
let subjectGroups = [
  {
    id: 1,
    majorId: 1,
    code: 'A00',
    subjects: ['Toán', 'Vật lý', 'Hóa học'],
    active: true,
  },
  {
    id: 2,
    majorId: 1,
    code: 'A01',
    subjects: ['Toán', 'Vật lý', 'Tiếng Anh'],
    active: true,
  },
  {
    id: 3,
    majorId: 2,
    code: 'A00',
    subjects: ['Toán', 'Vật lý', 'Hóa học'],
    active: true,
  },
  {
    id: 4,
    majorId: 3,
    code: 'D01',
    subjects: ['Toán', 'Ngữ văn', 'Tiếng Anh'],
    active: true,
  },
];

let admissionRounds = [
  {
    id: 1,
    universityId: 1,
    name: 'Đợt tuyển sinh 2026 - Đợt 1',
    startDate: '2026-05-01',
    endDate: '2026-08-30',
    active: true,
  },
  {
    id: 2,
    universityId: 2,
    name: 'Tuyển sinh chính quy 2026',
    startDate: '2026-06-01',
    endDate: '2026-09-15',
    active: true,
  },
];

export default {
  'GET /api/admin/subject-groups': (req: any, res: any) => {
    const { majorId } = req.query;

    let data = [...subjectGroups];

    if (majorId) {
      data = data.filter(item => item.majorId === Number(majorId));
    }

    res.send({
      success: true,
      data,
    });
  },

  'POST /api/admin/subject-groups': (req: any, res: any) => {
    subjectGroups.push({
      id: Date.now(),
      ...req.body,
    });

    res.send({
      success: true,
    });
  },

  'PUT /api/admin/subject-groups/:id': (req: any, res: any) => {
    const id = Number(req.params.id);

    subjectGroups = subjectGroups.map(item =>
      item.id === id ? { ...item, ...req.body } : item,
    );

    res.send({
      success: true,
    });
  },

  'DELETE /api/admin/subject-groups/:id': (req: any, res: any) => {
    const id = Number(req.params.id);

    subjectGroups = subjectGroups.filter(item => item.id !== id);

    res.send({
      success: true,
    });
  },

  'GET /api/admin/admission-rounds': (req: any, res: any) => {
    const { universityId } = req.query;

    let data = [...admissionRounds];

    if (universityId) {
      data = data.filter(
        item => item.universityId === Number(universityId),
      );
    }

    res.send({
      success: true,
      data,
    });
  },

  'POST /api/admin/admission-rounds': (req: any, res: any) => {
    admissionRounds.push({
      id: Date.now(),
      ...req.body,
    });

    res.send({
      success: true,
    });
  },
};