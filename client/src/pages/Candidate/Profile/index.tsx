import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  message,
} from 'antd';
import {
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import request, { getFileUrl } from '@/services/request';

import PageHeader from '@/components/PageHeader';
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

export default function CandidateProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  const [sidebarInfo, setSidebarInfo] = useState({
    fullName: 'Thí sinh',
    email: 'unknown@email.com',
    phone: 'Chưa cập nhật',
    avatarUrl: '',
  });

  // Hàm xử lý đổ dữ liệu Profile vào Form
  const fillFormData = (profileInfo: any, email: string) => {
    const fullName = profileInfo.fullName || 'Thí sinh';
    const phoneDisplay = profileInfo.phone || 'Chưa cập nhật';
    const phoneValue = profileInfo.phone || '';
    let gender = profileInfo.gender || undefined;
    let mainAddress = profileInfo.address || '';
    let province: string | undefined = profileInfo.province || undefined;
    const avatarUrl = profileInfo.avatarUrl || '';
    const score = profileInfo.score !== undefined && profileInfo.score !== null ? profileInfo.score : undefined;
    const priorityGroup = profileInfo.priorityGroup || 'NONE';
    const cccd = profileInfo.cccd || '';

    if (gender === 'Nam') gender = 'male';
    if (gender === 'Nữ') gender = 'female';

    // Bóc tách dự phòng nếu trường province trống (dữ liệu cũ)
    if (!province && mainAddress) {
      const foundProvince = provinceOptions.find((p) => mainAddress.endsWith(p));
      if (foundProvince) {
        province = foundProvince;
        mainAddress = mainAddress.replace(new RegExp(`,?\\s*${foundProvince}$`), '');
      }
    }

    const dobString = profileInfo.dateOfBirth || null;

    setSidebarInfo({ fullName, email, phone: phoneDisplay, avatarUrl });

    form.setFieldsValue({
      fullName,
      email,
      phone: phoneValue,
      gender,
      province,
      address: mainAddress,
      dob: dobString ? dayjs(dobString) : undefined,
      score,
      priorityGroup,
      cccd,
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res: any = await request.get('/profiles/me');
        if (res && res.success && res.data) {
          const userData = res.data;
          const profileInfo = userData.profile || {};
          const email = userData.email || 'unknown@email.com';

          fillFormData(profileInfo, email);

          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            fullName: profileInfo.fullName,
            profile: profileInfo,
          }));
        }
      } catch (error) {
        console.warn('⚠️ Không thể gọi API Profile, fallback sang localStorage:', error);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            const profileInfo = user.profile || {};
            const email = user.email || 'unknown@email.com';
            if (!profileInfo.fullName && user.fullName) profileInfo.fullName = user.fullName;
            if (!profileInfo.phone && user.phone) profileInfo.phone = user.phone;
            if (!profileInfo.gender && user.gender) profileInfo.gender = user.gender;
            if (!profileInfo.address && user.address) profileInfo.address = user.address;
            fillFormData(profileInfo, email);
          } catch (e) {
            console.error('Lỗi nạp dữ liệu LocalStorage:', e);
          }
        }
      }
    };

    fetchProfile();
  }, [form]);

  // Xử lý tải ảnh đại diện lên máy chủ
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
    if (!isValidType) {
      message.error('Chỉ hỗ trợ tải lên file ảnh định dạng JPG, JPEG, PNG!');
      return;
    }
    
    const isLessThan5MB = file.size / 1024 / 1024 < 5;
    if (!isLessThan5MB) {
      message.error('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }
    
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', 'AVATAR');
      
      const uploadRes: any = await request.post('/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (uploadRes && uploadRes.success && uploadRes.data?.fileUrl) {
        const newAvatarUrl = uploadRes.data.fileUrl;
        
        // Gọi API cập nhật avatar vào hồ sơ cá nhân
        const formValues = form.getFieldsValue();
        const payload = {
          ...formValues,
          dob: formValues.dob && typeof formValues.dob.format === 'function' ? formValues.dob.format('YYYY-MM-DD') : (formValues.dob || null),
          avatarUrl: newAvatarUrl,
        };
        
        const res: any = await request.put('/profiles/me', payload);
        if (res && res.success) {
          setSidebarInfo((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
          
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            if (!user.profile) user.profile = {};
            user.profile.avatarUrl = newAvatarUrl;
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          message.success('Tải ảnh đại diện lên thành công!');
        } else {
          message.error('Không thể lưu ảnh đại diện vào hồ sơ.');
        }
      } else {
        message.error(uploadRes?.message || 'Tải ảnh thất bại.');
      }
    } catch (error) {
      console.error('💥 [AVATAR UPLOAD ERROR]:', error);
      message.error('Không thể kết nối máy chủ để tải ảnh lên.');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Xử lý gửi API lưu thông tin cá nhân bảo mật
  const handleSubmit = async () => {
    let formValues;

    try {
      formValues = await form.validateFields();
    } catch {
      message.warning('Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        ...formValues,
        dob: formValues.dob && typeof formValues.dob.format === 'function' ? formValues.dob.format('YYYY-MM-DD') : (formValues.dob || null),
        avatarUrl: sidebarInfo.avatarUrl || null,
      };

      const res: any = await request.put('/profiles/me', payload);

      if (res && res.success) {
        const updatedDataFromServer = res.data;
        
        const newLocalStorageUser = {
          id: updatedDataFromServer.id,
          email: updatedDataFromServer.email,
          role: updatedDataFromServer.role,
          fullName: formValues.fullName,
          phone: formValues.phone,
          gender: formValues.gender,
          province: formValues.province,
          address: formValues.address,
          dob: payload.dob,
          profile: {
            fullName: formValues.fullName,
            phone: formValues.phone,
            gender: formValues.gender === 'male' ? 'Nam' : 'Nữ',
            dateOfBirth: payload.dob,
            province: updatedDataFromServer.profile?.province || formValues.province,
            address: updatedDataFromServer.profile?.address || formValues.address,
            avatarUrl: sidebarInfo.avatarUrl,
            score: formValues.score,
            priorityGroup: formValues.priorityGroup,
            cccd: formValues.cccd,
          }
        };
        localStorage.setItem('user', JSON.stringify(newLocalStorageUser));

        setSidebarInfo({
          fullName: formValues.fullName,
          email: formValues.email,
          phone: formValues.phone || 'Chưa cập nhật',
          avatarUrl: sidebarInfo.avatarUrl || '',
        });

        message.success('Cập nhật thông tin cá nhân vào cơ sở dữ liệu thành công!');
      } else {
        message.error(res?.message || 'Không thể lưu thay đổi.');
      }
    } catch (error: any) {
      console.error("💥 [API PROFILE ERROR]:", error);
      if (error?.status === 401 || error?.response?.status === 401) {
        message.error('Phiên làm việc đã hết hạn. Vui lòng Đăng xuất và Đăng nhập lại để làm mới Token!');
      } else {
        message.error(`Cập nhật thất bại. Máy chủ phản hồi mã lỗi hệ thống: ${error?.status || '500'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <PageHeader
        title="Thông tin cá nhân"
        description="Quản lý thông tin hồ sơ và dữ liệu xét tuyển của bạn."
      />

      <Row gutter={[24, 24]}>
        {/* PANEL TRÁI */}
        <Col xs={24} lg={8}>
          <Card className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrap}>
                <Avatar
                  size={120}
                  src={sidebarInfo.avatarUrl ? getFileUrl(sidebarInfo.avatarUrl) : undefined}
                  icon={<UserOutlined />}
                  style={{ border: '4px solid #e0e7ff', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.12)' }}
                />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className={styles.cameraButton}
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={avatarLoading}
                >
                  <CameraOutlined />
                </button>
              </div>

              <h2>{sidebarInfo.fullName}</h2>
              <p>Thí sinh hệ thống tuyển sinh 2026</p>

              <Space wrap>
                <Tag color="processing">Đã xác thực</Tag>
                <Tag color="success">Hồ sơ hoạt động</Tag>
              </Space>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <MailOutlined />
                <span>{sidebarInfo.email}</span>
              </div>

              <div className={styles.infoItem}>
                <PhoneOutlined />
                <span>{sidebarInfo.phone}</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* PANEL PHẢI */}
        <Col xs={24} lg={16}>
          <Card className={styles.formCard}>
            <Form form={form} layout="vertical" requiredMark={false}>
              <Row gutter={[20, 12]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input size="large" placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Ngày sinh" name="dob">
                    <DatePicker
                      size="large"
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày sinh"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Email" name="email">
                    <Input size="large" placeholder="Nhập email" disabled />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input size="large" placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Giới tính" name="gender">
                    <Select
                      size="large"
                      placeholder="Chọn giới tính"
                      options={[
                        { label: 'Nam', value: 'male' },
                        { label: 'Nữ', value: 'female' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số CCCD"
                    name="cccd"
                    rules={[
                      { pattern: /^[0-9]{9,12}$/, message: 'Số CCCD phải chứa từ 9 đến 12 số!' }
                    ]}
                  >
                    <Input size="large" maxLength={12} placeholder="Nhập số CCCD" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Tỉnh/Thành phố" name="province">
                    <Select
                      size="large"
                      placeholder="Chọn tỉnh/thành"
                      options={provinceOptions.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Điểm xét tuyển"
                    name="score"
                    rules={[
                      { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Điểm số phải là số dương hợp lệ!' }
                    ]}
                  >
                    <Input size="large" type="number" step="0.01" placeholder="Nhập điểm xét tuyển (ví dụ: 25.5)" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Đối tượng ưu tiên" name="priorityGroup">
                    <Select
                      size="large"
                      placeholder="Chọn đối tượng ưu tiên"
                      options={[
                        { label: 'Không thuộc diện ưu tiên', value: 'NONE' },
                        { label: 'KV1 (Khu vực 1)', value: 'KV1' },
                        { label: 'KV2 (Khu vực 2)', value: 'KV2' },
                        { label: 'KV2-NT (Khu vực 2 - Nông thôn)', value: 'KV2-NT' },
                        { label: 'KV3 (Khu vực 3)', value: 'KV3' },
                      ]}
                      allowClear
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label="Địa chỉ liên hệ" name="address">
                    <Input.TextArea rows={4} placeholder="Nhập số nhà, tên đường, xã/phường..." />
                  </Form.Item>
                </Col>
              </Row>

              <div className={styles.footerActions}>
                <Button 
                  type="primary" 
                  size="large" 
                  loading={loading} 
                  onClick={handleSubmit}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}