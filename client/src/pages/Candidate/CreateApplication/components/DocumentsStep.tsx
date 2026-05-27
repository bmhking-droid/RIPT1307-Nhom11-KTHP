import React from 'react';
import { Form, Upload, message } from 'antd';
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
      formData.append('file', file);
      formData.append('documentType', documentType);

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
    <>
      {/* 1. KHỐI UPLOAD HỌC BẠ (Bắt buộc) */}
      <Form.Item
        name="transcriptFile"
        label="Học bạ THPT (bắt buộc)"
        rules={[{ required: true, message: 'Vui lòng upload học bạ' }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Dragger {...uploadProps('HOC_BA')}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Bấm hoặc kéo file học bạ vào đây</p>
          <p className="ant-upload-hint">Hỗ trợ PDF, JPG, PNG. Tối đa 5MB.</p>
        </Dragger>
      </Form.Item>

      {/* 2. KHỐI UPLOAD CCCD (Bắt buộc) */}
      <Form.Item
        name="citizenIdFile"
        label="CCCD/CMND (bắt buộc)"
        rules={[{ required: true, message: 'Vui lòng upload CCCD/CMND' }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Dragger {...uploadProps('CCCD')}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Bấm hoặc kéo file CCCD/CMND vào đây</p>
          <p className="ant-upload-hint">Hỗ trợ PDF, JPG, PNG. Tối đa 5MB.</p>
        </Dragger>
      </Form.Item>

      {/* 3. KHỐI UPLOAD CHỨNG CHỈ TIẾNG ANH (Không bắt buộc) */}
      <Form.Item
        name="englishCertFile"
        label="Chứng chỉ tiếng Anh (IELTS, TOEIC, TOEFL... — không bắt buộc)"
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Dragger {...uploadProps('CHUNG_CHI_TIENG_ANH')}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Bấm hoặc kéo file chứng chỉ tiếng Anh vào đây</p>
          <p className="ant-upload-hint">IELTS, TOEIC, TOEFL, Cambridge... Hỗ trợ PDF, JPG, PNG. Tối đa 5MB.</p>
        </Dragger>
      </Form.Item>

      {/* 4. KHỐI UPLOAD GIẤY ƯU TIÊN (Không bắt buộc) */}
      <Form.Item
        name="priorityFile"
        label="Giấy xác nhận ưu tiên (không bắt buộc)"
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Dragger {...uploadProps('GIAY_UU_TIEN')}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Bấm hoặc kéo file giấy ưu tiên vào đây</p>
          <p className="ant-upload-hint">Giấy xác nhận khu vực ưu tiên, đối tượng ưu tiên. Hỗ trợ PDF, JPG, PNG. Tối đa 5MB.</p>
        </Dragger>
      </Form.Item>
    </>
  );
}