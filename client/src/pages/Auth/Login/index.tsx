import { Button, Card, Form, Input } from 'antd';
import { history } from 'umi';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f7fb' }}>
      <Card style={{ width: 420, borderRadius: 20 }}>
        <h2>Đăng nhập</h2>

        <Form layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Button type="primary" block onClick={() => history.push('/candidate/dashboard')}>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}