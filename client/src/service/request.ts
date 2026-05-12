import axios from 'axios';

const request = axios.create({
  baseURL: process.env.UMI_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);

export default request;