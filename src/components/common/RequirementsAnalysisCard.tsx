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

            {/* 핵심 조치사항 */}
            {(product.requirementAnalysis.criticalActions?.length ?? 0) > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  핵심 조치사항
                </h4>
                <div className="space-y-2">
                  {(product.requirementAnalysis.criticalActions ?? []).map((action, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-800">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 브로커 거절 사유 */}
            {product.requirementAnalysis.brokerRejectionReason && (
              <div className="mb-6">
                <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" />
                  브로커 거절 사유
                </h4>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{product.requirementAnalysis.brokerRejectionReason}</p>
                </div>
              </div>
            )}

            {/* 필수 문서 목록 */}
            {(product.requirementAnalysis.requiredDocuments?.length ?? 0) > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  필수 문서 목록
                </h4>
                <div className="space-y-2">
                  {(product.requirementAnalysis.requiredDocuments ?? []).map((doc, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 준수 단계 */}
            {(product.requirementAnalysis.complianceSteps?.length ?? 0) > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  준수 단계
                </h4>
                <div className="space-y-3">
                  {(product.requirementAnalysis.complianceSteps ?? []).map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-green-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 타임라인 및 기타 정보 */}
            <div className="space-y-4">
              {product.requirementAnalysis.timeline && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-1">예상 소요 시간</h5>
                  <p className="text-sm text-yellow-700">{product.requirementAnalysis.timeline}</p>
                </div>
              )}

              {product.requirementAnalysis.criticalDeadline && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h5 className="font-medium text-red-800 mb-1">중요 마감일</h5>
                  <p className="text-sm text-red-700">{product.requirementAnalysis.criticalDeadline}</p>
                </div>
              )}

              {product.requirementAnalysis.qualityStandards && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-1">품질 기준</h5>
                  <p className="text-sm text-blue-700">{product.requirementAnalysis.qualityStandards}</p>
                </div>
              )}

              {product.requirementAnalysis.coldChainRequirement && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-medium text-purple-800 mb-1">냉장 유통 요구사항</h5>
                  <p className="text-sm text-purple-700">{product.requirementAnalysis.coldChainRequirement}</p>
                </div>
              )}

              {product.requirementAnalysis.criticalWarning && (
                <div className="p-3 bg-red-100 border-2 border-red-300 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-1 flex items-center gap-2">
                    <AlertCircle size={16} />
                    중요 경고
                  </h5>
                  <p className="text-sm text-red-800">{product.requirementAnalysis.criticalWarning}</p>
                </div>
              )}

              {product.requirementAnalysis.pendingAnalysis && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h5 className="font-medium text-orange-800 mb-1">진행 중인 분석</h5>
                  <p className="text-sm text-orange-700">{product.requirementAnalysis.pendingAnalysis}</p>
                </div>
              )}
            </div>

            {/* 외부 링크 */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-text-primary mb-3">관련 링크</h4>
              <div className="space-y-2">
                {(product.requirementAnalysis.sources ?? []).map((source, index) => (
                  <a 
                    key={index}
                    href={source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
                  >
                    <ExternalLink size={14} />
                    {source}
                  </a>
                ))}
              </div>
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
