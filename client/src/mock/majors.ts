let majors = [
  {
    id: 1,
    universityId: 1,
    code: 'CNTT',
    name: 'Công nghệ thông tin',
    quota: 200,
    active: true,
  },
  {
    id: 2,
    universityId: 1,
    code: 'KTMT',
    name: 'Kỹ thuật máy tính',
    quota: 120,
    active: true,
  },
  {
    id: 3,
    universityId: 2,
    code: 'QTKD',
    name: 'Quản trị kinh doanh',
    quota: 180,
    active: true,
  },
];

export default {
  'GET /api/admin/majors': (req: any, res: any) => {
    const { universityId } = req.query;

    let data = [...majors];

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

  'POST /api/admin/majors': (req: any, res: any) => {
    majors.push({
      id: Date.now(),
      ...req.body,
    });

    res.send({
      success: true,
    });
  },

  'PUT /api/admin/majors/:id': (req: any, res: any) => {
    const id = Number(req.params.id);

    majors = majors.map(item =>
      item.id === id ? { ...item, ...req.body } : item,
    );

    res.send({
      success: true,
    });
  },

  'DELETE /api/admin/majors/:id': (req: any, res: any) => {
    const id = Number(req.params.id);

    majors = majors.filter(item => item.id !== id);

    res.send({
      success: true,
    });
  },
};