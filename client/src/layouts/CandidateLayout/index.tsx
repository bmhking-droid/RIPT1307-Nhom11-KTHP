import React, { useEffect, useState } from 'react';
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      history.push('/login');
      return;
    }
    try {
      setUser(JSON.parse(userStr));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      history.push('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('candidate_application_draft');
    history.push('/login');
  };

  const fullName = user?.fullName || 'Thí sinh';
  const email = user?.email || '';
  const avatarLetter = fullName.charAt(0).toUpperCase();



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
          selectedKeys={[
            (() => {
              const path = location.pathname;
              if (path.startsWith('/candidate/dashboard')) return '/candidate/dashboard';
              if (path.startsWith('/candidate/applications')) return '/candidate/applications';
              if (path.startsWith('/candidate/profile')) return '/candidate/profile';
              return path;
            })()
          ]}
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
          <Avatar size={42} style={{ backgroundColor: '#4F46E5' }}>{avatarLetter}</Avatar>

          <div className={styles.userInfo}>
            <strong>{fullName}</strong>
            <span>{email}</span>
          </div>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.welcome}>Xin chào,</span>
            <strong>{fullName}</strong>
          </div>

          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
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