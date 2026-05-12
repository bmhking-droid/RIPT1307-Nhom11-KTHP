import { SendOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
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
        <div className={styles.reviewItem}>
          <span>Trường đại học</span>
          <strong>{getUniversityName()}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Ngành xét tuyển</span>
          <strong>{getMajorName()}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Đợt tuyển sinh</span>
          <strong>{getAdmissionRoundName()}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Tổ hợp</span>
          <strong>{getCombinationName()}</strong>
        </div>

        <Divider />

        <div className={styles.reviewItem}>
          <span>Họ tên</span>
          <strong>{values.fullName}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Ngày sinh</span>
          <strong>{values.dob}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Email</span>
          <strong>{values.email}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Số điện thoại</span>
          <strong>{values.phone}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Địa chỉ</span>
          <strong>{values.address}</strong>
        </div>

        <div className={styles.reviewItem}>
          <span>Điểm xét tuyển</span>
          <strong>{values.score}</strong>
        </div>
      </div>
    </div>
  );
}