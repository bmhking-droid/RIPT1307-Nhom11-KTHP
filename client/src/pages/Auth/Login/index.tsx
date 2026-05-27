import { Button, Card, Form, Input, message } from 'antd';
import { history } from 'umi';
import { login } from '@/services/auth';

export default function LoginPage() {
  const [form] = Form.useForm();

  // 1. Xử lý khi form hợp lệ và gửi API
  const onFinish = async (values: any) => {
    try {
      const res = await login(values);

      if (res && res.data && res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);

        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }

        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          const displayName = res.data.user.fullName || 'bạn';
          message.success(`Chào mừng ${displayName} đã đăng nhập thành công!`);

          const userRole = res.data.user.role?.toUpperCase();
          if (userRole === 'ADMIN') {
            history.push('/admin/dashboard');
          } else {
            history.push('/candidate/dashboard');
          }
        }
      } else {
        message.error('Đăng nhập thất bại, không tìm thấy mã Token hợp lệ!');
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message;

      if (status === 403) {
        message.error({
          content: serverMsg || 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
          duration: 6,
        });
      } else {
        message.error(serverMsg || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    }
  };

  // 2. Xử lý khi form chưa hợp lệ
  const onFinishFailed = () => {
    message.error('Form nhập liệu chưa hợp lệ. Vui lòng kiểm tra lại các ô báo đỏ!');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f7fb' }}>
      <Card style={{ width: 420, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 600 }}>Đăng nhập</h2>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          onFinishFailed={onFinishFailed} 
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input size="large" placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              size="large" 
              placeholder="Nhập mật khẩu" 
              autoComplete="current-password" 
            />
          </Form.Item>

          <Button type="primary" block htmlType="submit" size="large" style={{ marginTop: 12, borderRadius: 8 }}>
            Đăng nhập
          </Button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            Chưa có tài khoản? <a onClick={() => history.push('/register')}>Đăng ký ngay</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}