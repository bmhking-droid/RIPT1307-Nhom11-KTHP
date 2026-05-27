declare namespace API {
  // Kiểu thoong tin người dùng
  export interface User {
    id: string; 
    email: string;
    role: 'CANDIDATE' | 'ADMIN'; 
    isActive: boolean;
    emailVerified: boolean;
    profile?: Profile;
    createdAt?: string;
    updatedAt?: string;
  }
// Kiểu dữ liệu thông tin cá nhân 
  export interface Profile {
    id: string;
    userId: string;
    fullName: string;
    cccd?: string;
    dateOfBirth?: string;
    gender?: 'Nam' | 'Nữ' | 'Khác';
    phone?: string;
    address?: string;
    priorityGroup?: string;
  }
// Kiểu dữ liệu hồ sơ
  export interface Application {
    id: string;
    userId: string;
    universityId: string;
    majorId: string;
    combinationId: string;
    roundId: string;
    totalScore?: number; 
    status: 'pending' | 'approved' | 'rejected'; 
    reviewedAt?: string;
    reviewedBy?: string;
    submittedAt: string; 
    university?: any;
    major?: any;
    documents?: ApplicationDocument[];
    statusHistories?: any[];
  }

  // Kiểu dữ liệu minh chứng đính kèm
  export interface ApplicationDocument {
    id: string;
    applicationId: string;
    documentType: 'CCCD' | 'HOC_BA' | 'DIEM_THI' | 'UU_TIEN' | 'ANH_3X4'; 
    fileUrl: string;
    originalName?: string;
    fileSize?: number;
    uploadedAt?: string;
  }
}