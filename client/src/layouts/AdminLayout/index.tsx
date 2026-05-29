import React, { useEffect, useState } from 'react';
import { Outlet, history, useLocation } from 'umi';
import {
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import styles from './index.less';
import AppLogo from '@/components/AppLogo';
import EmailSandbox from '@/components/EmailSandbox';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(true);

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
      const parsedUser = JSON.parse(userStr);
      const role = parsedUser?.role?.toUpperCase();
      if (role !== 'ADMIN') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        history.push('/login');
        return;
      }
      setUser(parsedUser);
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

  const fullName = user?.fullName || 'Admin';
  const avatarLetter = fullName.charAt(0).toUpperCase();



  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Thống kê',
    },
    {
      key: '/admin/universities',
      icon: <BankOutlined />,
      label: 'Danh sách trường',
    },
    {
      key: '/admin/majors',
      icon: <BookOutlined />,
      label: 'Danh sách ngành',
    },
    {
      key: '/admin/subject-groups',
      icon: <ProfileOutlined />,
      label: 'Tổ hợp xét tuyển',
    },
    {
      key: '/admin/admission-rounds',
      icon: <CalendarOutlined />,
      label: 'Đợt tuyển sinh',
    },
    {
      key: '/admin/applications',
      icon: <FileTextOutlined />,
      label: 'Hồ sơ nộp',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Người dùng',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cấu hình',
    },
  ];

  return (
    <Layout className={styles.adminLayout}>
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        trigger={null}
        className={styles.sider}
      >
        <div 
          onClick={() => history.push('/')}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 12,
            cursor: 'pointer',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            overflow: 'hidden',
            transition: 'all 0.2s'
          }}
        >
          <AppLogo />
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: '1.2' }}>UniAdmission</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 11, marginTop: 2 }}>Admin Portal</span>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[
            (() => {
              const path = location.pathname;
              if (path.startsWith('/admin/dashboard')) return '/admin/dashboard';
              if (path.startsWith('/admin/universities')) return '/admin/universities';
              if (path.startsWith('/admin/majors')) return '/admin/majors';
              if (path.startsWith('/admin/subject-groups')) return '/admin/subject-groups';
              if (path.startsWith('/admin/admission-rounds')) return '/admin/admission-rounds';
              if (path.startsWith('/admin/applications')) return '/admin/applications';
              if (path.startsWith('/admin/users')) return '/admin/users';
              if (path.startsWith('/admin/settings')) return '/admin/settings';
              return path;
            })()
          ]}
          items={menuItems}
          onClick={({ key }) => history.push(key)}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerTitle}>
            Hệ thống quản trị tuyển sinh
          </div>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Đăng xuất',
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <div className={styles.adminInfo}>
              <Avatar style={{ backgroundColor: '#10B981' }}>{avatarLetter}</Avatar>
              <span>{fullName}</span>
            </div>
          </Dropdown>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
      <EmailSandbox />
    </Layout>
  );
}