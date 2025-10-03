import axiosInstance from './axiosinstance';

export interface HierarchicalDescription {
  heading: string;
  subheading: string;
  tertiary: string;
  combinedDescription: string;
  headingCode: string;
  subheadingCode: string;
  tertiaryCode: string;
}

export interface HsCodeSuggestion {
  id?: number;
  hsCode: string;
  description: string;
  confidenceScore: number;
  reasoning: string;
  usTariffRate: number;
  usitcUrl: string;
  hierarchicalDescription?: HierarchicalDescription;
}

export interface HsCodeAnalysisRequest {
  productName: string;
  productDescription: string;
  analysisSessionId?: string;
}

export interface HsCodeAnalysisResponse {
  analysisSessionId: string;
  suggestions: HsCodeSuggestion[];
}

export const hsGraphGatewayApi = {
  analyze: async (request: HsCodeAnalysisRequest): Promise<HsCodeAnalysisResponse> => {
    try {
      // hs_graph_service의 실제 엔드포인트 사용
      const response = await axiosInstance.post('http://localhost:8000/api/hs-code/analyze-graph', request);
      return response.data;
    } catch (error: any) {
      // 타임아웃 또는 기타 에러 처리
      if (error.code === 'ECONNABORTED' || error.response?.status === 408) {
        throw new Error('분석 시간이 초과되었습니다. 제품 설명을 더 간단하게 입력해주세요.');
      }
      throw error;
    }
  },
};

export default hsGraphGatewayApi;