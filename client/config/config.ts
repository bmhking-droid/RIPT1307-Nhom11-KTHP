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
  
  npmClient: 'npm',
});