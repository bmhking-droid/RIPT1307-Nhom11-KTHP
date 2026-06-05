import React from 'react';
import { Form, Upload, message, Row, Col, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadCandidateFile } from '@/services/candidate';
import { validateFileBeforeUpload } from '@/utils/validators';

const { Dragger } = Upload;

export default function DocumentsStep() {
  const customUpload = (documentType: string) => async (options: any) => {
    const { file, onSuccess, onError } = options;

    const validate = validateFileBeforeUpload(file);
    if (!validate.valid) {
      message.error(validate.message);
      onError?.(new Error(validate.message));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('file', file);

      const res = await uploadCandidateFile(formData);

      onSuccess?.(res.data || res);
      message.success(`Upload thành công`);
    } catch (error) {
      onError?.(error);
      message.error('Upload file thất bại. Vui lòng kiểm tra lại kết nối.');
    }
  };

  const uploadProps = (documentType: string) => ({
    maxCount: 1,
    customRequest: customUpload(documentType),
    beforeUpload: (file: File) => {
      const validate = validateFileBeforeUpload(file);
      if (!validate.valid) {
        message.error(validate.message);
        return Upload.LIST_IGNORE;
      }
      return true;
    },
  });

  return (
    <Row gutter={[24, 24]}>
      {/* CỘT TRÁI: TÀI LIỆU BẮT BUỘC */}
      <Col xs={24} md={12}>
        <Card 
          title={
            <div style={{ color: '#dc2626', fontWeight: 700, fontSize: 16 }}>
              🔴 Hồ sơ bắt buộc nộp
            </div>
          }
          style={{ 
            borderRadius: 16, 
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.03)', 
            border: '1px solid #fee2e2',
            height: '100%' 
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              {/* 1. KHỐI UPLOAD HỌC BẠ */}
              <Form.Item
                name="transcriptFile"
                label={<span style={{ fontWeight: 600 }}>Học bạ THPT</span>}
                rules={[{ required: true, message: 'Vui lòng upload học bạ' }]}
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                style={{ marginBottom: 0 }}
              >
                <Dragger {...uploadProps('HOC_BA')} style={{ padding: '24px 12px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                    <InboxOutlined style={{ color: '#dc2626', fontSize: '28px' }} />
                  </p>
                  <p style={{ fontWeight: 500, fontSize: 13, margin: '0 0 4px 0' }}>Tải Học bạ</p>
                  <p className="ant-upload-hint" style={{ fontSize: 11, margin: 0 }}>Hỗ trợ PDF, JPG, PNG (tối đa 5MB)</p>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              {/* 2. KHỐI UPLOAD CCCD */}
              <Form.Item
                name="citizenIdFile"
                label={<span style={{ fontWeight: 600 }}>CCCD / CMND</span>}
                rules={[{ required: true, message: 'Vui lòng upload CCCD/CMND' }]}
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                style={{ marginBottom: 0 }}
              >
                <Dragger {...uploadProps('CCCD')} style={{ padding: '24px 12px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                    <InboxOutlined style={{ color: '#dc2626', fontSize: '28px' }} />
                  </p>
                  <p style={{ fontWeight: 500, fontSize: 13, margin: '0 0 4px 0' }}>Tải CCCD</p>
                  <p className="ant-upload-hint" style={{ fontSize: 11, margin: 0 }}>Hỗ trợ PDF, JPG, PNG (tối đa 5MB)</p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* CỘT PHẢI: TÀI LIỆU TỰ CHỌN (KHÔNG BẮT BUỘC) */}
      <Col xs={24} md={12}>
        <Card 
          title={
            <div style={{ color: '#2563eb', fontWeight: 700, fontSize: 16 }}>
              🔵 Hồ sơ tự chọn (Không bắt buộc)
            </div>
          }
          style={{ 
            borderRadius: 16, 
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.03)', 
            border: '1px solid #dbeafe',
            height: '100%' 
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              {/* 3. KHỐI UPLOAD CHỨNG CHỈ TIẾNG ANH */}
              <Form.Item
                name="englishCertFile"
                label={<span style={{ fontWeight: 600 }}>Chứng chỉ tiếng Anh</span>}
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                style={{ marginBottom: 0 }}
              >
                <Dragger {...uploadProps('CHUNG_CHI_TIENG_ANH')} style={{ padding: '24px 12px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                    <InboxOutlined style={{ color: '#2563eb', fontSize: '28px' }} />
                  </p>
                  <p style={{ fontWeight: 500, fontSize: 13, margin: '0 0 4px 0' }}>Tải Chứng chỉ</p>
                  <p className="ant-upload-hint" style={{ fontSize: 11, margin: 0 }}>IELTS, TOEIC, TOEFL (tối đa 5MB)</p>
                </Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              {/* 4. KHỐI UPLOAD GIẤY ƯU TIÊN */}
              <Form.Item
                name="priorityFile"
                label={<span style={{ fontWeight: 600 }}>Giấy xác nhận ưu tiên</span>}
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                style={{ marginBottom: 0 }}
              >
                <Dragger {...uploadProps('GIAY_UU_TIEN')} style={{ padding: '24px 12px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                    <InboxOutlined style={{ color: '#2563eb', fontSize: '28px' }} />
                  </p>
                  <p style={{ fontWeight: 500, fontSize: 13, margin: '0 0 4px 0' }}>Tải Giấy ưu tiên</p>
                  <p className="ant-upload-hint" style={{ fontSize: 11, margin: 0 }}>Giấy xác nhận (tối đa 5MB)</p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}