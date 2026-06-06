import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Switch, Button, message, Spin } from 'antd';
import request from '@/services/request';

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res: any = await request.get('/settings', { params: { _t: Date.now() } });
      if (res && res.success && res.data) {
        form.setFieldsValue(res.data);
      }
    } catch {
      message.error('Không thể tải cấu hình hệ thống');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const res: any = await request.put('/settings', values);
      if (res && res.success) {
        message.success('Đã lưu cấu hình hệ thống');
      }
    } catch {
      message.error('Không thể lưu cấu hình hệ thống');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" tip="Đang tải cấu hình..." />
      </div>
    );
  }

  return (
    <Card title="Cấu hình hệ thống">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="systemName"
          label="Tên hệ thống"
          rules={[{ required: true, message: 'Vui lòng nhập tên hệ thống' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="allowCandidateSubmit"
          label="Cho phép thí sinh nộp hồ sơ"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="autoSendEmail"
          label="Tự động gửi email khi hồ sơ đổi trạng thái"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item name="emailSenderName" label="Tên người gửi email">
          <Input placeholder="VD: Phòng tuyển sinh" />
        </Form.Item>

        <Form.Item name="emailFooter" label="Chữ ký email">
          <Input.TextArea
            rows={4}
            placeholder="VD: Trân trọng, Phòng tuyển sinh"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Lưu cấu hình
        </Button>
      </Form>
    </Card>
  );
}