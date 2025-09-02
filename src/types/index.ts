// 공통 타입 정의

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  role: 'seller' | 'buyer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  images: string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 폼 관련 타입
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  agreeToTerms: boolean;
}

// 필터 관련 타입
export interface ProductFilters {
  searchTerm: string;
  category: string;
  status: string;
  minPrice?: number;
  maxPrice?: number;
}
