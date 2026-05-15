import React from 'react';
import { Form, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadCandidateFile } from '@/services/candidate';
import { validateFileBeforeUpload } from '@/utils/validators';

const { Dragger } = Upload;

export default function DocumentsStep() {
  const customUpload = async (options: any) => {
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

      const res = await uploadCandidateFile(formData);

      onSuccess?.(res.data);
      message.success('Upload file thành công');
    } catch (error) {
      onError?.(error);
      message.error('Upload file thất bại');
    }
  };

  return (
    <>
      <Form.Item
        name="transcriptFile"
        label="Học bạ THPT"
        rules={[{ required: true, message: 'Vui lòng upload học bạ' }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Dragger
          maxCount={1}
          customRequest={customUpload}
          beforeUpload={(file) => {
            const validate = validateFileBeforeUpload(file);

            if (!validate.valid) {
              message.error(validate.message);
              return Upload.LIST_IGNORE;
            }

            return true;
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Bấm hoặc kéo file học bạ vào đây</p>
          <p>Hỗ trợ PDF, JPG, PNG. Tối đa 5MB.</p>
        </Dragger>
      </Form.Item>

      <Form.Item
        name="citizenIdFile"
        label="CCCD/CMND"
        rules={[{ required: true, message: 'Vui lòng upload CCCD/CMND' }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList}
      >
        <Dragger
          maxCount={1}
          customRequest={customUpload}
          beforeUpload={(file) => {
            const validate = validateFileBeforeUpload(file);

            if (!validate.valid) {
              message.error(validate.message);
              return Upload.LIST_IGNORE;
            }

            return true;
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Bấm hoặc kéo file CCCD/CMND vào đây</p>
          <p>Hỗ trợ PDF, JPG, PNG. Tối đa 5MB.</p>
        </Dragger>
      </Form.Item>
    </>
  );
}