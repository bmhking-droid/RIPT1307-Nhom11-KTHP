import { useEffect, useState } from 'react';
import { Button, Card, Form, message, Space, Steps, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { history } from 'umi';
import dayjs from 'dayjs';
import request from '@/services/request';

import PageHeader from '@/components/PageHeader';
import { getUniversities } from '@/services/university';
import { getMajors } from '@/services/major';
import { getAdmissionRounds, getCombinations } from '@/services/admission';
import { createApplication } from '@/services/application';
import {
  saveApplicationDraft,
  getApplicationDraft,
  clearApplicationDraft,
} from '@/utils/applicationDraft';

import PreferenceStep from './components/PreferenceStep';
import CandidateInfoStep from './components/CandidateInfoStep';
import DocumentsStep from './components/DocumentsStep';
import ReviewStep from './components/ReviewStep';

import styles from './index.less';

const provinceOptions = [
  'Thủ đô Hà Nội',
  'Thành phố Huế',
  'Tỉnh Lai Châu',
  'Tỉnh Điện Biên',
  'Tỉnh Sơn La',
  'Tỉnh Lạng Sơn',
  'Tỉnh Quảng Ninh',
  'Tỉnh Thanh Hóa',
  'Tỉnh Nghệ An',
  'Tỉnh Hà Tĩnh',
  'Tỉnh Cao Bằng',
  'Tỉnh An Giang',
  'Tỉnh Bắc Ninh',
  'Tỉnh Cà Mau',
  'Thành phố Cần Thơ',
  'Thành phố Đà Nẵng',
  'Tỉnh Đắk Lắk',
  'Tỉnh Đồng Nai',
  'Tỉnh Đồng Tháp',
  'Tỉnh Gia Lai',
  'Thành phố Hải Phòng',
  'Thành phố Hồ Chí Minh',
  'Tỉnh Hưng Yên',
  'Tỉnh Khánh Hòa',
  'Tỉnh Lâm Đồng',
  'Tỉnh Lào Cai',
  'Tỉnh Ninh Bình',
  'Tỉnh Phú Thọ',
  'Tỉnh Quảng Ngãi',
  'Tỉnh Quảng Trị',
  'Tỉnh Tây Ninh',
  'Tỉnh Thái Nguyên',
  'Tỉnh Tuyên Quang',
  'Tỉnh Vĩnh Long'
];

export default function CreateApplication() {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [universities, setUniversities] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const [formValues, setFormValues] = useState<any>({});

  const fetchData = async () => {
    try {
      const [uniRes, roundRes, comboRes, settingsRes] = await Promise.all([
        getUniversities({ isActive: true }),
        getAdmissionRounds({ isActive: true }),
        getCombinations(),
        request.get('/settings'),
      ]);
      setUniversities(uniRes.data || uniRes || []);
      setRounds(roundRes.data || roundRes || []);
      setCombinations(comboRes.data || comboRes || []);
      if (settingsRes && settingsRes.success) {
        setSettings(settingsRes.data);
      }
    } catch (error) {
      message.error('Không thể tải danh mục dữ liệu hệ thống');
    }
  };

  const handleUniversityChange = async (universityId: string, skipClearMajor = false) => {
    if (!skipClearMajor) {
      form.setFieldsValue({ major: undefined });
    }
    try {
      const majorRes = await getMajors({ universityId, isActive: true });
      setMajors(majorRes.data || majorRes || []);
    } catch {
      message.error('Không thể tải danh sách ngành học của trường này');
    }
  };

  // LUÔN gọi API Profile để đồng bộ thông tin cá nhân (bất kể có draft hay không)
  const loadProfile = async () => {
    try {
      const res: any = await request.get('/profiles/me');
      if (res && res.success && res.data) {
        const userData = res.data;
        const profile = userData.profile || {};
        const rawDob = profile.dateOfBirth;

        let mainAddress = profile.address || '';
        let province: string | undefined = profile.province || undefined;
        // Bóc tách dự phòng nếu trường province trống (dữ liệu cũ)
        if (!province && mainAddress) {
          const foundProvince = provinceOptions.find((p) => mainAddress.endsWith(p));
          if (foundProvince) {
            province = foundProvince;
            mainAddress = mainAddress.replace(new RegExp(`,?\\s*${foundProvince}$`), '');
          }
        }

        // Chỉ set những field mà form chưa có giá trị (ưu tiên draft)
        const currentValues = form.getFieldsValue(true);
        const profileFields: any = {};

        if (!currentValues.fullName) profileFields.fullName = profile.fullName || '';
        if (!currentValues.email) profileFields.email = userData.email || '';
        if (!currentValues.phone) profileFields.phone = profile.phone || '';
        if (!currentValues.citizenId) profileFields.citizenId = profile.cccd || '';
        if (!currentValues.province) profileFields.province = profile.province || '';
        if (!currentValues.address) profileFields.address = profile.address || '';
        if (!currentValues.gender) profileFields.gender = profile.gender || '';
        if (!currentValues.dob) profileFields.dob = rawDob ? dayjs(rawDob).format('DD/MM/YYYY') : '';
        if (!currentValues.score) profileFields.score = profile.score !== undefined && profile.score !== null ? profile.score : undefined;
        if (!currentValues.priorityGroup) profileFields.priorityGroup = profile.priorityGroup || 'NONE';

        if (Object.keys(profileFields).length > 0) {
          form.setFieldsValue(profileFields);
        }

        setProfileLoaded(true);
        setFormValues(form.getFieldsValue(true));
      }
    } catch (err) {
      console.warn('Không thể tải Profile từ API:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const initForm = async () => {
      // 1. Khôi phục draft trước (nếu có)
      const draft = getApplicationDraft();
      if (draft) {
        form.setFieldsValue(draft);
        if (draft.universityId) {
          handleUniversityChange(draft.universityId, true);
        }
        message.info('Đã khôi phục dữ liệu hồ sơ nháp trước đó.');
      }

      // 2. LUÔN gọi API Profile để bổ sung thông tin cá nhân
      await loadProfile();
    };
    initForm();
  }, [form]);

  const handleValuesChange = (_: any, allValues: any) => {
    saveApplicationDraft(allValues);
    setFormValues(allValues);
  };

  const steps = [
    { title: 'Nguyện vọng', description: 'Chọn trường/ngành' },
    { title: 'Thông tin', description: 'Đồng bộ từ profile' },
    { title: 'Hồ sơ', description: 'Upload minh chứng' },
    { title: 'Xác nhận', description: 'Kiểm tra & gửi' },
  ];

  const getOptionName = (list: any[], value: any) => {
    if (!value) return 'Chưa chọn';
    const found = list.find((item: any) => item.id === value || item.value === value);
    return found ? (found.name || found.label || found.code || value) : value;
  };

  const getUniversityName = () => getOptionName(universities, formValues.universityId);
  const getMajorName = () => getOptionName(majors, formValues.major);
  const getAdmissionRoundName = () => getOptionName(rounds, formValues.admissionRound);
  const getCombinationName = () => {
    const value = formValues.combination;
    if (!value) return 'Chưa chọn';
    const found = combinations.find((item: any) => item.id === value);
    if (!found) return value;
    return found.subjects ? `${found.code} (${found.subjects})` : found.code;
  };

  const handleNext = async () => {
    const fieldsByStep = [
      ['universityId', 'major', 'admissionRound', 'combination'],
      ['fullName', 'email', 'phone', 'citizenId', 'score', 'priorityGroup'],
      ['transcriptFile', 'citizenIdFile'],
      [],
    ];

    try {
      await form.validateFields(fieldsByStep[current]);
      setFormValues(form.getFieldsValue(true));
      setCurrent((prev) => prev + 1);
    } catch {
      message.warning('Vui lòng điền đầy đủ và chính xác thông tin bắt buộc.');
    }
  };

  const handlePrev = () => {
    setFormValues(form.getFieldsValue(true));
    setCurrent((prev) => prev - 1);
  };

  // Hàm lấy fileUrl từ nhiều cấu trúc khác nhau và lọc sạch blob/data URLs
  const extractFileUrl = (fileList: any) => {
    if (!fileList) return '';
    
    const getValidUrl = (file: any) => {
      // Ưu tiên phản hồi chính thức từ backend
      const url = file.response?.fileUrl || 
                  file.response?.data?.fileUrl || 
                  file.response?.url || 
                  file.response?.data?.url || 
                  (typeof file.response === 'string' ? file.response : '');
                  
      if (url && typeof url === 'string') {
        if (url.startsWith('/uploads/') || url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }
      }
      
      // Nếu không có response, kiểm tra file.url (chỉ chấp nhận nếu không phải là blob: hoặc data:)
      if (file.url && typeof file.url === 'string') {
        if (file.url.startsWith('/uploads/') || (file.url.startsWith('http') && !file.url.startsWith('blob:'))) {
          return file.url;
        }
      }
      
      return '';
    };

    if (Array.isArray(fileList) && fileList.length > 0) {
      return getValidUrl(fileList[0]);
    }
    
    if (typeof fileList === 'object') {
      return getValidUrl(fileList);
    }
    
    return '';
  };

  const handleSubmitForm = async () => {
    try {
      setSubmitting(true);
      await form.validateFields();
      const submitValues = form.getFieldsValue(true);

      // Tự động đồng bộ thông tin cá nhân của thí sinh lên database profile
      try {
        const profilePayload = {
          fullName: submitValues.fullName,
          phone: submitValues.phone,
          gender: submitValues.gender,
          dob: submitValues.dob,
          province: submitValues.province,
          address: submitValues.address,
          cccd: submitValues.citizenId,
          score: submitValues.score,
        };
        
        let formattedDob = null;
        if (profilePayload.dob) {
          const match = String(profilePayload.dob).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
          if (match) {
            formattedDob = `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
          } else {
            formattedDob = profilePayload.dob;
          }
        }

        await request.put('/profiles/me', {
          ...profilePayload,
          dob: formattedDob,
        });
        console.log("✅ [PROFILE AUTO-SYNC] Đã tự động đồng bộ thông tin cá nhân lên cơ sở dữ liệu!");
      } catch (profileError) {
        console.error("💥 [PROFILE AUTO-SYNC ERROR]:", profileError);
      }

      const documents = [
        {
          fileUrl: extractFileUrl(submitValues.transcriptFile),
          originalName: submitValues.transcriptFile?.[0]?.name || 'Học bạ THPT',
          documentType: 'HOC_BA',
        },
        {
          fileUrl: extractFileUrl(submitValues.citizenIdFile),
          originalName: submitValues.citizenIdFile?.[0]?.name || 'CCCD/CMND',
          documentType: 'CCCD',
        },
      ];

      // Thêm chứng chỉ tiếng Anh nếu có
      if (submitValues.englishCertFile && submitValues.englishCertFile.length > 0) {
        documents.push({
          fileUrl: extractFileUrl(submitValues.englishCertFile),
          originalName: submitValues.englishCertFile?.[0]?.name || 'Chứng chỉ tiếng Anh',
          documentType: 'CHUNG_CHI_TIENG_ANH',
        });
      }

      // Thêm giấy ưu tiên nếu có
      if (submitValues.priorityFile && submitValues.priorityFile.length > 0) {
        documents.push({
          fileUrl: extractFileUrl(submitValues.priorityFile),
          originalName: submitValues.priorityFile?.[0]?.name || 'Giấy ưu tiên',
          documentType: 'GIAY_UU_TIEN',
        });
      }

      const payload = {
        universityId: submitValues.universityId,
        majorId: submitValues.major,
        combinationId: submitValues.combination,
        roundId: submitValues.admissionRound,
        totalScore: submitValues.score,
        documents: documents.filter(doc => doc.fileUrl),
      };

      console.log("🚀 [PAYLOAD CHECK] Gói tin sạch gửi lên Backend:", payload);

      await createApplication(payload);

      // Tự động đồng bộ thông tin cá nhân vừa nhập về Hồ sơ của thí sinh trên DB
      try {
        const profilePayload = {
          fullName: submitValues.fullName,
          phone: submitValues.phone,
          gender: submitValues.gender === 'male' || submitValues.gender === 'Nam' ? 'male' : 'female',
          dob: submitValues.dob ? dayjs(submitValues.dob, 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
          province: submitValues.province || null,
          address: submitValues.address || '',
          score: submitValues.score,
          priorityGroup: submitValues.priorityGroup || 'NONE',
          cccd: submitValues.citizenId,
        };
        await request.put('/profiles/me', profilePayload);
      } catch (profileErr) {
        console.warn('Không thể tự động đồng bộ thông tin cá nhân về Hồ sơ:', profileErr);
      }

      clearApplicationDraft();

      Modal.success({
        title: 'Nộp hồ sơ thành công!',
        content: 'Hồ sơ xét tuyển của bạn đã được gửi thành công lên hệ thống và đang chờ duyệt.',
        okText: 'Quay lại Trang tổng quan',
        onOk: () => {
          history.push('/candidate/dashboard');
        },
      });
    } catch (error: any) {
      if (error?.errorFields) {
        message.warning('Vui lòng điền đầy đủ và chính xác thông tin bắt buộc.');
      } else {
        console.error("💥 Lỗi gửi đơn:", error);
        message.error(error?.response?.data?.message || 'Gửi hồ sơ xét tuyển thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (settings && settings.allowCandidateSubmit === false) {
    return (
      <div className={styles.createPage}>
        <PageHeader
          title="Nộp hồ sơ xét tuyển"
          description="Cổng nộp hồ sơ xét tuyển trực tuyến."
          extra={
            <Button onClick={() => history.push('/candidate/applications')}>
              Quay lại danh sách
            </Button>
          }
        />
        <Card 
          style={{ 
            textAlign: 'center', 
            padding: '48px 24px', 
            borderRadius: 24, 
            border: '1px solid #dde3f4',
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.03)'
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛠️</div>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: '#111827', marginBottom: 12 }}>
            HỆ THỐNG ĐANG BẢO TRÌ
          </h2>
          <p style={{ color: '#4B5563', fontSize: 16, maxWidth: 500, margin: '0 auto 24px' }}>
            Hệ thống đang bảo trì, thắc mắc liên hệ qua Ban Tuyển sinh để được hỗ trợ.
          </p>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => history.push('/candidate/dashboard')}
            style={{ borderRadius: 12 }}
          >
            Quay lại Tổng quan
          </Button>
        </Card>
      </div>
    );
  }

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
          onValuesChange={handleValuesChange}
        >
          {current === 0 && (
            <PreferenceStep 
              form={form} 
              universities={universities} 
              majors={majors}
              rounds={rounds} 
              combinations={combinations} 
              onUniversityChange={handleUniversityChange}
            />
          )}

          {current === 1 && <CandidateInfoStep />}

          {current === 2 && <DocumentsStep />}

          {current === 3 && (
            <ReviewStep
              values={formValues}
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
                  loading={submitting}
                  onClick={handleSubmitForm}
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