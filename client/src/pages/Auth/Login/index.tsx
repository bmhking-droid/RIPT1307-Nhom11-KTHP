import { Button, Card, Form, Input, message, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { history } from 'umi';
import { login, forgotPassword, resetPassword } from '@/services/auth';
import { MailOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons';

export default function LoginPage() {
  const [form] = Form.useForm();
  
  // States cho chức năng Quên mật khẩu & OTP
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [cooldown, setCooldown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Hiệu ứng đồng hồ đếm ngược gửi lại mã OTP
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

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

  const onFinishFailed = () => {
    message.error('Form nhập liệu chưa hợp lệ. Vui lòng kiểm tra lại các ô báo đỏ!');
  };

  const handleRequestOtp = async () => {
    const emailStr = forgotEmail.trim();
    if (!emailStr) {
      message.error('Vui lòng nhập Email!');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      message.error('Email không đúng định dạng!');
      return;
    }

    try {
      setSendingOtp(true);
      const res = await forgotPassword(emailStr);
      if (res && res.success) {
        message.success('Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn!');
        setStep(2);
        setCooldown(60); 
      } else {
        message.error(res?.message || 'Gửi mã OTP thất bại!');
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu khôi phục mật khẩu!');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    const emailStr = forgotEmail.trim();
    const otpStr = otpCode.trim();
    const passStr = newPassword.trim();
    const confirmStr = confirmPassword.trim();

    if (!otpStr || !passStr || !confirmStr) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (passStr !== confirmStr) {
      message.error('Mật khẩu nhập lại không trùng khớp!');
      return;
    }
    if (passStr.length < 6) {
      message.error('Mật khẩu mới phải từ 6 ký tự trở lên!');
      return;
    }

    try {
      setResettingPassword(true);
      const res = await resetPassword({
        email: emailStr,
        otpCode: otpStr,
        newPassword: passStr
      });
      if (res && res.success) {
        message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
        setIsModalOpen(false);
        
        setForgotEmail('');
        setOtpCode('');
        setNewPassword('');
        setConfirmPassword('');
        setStep(1);
      } else {
        message.error(res?.message || 'Khôi phục mật khẩu thất bại!');
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hiệu lực!');
    } finally {
      setResettingPassword(false);
    }
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

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <a onClick={() => setIsModalOpen(true)} style={{ fontSize: 14, fontWeight: 500, color: '#4f46e5' }}>
              Quên mật khẩu?
            </a>
          </div>

          <Button type="primary" block htmlType="submit" size="large" style={{ borderRadius: 8, background: '#4f46e5', borderColor: '#4f46e5' }}>
            Đăng nhập
          </Button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            Chưa có tài khoản? <a onClick={() => history.push('/register')} style={{ color: '#4f46e5' }}>Đăng ký ngay</a>
          </div>
        </Form>
      </Card>

      {/* Modal khôi phục mật khẩu bằng OTP */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>
            🔒 Khôi phục mật khẩu tài khoản
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setStep(1);
          setForgotEmail('');
          setOtpCode('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        footer={null}
        destroyOnClose
        width={400}
        styles={{ body: { paddingTop: 12 } }}
      >
        {step === 1 ? (
          <div>
            <p style={{ color: '#4b5563', marginBottom: 16, fontSize: 14 }}>
              Nhập email đã đăng ký. Chúng tôi sẽ gửi mã OTP xác thực (hiệu lực 1 phút) để bạn thiết lập lại mật khẩu.
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#374151' }}>Email đăng ký</label>
              <Input
                size="large"
                placeholder="Nhập email của bạn"
                prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <Button
              type="primary"
              block
              size="large"
              loading={sendingOtp}
              onClick={handleRequestOtp}
              style={{ borderRadius: 8, background: '#4f46e5', borderColor: '#4f46e5' }}
            >
              Gửi mã OTP khôi phục
            </Button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#4b5563', marginBottom: 16, fontSize: 14 }}>
              Mã xác thực đã được gửi đến: <strong style={{ color: '#4f46e5' }}>{forgotEmail}</strong>. Vui lòng kiểm tra email của bạn.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#374151' }}>Mã xác thực OTP (6 chữ số)</label>
              <Input
                size="large"
                placeholder="Nhập mã OTP gồm 6 chữ số"
                maxLength={6}
                prefix={<KeyOutlined style={{ color: '#9ca3af' }} />}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#374151' }}>Mật khẩu mới</label>
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu mới"
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#374151' }}>Xác nhận mật khẩu mới</label>
              <Input.Password
                size="large"
                placeholder="Nhập lại mật khẩu mới"
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                block
                size="large"
                disabled={cooldown > 0 || sendingOtp}
                onClick={handleRequestOtp}
                style={{ borderRadius: 8, flex: 1 }}
              >
                {cooldown > 0 ? `Gửi lại sau (${cooldown}s)` : 'Gửi lại mã'}
              </Button>
              
              <Button
                type="primary"
                block
                size="large"
                loading={resettingPassword}
                onClick={handleResetPassword}
                style={{ borderRadius: 8, flex: 1, background: '#10b981', borderColor: '#10b981' }}
              >
                Đặt lại mật khẩu
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}