import request from './request';

// Đăng ký tài khoản mới
export async function register(data: any) {
  return request.post('/auth/register', data); 
}

// Đăng nhập hệ thống
export async function login(data: any) {
  return request.post('/auth/login', data);
}

// Làm mới mã Token truy cập công khai
export async function refreshToken(refreshToken: string) {
  return request.post('/auth/refresh', { refreshToken });
}