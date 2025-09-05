import React from 'react';
import { FileText, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { RequirementAnalysisResponse } from '@/api/requirementApi';

interface RequirementsAnalysisCardProps {
  product: {
    analysisComplete: boolean;
    requirementAnalysis?: RequirementAnalysisResponse;
    loading?: boolean;
  };
}

interface ExternalLink {
  title: string;
  url: string;
}

const getExternalLinks = (hsCode: string): ExternalLink[] => {
  const links: ExternalLink[] = [
    {
      title: 'FDA 화장품 규정 확인',
      url: 'https://www.fda.gov/cosmetics'
    }
  ];

  // HS 코드에 따른 추가 링크
  if (hsCode.startsWith('3304')) {
    // 화장품 관련
    links.push({
      title: 'FDA 색소 첨가물 규정',
      url: 'https://www.fda.gov/industry/color-additive-inventories'
    });
  } else if (hsCode.startsWith('3305')) {
    // 헤어케어 제품
    links.push({
      title: 'FDA 헤어케어 제품 가이드',
      url: 'https://www.fda.gov/cosmetics/cosmetic-products/hair-care-products'
    });
  } else if (hsCode.startsWith('3307')) {
    // 향수
    links.push({
      title: 'FDA 향수 규정',
      url: 'https://www.fda.gov/cosmetics/cosmetic-products/fragrances-cosmetics'
    });
  }

  // 일반적인 추가 링크
  links.push(
    {
      title: 'MoCRA (화장품 규정 현대화법)',
      url: 'https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-mcra'
    },
    {
      title: 'CPSC 화장품 안전 규정',
      url: 'https://www.cpsc.gov/Business--Manufacturing/Business-Education/Business-Guidance/Cosmetics'
    }
  );

  return links;
};

const getProductClassification = (hsCode: string): string => {
  if (hsCode.startsWith('3304')) {
    return '화장품 (Cosmetics)로 분류';
  } else if (hsCode.startsWith('3305')) {
    return '헤어케어 제품 (Hair Care Products)로 분류';
  } else if (hsCode.startsWith('3307')) {
    return '향수 (Perfumes)로 분류';
  }
  return '건강기능식품 (Dietary Supplement)로 분류';
};

const getLabelingRequirements = (hsCode: string): string => {
  if (hsCode.startsWith('3304')) {
    return '화장품 라벨링 규정 및 성분 표시 규정 준수';
  } else if (hsCode.startsWith('3305')) {
    return '헤어케어 제품 라벨링 및 성분 공개 규정 준수';
  } else if (hsCode.startsWith('3307')) {
    return '향수 라벨링 및 알레르기 성분 표시 규정 준수';
  }
  return '영양성분표 및 건강기능 표시 규정 준수';
};

const getAdditionalTests = (hsCode: string): string => {
  if (hsCode.startsWith('3304')) {
    return '중금속, 농약 잔류물질, 색소 안전성 검사 권장';
  } else if (hsCode.startsWith('3305')) {
    return 'pH, 중금속, 농약 잔류물질 검사 권장';
  } else if (hsCode.startsWith('3307')) {
    return '알레르기 성분, 중금속, 농약 잔류물질 검사 권장';
  }
  return '중금속, 농약 잔류물질 검사 권장';
};

const RequirementsAnalysisCard: React.FC<RequirementsAnalysisCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-secondary from-accent-cream to-secondary p-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <FileText size={18} className="text-primary" />
        </div>
        <div className="text-lg font-semibold text-text-primary">수입 요건 분석</div>
      </div>
      <div className="p-6">
        {product.loading ? (
          <div className="text-center py-10 text-text-secondary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p>AI가 수입 요건을 분석하고 있습니다...</p>
          </div>
        ) : product.analysisComplete && product.requirementAnalysis ? (
          <div className="space-y-4">
            {/* 분석 상태 표시 */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.requirementAnalysis.isValid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.requirementAnalysis.isValid ? '분석 완료' : '분석 필요'}
              </div>
              <div className="text-sm text-text-secondary">
                신뢰도: {(product.requirementAnalysis.confidenceScore * 100).toFixed(1)}%
              </div>
            </div>

            {/* 상세 설명 (원본 내용 복원) */}
            <div className="text-text-primary leading-relaxed mb-4">
              <strong>FDA 규정 준수 필요</strong><br/><br/>
              1. <strong>시설 등록:</strong> FDA에 제조시설 등록 필요<br/>
              2. <strong>제품 분류:</strong> {getProductClassification(product.requirementAnalysis.hsCode)}<br/>
              3. <strong>라벨링 요건:</strong> {getLabelingRequirements(product.requirementAnalysis.hsCode)}<br/>
              4. <strong>Good Manufacturing Practice (GMP)</strong> 인증 필요<br/><br/>
              <strong>추가 검사:</strong> {getAdditionalTests(product.requirementAnalysis.hsCode)}
            </div>

            {/* API 데이터 기반 체크리스트 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-text-primary mb-3">상세 요구사항 체크리스트</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {product.requirementAnalysis.fdaRegistration ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                  <span className="text-sm">FDA 등록</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {product.requirementAnalysis.cosmeticFacilityRegistration ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                  <span className="text-sm">화장품 시설 등록</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {product.requirementAnalysis.ingredientSafety ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                  <span className="text-sm">원료 안전성</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {product.requirementAnalysis.labelingCompliance ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                  <span className="text-sm">라벨링 규정 준수</span>
                </div>
                
                {product.requirementAnalysis.colorAdditiveApproval && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm">색소 첨가물 승인</span>
                  </div>
                )}
                
                {product.requirementAnalysis.safetyTesting && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm">안전성 테스트</span>
                  </div>
                )}
                
                {product.requirementAnalysis.phTesting && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm">pH 테스트</span>
                  </div>
                )}
                
                {product.requirementAnalysis.sensitiveSkinTesting && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm">민감성 피부 테스트</span>
                  </div>
                )}
                
                {product.requirementAnalysis.uvSafety && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm">UV 안전성</span>
                  </div>
                )}
                
                {product.requirementAnalysis.sulfateFreeClaim && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm">Sulfate Free 주장</span>
                  </div>
                )}
              </div>
            </div>

            {/* 추가 문서 요구사항 */}
            {product.requirementAnalysis.additionalDocs.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-text-primary mb-3">추가 필요 문서</h4>
                <div className="flex flex-wrap gap-2">
                  {product.requirementAnalysis.additionalDocs.map((doc, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 외부 링크 */}
            <div className="pt-4 border-t border-gray-200">
              {getExternalLinks(product.requirementAnalysis.hsCode).map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm flex items-center gap-2 hover:underline mb-2"
                >
                  <ExternalLink size={14} />
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <AlertCircle size={24} className="mx-auto mb-3 text-gray-400" />
            <p>요구사항 분석 데이터를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementsAnalysisCard;
