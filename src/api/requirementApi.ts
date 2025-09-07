import axiosInstance from './axiosinstance';

export interface RequirementAnalysisResponse {
  productId: string;
  productName: string;
  hsCode: string;
  criticalActions: string[];
  requiredDocuments: string[];
  complianceSteps: string[];
  timeline: string;
  brokerRejectionReason?: string;
  criticalDeadline?: string;
  qualityStandards?: string;
  coldChainRequirement?: string;
  criticalWarning?: string;
  pendingAnalysis?: string;
  sources: string[];
  confidenceScore: number;
  isValid: boolean;
  lastUpdated: string | null;
}

export const requirementApi = {
  // 상품의 요구사항 분석 결과 조회
  getRequirementAnalysis: async (productId: number): Promise<RequirementAnalysisResponse> => {
    const response = await axiosInstance.get(`/requirements/product/${productId}`);
    return response.data;
  },
};
