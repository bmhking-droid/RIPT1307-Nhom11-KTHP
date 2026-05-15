export const phoneRules = [
  {
    pattern: /^(0|\+84)[0-9]{9}$/,
    message: 'Số điện thoại không hợp lệ',
  },
];

export const emailRules = [
  {
    type: 'email' as const,
    message: 'Email không hợp lệ',
  },
];

export const citizenIdRules = [
  {
    pattern: /^[0-9]{12}$/,
    message: 'CCCD phải gồm đúng 12 số',
  },
];

export function validateFileBeforeUpload(file: File) {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];

  const isValidType = allowedTypes.includes(file.type);
  const isValidSize = file.size / 1024 / 1024 < 5;

  if (!isValidType) {
    return {
      valid: false,
      message: 'Chỉ cho phép upload PDF, JPG, PNG',
    };
  }

  if (!isValidSize) {
    return {
      valid: false,
      message: 'File không được vượt quá 5MB',
    };
  }

  return {
    valid: true,
    message: '',
  };
}