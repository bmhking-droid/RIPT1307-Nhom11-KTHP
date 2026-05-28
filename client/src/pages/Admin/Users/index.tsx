import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag, message, Modal } from 'antd';
import request from '@/services/request';
import dayjs from 'dayjs';

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await request.get('/users');
      setData(res.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách người dùng:', error);
      message.error('Không thể tải danh sách người dùng từ máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = (record: any) => {
    Modal.confirm({
      title: `${record.isActive ? 'Khóa' : 'Mở khóa'} tài khoản`,
      content: `Bạn có chắc chắn muốn ${record.isActive ? 'khóa' : 'mở khóa'} tài khoản "${record.profile?.fullName || record.email}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okType: record.isActive ? 'danger' : 'primary',
      onOk: async () => {
        try {
          await request.patch(`/users/${record.id}/toggle-status`);
          message.success(`Đã ${record.isActive ? 'khóa' : 'mở khóa'} tài khoản thành công`);
          fetchData();
        } catch (error) {
          message.error('Thao tác thất bại');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Họ tên',
      render: (_: any, record: any) => record.profile?.fullName || 'Chưa cập nhật',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      render: (_: any, record: any) => record.profile?.phone || '---',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      render: (role: string) =>
        role === 'ADMIN' ? (
          <Tag color="blue">Quản trị viên</Tag>
        ) : (
          <Tag color="green">Thí sinh</Tag>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Đã khóa</Tag>
        ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '---',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            danger={record.isActive}
            onClick={() => handleToggleStatus(record)}
          >
            {record.isActive ? 'Khóa' : 'Mở khóa'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý người dùng">
      <Table 
        rowKey="id" 
        columns={columns} 
        dataSource={data} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}