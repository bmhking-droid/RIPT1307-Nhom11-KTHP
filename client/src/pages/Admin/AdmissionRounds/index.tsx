import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  message,
} from 'antd';
import dayjs from 'dayjs';
import {
  createAdmissionRound,
  getAdmissionRounds,
  getUniversities,
} from '@/services/admin';

export default function AdmissionRoundsPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [universityId, setUniversityId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUniversities = async () => {
    const res = await getUniversities();
    setUniversities(res.data || []);
  };

  const fetchData = async (selectedUniversityId?: number) => {
    const res = await getAdmissionRounds({
      universityId: selectedUniversityId,
    });

    setData(res.data || []);
  };

  useEffect(() => {
    fetchUniversities();
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    await createAdmissionRound({
      universityId: values.universityId,
      name: values.name,
      startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
      active: values.active,
    });

    message.success('Đã thêm đợt tuyển sinh');
    setOpen(false);
    form.resetFields();
    fetchData(universityId);
  };

  const columns = [
    {
      title: 'Trường',
      dataIndex: 'universityId',
      render: (id: number) =>
        universities.find(item => item.id === id)?.name || '',
    },
    {
      title: 'Tên đợt',
      dataIndex: 'name',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      render: (value: boolean) => <Switch checked={value} disabled />,
    },
  ];

  return (
    <Card
      title="Quản lý đợt tuyển sinh"
      extra={
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm đợt
        </Button>
      }
    >
      <Select
        allowClear
        placeholder="Lọc theo trường"
        style={{ width: 320, marginBottom: 16 }}
        value={universityId}
        onChange={(value) => {
          setUniversityId(value);
          fetchData(value);
        }}
        options={universities.map(item => ({
          label: item.name,
          value: item.id,
        }))}
      />

      <Table rowKey="id" columns={columns} dataSource={data} />

      <Modal
        title="Thêm đợt tuyển sinh"
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical" initialValues={{ active: true }}>
          <Form.Item
            name="universityId"
            label="Trường"
            rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
          >
            <Select
              placeholder="Chọn trường"
              options={universities.map(item => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên đợt tuyển sinh"
            rules={[{ required: true, message: 'Vui lòng nhập tên đợt' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian tuyển sinh"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
            />
          </Form.Item>

          <Form.Item name="active" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}