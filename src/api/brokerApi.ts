import axiosInstance from './axiosinstance';
import type { TariffAnalysisResponse, PrecedentsResponse } from './productApi';

// 타입 정의
export interface BrokerReviewRequest {
  productId: number;
  brokerId: number;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewComment?: string;
  suggestedHsCode?: string;
}

export interface BrokerReviewResponse {
  id: number;
  productId: number;
  productName: string;
  brokerId: number;
  brokerName: string;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewComment?: string;
  suggestedHsCode?: string;
  requestedAt: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrokerReviewListResponse {
  id: number;
  productId: number;
  productName: string;
  brokerId: number;
  brokerName: string;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewComment?: string;
  requestedAt: string;
  reviewedAt?: string;
  createdAt: string;
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
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

// API 함수들
export const brokerApi = {
  // 리뷰 요청 생성
  createReviewRequest: async (data: BrokerReviewRequest): Promise<BrokerReviewResponse> => {
    const response = await axiosInstance.post('/broker/reviews', data);
    return response.data;
  },

  // 리뷰 상태 업데이트
  updateReviewStatus: async (
    reviewId: number,
    reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED',
    reviewComment?: string,
    suggestedHsCode?: string
  ): Promise<BrokerReviewResponse> => {
    const response = await axiosInstance.put(`/broker/reviews/${reviewId}`, null, {
      params: {
        reviewStatus,
        reviewComment,
        suggestedHsCode
      }
    });
    return response.data;
  },

  // 리뷰 상세 조회
  getReviewById: async (reviewId: number): Promise<BrokerReviewResponse> => {
    const response = await axiosInstance.get(`/broker/reviews/${reviewId}`);
    return response.data;
  },

  // 관세사별 리뷰 목록 조회
  getReviewsByBrokerId: async (
    brokerId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<BrokerReviewListResponse>> => {
    const response = await axiosInstance.get(`/broker/reviews/broker/${brokerId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // 상품별 리뷰 목록 조회
  getReviewsByProductId: async (
    productId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<BrokerReviewListResponse>> => {
    const response = await axiosInstance.get(`/broker/reviews/product/${productId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // 상품의 최신 리뷰 조회 (단일)
  getLatestReviewByProductId: async (productId: number): Promise<BrokerReviewResponse | null> => {
    try {
      const response = await axiosInstance.get(`/broker/reviews/product/${productId}/latest`);
      return response.data;
    } catch (error: any) {
      // 204 No Content인 경우 null 반환
      if (error.response?.status === 204) {
        return null;
      }
      throw error;
    }
  },

  // 리뷰 상태별 목록 조회
  getReviewsByStatus: async (
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<BrokerReviewListResponse>> => {
    const response = await axiosInstance.get(`/broker/reviews/status/${status}`, {
      params: { page, size }
    });
    return response.data;
  },

  // 관세사별 대기 중인 리뷰 목록 조회
  getPendingReviewsByBrokerId: async (brokerId: number): Promise<BrokerReviewListResponse[]> => {
    const response = await axiosInstance.get(`/broker/reviews/broker/${brokerId}/pending`);
    return response.data;
  },

  // 상품별 최신 리뷰 조회
  getLatestReviewsByProductId: async (
    productId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<BrokerReviewListResponse>> => {
    const response = await axiosInstance.get(`/broker/reviews/product/${productId}/latest`, {
      params: { page, size }
    });
    return response.data;
  },

  // 리뷰 삭제
  deleteReview: async (reviewId: number, brokerId: number): Promise<void> => {
    await axiosInstance.delete(`/broker/reviews/${reviewId}`, {
      headers: { 'X-Broker-Id': brokerId }
    });
  }
};

// 상품 API 함수들
export const productApi = {
  // 상품 목록 조회
  getProducts: async (
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt,desc'
  ): Promise<PaginatedResponse<ProductListResponse>> => {
    const response = await axiosInstance.get('/products', {
      params: { page, size, sort }
    });
    return response.data;
  },

  // 상품 상세 조회
  getProductById: async (productId: string): Promise<ProductResponse> => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  },

  // 상품 ID 매핑 조회 (숫자 ID -> 문자열 productId)
  getProductIdMapping: async (id: number): Promise<{id: string, productId: string, productName: string}> => {
    const response = await axiosInstance.get(`/products/id-mapping/${id}`);
    return response.data;
  },

  // 판매자별 상품 목록 조회
  getProductsBySellerId: async (
    sellerId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<ProductListResponse>> => {
    const response = await axiosInstance.get(`/products/seller/${sellerId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // 상품명으로 검색
  searchProductsByName: async (
    productName: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<ProductListResponse>> => {
    const response = await axiosInstance.get('/products/search', {
      params: { productName, page, size }
    });
    return response.data;
  },

  // 상품의 관세 분석 결과 조회
  getProductTariffAnalysis: async (productId: string): Promise<TariffAnalysisResponse> => {
    try {
      const response = await axiosInstance.get(`/products/${productId}/tariff-analysis`);
      return response.data;
    } catch (error) {
      console.error('Failed to get product tariff analysis:', error);
      throw error;
    }
  },

  // 상품의 판례 분석 결과 조회
  getProductPrecedents: async (productId: string): Promise<PrecedentsResponse> => {
    try {
      const response = await axiosInstance.get(`/products/${productId}/precedents`);
      return response.data;
    } catch (error) {
      console.error('Failed to get product precedents:', error);
      throw error;
    }
  }
};
