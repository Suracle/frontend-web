import axiosInstance from './axiosinstance';

// 출처 정보
export interface SourceCitation {
  agency: string;
  category: string;
  url: string;
  title: string;
}

// 요구사항 항목 (출처 포함 + 한국어 지원)
export interface RequirementItem {
  requirement?: string;
  requirement_ko?: string;           // 한국어 요구사항
  action?: string;
  action_ko?: string;                // 한국어 조치사항
  agency: string;
  source_url: string;
  severity?: string;
  penalty_if_violated?: string;
  penalty_if_violated_ko?: string;   // 한국어 처벌 설명
  effective_date?: string;           // 규정 발효일
  last_updated?: string;             // 마지막 업데이트일
}

// 문서 항목 (출처 포함 + 한국어 지원)
export interface DocumentItem {
  document: string;
  document_ko?: string;              // 한국어 문서명
  issuing_authority?: string;
  issuing_authority_ko?: string;     // 한국어 발급 기관
  source_url: string;
  estimated_time?: string;
  estimated_time_ko?: string;        // 한국어 소요 시간
  notes?: string;
  notes_ko?: string;                 // 한국어 주의사항
}

// 준수 단계 (출처 포함 + 한국어 지원)
export interface ComplianceStep {
  step: number;
  action: string;
  action_ko?: string;                // 한국어 조치사항
  responsible_party?: string;
  responsible_party_ko?: string;     // 한국어 담당자
  source_url: string;
  estimated_duration?: string;
  estimated_duration_ko?: string;    // 한국어 소요 시간
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

// 위험 요소 (한국어 지원)
export interface RiskFactor {
  risk: string;
  risk_ko?: string;                  // 한국어 위험 설명
  impact: 'low' | 'medium' | 'high';
  likelihood: 'low' | 'medium' | 'high';
  mitigation: string;
  mitigation_ko?: string;            // 한국어 완화 방안
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

// 권장사항 (한국어 지원)
export interface Recommendation {
  recommendation: string;
  recommendation_ko?: string;        // 한국어 권장사항
  priority: 'low' | 'medium' | 'high';
  rationale: string;
  rationale_ko?: string;             // 한국어 이유
  source_url: string;
}

// 면제 규정 (신규)
export interface Exemption {
  exemption_type: string;
  condition: string;
  condition_ko?: string;             // 한국어 조건
  exempted_from: string[];
  exempted_from_ko?: string[];       // 한국어 면제 항목
  limitations: string;
  limitations_ko?: string;           // 한국어 제한사항
  how_to_claim: string;
  how_to_claim_ko?: string;          // 한국어 신청 방법
  source_url: string;
  notes?: string;
  notes_ko?: string;                 // 한국어 주의사항
}

// 타임라인 (상세)
export interface TimelineDetail {
  minimum_days: number;
  typical_days: number;
  maximum_days: number;
  critical_path?: string[];
  source_url?: string;
}

// Phase 2-4 전문 분석 결과
export interface DetailedRegulationsResult {
  hs_code: string;
  product_name: string;
  analysis_timestamp: string;
  agencies: string[];
  detailed_by_agency: any;
  sources: any[];
}

export interface TestingProceduresResult {
  hs_code: string;
  product_name: string;
  analysis_timestamp: string;
  agencies: string[];
  inspection_cycle: string;          // per_import, annual, sampling
  methods: string[];                 // chemical, physical
  estimates: {
    estimated_cost_band: string;     // low, medium, high
    estimated_duration_band: string; // short, medium, long
    cost_confidence: number;
    duration_confidence: number;
  };
  evidence: any;
  sources: any[];
}

export interface PenaltiesResult {
  hs_code: string;
  product_name: string;
  analysis_timestamp: string;
  agencies: string[];
  fine_range: {
    min: number | null;
    max: number | null;
    confidence: number;
  };
  measures: {
    seizure_or_destruction: boolean;
    import_ban_possible: boolean;
  };
  legal: any;
  sources: any[];
}

export interface ValidityResult {
  hs_code: string;
  product_name: string;
  analysis_timestamp: string;
  agencies: string[];
  validity: string;                  // 1_year, 2_years, 3_years
  renewal: {
    procedure: string;
    cost_band: string;               // low, medium, high
  };
  reminders: string;
  sources: any[];
  evidence: any;
}

export interface CrossValidationResult {
  hs_code: string;
  product_name: string;
  conflicts_found: any[];
  validation_score: number;
  recommendations: string[];
  last_updated: string;
}

// 판례 기반 검증 결과 (신규 - 2025-10-12)
export interface PrecedentValidationResult {
  validation_score: number;              // 0.0 ~ 1.0
  precedents_analyzed: number;           // 분석한 판례 수
  precedents_source: string;             // "faiss_db", "api", "none"
  matched_requirements: Array<{
    requirement: string;
    precedent_ruling: string;
    confidence: number;
  }>;
  missing_requirements: Array<{
    requirement: string;
    reason: string;
    severity: string;
  }>;
  extra_requirements: Array<{
    requirement: string;
    found_in_precedents: boolean;
  }>;
  red_flags: Array<{
    issue: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    recommendation: string;
  }>;
  verdict: {
    status: 'APPROVED' | 'REVIEW_REQUIRED' | 'HIGH_RISK';
    reason: string;
    action_items: string[];
  };
}

// 통합 신뢰도 (판례 + 교차검증 + 출처) (신규 - 2025-10-12)
export interface OverallConfidence {
  overall_score: number;                 // 0.0 ~ 1.0
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  breakdown: {
    precedent_validation: { score: number; weight: number };
    cross_validation: { score: number; weight: number };
    source_reliability: { score: number; weight: number };
  };
  red_flags: Array<{
    type: string;
    severity: string;
    description: string;
    agencies?: string[];
  }>;
  red_flags_count: number;
  verdict: {
    status: 'RELIABLE' | 'CAUTION' | 'HIGH_RISK';
    confidence: string;
    reason: string;
    action: string;
  };
}

// 검증 요약 (Frontend용 간단 버전) (신규 - 2025-10-12)
export interface VerificationSummary {
  verdict: 'RELIABLE' | 'CAUTION' | 'HIGH_RISK' | 'UNKNOWN';
  confidence_score: number;
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  red_flags_count: number;
  action_recommendation: string;
}

// 확장 필드 인터페이스 (신규 - 2025-10-12)
export interface ExecutionChecklist {
  pre_import: Array<{
    task: string;
    task_ko?: string;
    deadline: string;
    deadline_ko?: string;
    responsible: string;
    responsible_ko?: string;
    priority: string;
    estimated_hours: number;
    dependencies: string[];
    success_criteria: string;
    success_criteria_ko?: string;
    source_url?: string;
  }>;
  during_import: Array<{
    task: string;
    task_ko?: string;
    timing: string;
    timing_ko?: string;
    source_url?: string;
    estimated_hours: number;
  }>;
  post_import: Array<{
    task: string;
    task_ko?: string;
    deadline: string;
    source_url?: string;
    estimated_hours: number;
  }>;
}

export interface CostBreakdown {
  mandatory_costs: {
    [key: string]: {
      min: number;
      max: number;
      currency: string;
      frequency: string;
      source_url?: string;
    };
  };
  optional_costs: {
    [key: string]: {
      min: number;
      max: number;
      currency: string;
      frequency: string;
      source_url?: string;
    };
  };
  hidden_costs: {
    [key: string]: {
      min: number;
      max: number;
      currency: string;
      frequency: string;
      source_url?: string;
    };
  };
  cost_optimization: Array<{
    strategy: string;
    strategy_ko?: string;
    potential_savings: string;
    potential_savings_ko?: string;
    trade_offs: string;
    trade_offs_ko?: string;
  }>;
}

export interface RiskMatrix {
  high_risk: Array<{
    risk: string;
    risk_ko?: string;
    impact: string;
    probability: string;
    detection_method: string;
    detection_method_ko?: string;
    contingency_plan: string;
    contingency_plan_ko?: string;
  }>;
  medium_risk: Array<{
    risk: string;
    risk_ko?: string;
    impact: string;
    probability: string;
    monitoring_frequency: string;
    monitoring_frequency_ko?: string;
  }>;
}

export interface ComplianceScore {
  overall_score: number;
  category_scores: {
    [category: string]: {
      score: number;
      weight: number;
      max_score: number;
    };
  };
  improvement_areas: Array<{
    area: string;
    area_ko?: string;
    current_gap: string;
    current_gap_ko?: string;
    action_plan: string;
    action_plan_ko?: string;
    estimated_effort: string;
    priority: string;
    source_url?: string;
  }>;
}

export interface MarketAccess {
  retailer_requirements: Array<{
    retailer: string;
    specific_requirements: string[];
    specific_requirements_ko?: string[];
    certifications_needed: string[];
    certifications_needed_ko?: string[];
    compliance_deadline: string;
    compliance_deadline_ko?: string;
    source_url?: string;
  }>;
  state_regulations: Array<{
    state: string;
    regulation: string;
    regulation_ko?: string;
    applies_to: string;
    applies_to_ko?: string;
    penalty: string;
    penalty_ko?: string;
    source_url?: string;
  }>;
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
  exemptions?: Exemption[];          // 면제 규정 (신규)
  
  // Phase 2-4 전문 분석 결과 (신규)
  detailedRegulations?: DetailedRegulationsResult;
  testingProcedures?: TestingProceduresResult;
  penalties?: PenaltiesResult;
  validity?: ValidityResult;
  crossValidation?: CrossValidationResult;
  precedentValidation?: PrecedentValidationResult;  // 판례 기반 검증 (신규 - 2025-10-12)
  overallConfidence?: OverallConfidence;            // 통합 신뢰도 (신규 - 2025-10-12)
  verificationSummary?: VerificationSummary;        // 검증 요약 (신규 - 2025-10-12)
  
  // 확장 필드 (신규 - 2025-10-12)
  executionChecklist?: ExecutionChecklist;
  costBreakdown?: CostBreakdown;
  riskMatrix?: RiskMatrix;
  complianceScore?: ComplianceScore;
  marketAccess?: MarketAccess;
  
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
