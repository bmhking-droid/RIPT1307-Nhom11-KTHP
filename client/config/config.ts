import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  npmClient: 'npm',

  routes,

  hash: true,

  history: {
    type: 'browser',
  },
});