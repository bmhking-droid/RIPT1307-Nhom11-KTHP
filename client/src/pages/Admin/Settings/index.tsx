import React from 'react';
import { Card, Form, Input, Switch, Button, message } from 'antd';

export default function SettingsPage() {
  const handleSubmit = () => {
    message.success('Đã lưu cấu hình hệ thống');
  };

  return (
    <Card title="Cấu hình hệ thống">
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          autoSendEmail: true,
          allowCandidateSubmit: true,
          systemName: 'Hệ thống tuyển sinh trực tuyến',
        }}
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