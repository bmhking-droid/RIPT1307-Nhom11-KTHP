import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#4F46E5',

          colorInfo: '#4F46E5',

          borderRadius: 16,

          colorText: '#111827',

          colorTextSecondary: '#6B7280',

          colorBorder: '#DDE3F4',

          colorBgLayout: '#F5F7FF',

          colorBgContainer: '#FFFFFF',

          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
        },

      }}
    >
      {container}
    </ConfigProvider>
  );
}