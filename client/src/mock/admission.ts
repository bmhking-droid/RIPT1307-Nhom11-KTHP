export const candidateStats = [
  {
    label: 'Hồ sơ đã nộp',
    value: 3,
    trend: '+1 hồ sơ mới',
  },
  {
    label: 'Đang xét duyệt',
    value: 1,
    trend: 'Cập nhật hôm nay',
  },
  {
    label: 'Đã được duyệt',
    value: 2,
    trend: 'Tỷ lệ tốt',
  },
];

export const recentApplications = [
  {
    id: 'HS-2026-001',
    university: 'Đại học Công nghệ Quốc gia',
    major: 'Công nghệ thông tin',
    status: 'Chờ duyệt',
    updatedAt: '11/05/2026',
  },
  {
    id: 'HS-2026-002',
    university: 'Đại học Kinh tế & Quản trị',
    major: 'Marketing',
    status: 'Đã duyệt',
    updatedAt: '10/05/2026',
  },
  {
    id: 'HS-2026-003',
    university: 'Đại học Kinh tế & Quản trị',
    major: 'Quản trị kinh doanh',
    status: 'Cần bổ sung',
    updatedAt: '09/05/2026',
  },
];
export const universitiesMock = [
  {
    id: 'uni-1',
    name: 'Đại học Công nghệ Quốc gia',
    majors: [
      { id: 'major-1', name: 'Công nghệ thông tin' },
      { id: 'major-2', name: 'Khoa học dữ liệu' },
      { id: 'major-3', name: 'An toàn thông tin' },
    ],
  },
  {
    id: 'uni-2',
    name: 'Đại học Kinh tế & Quản trị',
    majors: [
      { id: 'major-4', name: 'Marketing' },
      { id: 'major-5', name: 'Quản trị kinh doanh' },
      { id: 'major-6', name: 'Tài chính ngân hàng' },
    ],
  },
];

export const admissionRoundsMock = [
  { id: 'round-1', name: 'Đợt 1 - Xét học bạ 2026' },
  { id: 'round-2', name: 'Đợt 2 - Xét điểm thi THPT 2026' },
];

export const combinationsMock = [
  { id: 'A00', name: 'A00 - Toán, Lý, Hóa' },
  { id: 'A01', name: 'A01 - Toán, Lý, Anh' },
  { id: 'D01', name: 'D01 - Toán, Văn, Anh' },
];