import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Switch,
  Table,
  message,
} from 'antd';
import request from '@/services/request';

export default function SubjectGroupsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>();
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await request.get('/admission-combinations');
      setData(res.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách tổ hợp:', error);
      message.error('Không thể tải danh sách tổ hợp xét tuyển từ máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.put(`/admission-combinations/${editing.id}`, values);
        message.success('Đã cập nhật tổ hợp xét tuyển');
      } else {
        await request.post('/admission-combinations', values);
        message.success('Đã thêm tổ hợp xét tuyển');
      }
      setOpen(false);
      setEditing(undefined);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      if (error?.errorFields) return; 
      message.error('Thao tác thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tổ hợp xét tuyển này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await request.delete(`/admission-combinations/${id}`);
          message.success('Đã xóa tổ hợp xét tuyển');
          fetchData();
        } catch {
          message.error('Không thể xóa tổ hợp này');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Mã tổ hợp',
      dataIndex: 'code',
    },
    {
      title: 'Môn xét tuyển',
      dataIndex: 'subjects',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setOpen(true);
            }}
          >
            Sửa
          </Button>

          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý tổ hợp xét tuyển"
      extra={
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm tổ hợp
        </Button>
      }
    >
      <Table 
        rowKey="id" 
        columns={columns} 
        dataSource={data} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? 'Cập nhật tổ hợp xét tuyển' : 'Thêm tổ hợp xét tuyển'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(undefined);
          form.resetFields();
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Mã tổ hợp"
            rules={[{ required: true, message: 'Vui lòng nhập mã tổ hợp' }]}
          >
            <Input placeholder="VD: A00, A01, D01" />
          </Form.Item>

          <Form.Item
            name="subjects"
            label="Các môn xét tuyển"
            rules={[{ required: true, message: 'Vui lòng nhập các môn' }]}
          >
            <Input placeholder="VD: Toán, Vật lý, Hóa học" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}