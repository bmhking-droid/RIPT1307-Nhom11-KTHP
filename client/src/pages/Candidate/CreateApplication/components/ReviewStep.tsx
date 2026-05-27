import { SendOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Divider, Tag } from 'antd';
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
    if (val === undefined || val === null || val === '') return <span style={{ color: '#999' }}>Chưa điền</span>;
    return <strong>{val}</strong>;
  };

  // Đếm file minh chứng đã upload
  const fileCount = [
    values?.transcriptFile,
    values?.citizenIdFile,
    values?.englishCertFile,
    values?.priorityFile,
  ].filter((f) => f && f.length > 0).length;

  return (
    <div className={styles.stepContent}>
      <div className={styles.blockTitle}>
        <SendOutlined />
        <div>
          <h3>Xác nhận thông tin hồ sơ</h3>
          <p>Kiểm tra lại toàn bộ thông tin trước khi gửi xét tuyển.</p>
        </div>
      </div>

      <div className={styles.reviewBox}>
        {/* KHỐI 1: NGUYỆN VỌNG */}
        <h4 style={{ color: '#1677ff', marginBottom: 12 }}>📋 Thông tin nguyện vọng</h4>
        
        <div className={styles.reviewItem}>
          <span>Trường đại học</span>
          {renderValue(getUniversityName())}
        </div>

        <div className={styles.reviewItem}>
          <span>Ngành xét tuyển</span>
          {renderValue(getMajorName())}
        </div>

        <div className={styles.reviewItem}>
          <span>Đợt tuyển sinh</span>
          {renderValue(getAdmissionRoundName())}
        </div>

        <div className={styles.reviewItem}>
          <span>Tổ hợp xét tuyển</span>
          {renderValue(getCombinationName())}
        </div>

        <Divider />

        {/* KHỐI 2: THÔNG TIN CÁ NHÂN */}
        <h4 style={{ color: '#1677ff', marginBottom: 12 }}>👤 Thông tin thí sinh</h4>

        <div className={styles.reviewItem}>
          <span>Họ tên</span>
          {renderValue(values?.fullName)}
        </div>

        <div className={styles.reviewItem}>
          <span>Ngày sinh</span>
          {renderValue(values?.dob)}
        </div>

        <div className={styles.reviewItem}>
          <span>Giới tính</span>
          {renderValue(values?.gender)}
        </div>

        <div className={styles.reviewItem}>
          <span>Email</span>
          {renderValue(values?.email)}
        </div>

        <div className={styles.reviewItem}>
          <span>Số điện thoại</span>
          {renderValue(values?.phone)}
        </div>

        <div className={styles.reviewItem}>
          <span>CCCD</span>
          {renderValue(values?.citizenId)}
        </div>

        <div className={styles.reviewItem}>
          <span>Địa chỉ</span>
          {renderValue(values?.address)}
        </div>

        <div className={styles.reviewItem}>
          <span>Điểm xét tuyển</span>
          {renderValue(values?.score)}
        </div>

        <Divider />

        {/* KHỐI 3: MINH CHỨNG */}
        <h4 style={{ color: '#1677ff', marginBottom: 12 }}>📎 Minh chứng đã tải lên</h4>

        <div className={styles.reviewItem}>
          <span>Học bạ THPT</span>
          {values?.transcriptFile && values.transcriptFile.length > 0 
            ? <Tag color="success" icon={<CheckCircleFilled />}>{values.transcriptFile[0]?.name || 'Đã upload'}</Tag> 
            : <Tag color="error">Chưa upload</Tag>}
        </div>

        <div className={styles.reviewItem}>
          <span>CCCD/CMND</span>
          {values?.citizenIdFile && values.citizenIdFile.length > 0 
            ? <Tag color="success" icon={<CheckCircleFilled />}>{values.citizenIdFile[0]?.name || 'Đã upload'}</Tag>
            : <Tag color="error">Chưa upload</Tag>}
        </div>

        <div className={styles.reviewItem}>
          <span>Chứng chỉ tiếng Anh</span>
          {values?.englishCertFile && values.englishCertFile.length > 0 
            ? <Tag color="success" icon={<CheckCircleFilled />}>{values.englishCertFile[0]?.name || 'Đã upload'}</Tag>
            : <Tag color="default">Không bắt buộc</Tag>}
        </div>

        <div className={styles.reviewItem}>
          <span>Giấy ưu tiên</span>
          {values?.priorityFile && values.priorityFile.length > 0 
            ? <Tag color="success" icon={<CheckCircleFilled />}>{values.priorityFile[0]?.name || 'Đã upload'}</Tag>
            : <Tag color="default">Không bắt buộc</Tag>}
        </div>

        <Divider />

        <div style={{ textAlign: 'center', padding: '12px 0', background: '#f6ffed', borderRadius: 8 }}>
          <strong style={{ color: '#52c41a', fontSize: 16 }}>
            Tổng cộng {fileCount} file minh chứng đã sẵn sàng
          </strong>
        </div>
      </div>
    </div>
  );
}