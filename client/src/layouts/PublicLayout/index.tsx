import { Button } from 'antd';
import { history, Outlet } from 'umi';
import AppLogo from '@/components/AppLogo';
import styles from './index.less';

export default function PublicLayout() {
  return (
    <div className={styles.publicLayout}>
      <header className={styles.header}>
        <div className={styles.brand} onClick={() => history.push('/')}>
          <AppLogo />

          <div>
            <div className={styles.brandTitle}>UniAdmission</div>
            <div className={styles.brandSub}>Tuyển sinh đại học trực tuyến</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <a onClick={() => history.push('/')}>Trang chủ</a>
          <a onClick={() => history.push('/lookup')}>Tra cứu kết quả</a>
          <a>Trường/ngành</a>
          <a>Hướng dẫn</a>
          <a>FAQ</a>
        </nav>

        <div className={styles.actions}>
          <Button onClick={() => history.push('/login')}>Đăng nhập</Button>
          <Button type="primary" onClick={() => history.push('/register')}>
            Đăng ký
          </Button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}