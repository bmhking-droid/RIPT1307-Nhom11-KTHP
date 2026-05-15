import React from 'react';
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

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const location = useLocation();

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
      <Sider width={250} className={styles.sider}>
        <div className={styles.logo}>Admin Tuyển Sinh</div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
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
                  onClick: () => history.push('/auth/login'),
                },
              ],
            }}
          >
            <div className={styles.adminInfo}>
              <Avatar>AD</Avatar>
              <span>Admin</span>
            </div>
          </Dropdown>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}