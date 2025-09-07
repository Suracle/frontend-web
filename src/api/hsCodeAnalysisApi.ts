import axiosInstance from './axiosinstance';

// HS코드 분석 관련 타입 정의
export interface HsCodeAnalysisRequest {
  productName: string;
  productDescription: string;
  analysisSessionId?: string;
}

export interface HsCodeSuggestion {
  id: number;
  hsCode: string;
  description: string;
  confidenceScore: number;
  reasoning: string;
  usTariffRate: number;
}

export interface HsCodeAnalysisResponse {
  analysisSessionId: string;
  suggestions: HsCodeSuggestion[];
}

export interface HsCodeSelection {
  analysisId: number;
  analysisSessionId: string;
}

// HS코드 분석 API 함수들
export const hsCodeAnalysisApi = {
  // 상품명과 설명을 기반으로 HS코드 분석 수행
  analyzeHsCode: async (request: HsCodeAnalysisRequest): Promise<HsCodeAnalysisResponse> => {
    try {
      const response = await axiosInstance.post('/hs-code-analysis/analyze', request);
      return response.data;
    } catch (error) {
      console.error('Failed to analyze HS code:', error);
      throw error;
    }
  },

  // 분석 세션 ID로 추천된 HS코드 목록 조회
  getAnalysisResults: async (sessionId: string): Promise<HsCodeAnalysisResponse> => {
    try {
      const response = await axiosInstance.get(`/hs-code-analysis/results/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get analysis results:', error);
      throw error;
    }
  },

  // 사용자가 선택한 HS코드 저장
  selectHsCode: async (selection: HsCodeSelection): Promise<HsCodeSuggestion> => {
    try {
      const response = await axiosInstance.post('/hs-code-analysis/select', selection);
      return response.data;
    } catch (error) {
      console.error('Failed to select HS code:', error);
      throw error;
    }
  }
};
