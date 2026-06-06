import { Button, Card, Form, Input, message } from 'antd';
import { history } from 'umi';
import { register } from '@/services/auth';

export default function RegisterPage() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const { fullName, email, password } = values;
      
      await register({ fullName, email, password });
      
      message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      
      history.push('/login');
    } catch (error: any) {
      console.error('Register failed:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
      message.error(errorMsg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f5f7fb' }}>
      <Card style={{ width: 420, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 600 }}>Đăng ký tài khoản</h2>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            label="Họ và tên" 
            name="fullName" 
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input size="large" placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item 
            label="Email" 
            name="email" 
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input size="large" placeholder="Nhập email" autoComplete="username" />
          </Form.Item>

          <Form.Item 
            label="Mật khẩu" 
            name="password" 
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password 
              size="large" 
              placeholder="Nhập mật khẩu" 
              autoComplete="new-password" 
            />
          </Form.Item>

          <Form.Item 
            label="Xác nhận mật khẩu" 
            name="confirmPassword" 
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              size="large" 
              placeholder="Nhập lại mật khẩu" 
              autoComplete="new-password" 
            />
          </Form.Item>

          <Button type="primary" block htmlType="submit" size="large" style={{ marginTop: 12, borderRadius: 8 }}>
            Đăng ký
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            Đã có tài khoản? <a onClick={() => history.push('/login')}>Đăng nhập ngay</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}