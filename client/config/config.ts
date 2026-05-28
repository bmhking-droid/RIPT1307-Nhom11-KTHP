import { defineConfig } from 'umi';
import proxy from './proxy';
import routes from './routes';

export default defineConfig({
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/request',
  ],

  antd: {
  },
  request: {
  },
  
  routes: routes,
  proxy: proxy,
  
  define: {
    'process.env.UMI_APP_API_URL': process.env.UMI_APP_API_URL || 'https://online-admission-api.onrender.com/api',
  },
  
  esbuildMinifyIIFE: true,
  
  npmClient: 'npm',
});