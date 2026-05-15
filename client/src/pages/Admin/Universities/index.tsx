import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Switch, Table, message } from 'antd';
import {
  createUniversity,
  deleteUniversity,
  getUniversities,
  updateUniversity,
} from '@/services/admin';

export default function UniversitiesPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>();
  const [form] = Form.useForm();

  const fetchData = async () => {
    const res = await getUniversities();
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editing) {
      await updateUniversity(editing.id, values);
      message.success('Đã cập nhật trường');
    } else {
      await createUniversity(values);
      message.success('Đã thêm trường');
    }

    setOpen(false);
    setEditing(undefined);
    form.resetFields();
    fetchData();
  };

  const columns = [
    { title: 'Mã trường', dataIndex: 'code' },
    { title: 'Tên trường', dataIndex: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address' },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      render: (value: boolean) => <Switch checked={value} disabled />,
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
            onClick={async () => {
              await deleteUniversity(record.id);
              message.success('Đã xóa trường');
              fetchData();
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý danh sách trường"
      extra={
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm trường
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={data} />

      <Modal
        title={editing ? 'Cập nhật trường' : 'Thêm trường'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(undefined);
          form.resetFields();
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical" initialValues={{ active: true }}>
          <Form.Item name="code" label="Mã trường" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Tên trường" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="active" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}