import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: process.env.UMI_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

request.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const messageText =
      error?.response?.data?.message ||
      'Có lỗi xảy ra';

    message.error(messageText);

    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export const getFileUrl = (url: string): string => {
  if (!url) return '';
  
  // Tự động chuyển đổi các liên kết mẫu giả lập sang file thật để Demo hoàn hảo
  if (url.includes('api.admission.edu.vn')) {
    if (url.endsWith('.pdf')) {
      return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }
    return 'https://placehold.co/600x800/e2e8f0/475569?text=Minh+Chung+Mau';
  }

  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  const apiUrl = process.env.UMI_APP_API_URL || 'http://localhost:5000/api';
  const backendBase = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
  
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanUrl}`;
};

export const apiRequest = request; 
export default request;