import { CheckCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import styles from '../index.less';
import {
  phoneRules,
  emailRules,
  citizenIdRules,
} from '@/utils/validators';
const { TextArea } = Input;

export default function CandidateInfoStep() {
  return (
    <div className={styles.stepContent}>
      <div className={styles.blockTitle}>
        <CheckCircleOutlined />
        <div>
          <h3>Thông tin thí sinh</h3>
          <p>Hệ thống tự động lấy thông tin từ hồ sơ cá nhân của bạn.</p>
        </div>
      </div>

      <div className={styles.profileNotice}>
        Thông tin bên dưới được đồng bộ từ mục <strong>Thông tin cá nhân</strong>.
        Nếu cần chỉnh sửa, vui lòng cập nhật tại trang hồ sơ trước khi nộp.
      </div>

      <Row gutter={[20, 12]}>
        <Col xs={24} md={12}>
<Form.Item
  name="fullName"
  label="Họ và tên"
  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
>            <Input size="large" disabled />
          </Form.Item>
        </Col>

        

        <Col xs={24} md={12}>
<Form.Item
  name="email"
  label="Email"
  rules={[
    { required: true, message: 'Vui lòng nhập email' },
    ...emailRules,
  ]}
>            <Input size="large" disabled />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
<Form.Item
  name="phone"
  label="Số điện thoại"
  rules={[
    { required: true, message: 'Vui lòng nhập số điện thoại' },
    ...phoneRules,
  ]}
>            <Input size="large" disabled />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Giới tính" name="gender">
            <Input size="large" disabled />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Ngày sinh" name="dob">
            <Input size="large" disabled />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Tỉnh/Thành phố" name="province">
            <Input size="large" disabled />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
<Form.Item
  name="citizenId"
  label="CCCD"
  rules={[
    { required: true, message: 'Vui lòng nhập CCCD' },
    ...citizenIdRules,
  ]}
>            <Input  maxLength={12} disabled />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Địa chỉ liên hệ" name="address">
            <TextArea rows={3} disabled />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Điểm xét tuyển"
            name="score"
            rules={[{ required: true, message: 'Vui lòng nhập điểm xét tuyển' }]}
          >
            <InputNumber
              size="large"
              min={0}
              max={30}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="Ví dụ: 25.75"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}