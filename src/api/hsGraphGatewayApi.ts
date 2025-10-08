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
  reasoning: string;  // HS 코드 추천 근거
  tariffReasoning?: string;  // 관세율 적용 근거
  usTariffRate: number;
  baseTariffRate?: number;
  reciprocalTariffRate?: number;
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
      // 백엔드 API를 통한 HS 그래프 분석 (충돌 방지용 엔드포인트)
      const response = await axiosInstance.post('/hs-code-analysis/analyze-graph', request);
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