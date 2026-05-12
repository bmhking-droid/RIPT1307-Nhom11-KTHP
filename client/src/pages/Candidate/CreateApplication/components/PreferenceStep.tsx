import { Col, Form, Row, Select } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import {
  admissionRoundsMock,
  combinationsMock,
  universitiesMock,
} from '@/mock/admission';
import styles from '../index.less';

type Props = {
  form: any;
};

export default function PreferenceStep({ form }: Props) {
  const selectedUniversityId = Form.useWatch('universityId', form);

  const selectedUniversity = universitiesMock.find(
    (item: any) => item.id === selectedUniversityId,
  );

  return (
    <div className={styles.stepContent}>
      <div className={styles.blockTitle}>
        <FileTextOutlined />
        <div>
          <h3>Thông tin nguyện vọng</h3>
          <p>Chọn trường, ngành và đợt tuyển sinh phù hợp.</p>
        </div>
      </div>

      <Row gutter={[20, 12]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Trường đại học"
            name="universityId"
            rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
          >
            <Select
              size="large"
              placeholder="Chọn trường đại học"
              options={universitiesMock.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              onChange={() => form.setFieldValue('major', undefined)}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Ngành xét tuyển"
            name="major"
            rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
          >
            <Select
              size="large"
              placeholder="Chọn ngành"
              disabled={!selectedUniversity}
              options={(selectedUniversity?.majors || []).map((major: any) => ({
                label: typeof major === 'string' ? major : major.name,
                value: typeof major === 'string' ? major : major.id,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Đợt tuyển sinh"
            name="admissionRound"
            rules={[{ required: true, message: 'Vui lòng chọn đợt tuyển sinh' }]}
          >
            <Select
              size="large"
              placeholder="Chọn đợt tuyển sinh"
              options={admissionRoundsMock.map((item: any) => ({
                label: typeof item === 'string' ? item : item.name,
                value: typeof item === 'string' ? item : item.id,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Tổ hợp xét tuyển"
            name="combination"
            rules={[{ required: true, message: 'Vui lòng chọn tổ hợp' }]}
          >
            <Select
              size="large"
              options={combinationsMock.map((item: any) => ({
                label: typeof item === 'string' ? item : item.name,
                value: typeof item === 'string' ? item : item.id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}