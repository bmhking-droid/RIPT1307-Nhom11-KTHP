const applications = [
  {
    id: 1,
    universityName: 'Đại học Bách khoa Hà Nội',
    majorName: 'Công nghệ thông tin',
    status: 'pending',
  },
  {
    id: 2,
    universityName: 'Đại học Bách khoa Hà Nội',
    majorName: 'Kỹ thuật máy tính',
    status: 'approved',
  },
  {
    id: 3,
    universityName: 'Đại học Kinh tế Quốc dân',
    majorName: 'Quản trị kinh doanh',
    status: 'rejected',
  },
];

function groupByField(field: string) {
  const map: Record<string, number> = {};

  applications.forEach((item: any) => {
    const key = item[field];

    map[key] = (map[key] || 0) + 1;
  });

  return Object.keys(map).map(key => ({
    [field]: key,
    total: map[key],
  }));
}

export default {
  'GET /api/admin/statistics': (req: any, res: any) => {
    res.send({
      success: true,
      data: {
        totalApplications: applications.length,
        pendingApplications: applications.filter(
          item => item.status === 'pending',
        ).length,
        approvedApplications: applications.filter(
          item => item.status === 'approved',
        ).length,
        rejectedApplications: applications.filter(
          item => item.status === 'rejected',
        ).length,

        byUniversity: groupByField('universityName'),
        byMajor: groupByField('majorName'),
        byStatus: groupByField('status'),
      },
    });
  },
};