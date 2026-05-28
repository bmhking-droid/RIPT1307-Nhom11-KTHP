import { Col, Form, Row, Select } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import styles from '../index.less';

type Props = {
  form: any;
  universities: any[];
  majors: any[]; 
  rounds: any[];
  combinations: any[];
  onUniversityChange?: (universityId: string) => void; 
};

export default function PreferenceStep({ form, universities, majors, rounds, combinations, onUniversityChange }: Props) {
  const selectedUniversityId = Form.useWatch('universityId', form);
  const selectedMajorId = Form.useWatch('major', form);

  // Lọc lấy danh sách các tổ hợp xét tuyển của riêng ngành đang được chọn
  const selectedMajor = majors.find((m: any) => m.id === selectedMajorId);
  const allowedCombinations = selectedMajor?.AdmissionCombinations || [];

  return (
    <div className={styles.stepContent}>
      <div className={styles.blockTitle}>
        <FileTextOutlined />
        <div>
          <h3>Thông tin nguyện vọng</h3>
          <p>Chọn trường, ngành và đợt tuyển sinh phù hợp từ hệ thống.</p>
        </div>
      </div>

      <Row gutter={[20, 12]}>
        {/* 1. Ô CHỌN TRƯỜNG ĐẠI HỌC */}
        <Col xs={24} md={12}>
          <Form.Item
            label="Trường đại học"
            name="universityId"
            rules={[{ required: true, message: 'Vui lòng chọn trường đại học' }]}
          >
            <Select
              size="large"
              placeholder="Chọn trường đại học"
              options={universities.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              onChange={(value) => {
                form.setFieldValue('major', undefined);
                form.setFieldValue('combination', undefined);
                if (onUniversityChange) {
                  onUniversityChange(value);
                }
              }}
            />
          </Form.Item>
        </Col>

        {/* 2. Ô CHỌN NGÀNH XẾT TUYỂN */}
        <Col xs={24} md={12}>
          <Form.Item
            label="Ngành xét tuyển"
            name="major"
            rules={[{ required: true, message: 'Vui lòng chọn ngành xét tuyển' }]}
          >
            <Select
              size="large"
              placeholder={selectedUniversityId ? "Chọn ngành học" : "Vui lòng chọn trường đại học trước"}
              disabled={!selectedUniversityId || majors.length === 0}
              options={majors.map((major: any) => ({
                label: major.name,
                value: major.id,
              }))}
              onChange={(value) => {
                form.setFieldValue('combination', undefined);
              }}
            />
          </Form.Item>
        </Col>

        {/* 3. Ô CHỌN ĐỢT TUYỂN SINH */}
        <Col xs={24} md={12}>
          <Form.Item
            label="Đợt tuyển sinh"
            name="admissionRound"
            rules={[{ required: true, message: 'Vui lòng chọn đợt tuyển sinh' }]}
          >
            <Select
              size="large"
              placeholder="Chọn đợt tuyển sinh"
              options={rounds.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
        </Col>

        {/* 4. Ô CHỌN TỔ HỢP XẾT TUYỂN */}
        <Col xs={24} md={12}>
          <Form.Item
            label="Tổ hợp xét tuyển"
            name="combination"
            rules={[{ required: true, message: 'Vui lòng chọn tổ hợp xét tuyển' }]}
          >
            <Select
              size="large"
              placeholder={selectedMajorId ? "Chọn tổ hợp xét tuyển" : "Vui lòng chọn ngành xét tuyển trước"}
              disabled={!selectedMajorId || allowedCombinations.length === 0}
              options={allowedCombinations.map((item: any) => ({
                label: item.subjects ? `${item.code} (${item.subjects})` : item.code,
                value: item.id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}