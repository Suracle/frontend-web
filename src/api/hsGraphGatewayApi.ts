import axiosInstance from './axiosinstance';

export interface HsCodeSuggestion {
  id?: number;
  hsCode: string;
  description: string;
  confidenceScore: number;
  reasoning: string;
  usTariffRate: number;
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
    const response = await axiosInstance.post('/hs-code-graph/analyze', request);
    return response.data;
  },
};

export default hsGraphGatewayApi;