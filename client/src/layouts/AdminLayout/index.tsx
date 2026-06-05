import {
  AppstoreOutlined,
  FileExcelOutlined,
  LogoutOutlined,
  UserOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Menu } from 'antd';
import { Outlet, history, useLocation } from 'umi';
import AppLogo from '@/components/AppLogo';
import styles from './index.less';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand} onClick={() => history.push('/')}>
          <AppLogo />

          <div className={styles.brandContent}>
            <div className={styles.brandTitle}>UniAdmission</div>
            <div className={styles.brandSub}>Admin Portal</div>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className={styles.menu}
          items={[
            {
              key: '/admin/dashboard',
              icon: <AppstoreOutlined />,
              label: 'Tổng quan',
              onClick: () => history.push('/admin/dashboard'),
            },
            {
              key: '/admin/export-report',
              icon: <FileExcelOutlined />,
              label: 'Xuất báo cáo',
              onClick: () => history.push('/admin/export-report'),
            },
            {
              key: '/admin/statistics',
              icon: <BarChartOutlined />,
              label: 'Thống kê',
              onClick: () => history.push('/admin/statistics'),
            },
          ]}
        />

        <div className={styles.sidebarFooter}>
          <Avatar size={42}>AD</Avatar>

          <div className={styles.userInfo}>
            <strong>Admin demo</strong>
            <span>admin@email.com</span>
          </div>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.welcome}>Xin chào,</span>
            <strong>Admin demo</strong>
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
