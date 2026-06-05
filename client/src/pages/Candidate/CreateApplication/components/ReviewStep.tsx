import React from 'react';
import { SendOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Card, Tag, Alert } from 'antd';
import styles from '../index.less';

type Props = {
  values: any;
  getUniversityName: () => string;
  getMajorName: () => string;
  getAdmissionRoundName: () => string;
  getCombinationName: () => string;
};

export default function ReviewStep({
  values,
  getUniversityName,
  getMajorName,
  getAdmissionRoundName,
  getCombinationName,
}: Props) {
  const renderValue = (val: any) => {
    if (val === undefined || val === null || val === '') {
      return <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '15px' }}>Chưa điền</span>;
    }
    return <strong style={{ color: '#111827', fontWeight: 700, fontSize: '16px' }}>{val}</strong>;
  };

  // Đếm file minh chứng đã upload
  const fileCount = [
    values?.transcriptFile,
    values?.citizenIdFile,
    values?.englishCertFile,
    values?.priorityFile,
  ].filter((f) => f && f.length > 0).length;

  const infoItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #f3f4f6',
    gap: '16px',
  };

  const labelStyle = {
    color: '#4b5563',
    fontWeight: 600,
    fontSize: '15px',
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.blockTitle} style={{ marginBottom: '24px' }}>
        <span><SendOutlined /></span>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: 800 }}>Xác nhận thông tin hồ sơ</h3>
          <p style={{ fontSize: '15px' }}>Kiểm tra lại toàn bộ thông tin trước khi gửi xét tuyển.</p>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
        <Col xs={24} md={13}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 800, color: '#4f46e5' }}>
                <span>👤</span> Thông tin cá nhân thí sinh
              </div>
            }
            style={{
              borderRadius: '20px',
              border: '1px solid #e0e7ff',
              boxShadow: '0 8px 30px rgba(79, 70, 229, 0.04)',
              height: '100%',
            }}
          >
            <div style={infoItemStyle}>
              <span style={labelStyle}>Họ tên</span>
              {renderValue(values?.fullName)}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Ngày sinh</span>
              {renderValue(values?.dob)}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Giới tính</span>
              {renderValue(values?.gender)}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Email</span>
              {renderValue(values?.email)}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Số điện thoại</span>
              {renderValue(values?.phone)}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>CCCD</span>
              {renderValue(values?.citizenId)}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Tỉnh / Thành phố</span>
              {renderValue(values?.province)}
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Địa chỉ chi tiết</span>
              {renderValue(values?.address)}
            </div>
            <div style={{ ...infoItemStyle, borderBottom: 'none' }}>
              <span style={labelStyle}>Điểm xét tuyển</span>
              <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '20px' }}>
                {values?.score || 'Chưa nhập'}
              </span>
            </div>
          </Card>
        </Col>

        {/* CỘT PHẢI: NGUYỆN VỌNG & MINH CHỨNG */}
        <Col xs={24} md={11} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KHỐI 1: NGUYỆN VỌNG */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 800, color: '#1677ff' }}>
                <span>📋</span> Thông tin nguyện vọng
              </div>
            }
            style={{
              borderRadius: '20px',
              border: '1px solid #dbeafe',
              boxShadow: '0 8px 30px rgba(22, 119, 255, 0.04)',
            }}
          >
            <div style={infoItemStyle}>
              <span style={labelStyle}>Trường đại học</span>
              {renderValue(getUniversityName())}
            </div>

            <div style={infoItemStyle}>
              <span style={labelStyle}>Ngành xét tuyển</span>
              {renderValue(getMajorName())}
            </div>

            <div style={infoItemStyle}>
              <span style={labelStyle}>Đợt tuyển sinh</span>
              {renderValue(getAdmissionRoundName())}
            </div>

            <div style={{ ...infoItemStyle, borderBottom: 'none' }}>
              <span style={labelStyle}>Tổ hợp xét tuyển</span>
              <span style={{ background: '#e6f4ff', color: '#0958d9', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '15px' }}>
                {getCombinationName() || 'Chưa chọn'}
              </span>
            </div>
          </Card>

          {/* KHỐI 2: MINH CHỨNG */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 800, color: '#52c41a' }}>
                <span>📎</span> Minh chứng đã tải lên
              </div>
            }
            style={{
              borderRadius: '20px',
              border: '1px solid #d9f7be',
              boxShadow: '0 8px 30px rgba(82, 196, 26, 0.04)',
              flexGrow: 1,
            }}
          >
            <div style={infoItemStyle}>
              <span style={labelStyle}>Học bạ THPT</span>
              {values?.transcriptFile && values.transcriptFile.length > 0 
                ? <Tag color="success" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }} icon={<CheckCircleFilled />}>{values.transcriptFile[0]?.name || 'Đã upload'}</Tag> 
                : <Tag color="error" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }}>Chưa upload</Tag>}
            </div>

            <div style={infoItemStyle}>
              <span style={labelStyle}>CCCD/CMND</span>
              {values?.citizenIdFile && values.citizenIdFile.length > 0 
                ? <Tag color="success" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }} icon={<CheckCircleFilled />}>{values.citizenIdFile[0]?.name || 'Đã upload'}</Tag>
                : <Tag color="error" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }}>Chưa upload</Tag>}
            </div>

            <div style={infoItemStyle}>
              <span style={labelStyle}>Chứng chỉ tiếng Anh</span>
              {values?.englishCertFile && values.englishCertFile.length > 0 
                ? <Tag color="success" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }} icon={<CheckCircleFilled />}>{values.englishCertFile[0]?.name || 'Đã upload'}</Tag>
                : <Tag color="default" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }}>Không bắt buộc</Tag>}
            </div>

            <div style={{ ...infoItemStyle, borderBottom: 'none' }}>
              <span style={labelStyle}>Giấy ưu tiên</span>
              {values?.priorityFile && values.priorityFile.length > 0 
                ? <Tag color="success" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }} icon={<CheckCircleFilled />}>{values.priorityFile[0]?.name || 'Đã upload'}</Tag>
                : <Tag color="default" style={{ fontSize: '14px', padding: '4px 10px', borderRadius: '6px' }}>Không bắt buộc</Tag>}
            </div>

            <div style={{ marginTop: '20px', padding: '14px', background: '#f6ffed', borderRadius: '12px', border: '1px dashed #b7eb8f', textAlign: 'center' }}>
              <strong style={{ color: '#389e0d', fontSize: '16px' }}>
                Tổng cộng {fileCount} file minh chứng đã sẵn sàng
              </strong>
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '24px' }}>
        <Alert
          message={<span style={{ fontWeight: 750, fontSize: '15px' }}>Lưu ý trước khi nộp hồ sơ</span>}
          description={
            <span style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
              Vui lòng rà soát lại thật kỹ các thông tin cá nhân, điểm xét tuyển và các tệp minh chứng đã upload ở trên. 
              Sau khi bấm <strong>"Gửi hồ sơ xét tuyển"</strong>, hệ thống sẽ tiếp nhận đơn xét tuyển của bạn và bạn sẽ không thể tự chỉnh sửa cho đến khi được duyệt.
            </span>
          }
          type="warning"
          showIcon
          style={{ borderRadius: '12px' }}
        />
      </div>
    </div>
  );
}