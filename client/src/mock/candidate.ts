export const candidateProfileMock = {
  fullName: 'Nguyễn Văn A',
  dob: '15/08/2006',
  email: 'candidate@email.com',
  phone: '09xxxxxxxx',
  gender: 'Nam',
  province: 'Hà Nội',
  address: 'Ba Đình, Hà Nội',
};
const candidateApplications = [
  {
    id: 1,
    code: 'HS-2026-000000000001',

    candidateName: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    phone: '0987654321',

    universityId: 1,
    universityName: 'Đại học Bách khoa Hà Nội',

    majorId: 1,
    majorName: 'Công nghệ thông tin',

    subjectGroupId: 1,
    subjectGroupCode: 'A00',

    admissionRoundId: 1,
    admissionRoundName: 'Đợt tuyển sinh 2026 - Đợt 1',

    status: 'pending',
    createdAt: '2026-05-13',

    evidenceFiles: [
      {
        id: 1,
        name: 'Học bạ THPT.pdf',
        url: '/mock-files/hoc-ba.pdf',
        type: 'pdf',
      },
      {
        id: 2,
        name: 'CCCD mặt trước.jpg',
        url: '/mock-files/cccd.jpg',
        type: 'image',
      },
    ],
  },
];

export default {
  'GET /api/candidate/applications/:id': (req: any, res: any) => {
    const item = candidateApplications.find(
      app => app.id === Number(req.params.id),
    );

    res.send({
      success: true,
      data: item,
    });
  },

  'POST /api/candidate/upload': (req: any, res: any) => {
    res.send({
      success: true,
      data: {
        id: Date.now(),
        name: 'uploaded-file.pdf',
        url: '/mock-files/uploaded-file.pdf',
        type: 'pdf',
      },
    });
  },
};