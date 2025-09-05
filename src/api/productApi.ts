import axiosInstance from './axiosinstance';
import type { 
  ProductRequest, 
  ProductResponse, 
  ProductListResponse, 
  PaginatedResponse 
} from '../types';

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
  }
};
