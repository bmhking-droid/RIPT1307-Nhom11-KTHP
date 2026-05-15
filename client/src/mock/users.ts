let users = [
  {
    id: 1,
    name: 'Admin hệ thống',
    email: 'admin@gmail.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: 2,
    name: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    role: 'candidate',
    status: 'active',
  },
  {
    id: 3,
    name: 'Trần Thị B',
    email: 'thib@gmail.com',
    role: 'candidate',
    status: 'locked',
  },
];

export default {
  'GET /api/admin/users': (req: any, res: any) => {
    res.send({
      success: true,
      data: users,
    });
  },
};