import axiosInstance from './axiosinstance';

// 타입 정의
export interface SignupRequest {
  email: string;
  password: string;
  userType: 'SELLER' | 'BUYER' | 'BROKER';
  userName: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  userType: 'SELLER' | 'BUYER' | 'BROKER';
  userName: string;
  preferredLanguage: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  userType: 'SELLER' | 'BUYER' | 'BROKER';
  userName: string;
  preferredLanguage: string;
  isActive: boolean;
  message: string;
}

// API 함수들
export const userApi = {
  // 회원가입
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post('/users/signup', data);
    return response.data;
  },

  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/users/login', data);
    return response.data;
  },

  // 이메일 중복 확인
  checkEmailDuplicate: async (email: string): Promise<boolean> => {
    const response = await axiosInstance.get(`/users/check-email?email=${email}`);
    return response.data;
  },
};
