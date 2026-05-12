import { useState } from 'react';
import { Button, Card, Form, message, Space, Steps } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { history } from 'umi';

import PageHeader from '@/components/PageHeader';
import {
  admissionRoundsMock,
  combinationsMock,
  universitiesMock,
} from '@/mock/admission';
import { candidateProfileMock } from '@/mock/candidate';

import PreferenceStep from './components/PreferenceStep';
import CandidateInfoStep from './components/CandidateInfoStep';
import DocumentsStep from './components/DocumentsStep';
import ReviewStep from './components/ReviewStep';

import styles from './index.less';

export default function CreateApplication() {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);

  const values = form.getFieldsValue(true);

  const steps = [
    { title: 'Nguyện vọng', description: 'Chọn trường/ngành' },
    { title: 'Thông tin', description: 'Đồng bộ từ profile' },
    { title: 'Hồ sơ', description: 'Upload minh chứng' },
    { title: 'Xác nhận', description: 'Kiểm tra & gửi' },
  ];

  const getOptionName = (list: any[], value: any) => {
    if (!value) return 'Chưa chọn';

    if (typeof value === 'object') {
      return value.name || value.label || 'Chưa chọn';
    }

    const found = list.find((item: any) => {
      if (typeof item === 'string') return item === value;
      return item.id === value || item.value === value;
    });

    if (!found) return value;

    return typeof found === 'string' ? found : found.name || found.label;
  };

  const getUniversityName = () => {
    return getOptionName(universitiesMock, values.universityId);
  };

  const getMajorName = () => {
    const selectedUniversity = universitiesMock.find(
      (item: any) => item.id === values.universityId,
    );

    return getOptionName(selectedUniversity?.majors || [], values.major);
  };

  const getAdmissionRoundName = () => {
    return getOptionName(admissionRoundsMock, values.admissionRound);
  };

  const getCombinationName = () => {
    return getOptionName(combinationsMock, values.combination);
  };

  const handleNext = async () => {
    const fieldsByStep = [
      ['universityId', 'major', 'admissionRound', 'combination'],
      ['score'],
      ['identityFile', 'transcriptFile'],
      [],
    ];

    try {
      await form.validateFields(fieldsByStep[current]);
      setCurrent((prev) => prev + 1);
    } catch {
      message.warning('Vui lòng hoàn thiện thông tin bắt buộc.');
    }
  };

  const handlePrev = () => {
    setCurrent((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      const submitValues = form.getFieldsValue(true);

      const newApplication = {
        id: `HS-${Date.now()}`,
        university: getUniversityName(),
        major: getMajorName(),
        admissionRound: getAdmissionRoundName(),
        combination: getCombinationName(),
        status: 'Chờ duyệt',
        updatedAt: new Date().toLocaleDateString('vi-VN'),
        score: submitValues.score,
      };

      const oldApplications = JSON.parse(
        localStorage.getItem('candidateApplications') || '[]',
      );

      localStorage.setItem(
        'candidateApplications',
        JSON.stringify([newApplication, ...oldApplications]),
      );

      message.success('Nộp hồ sơ thành công. Hồ sơ đang chờ xét duyệt.');
      history.push('/candidate/applications');
    } catch {
      message.warning('Vui lòng kiểm tra lại thông tin hồ sơ.');
    }
  };

  return (
    <div className={styles.createPage}>
      <PageHeader
        title="Nộp hồ sơ xét tuyển"
        description="Hoàn thiện từng bước để gửi hồ sơ xét tuyển trực tuyến."
        extra={
          <Button onClick={() => history.push('/candidate/applications')}>
            Quay lại danh sách
          </Button>
        }
      />

      <Card className={styles.stepCard}>
        <Steps current={current} items={steps} />
      </Card>

      <Card className={styles.formCard}>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{
            combination: 'A00',
            fullName: candidateProfileMock.fullName,
            email: candidateProfileMock.email,
            phone: candidateProfileMock.phone,
            address: candidateProfileMock.address,
            gender: candidateProfileMock.gender,
            province: candidateProfileMock.province,
            dob: candidateProfileMock.dob,
          }}
        >
          {current === 0 && <PreferenceStep form={form} />}

          {current === 1 && <CandidateInfoStep />}

          {current === 2 && <DocumentsStep />}

          {current === 3 && (
            <ReviewStep
              values={values}
              getUniversityName={getUniversityName}
              getMajorName={getMajorName}
              getAdmissionRoundName={getAdmissionRoundName}
              getCombinationName={getCombinationName}
            />
          )}

          <div className={styles.footerActions}>
            <Space>
              {current > 0 && (
                <Button size="large" onClick={handlePrev}>
                  Quay lại
                </Button>
              )}

              {current < steps.length - 1 && (
                <Button type="primary" size="large" onClick={handleNext}>
                  Tiếp tục
                </Button>
              )}

              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                >
                  Gửi hồ sơ xét tuyển
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}