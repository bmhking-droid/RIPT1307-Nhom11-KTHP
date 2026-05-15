let applications = [
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
  'GET /api/admin/applications': (req: any, res: any) => {
    const {
      keyword,
      universityId,
      majorId,
      admissionRoundId,
      status,
    } = req.query;

    let data = [...applications];

    if (keyword) {
      const lowerKeyword = String(keyword).toLowerCase();

      data = data.filter(
        item =>
          item.code.toLowerCase().includes(lowerKeyword) ||
          item.candidateName.toLowerCase().includes(lowerKeyword) ||
          item.email.toLowerCase().includes(lowerKeyword) ||
          item.phone.includes(lowerKeyword),
      );
    }

    if (universityId) {
      data = data.filter(
        item => item.universityId === Number(universityId),
      );
    }

    if (majorId) {
      data = data.filter(item => item.majorId === Number(majorId));
    }

    if (admissionRoundId) {
      data = data.filter(
        item => item.admissionRoundId === Number(admissionRoundId),
      );
    }

    if (status) {
      data = data.filter(item => item.status === status);
    }

    res.send({
      success: true,
      data,
    });
  },

  'GET /api/admin/applications/:id': (req: any, res: any) => {
    const item = applications.find(
      app => app.id === Number(req.params.id),
    );

    res.send({
      success: true,
      data: item,
    });
  },

  'PUT /api/admin/applications/:id/status': (
    req: any,
    res: any,
  ) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    applications = applications.map(item =>
      item.id === id ? { ...item, status } : item,
    );

    res.send({
      success: true,
    });
  },

  'POST /api/admin/applications/:id/send-email': (
    req: any,
    res: any,
  ) => {
    res.send({
      success: true,
      message: 'Đã gửi email thông báo cho thí sinh',
    });
  },
};