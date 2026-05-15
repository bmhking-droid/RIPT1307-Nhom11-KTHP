let universities = [
  {
    id: 1,
    code: 'HUST',
    name: 'Đại học Bách khoa Hà Nội',
    address: 'Hà Nội',
    active: true,
  },
  {
    id: 2,
    code: 'NEU',
    name: 'Đại học Kinh tế Quốc dân',
    address: 'Hà Nội',
    active: true,
  },
];

export default {
  'GET /api/admin/universities': (req: any, res: any) => {
    res.send({
      success: true,
      data: universities,
    });
  },

  'POST /api/admin/universities': (req: any, res: any) => {
    universities.push({
      id: Date.now(),
      ...req.body,
    });

    res.send({
      success: true,
    });
  },

  'PUT /api/admin/universities/:id': (req: any, res: any) => {
    const id = Number(req.params.id);

    universities = universities.map(item =>
      item.id === id ? { ...item, ...req.body } : item,
    );

    res.send({
      success: true,
    });
  },

  'DELETE /api/admin/universities/:id': (req: any, res: any) => {
    const id = Number(req.params.id);

    universities = universities.filter(item => item.id !== id);

    res.send({
      success: true,
    });
  },
};