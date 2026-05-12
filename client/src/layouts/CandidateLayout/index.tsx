import {
  AppstoreOutlined,
  FileAddOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Menu } from 'antd';
import { Outlet, history, useLocation } from 'umi';
import AppLogo from '@/components/AppLogo';
import styles from './index.less';

export default function CandidateLayout() {
  const location = useLocation();

  return (
    <div className={styles.candidateLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand} onClick={() => history.push('/')}>
          <AppLogo />

          <div className={styles.brandContent}>
            <div className={styles.brandTitle}>UniAdmission</div>
            <div className={styles.brandSub}>Candidate Portal</div>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className={styles.menu}
          items={[
            {
              key: '/candidate/dashboard',
              icon: <AppstoreOutlined />,
              label: 'Tổng quan',
              onClick: () => history.push('/candidate/dashboard'),
            },
            {
              key: '/candidate/applications',
              icon: <FileTextOutlined />,
              label: 'Hồ sơ của tôi',
              onClick: () => history.push('/candidate/applications'),
            },
            {
              key: '/candidate/applications/create',
              icon: <FileAddOutlined />,
              label: 'Nộp hồ sơ mới',
              onClick: () => history.push('/candidate/applications/create'),
            },
            {
              key: '/candidate/profile',
              icon: <UserOutlined />,
              label: 'Thông tin cá nhân',
              onClick: () => history.push('/candidate/profile'),
            },
          ]}
        />

        <div className={styles.sidebarFooter}>
          <Avatar size={42}>TS</Avatar>

          <div className={styles.userInfo}>
            <strong>Thí sinh demo</strong>
            <span>candidate@email.com</span>
          </div>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.welcome}>Xin chào,</span>
            <strong>Thí sinh demo</strong>
          </div>

          <Button icon={<LogoutOutlined />} onClick={() => history.push('/')}>
            Thoát
          </Button>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </section>
    </div>
  );
}