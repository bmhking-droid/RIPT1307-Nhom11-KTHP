import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  message,
} from 'antd';
import {
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';

import PageHeader from '@/components/PageHeader';

import styles from './index.less';

const provinceOptions = [
  'Hà Nội',
  'TP Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
];

export default function CandidateProfile() {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      message.success('Cập nhật thông tin thành công.');
    } catch {
      message.warning('Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className={styles.profilePage}>
      <PageHeader
        title="Thông tin cá nhân"
        description="Quản lý thông tin hồ sơ và dữ liệu xét tuyển của bạn."
      />

      <Row gutter={[24, 24]}>
        {/* LEFT */}
        <Col xs={24} lg={8}>
          <Card className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrap}>
                <Avatar size={120} icon={<UserOutlined />} />

                <button className={styles.cameraButton}>
                  <CameraOutlined />
                </button>
              </div>

              <h2>Nguyễn Văn A</h2>

              <p>Thí sinh hệ thống tuyển sinh 2026</p>

              <Space wrap>
                <Tag color="processing">Đã xác thực</Tag>
                <Tag color="success">Hồ sơ hoạt động</Tag>
              </Space>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <MailOutlined />
                <span>candidate@email.com</span>
              </div>

              <div className={styles.infoItem}>
                <PhoneOutlined />
                <span>09xxxxxxxx</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={16}>
          <Card className={styles.formCard}>
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              initialValues={{
                fullName: 'Nguyễn Văn A',
                email: 'candidate@email.com',
                phone: '09xxxxxxxx',
                gender: 'male',
                province: 'Hà Nội',
              }}
            >
              <Row gutter={[20, 12]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập họ tên',
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Nhập họ và tên"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dob"
                  >
                    <DatePicker
                      size="large"
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày sinh"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập email',
                      },
                      {
                        type: 'email',
                        message: 'Email không hợp lệ',
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Nhập email"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại',
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                  >
                    <Select
                      size="large"
                      options={[
                        {
                          label: 'Nam',
                          value: 'male',
                        },
                        {
                          label: 'Nữ',
                          value: 'female',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tỉnh/Thành phố"
                    name="province"
                  >
                    <Select
                      size="large"
                      placeholder="Chọn tỉnh/thành"
                      options={provinceOptions.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Địa chỉ liên hệ"
                    name="address"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Nhập địa chỉ liên hệ"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className={styles.footerActions}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}