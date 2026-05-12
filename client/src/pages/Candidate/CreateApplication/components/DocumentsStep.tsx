import { UploadOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Upload } from 'antd';
import styles from '../index.less';

const { TextArea } = Input;

function UploadBox({ label, name, required, message, text }: any) {
  return (
    <Col xs={24} md={12}>
      <Form.Item
        label={label}
        name={name}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
        rules={required ? [{ required: true, message }] : []}
      >
        <Upload.Dragger
          beforeUpload={() => false}
          maxCount={1}
          accept=".pdf,.jpg,.jpeg,.png"
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">{text}</p>
          <p className="ant-upload-hint">
            {required ? 'Bắt buộc upload' : 'Không bắt buộc, chỉ upload nếu có'}
          </p>
        </Upload.Dragger>
      </Form.Item>
    </Col>
  );
}

export default function DocumentsStep() {
  return (
    <div className={styles.stepContent}>
      <div className={styles.blockTitle}>
        <UploadOutlined />
        <div>
          <h3>Minh chứng hồ sơ</h3>
          <p>Upload các giấy tờ cần thiết để cán bộ tuyển sinh xét duyệt.</p>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        <UploadBox
          label="CCCD/CMND"
          name="identityFile"
          required
          message="Vui lòng upload CCCD/CMND"
          text="Kéo file hoặc bấm để upload CCCD/CMND"
        />

        <UploadBox
          label="Học bạ/Bảng điểm"
          name="transcriptFile"
          required
          message="Vui lòng upload học bạ/bảng điểm"
          text="Kéo file hoặc bấm để upload học bạ/bảng điểm"
        />

        <UploadBox
          label="Chứng chỉ tiếng Anh nếu có"
          name="englishCertificateFile"
          text="IELTS / TOEIC / TOEFL / chứng chỉ khác"
        />

        <UploadBox
          label="Giấy chứng nhận nếu có"
          name="certificateFile"
          text="Upload giấy chứng nhận"
        />

        <UploadBox
          label="Giấy ưu tiên nếu có"
          name="priorityFile"
          text="Upload giấy ưu tiên"
        />

        <Col xs={24}>
          <Form.Item label="Ghi chú bổ sung" name="note">
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú nếu có, ví dụ: giấy ưu tiên, chứng chỉ bổ sung..."
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}