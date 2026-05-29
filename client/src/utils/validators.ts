// Thêm mảng rules cấu hình cho Ant Design Form
export const phoneRules = [
  { required: true, message: 'Vui lòng nhập số điện thoại!' },
  { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không đúng định dạng Việt Nam!' }
];

export const emailRules = [
  { required: true, message: 'Vui lòng nhập Email!' },
  { type: 'email', message: 'Email không đúng định dạng!' }
];

export const citizenIdRules = [
  { required: true, message: 'Vui lòng nhập số CCCD!' },
  { pattern: /^\d{9,12}$/, message: 'Số CCCD phải bao gồm 9 đến 12 chữ số!' }
];

// Hàm kiểm tra file đính kèm trước khi tải lên (Size < 5MB, đúng định dạng)
export function validateFileBeforeUpload(file: File): { valid: boolean; message: string } {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    return { valid: false, message: 'File phải nhỏ hơn 5MB!' };
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Chỉ hỗ trợ file JPG, PNG, PDF!' };
  }
  
  return { valid: true, message: '' };
}

// Giữ lại bộ Validators cũ để tránh lỗi ở các file khác nếu có gọi
export const Validators = {
  validateEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  validateCCCD: (cccd: string) => /^\d{9,12}$/.test(cccd.trim()),
  validatePhone: (phone: string) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone.trim()),
  validateScore: (score: number | string) => {
    const num = Number(score);
    return !isNaN(num) && num >= 0 && num <= 30;
  }
};