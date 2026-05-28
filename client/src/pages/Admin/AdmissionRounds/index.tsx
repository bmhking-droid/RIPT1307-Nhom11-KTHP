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
  updateAdmissionRound,
} from '@/services/admin';

export default function AdmissionRoundsPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const res = await getAdmissionRounds();
    setData(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    await createAdmissionRound({
      name: values.name,
      startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
      isActive: values.isActive,
    });

    message.success('Đã thêm đợt tuyển sinh');
    setOpen(false);
    form.resetFields();
    fetchData();
  };

  const columns = [
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
      dataIndex: 'isActive',
      render: (checked: boolean, record: any) => (
        <Switch
          checked={checked}
          onChange={async (val) => {
            try {
              await updateAdmissionRound(record.id, { isActive: val });
              message.success(`Đã cập nhật trạng thái hoạt động của đợt ${record.name}`);
              fetchData();
            } catch {
              message.error('Không thể cập nhật trạng thái hoạt động');
            }
          }}
        />
      ),
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
        <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
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

          <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}