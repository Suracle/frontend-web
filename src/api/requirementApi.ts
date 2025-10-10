import axiosInstance from './axiosinstance';

// 출처 정보
export interface SourceCitation {
  agency: string;
  category: string;
  url: string;
  title: string;
}

// 요구사항 항목 (출처 포함)
export interface RequirementItem {
  requirement?: string;
  action?: string;
  agency: string;
  source_url: string;
  severity?: string;
  penalty_if_violated?: string;
  effective_date?: string;  // 규정 발효일
  last_updated?: string;     // 마지막 업데이트일
}

// 문서 항목 (출처 포함)
export interface DocumentItem {
  document: string;
  issuing_authority?: string;
  source_url: string;
  estimated_time?: string;
  notes?: string;
}

// 준수 단계 (출처 포함)
export interface ComplianceStep {
  step: number;
  action: string;
  responsible_party?: string;
  source_url: string;
  estimated_duration?: string;
  dependencies?: string[];
}

// 라벨링 요구사항
export interface LabelingRequirement {
  element: string;
  requirement: string;
  agency: string;
  source_url: string;
  format?: string;
  placement?: string;
  language?: string;
  penalties?: string;
}

// 테스트 요구사항
export interface TestingRequirement {
  test: string;
  required_by: string;
  frequency?: string;
  accredited_labs?: string[];
  cost_per_test?: {
    min: number;
    max: number;
    currency: string;
  };
  turnaround_time?: string;
  source_url: string;
  pass_criteria?: string;
}

// 금지/제한 물질
export interface ProhibitedRestrictedSubstance {
  substance: string;
  status: 'prohibited' | 'restricted';
  max_concentration?: string;
  agency: string;
  source_url: string;
  alternatives?: string[];
}

// 사전 통지
export interface PriorNotification {
  type: string;
  required_for: string;
  deadline: string;
  submission_method: string;
  source_url: string;
  processing_time?: string;
  consequences_if_missed?: string;
}

// 위험 요소
export interface RiskFactor {
  risk: string;
  impact: 'low' | 'medium' | 'high';
  likelihood: 'low' | 'medium' | 'high';
  mitigation: string;
  source_url: string;
}

// 예상 비용
export interface EstimatedCosts {
  total: {
    min: number;
    max: number;
    currency: string;
  };
  testing?: {
    min: number;
    max: number;
    currency: string;
    source_url?: string;
  };
  legal_review?: {
    min: number;
    max: number;
    currency: string;
    source_url?: string;
  };
  certification?: {
    min: number;
    max: number;
    currency: string;
    source_url?: string;
  };
  notes?: string;
}

// 권장사항
export interface Recommendation {
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  rationale: string;
  source_url: string;
}

// 타임라인 (상세)
export interface TimelineDetail {
  minimum_days: number;
  typical_days: number;
  maximum_days: number;
  critical_path?: string[];
  source_url?: string;
}

export interface RequirementAnalysisResponse {
  productId: string;
  productName: string;
  hsCode: string;
  
  // 기존 필드 (하위 호환성)
  criticalActions?: (string | RequirementItem)[];
  requiredDocuments?: (string | DocumentItem)[];
  complianceSteps?: (string | ComplianceStep)[];
  
  // 새로운 구조화된 필드
  labelingRequirements?: LabelingRequirement[];
  testingRequirements?: TestingRequirement[];
  prohibitedRestrictedSubstances?: ProhibitedRestrictedSubstance[];
  priorNotifications?: PriorNotification[];
  
  // 추가된 필드 (백엔드 llm_summary 구조)
  riskFactors?: RiskFactor[];
  estimatedCosts?: EstimatedCosts;
  recommendations?: Recommendation[];
  timelineDetail?: TimelineDetail;
  
  // 기존 타임라인 (하위 호환성)
  timeline?: string;
  brokerRejectionReason?: string;
  criticalDeadline?: string;
  qualityStandards?: string;
  coldChainRequirement?: string;
  criticalWarning?: string;
  pendingAnalysis?: string;
  
  sources: (string | SourceCitation)[];
  citations?: SourceCitation[];
  
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
