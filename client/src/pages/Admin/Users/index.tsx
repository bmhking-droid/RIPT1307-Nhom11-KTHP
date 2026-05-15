import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag, message } from 'antd';
import { getAdminUsers } from '@/services/admin';

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await getAdminUsers();
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      render: (role: string) =>
        role === 'admin' ? (
          <Tag color="blue">Quản trị viên</Tag>
        ) : (
          <Tag color="green">Thí sinh</Tag>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) =>
        status === 'active' ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Đã khóa</Tag>
        ),
    },
    {
      title: 'Thao tác',
      render: () => (
        <Space>
          <Button
            type="link"
            onClick={() => message.info('Chức năng đang phát triển')}
          >
            Xem
          </Button>

          <Button
            type="link"
            danger
            onClick={() => message.info('Chức năng đang phát triển')}
          >
            Khóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý người dùng">
      <Table rowKey="id" columns={columns} dataSource={data} />
    </Card>
  );
}