import axiosInstance from './axiosinstance';
import type { 
  ProductRequest, 
  ProductResponse, 
  ProductListResponse, 
  PaginatedResponse 
} from '../types';

// 판례 상세 정보 타입
export interface PrecedentDetail {
  case_id: string;
  title: string;
  description: string;
  status: string;
  link: string;
  source: string;
  hs_code: string;
}

// Precedents 타입 정의 (백엔드 응답 구조에 맞게 수정)
export interface PrecedentsResponse {
  success_cases: string[];
  failure_cases: string[];
  review_cases: string[];
  actionable_insights: string[];
  risk_factors: string[];
  recommended_action: string;
  precedents_data?: PrecedentDetail[];  // 판례 원본 데이터
  confidence_score: number;
  is_valid: boolean;
}

// 관세 분석 타입 정의
export interface TariffAnalysisResponse {
  hsCode: string;
  tariffRate: number;
  ftaRate: number;
  estimatedDuty: number;
  fobPrice: number;
  description: string;
  confidenceScore: number;
  lastUpdated: string;
}

// 관세 분석 타입 정의
export interface TariffAnalysisResponse {
  hsCode: string;
  tariffRate: number;
  ftaRate: number;
  estimatedDuty: number;
  fobPrice: number;
  description: string;
  confidenceScore: number;
  lastUpdated: string;
}

// 상품 API 함수들
export const productApi = {
  // 상품 등록
  createProduct: async (data: ProductRequest, sellerId: number): Promise<ProductResponse> => {
    try {
      const response = await axiosInstance.post('/products', data, {
        headers: {
          'X-Seller-Id': sellerId.toString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  // 상품 목록 조회 (페이징)
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

  // 상품 삭제
  deleteProduct: async (productId: string, sellerId: number): Promise<void> => {
    await axiosInstance.delete(`/products/${productId}`, {
      headers: {
        'X-Seller-Id': sellerId.toString()
      }
    });
  },

  // 상품명으로 검색 (구매자용)
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

  // 판매자별 상품 검색 (상품명 + 상태 필터)
  searchProductsBySellerIdAndNameAndStatus: async (
    sellerId: number,
    productName: string | null,
    status: string = 'all',
    page: number = 0, 
    size: number = 10
  ): Promise<PaginatedResponse<ProductListResponse>> => {
    const params: any = { status, page, size };
    if (productName !== null) {
      params.productName = productName;
    }
    
    const response = await axiosInstance.get(`/products/seller/${sellerId}/search-filter`, {
      params
    });
    return response.data;
  },

  // 상품의 판례 분석 결과 조회
  getProductPrecedents: async (productId: string, productData?: any): Promise<PrecedentsResponse> => {
    try {
      // Python AI 엔진의 analyze-precedents 엔드포인트 사용 (8000번 포트)
      const requestData = {
        product_id: productId,
        product_name: productData?.productName || "premium vitamin serum C",
        hs_code: productData?.hsCode || "3304.99.50.00",
        description: productData?.description || "Korean premium vitamin C serum for skincare",
        origin_country: productData?.originCountry || "Korea",
        price: productData?.price || 25.00,
        fob_price: productData?.fobPrice || 22.00
      };
      
      console.log("Sending precedents analysis request:", requestData);
      // Python AI 엔진으로 직접 요청
      const response = await fetch('http://localhost:8000/analyze-precedents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get product precedents:', error);
      throw error;
    }
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

  // 상품 ID 매핑 조회 (브로커 리뷰용)
  getProductIdMapping: async (reviewProductId: number): Promise<{ productId: string }> => {
    try {
      const response = await axiosInstance.get(`/products/id-mapping/${reviewProductId}`);
      return { productId: response.data.productId };
    } catch (error) {
      console.error('Failed to get product ID mapping:', error);
      throw error;
    }
  },

  // 상품 분석 실행
  triggerAnalysis: async (productId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post(`/products/${productId}/analyze`);
      return response.data;
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
      throw error;
    }
  },

  // 요구사항 분석 실행
  triggerRequirementsAnalysis: async (productId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post(`/products/${productId}/analyze/requirements`);
      return response.data;
    } catch (error) {
      console.error('Failed to trigger requirements analysis:', error);
      throw error;
    }
  },

  // 관세 분석 실행
  triggerTariffAnalysis: async (productId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post(`/products/${productId}/analyze/tariff`);
      return response.data;
    } catch (error) {
      console.error('Failed to trigger tariff analysis:', error);
      throw error;
    }
  },

  // 분석 상태 확인
  getAnalysisStatus: async (productId: string): Promise<{ 
    success: boolean; 
    analysisAvailable: boolean;
    analysisInProgress: boolean;
    analysisComplete: boolean;
    precedentsComplete: boolean;
    requirementsComplete: boolean;
  }> => {
    try {
      const response = await axiosInstance.get(`/products/${productId}/analysis/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get analysis status:', error);
      throw error;
    }
  }
};
