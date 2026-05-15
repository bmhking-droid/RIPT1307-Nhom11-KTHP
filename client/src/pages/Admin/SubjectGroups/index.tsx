import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  message,
} from 'antd';
import {
  createSubjectGroup,
  deleteSubjectGroup,
  getMajors,
  getSubjectGroups,
  getUniversities,
  updateSubjectGroup,
} from '@/services/admin';

export default function SubjectGroupsPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);

  const [universityId, setUniversityId] = useState<number>();
  const [majorId, setMajorId] = useState<number>();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>();

  const [form] = Form.useForm();

  const fetchUniversities = async () => {
    const res = await getUniversities();
    setUniversities(res.data || []);
  };

  const fetchMajors = async (selectedUniversityId?: number) => {
    const res = await getMajors({
      universityId: selectedUniversityId,
    });

    setMajors(res.data || []);
  };

  const fetchSubjectGroups = async (selectedMajorId?: number) => {
    const res = await getSubjectGroups({
      majorId: selectedMajorId,
    });

    setData(res.data || []);
  };

  useEffect(() => {
    fetchUniversities();
    fetchMajors();
    fetchSubjectGroups();
  }, []);

  const handleUniversityChange = async (value?: number) => {
    setUniversityId(value);
    setMajorId(undefined);

    await fetchMajors(value);
    await fetchSubjectGroups(undefined);
  };

  const handleMajorChange = async (value?: number) => {
    setMajorId(value);
    await fetchSubjectGroups(value);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      subjects: values.subjects
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean),
    };

    if (editing) {
      await updateSubjectGroup(editing.id, payload);
      message.success('Đã cập nhật tổ hợp xét tuyển');
    } else {
      await createSubjectGroup(payload);
      message.success('Đã thêm tổ hợp xét tuyển');
    }

    setOpen(false);
    setEditing(undefined);
    form.resetFields();
    fetchSubjectGroups(majorId);
  };

  const columns = [
    {
      title: 'Ngành',
      dataIndex: 'majorId',
      render: (id: number) =>
        majors.find(item => item.id === id)?.name || '',
    },
    {
      title: 'Mã tổ hợp',
      dataIndex: 'code',
    },
    {
      title: 'Môn xét tuyển',
      dataIndex: 'subjects',
      render: (subjects: string[]) => subjects.join(', '),
    },
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
              form.setFieldsValue({
                ...record,
                subjects: record.subjects.join(', '),
              });
              setOpen(true);
            }}
          >
            Sửa
          </Button>

          <Button
            type="link"
            danger
            onClick={async () => {
              await deleteSubjectGroup(record.id);
              message.success('Đã xóa tổ hợp xét tuyển');
              fetchSubjectGroups(majorId);
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
      title="Quản lý tổ hợp xét tuyển"
      extra={
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm tổ hợp
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Lọc theo trường"
          style={{ width: 300 }}
          value={universityId}
          onChange={handleUniversityChange}
          options={universities.map(item => ({
            label: item.name,
            value: item.id,
          }))}
        />

        <Select
          allowClear
          placeholder="Lọc theo ngành"
          style={{ width: 260 }}
          value={majorId}
          onChange={handleMajorChange}
          disabled={!universityId}
          options={majors.map(item => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </Space>

      <Table rowKey="id" columns={columns} dataSource={data} />

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
        <Form form={form} layout="vertical" initialValues={{ active: true }}>
          <Form.Item
            name="majorId"
            label="Ngành"
            rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
          >
            <Select
              placeholder="Chọn ngành"
              options={majors.map(item => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>

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

          <Form.Item name="active" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}