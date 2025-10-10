// 공통 타입 정의

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  role: 'SELLER' | 'BUYER' | 'BROKER';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  sellerId: number;
  sellerName: string;
  productId: string;
  productName: string;
  description: string;
  price: number;
  fobPrice: number;
  originCountry: string;
  hsCode: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  productName: string;
  description: string;
  price: number;
  fobPrice: number;
  originCountry: string;
  hsCode: string;
  hsCodeDescription?: string;  // AI 분석 결과
  usTariffRate?: number;       // AI 분석 결과
  reasoning?: string;          // HS 코드 추천 근거
  tariffReasoning?: string;    // 관세율 적용 근거
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
}

export interface ProductResponse {
  id: number;
  sellerId: number;
  sellerName: string;
  productId: string;
  productName: string;
  description: string;
  price: number;
  fobPrice: number;
  originCountry: string;
  hsCode: string;
  hsCodeDescription: string;  // HS 코드 설명 (combined_description)
  usTariffRate: number;       // 최종 관세율
  reasoning: string;          // HS 코드 추천 근거 (AI 분석)
  tariffReasoning: string;    // 관세율 적용 근거 (AI 분석)
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  id: number;
  sellerId: number;
  sellerName: string;
  productId: string;
  productName: string;
  price: number;
  fobPrice: number;
  originCountry: string;
  hsCode: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
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


// 채팅 관련 타입 정의
export type ChatSessionType = 'SELLER_PRODUCT_INQUIRY' | 'BUYER_PURCHASE_INQUIRY';
export type ChatSessionStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED';
export type MessageSenderType = 'USER' | 'AI';
export type MessageType = 'TEXT' | 'BUTTON' | 'BUTTON_GROUP';

export interface ChatSessionRequest {
  userId: number;
  sessionType: ChatSessionType;
  language: string;
  sessionData?: string;
}

export interface ChatSessionResponse {
  id: number;
  userId: number;
  userName: string;
  sessionType: ChatSessionType;
  language: string;
  status: ChatSessionStatus;
  sessionData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageRequest {
  sessionId: number;
  senderType: MessageSenderType;
  messageContent: string;
  messageType: MessageType;
  metadata?: string;
}

export interface ChatMessageResponse {
  id: number;
  sessionId: number;
  senderType: MessageSenderType;
  messageContent: string;
  messageType: MessageType;
  metadata?: string;
  createdAt: string;
}

export interface ChatMessagesPageResponse {
  content: ChatMessageResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
}