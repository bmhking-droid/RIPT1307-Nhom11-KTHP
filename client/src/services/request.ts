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

export const apiRequest = request; 
export default request;