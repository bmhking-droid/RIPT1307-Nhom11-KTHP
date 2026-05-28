import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tag, message } from 'antd';
import {
  createMajor,
  deleteMajor,
  getMajors,
  getUniversities,
  updateMajor,
} from '@/services/admin';
import { getCombinations } from '@/services/admission';

export default function MajorsPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [universityId, setUniversityId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>();
  const [form] = Form.useForm();

  const fetchUniversities = async () => {
    const res = await getUniversities();
    setUniversities(res.data || []);
  };

  const fetchCombinations = async () => {
    const res = await getCombinations();
    setCombinations(res.data || []);
  };

  const fetchMajors = async (selectedUniversityId?: number) => {
    const res = await getMajors({
      universityId: selectedUniversityId,
    });

    setData(res.data || []);
  };

  useEffect(() => {
    fetchUniversities();
    fetchCombinations();
    fetchMajors();
  }, []);

  const handleUniversityChange = (value: number) => {
    setUniversityId(value);
    fetchMajors(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await updateMajor(editing.id, values);
        message.success('Đã cập nhật ngành');
      } else {
        await createMajor(values);
        message.success('Đã thêm ngành');
      }

      setOpen(false);
      setEditing(undefined);
      form.resetFields();
      fetchMajors(universityId);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: 'Trường',
      dataIndex: 'universityId',
      render: (id: any) =>
        universities.find(item => item.id === id)?.name || '',
    },
    { title: 'Mã ngành', dataIndex: 'code' },
    { title: 'Tên ngành', dataIndex: 'name' },
    { title: 'Chỉ tiêu', dataIndex: 'quota' },
    {
      title: 'Tổ hợp xét tuyển',
      dataIndex: 'AdmissionCombinations',
      render: (combos: any[]) => (
        <Space size={[4, 4]} wrap>
          {combos && combos.length > 0 ? (
            combos.map((combo) => (
              <Tag color="geekblue" key={combo.id} style={{ fontWeight: 600, borderRadius: 4 }}>
                {combo.code}
              </Tag>
            ))
          ) : (
            <span style={{ color: '#9CA3AF', fontSize: 12, fontStyle: 'italic' }}>Chưa cấu hình</span>
          )}
        </Space>
      ),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      render: (checked: boolean, record: any) => (
        <Switch
          checked={checked}
          onChange={async (val) => {
            try {
              await updateMajor(record.id, { isActive: val });
              message.success(`Đã cập nhật trạng thái hoạt động của ngành ${record.name}`);
              fetchMajors(universityId);
            } catch {
              message.error('Không thể cập nhật trạng thái hoạt động');
            }
          }}
        />
      ),
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
                combinationIds: record.AdmissionCombinations ? record.AdmissionCombinations.map((c: any) => c.id) : []
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
              await deleteMajor(record.id);
              message.success('Đã xóa ngành');
              fetchMajors(universityId);
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
      title="Quản lý danh sách ngành"
      extra={
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm ngành
        </Button>
      }
    >
      <Select
        allowClear
        placeholder="Lọc theo trường"
        style={{ width: 320, marginBottom: 16 }}
        value={universityId}
        onChange={handleUniversityChange}
        options={universities.map(item => ({
          label: item.name,
          value: item.id,
        }))}
      />

      <Table rowKey="id" columns={columns} dataSource={data} />

      <Modal
        title={editing ? 'Cập nhật ngành' : 'Thêm ngành'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(undefined);
          form.resetFields();
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
          <Form.Item name="universityId" label="Trường" rules={[{ required: true }]}>
            <Select
              options={universities.map(item => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="code" label="Mã ngành" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Tên ngành" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="quota" label="Chỉ tiêu">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="combinationIds" label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn ít nhất một tổ hợp xét tuyển!' }]}>
            <Select
              mode="multiple"
              placeholder="Chọn các tổ hợp xét tuyển cho ngành này"
              options={combinations.map(item => ({
                label: `${item.code} (${item.subjects})`,
                value: item.id,
              }))}
              allowClear
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