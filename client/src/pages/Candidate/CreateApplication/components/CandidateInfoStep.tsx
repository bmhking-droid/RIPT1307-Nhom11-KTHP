import { CheckCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import styles from '../index.less';
import { phoneRules, emailRules, citizenIdRules } from '@/utils/validators';

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
        Bạn có thể chỉnh sửa trực tiếp tại đây nếu thông tin trống.
      </div>

      <Row gutter={[20, 12]}>
        {/* 1. Họ và tên */}
        <Col xs={24} md={12}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input size="large" placeholder="Nhập họ và tên" />
          </Form.Item>
        </Col>

        {/* 2. Email */}
        <Col xs={24} md={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={emailRules}
          >
            <Input size="large" placeholder="Nhập địa chỉ email" disabled />
          </Form.Item>
        </Col>

        {/* 3. Số điện thoại */}
        <Col xs={24} md={12}>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={phoneRules}
          >
            <Input size="large" placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        {/* 4. Giới tính */}
        <Col xs={24} md={12}>
          <Form.Item label="Giới tính" name="gender">
            <Input size="large" placeholder="Nhập giới tính (Nam/Nữ)" />
          </Form.Item>
        </Col>

        {/* 5. Ngày sinh */}
        <Col xs={24} md={12}>
          <Form.Item label="Ngày sinh" name="dob">
            <Input size="large" placeholder="Ví dụ: 14/12/2005" />
          </Form.Item>
        </Col>

        {/* 6. Tỉnh/Thành phố */}
        <Col xs={24} md={12}>
          <Form.Item label="Tỉnh/Thành phố" name="province">
            <Input size="large" placeholder="Nhập Tỉnh/Thành phố" />
          </Form.Item>
        </Col>

        {/* 7. CCCD */}
        <Col xs={24} md={12}>
          <Form.Item
            name="citizenId"
            label="CCCD"
            rules={citizenIdRules}
          >
            <Input size="large" maxLength={12} placeholder="Nhập mã số CCCD 12 số" />
          </Form.Item>
        </Col>

        {/* 8. Địa chỉ liên hệ */}
        <Col xs={24}>
          <Form.Item label="Địa chỉ liên hệ" name="address">
            <TextArea rows={3} placeholder="Nhập số nhà, tên đường, xã/phường, quận/huyện..." />
          </Form.Item>
        </Col>

        {/* 9. Điểm xét tuyển */}
        <Col xs={24} md={12}>
          <Form.Item
            label="Điểm xét tuyển"
            name="score"
            rules={[{ required: true, message: 'Vui lòng nhập điểm xét tuyển!' }]}
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

        {/* 10. Đối tượng ưu tiên */}
        <Col xs={24} md={12}>
          <Form.Item label="Đối tượng ưu tiên" name="priorityGroup">
            <Select
              size="large"
              placeholder="Chọn đối tượng ưu tiên"
              options={[
                { label: 'KV1 (Khu vực 1)', value: 'KV1' },
                { label: 'KV2 (Khu vực 2)', value: 'KV2' },
                { label: 'KV2-NT (Khu vực 2 - Nông thôn)', value: 'KV2-NT' },
                { label: 'KV3 (Khu vực 3)', value: 'KV3' },
              ]}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}