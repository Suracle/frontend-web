/**
 * 요구사항 분석 카드 컴포넌트
 * 
 * 이 컴포넌트는 AI 엔진에서 분석한 수입 요건을 시각화합니다.
 * 
 * 주요 섹션 (아코디언):
 * 1. 핵심 조치사항 (Critical Actions) - 필수 규정
 * 2. 필수 문서 목록 (Required Documents) - 제출 서류
 * 3. 준수 단계 (Compliance Steps) - 순차적 절차
 * 4. 위험 요소 (Risk Factors) - 위험도 평가
 * 5. 예상 비용 (Estimated Costs) - 비용 항목별 분석
 * 6. 권장사항 (Recommendations) - 전문가 조언
 * 7. 상세 타임라인 (Timeline Detail) - 최소/일반/최대 소요일
 * 8. 라벨링 요구사항 (Labeling Requirements) - 라벨 규정
 * 9. 테스트 요구사항 (Testing Requirements) - 시험 검사
 * 10. 금지/제한 물질 (Prohibited/Restricted Substances) - 성분 규제
 * 11. 사전 통지 (Prior Notifications) - 사전 제출 요건
 * 
 * 특징:
 * - 출처 링크 포함 (source_url) - 각 항목마다 공식 출처 연결
 * - 신뢰도 점수 표시 (confidence_score)
 * - 기본적으로 핵심 조치사항만 펼쳐짐
 * 
 * @param product - 상품 정보 및 요건 분석 결과
 */
import React, { useState } from 'react';
import { FileText, ExternalLink, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, TrendingUp, DollarSign, Lightbulb, Clock, Globe, AlertTriangle, CheckSquare } from 'lucide-react';
import type { RequirementAnalysisResponse } from '@/api/requirementApi';

interface RequirementsAnalysisCardProps {
  product: {
    analysisComplete: boolean;
    requirementAnalysis?: RequirementAnalysisResponse;
    loading?: boolean;
  };
}



const RequirementsAnalysisCard: React.FC<RequirementsAnalysisCardProps> = ({ product }) => {
  // 아코디언 섹션 상태 관리 (기본값: 'critical'만 펼침)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['critical']));

  /**
   * 아코디언 섹션 토글
   * @param section - 섹션 ID (critical, documents, steps, risks, costs, recommendations, timeline, labeling, testing, substances, notifications)
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

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
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✓ 분석 완료
              </div>
              <div className="text-sm text-text-secondary">
                신뢰도: {(product.requirementAnalysis.confidenceScore * 100).toFixed(1)}%
              </div>
              {product.requirementAnalysis.lastUpdated && (
                <div className="text-xs text-text-tertiary ml-auto">
                  마지막 업데이트: {new Date(product.requirementAnalysis.lastUpdated).toLocaleDateString('ko-KR')}
                </div>
              )}
            </div>

            {/* 핵심 조치사항 */}
            {(product.requirementAnalysis.criticalActions?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('critical')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <h4 className="font-semibold text-text-primary">핵심 조치사항</h4>
                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.criticalActions?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('critical') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('critical') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.criticalActions ?? []).map((action, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg hover:bg-red-100 transition-colors">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <span className="text-sm text-red-800">
                          {typeof action === 'string' 
                            ? action 
                            : (action.requirement_ko || action.action_ko || action.requirement || action.action)}
                        </span>
                        {(typeof action === 'object' && action.effective_date) && (
                          <div className="text-xs text-red-600 mt-1">발효일: {action.effective_date}</div>
                        )}
                        {(typeof action === 'object' && action.severity) && (
                          <div className="text-xs text-red-700 mt-1">
                            <span className={`px-2 py-0.5 rounded ${action.severity === 'mandatory' ? 'bg-red-200' : 'bg-orange-200'}`}>
                              {action.severity === 'mandatory' ? '필수' : '권장'}
                            </span>
                          </div>
                        )}
                      </div>
                      {(typeof action === 'object' && action.source_url) && (
                        <a
                          href={action.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-red-200 hover:bg-red-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-red-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
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
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('documents')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    <h4 className="font-semibold text-text-primary">필수 문서 목록</h4>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.requiredDocuments?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('documents') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('documents') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.requiredDocuments ?? []).map((doc, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg hover:bg-blue-100 transition-colors">
                      <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-sm text-blue-800">
                          {typeof doc === 'string' ? doc : (doc.document_ko || doc.document)}
                        </span>
                        {(typeof doc === 'object' && (doc.issuing_authority_ko || doc.issuing_authority)) && (
                          <div className="text-xs text-blue-600 mt-1">
                            발급기관: {doc.issuing_authority_ko || doc.issuing_authority}
                          </div>
                        )}
                        {(typeof doc === 'object' && (doc.estimated_time_ko || doc.estimated_time)) && (
                          <div className="text-xs text-blue-600 mt-1">
                            소요시간: {doc.estimated_time_ko || doc.estimated_time}
                          </div>
                        )}
                      </div>
                      {(typeof doc === 'object' && doc.source_url) && (
                        <a
                          href={doc.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-blue-200 hover:bg-blue-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-blue-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 준수 단계 */}
            {(product.requirementAnalysis.complianceSteps?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('steps')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <h4 className="font-semibold text-text-primary">준수 단계</h4>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.complianceSteps?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('steps') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('steps') && (
                  <div className="p-4 space-y-3 bg-white">
                  {(product.requirementAnalysis.complianceSteps ?? []).map((step, index) => (
                    <div key={index} className="relative group flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {typeof step === 'object' ? step.step : index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-green-800">
                          {typeof step === 'string' ? step : (step.action_ko || step.action)}
                        </span>
                        {(typeof step === 'object' && (step.responsible_party_ko || step.responsible_party)) && (
                          <div className="text-xs text-green-600 mt-1">
                            담당: {step.responsible_party_ko || step.responsible_party}
                          </div>
                        )}
                        {(typeof step === 'object' && (step.estimated_duration_ko || step.estimated_duration)) && (
                          <div className="text-xs text-green-600 mt-1">
                            소요: {step.estimated_duration_ko || step.estimated_duration}
                          </div>
                        )}
                      </div>
                      {(typeof step === 'object' && step.source_url) && (
                        <a
                          href={step.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-green-200 hover:bg-green-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-green-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 위험 요소 */}
            {(product.requirementAnalysis.riskFactors?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('risks')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-orange-500" />
                    <h4 className="font-semibold text-text-primary">위험 요소</h4>
                    <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.riskFactors?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('risks') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('risks') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.riskFactors ?? []).map((risk, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg hover:bg-orange-100 transition-colors">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-orange-900">{risk.risk_ko || risk.risk}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            risk.impact === 'high' ? 'bg-red-200 text-red-800' : 
                            risk.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
                            'bg-green-200 text-green-800'
                          }`}>
                            영향도: {risk.impact === 'high' ? '높음' : risk.impact === 'medium' ? '중간' : '낮음'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            risk.likelihood === 'high' ? 'bg-red-200 text-red-800' : 
                            risk.likelihood === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
                            'bg-green-200 text-green-800'
                          }`}>
                            발생가능성: {risk.likelihood === 'high' ? '높음' : risk.likelihood === 'medium' ? '중간' : '낮음'}
                          </span>
                        </div>
                        {(risk.mitigation_ko || risk.mitigation) && (
                          <div className="text-xs text-orange-700 mt-2">
                            <span className="font-semibold">완화방안:</span> {risk.mitigation_ko || risk.mitigation}
                          </div>
                        )}
                      </div>
                      {risk.source_url && (
                        <a
                          href={risk.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-orange-200 hover:bg-orange-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-orange-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 예상 비용 */}
            {product.requirementAnalysis.estimatedCosts && product.requirementAnalysis.estimatedCosts.total && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('costs')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-teal-50 hover:bg-teal-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-teal-500" />
                    <h4 className="font-semibold text-text-primary">예상 비용</h4>
                    <span className="px-2 py-0.5 bg-teal-200 text-teal-800 text-xs rounded-full font-medium">
                      ${product.requirementAnalysis.estimatedCosts.total.min?.toLocaleString() || 'N/A'} - ${product.requirementAnalysis.estimatedCosts.total.max?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  {expandedSections.has('costs') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('costs') && (
                  <div className="p-4 bg-white">
                    <div className="space-y-3">
                      {/* 총 비용 */}
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-teal-900">총 예상 비용</span>
                          <span className="text-lg font-bold text-teal-700">
                            ${product.requirementAnalysis.estimatedCosts.total.min?.toLocaleString() || 'N/A'} - ${product.requirementAnalysis.estimatedCosts.total.max?.toLocaleString() || 'N/A'} {product.requirementAnalysis.estimatedCosts.total.currency || 'USD'}
                          </span>
                        </div>
                        {(product.requirementAnalysis.estimatedCosts as any).notes && (
                          <div className="text-xs text-teal-600 mt-2">
                            💡 {(product.requirementAnalysis.estimatedCosts as any).notes}
                          </div>
                        )}
                      </div>

                      {/* 세부 비용 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {product.requirementAnalysis.estimatedCosts.testing && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-xs text-blue-600 mb-1">테스트 비용</div>
                            <div className="font-semibold text-blue-900">
                              ${product.requirementAnalysis.estimatedCosts.testing.min?.toLocaleString() || 'N/A'} - ${product.requirementAnalysis.estimatedCosts.testing.max?.toLocaleString() || 'N/A'}
                            </div>
                            {(product.requirementAnalysis.estimatedCosts.testing as any).reasoning && (
                              <div className="text-xs text-blue-700 mt-1">
                                {(product.requirementAnalysis.estimatedCosts.testing as any).reasoning}
                              </div>
                            )}
                            {product.requirementAnalysis.estimatedCosts.testing.source_url && (
                              <a
                                href={product.requirementAnalysis.estimatedCosts.testing.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                              >
                                <ExternalLink size={10} />
                                출처
                              </a>
                            )}
                          </div>
                        )}

                        {product.requirementAnalysis.estimatedCosts.legal_review && (
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="text-xs text-purple-600 mb-1">법률 검토</div>
                            <div className="font-semibold text-purple-900">
                              ${product.requirementAnalysis.estimatedCosts.legal_review.min?.toLocaleString() || 'N/A'} - ${product.requirementAnalysis.estimatedCosts.legal_review.max?.toLocaleString() || 'N/A'}
                            </div>
                            {(product.requirementAnalysis.estimatedCosts.legal_review as any).reasoning && (
                              <div className="text-xs text-purple-700 mt-1">
                                {(product.requirementAnalysis.estimatedCosts.legal_review as any).reasoning}
                              </div>
                            )}
                            {product.requirementAnalysis.estimatedCosts.legal_review.source_url && (
                              <a
                                href={product.requirementAnalysis.estimatedCosts.legal_review.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 hover:underline mt-1 inline-flex items-center gap-1"
                              >
                                <ExternalLink size={10} />
                                출처
                              </a>
                            )}
                          </div>
                        )}

                        {product.requirementAnalysis.estimatedCosts.certification && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-xs text-green-600 mb-1">인증 비용</div>
                            <div className="font-semibold text-green-900">
                              ${product.requirementAnalysis.estimatedCosts.certification.min?.toLocaleString() || 'N/A'} - ${product.requirementAnalysis.estimatedCosts.certification.max?.toLocaleString() || 'N/A'}
                            </div>
                            {(product.requirementAnalysis.estimatedCosts.certification as any).reasoning && (
                              <div className="text-xs text-green-700 mt-1">
                                {(product.requirementAnalysis.estimatedCosts.certification as any).reasoning}
                              </div>
                            )}
                            {product.requirementAnalysis.estimatedCosts.certification.source_url && (
                              <a
                                href={product.requirementAnalysis.estimatedCosts.certification.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:underline mt-1 inline-flex items-center gap-1"
                              >
                                <ExternalLink size={10} />
                                출처
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {product.requirementAnalysis.estimatedCosts.notes && (
                        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          💡 {product.requirementAnalysis.estimatedCosts.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 권장사항 */}
            {(product.requirementAnalysis.recommendations?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('recommendations')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-violet-50 hover:bg-violet-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb size={16} className="text-violet-500" />
                    <h4 className="font-semibold text-text-primary">전문가 권장사항</h4>
                    <span className="px-2 py-0.5 bg-violet-200 text-violet-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.recommendations?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('recommendations') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('recommendations') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.recommendations ?? []).map((rec, index) => (
                    <div key={index} className="relative group flex items-start gap-3 p-3 bg-violet-50 border-l-4 border-violet-400 rounded-r-lg hover:bg-violet-100 transition-colors">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        rec.priority === 'high' ? 'bg-red-500' : 
                        rec.priority === 'medium' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}>
                        <Lightbulb size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            rec.priority === 'high' ? 'bg-red-200 text-red-800' : 
                            rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
                            'bg-green-200 text-green-800'
                          }`}>
                            {rec.priority === 'high' ? '높은 우선순위' : rec.priority === 'medium' ? '중간 우선순위' : '낮은 우선순위'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-violet-900 mb-1">
                          {rec.recommendation_ko || rec.recommendation}
                        </div>
                        <div className="text-xs text-violet-700">
                          <span className="font-semibold">이유:</span> {rec.rationale_ko || rec.rationale}
                        </div>
                      </div>
                      {rec.source_url && (
                        <a
                          href={rec.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-violet-200 hover:bg-violet-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-violet-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 상세 타임라인 */}
            {product.requirementAnalysis.timelineDetail && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('timeline')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-cyan-500" />
                    <h4 className="font-semibold text-text-primary">상세 타임라인</h4>
                    <span className="px-2 py-0.5 bg-cyan-200 text-cyan-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.timelineDetail.typical_days}일 소요 예상
                    </span>
                  </div>
                  {expandedSections.has('timeline') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('timeline') && (
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                        <div className="text-xs text-green-600 mb-1">최소</div>
                        <div className="text-2xl font-bold text-green-700">{product.requirementAnalysis.timelineDetail.minimum_days}</div>
                        <div className="text-xs text-green-600">일</div>
                      </div>
                      <div className="p-3 bg-cyan-50 border-2 border-cyan-300 rounded-lg text-center">
                        <div className="text-xs text-cyan-600 mb-1">일반적</div>
                        <div className="text-2xl font-bold text-cyan-700">{product.requirementAnalysis.timelineDetail.typical_days}</div>
                        <div className="text-xs text-cyan-600">일</div>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                        <div className="text-xs text-orange-600 mb-1">최대</div>
                        <div className="text-2xl font-bold text-orange-700">{product.requirementAnalysis.timelineDetail.maximum_days}</div>
                        <div className="text-xs text-orange-600">일</div>
                      </div>
                    </div>
                    {(product.requirementAnalysis.timelineDetail.critical_path?.length ?? 0) > 0 && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-xs font-semibold text-gray-700 mb-2">주요 경로 (Critical Path)</div>
                        <div className="space-y-1">
                          {(product.requirementAnalysis.timelineDetail.critical_path ?? []).map((path, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                              <div className="w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              {path}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(product.requirementAnalysis.timelineDetail as any).reasoning && (
                      <div className="text-xs text-cyan-700 p-2 bg-cyan-100 rounded mt-3">
                        📊 {(product.requirementAnalysis.timelineDetail as any).reasoning}
                      </div>
                    )}
                    {product.requirementAnalysis.timelineDetail.source_url && (
                      <a
                        href={product.requirementAnalysis.timelineDetail.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-600 hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        <ExternalLink size={10} />
                        타임라인 출처 보기
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 기타 정보 */}
            <div className="space-y-4">

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

            </div>

            {/* 라벨링 요구사항 */}
            {(product.requirementAnalysis.labelingRequirements?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('labeling')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-500" />
                    <h4 className="font-semibold text-text-primary">라벨링 요구사항</h4>
                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.labelingRequirements?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('labeling') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('labeling') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.labelingRequirements ?? []).map((label, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg hover:bg-purple-100 transition-colors">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-purple-900">{label.element}</div>
                        <div className="text-xs text-purple-700 mt-1">{label.requirement}</div>
                        {label.agency && <div className="text-xs text-purple-600 mt-1">기관: {label.agency}</div>}
                      </div>
                      {label.source_url && (
                        <a
                          href={label.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-purple-200 hover:bg-purple-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-purple-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 테스트 요구사항 */}
            {(product.requirementAnalysis.testingRequirements?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('testing')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-indigo-500" />
                    <h4 className="font-semibold text-text-primary">테스트 요구사항</h4>
                    <span className="px-2 py-0.5 bg-indigo-200 text-indigo-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.testingRequirements?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('testing') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('testing') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.testingRequirements ?? []).map((test, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg hover:bg-indigo-100 transition-colors">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-indigo-900">{test.test}</div>
                        {test.required_by && <div className="text-xs text-indigo-700 mt-1">요구기관: {test.required_by}</div>}
                        {test.frequency && <div className="text-xs text-indigo-600 mt-1">주기: {test.frequency}</div>}
                        {test.cost_per_test && (
                          <div className="text-xs text-indigo-600 mt-1">
                            비용: ${test.cost_per_test.min}-${test.cost_per_test.max}
                          </div>
                        )}
                      </div>
                      {test.source_url && (
                        <a
                          href={test.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-indigo-200 hover:bg-indigo-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-indigo-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 금지/제한 물질 */}
            {(product.requirementAnalysis.prohibitedRestrictedSubstances?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('substances')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-500" />
                    <h4 className="font-semibold text-text-primary">금지/제한 물질</h4>
                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.prohibitedRestrictedSubstances?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('substances') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('substances') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.prohibitedRestrictedSubstances ?? []).map((substance, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg hover:bg-red-100 transition-colors">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-900">{substance.substance}</div>
                        <div className="text-xs text-red-700 mt-1">
                          상태: <span className="font-semibold">{substance.status === 'prohibited' ? '금지' : '제한'}</span>
                          {substance.max_concentration && ` (최대 ${substance.max_concentration})`}
                        </div>
                        {substance.alternatives && substance.alternatives.length > 0 && (
                          <div className="text-xs text-red-600 mt-1">대안: {substance.alternatives.join(', ')}</div>
                        )}
                      </div>
                      {substance.source_url && (
                        <a
                          href={substance.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-red-200 hover:bg-red-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-red-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 면제 규정 */}
            {(product.requirementAnalysis.exemptions?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('exemptions')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <h4 className="font-semibold text-text-primary">면제 규정 및 특별 조건</h4>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.exemptions?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('exemptions') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('exemptions') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.exemptions ?? []).map((exemption, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg hover:bg-green-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded font-medium">
                            {exemption.exemption_type}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-green-900 mb-1">
                          조건: {exemption.condition_ko || exemption.condition}
                        </div>
                        <div className="text-xs text-green-700 mb-1">
                          <span className="font-semibold">면제 항목:</span>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            {exemption.exempted_from_ko ? 
                              exemption.exempted_from_ko.map((item, i) => (
                                <li key={i}>{item}</li>
                              )) :
                              exemption.exempted_from.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))
                            }
                          </ul>
                        </div>
                        {(exemption.limitations_ko || exemption.limitations) && (
                          <div className="text-xs text-orange-600 mt-2 p-2 bg-orange-50 rounded">
                            <span className="font-semibold">⚠️ 제한사항:</span> {exemption.limitations_ko || exemption.limitations}
                          </div>
                        )}
                        {(exemption.how_to_claim_ko || exemption.how_to_claim) && (
                          <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded">
                            <span className="font-semibold">📋 신청 방법:</span> {exemption.how_to_claim_ko || exemption.how_to_claim}
                          </div>
                        )}
                        {(exemption.notes_ko || exemption.notes) && (
                          <div className="text-xs text-gray-600 mt-2">
                            💡 {exemption.notes_ko || exemption.notes}
                          </div>
                        )}
                      </div>
                      {exemption.source_url && (
                        <a
                          href={exemption.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-green-200 hover:bg-green-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-green-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* 사전 통지 */}
            {(product.requirementAnalysis.priorNotifications?.length ?? 0) > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('notifications')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-orange-500" />
                    <h4 className="font-semibold text-text-primary">사전 통지 요구사항</h4>
                    <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.priorNotifications?.length ?? 0}
                    </span>
                  </div>
                  {expandedSections.has('notifications') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('notifications') && (
                  <div className="p-4 space-y-2 bg-white">
                  {(product.requirementAnalysis.priorNotifications ?? []).map((notice, index) => (
                    <div key={index} className="relative group flex items-start gap-2 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg hover:bg-orange-100 transition-colors">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-orange-900">{notice.type}</div>
                        {notice.deadline && <div className="text-xs text-orange-700 mt-1">마감: {notice.deadline}</div>}
                        {notice.submission_method && <div className="text-xs text-orange-600 mt-1">제출방법: {notice.submission_method}</div>}
                        {notice.consequences_if_missed && (
                          <div className="text-xs text-red-600 mt-1 font-medium">⚠️ {notice.consequences_if_missed}</div>
                        )}
                      </div>
                      {notice.source_url && (
                        <a
                          href={notice.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 bg-orange-200 hover:bg-orange-300 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:scale-110"
                          title="출처 보기"
                        >
                          <ExternalLink size={12} className="text-orange-700" />
                        </a>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== 확장 필드 섹션 (신규 - 2025-10-12) ==================== */}
            
            {/* 1. 실행 체크리스트 (Execution Checklist) */}
            {product.requirementAnalysis.executionChecklist && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('executionChecklist')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <h4 className="font-semibold text-text-primary">실행 체크리스트</h4>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-xs rounded-full font-medium">
                      {(product.requirementAnalysis.executionChecklist.pre_import?.length || 0) +
                       (product.requirementAnalysis.executionChecklist.during_import?.length || 0) +
                       (product.requirementAnalysis.executionChecklist.post_import?.length || 0)}개
                    </span>
                  </div>
                  {expandedSections.has('executionChecklist') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('executionChecklist') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 수입 전 (Pre-Import) */}
                    {product.requirementAnalysis.executionChecklist.pre_import && 
                     product.requirementAnalysis.executionChecklist.pre_import.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                          📋 수입 전 (Pre-Import)
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.executionChecklist.pre_import.map((task: any, index: number) => (
                            <div key={index} className="p-3 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-emerald-900">{task.task_ko || task.task}</div>
                                  <div className="text-xs text-emerald-700 mt-1">
                                    <span className="font-semibold">담당:</span> {task.responsible_ko || task.responsible}
                                  </div>
                                  <div className="text-xs text-emerald-700 mt-1">
                                    <span className="font-semibold">마감:</span> {task.deadline_ko || task.deadline}
                                  </div>
                                  <div className="text-xs text-emerald-700 mt-1">
                                    <span className="font-semibold">예상시간:</span> {task.estimated_hours}시간
                                  </div>
                                  {task.success_criteria && (
                                    <div className="text-xs text-emerald-600 mt-2 p-2 bg-emerald-100 rounded">
                                      ✅ {task.success_criteria_ko || task.success_criteria}
                                    </div>
                                  )}
                                </div>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  task.priority === 'high' ? 'bg-red-200 text-red-800' :
                                  task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                  'bg-green-200 text-green-800'
                                }`}>
                                  {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 수입 중 (During-Import) */}
                    {product.requirementAnalysis.executionChecklist.during_import && 
                     product.requirementAnalysis.executionChecklist.during_import.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          🚢 수입 중 (During-Import)
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.executionChecklist.during_import.map((task: any, index: number) => (
                            <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                              <div className="font-medium text-blue-900">{task.task_ko || task.task}</div>
                              <div className="text-xs text-blue-700 mt-1">
                                <span className="font-semibold">타이밍:</span> {task.timing_ko || task.timing}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 수입 후 (Post-Import) */}
                    {product.requirementAnalysis.executionChecklist.post_import && 
                     product.requirementAnalysis.executionChecklist.post_import.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          📦 수입 후 (Post-Import)
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.executionChecklist.post_import.map((task: any, index: number) => (
                            <div key={index} className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                              <div className="font-medium text-purple-900">{task.task_ko || task.task}</div>
                              <div className="text-xs text-purple-700 mt-1">
                                <span className="font-semibold">마감:</span> {task.deadline}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. 비용 분석 (Cost Breakdown) */}
            {product.requirementAnalysis.costBreakdown && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('costBreakdown')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-amber-500" />
                    <h4 className="font-semibold text-text-primary">상세 비용 분석</h4>
                  </div>
                  {expandedSections.has('costBreakdown') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('costBreakdown') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 필수 비용 */}
                    {product.requirementAnalysis.costBreakdown.mandatory_costs && 
                     Object.keys(product.requirementAnalysis.costBreakdown.mandatory_costs).length > 0 && (
                      <div>
                        <h5 className="font-semibold text-red-900 mb-2">💰 필수 비용</h5>
                        <div className="space-y-2">
                          {Object.entries(product.requirementAnalysis.costBreakdown.mandatory_costs).map(([key, cost]: [string, any]) => (
                            <div key={key} className="p-2 bg-red-50 border border-red-200 rounded">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-red-900 capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="text-sm font-bold text-red-700">
                                  ${cost.min?.toLocaleString()} - ${cost.max?.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-xs text-red-600 mt-1">빈도: {cost.frequency}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 선택 비용 */}
                    {product.requirementAnalysis.costBreakdown.optional_costs && 
                     Object.keys(product.requirementAnalysis.costBreakdown.optional_costs).length > 0 && (
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2">💡 선택 비용</h5>
                        <div className="space-y-2">
                          {Object.entries(product.requirementAnalysis.costBreakdown.optional_costs).map(([key, cost]: [string, any]) => (
                            <div key={key} className="p-2 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-900 capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="text-sm font-bold text-blue-700">
                                  ${cost.min?.toLocaleString()} - ${cost.max?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 숨겨진 비용 */}
                    {product.requirementAnalysis.costBreakdown.hidden_costs && 
                     Object.keys(product.requirementAnalysis.costBreakdown.hidden_costs).length > 0 && (
                      <div>
                        <h5 className="font-semibold text-orange-900 mb-2">⚠️ 숨겨진 비용</h5>
                        <div className="space-y-2">
                          {Object.entries(product.requirementAnalysis.costBreakdown.hidden_costs).map(([key, cost]: [string, any]) => (
                            <div key={key} className="p-2 bg-orange-50 border border-orange-200 rounded">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-orange-900 capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="text-sm font-bold text-orange-700">
                                  ${cost.min?.toLocaleString()} - ${cost.max?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 비용 최적화 */}
                    {product.requirementAnalysis.costBreakdown.cost_optimization && 
                     product.requirementAnalysis.costBreakdown.cost_optimization.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-green-900 mb-2">✨ 비용 최적화 전략</h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.costBreakdown.cost_optimization.map((strategy: any, index: number) => (
                            <div key={index} className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                              <div className="font-medium text-green-900">{strategy.strategy_ko || strategy.strategy}</div>
                              <div className="text-xs text-green-700 mt-1">
                                💰 절감액: {strategy.potential_savings_ko || strategy.potential_savings}
                              </div>
                              {strategy.trade_offs && (
                                <div className="text-xs text-orange-600 mt-1">
                                  ⚖️ Trade-offs: {strategy.trade_offs_ko || strategy.trade_offs}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. 리스크 매트릭스 (Risk Matrix) */}
            {product.requirementAnalysis.riskMatrix && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('riskMatrix')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-500" />
                    <h4 className="font-semibold text-text-primary">리스크 매트릭스</h4>
                    <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-xs rounded-full font-medium">
                      {(product.requirementAnalysis.riskMatrix.high_risk?.length || 0) +
                       (product.requirementAnalysis.riskMatrix.medium_risk?.length || 0)}개
                    </span>
                  </div>
                  {expandedSections.has('riskMatrix') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('riskMatrix') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 높은 리스크 */}
                    {product.requirementAnalysis.riskMatrix.high_risk && 
                     product.requirementAnalysis.riskMatrix.high_risk.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                          🚨 높은 리스크
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.riskMatrix.high_risk.map((risk: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                              <div className="font-medium text-red-900">{risk.risk_ko || risk.risk}</div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-0.5 bg-red-200 text-red-800 rounded">
                                  영향도: {risk.impact}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-orange-200 text-orange-800 rounded">
                                  확률: {risk.probability}
                                </span>
                              </div>
                              <div className="text-xs text-red-700 mt-2 p-2 bg-red-100 rounded">
                                <span className="font-semibold">🔍 감지방법:</span> {risk.detection_method_ko || risk.detection_method}
                              </div>
                              <div className="text-xs text-red-700 mt-2 p-2 bg-red-100 rounded">
                                <span className="font-semibold">🛡️ 비상계획:</span> {risk.contingency_plan_ko || risk.contingency_plan}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 중간 리스크 */}
                    {product.requirementAnalysis.riskMatrix.medium_risk && 
                     product.requirementAnalysis.riskMatrix.medium_risk.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                          ⚠️ 중간 리스크
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.riskMatrix.medium_risk.map((risk: any, index: number) => (
                            <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                              <div className="font-medium text-yellow-900">{risk.risk_ko || risk.risk}</div>
                              <div className="text-xs text-yellow-700 mt-1">
                                모니터링 빈도: {risk.monitoring_frequency_ko || risk.monitoring_frequency}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. 준수 점수 (Compliance Score) */}
            {product.requirementAnalysis.complianceScore && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('complianceScore')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" />
                    <h4 className="font-semibold text-text-primary">준수 점수</h4>
                    <span className="px-2 py-0.5 bg-indigo-200 text-indigo-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.complianceScore.overall_score}점
                    </span>
                  </div>
                  {expandedSections.has('complianceScore') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('complianceScore') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 전체 점수 */}
                    <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-lg text-center">
                      <div className="text-sm text-indigo-600 mb-2">전체 준수 점수</div>
                      <div className="text-4xl font-bold text-indigo-900">
                        {product.requirementAnalysis.complianceScore.overall_score}
                      </div>
                      <div className="text-xs text-indigo-700 mt-1">/ 100</div>
                    </div>
                    
                    {/* 카테고리별 점수 */}
                    {product.requirementAnalysis.complianceScore.category_scores && 
                     Object.keys(product.requirementAnalysis.complianceScore.category_scores).length > 0 && (
                      <div>
                        <h5 className="font-semibold text-indigo-900 mb-2">📊 카테고리별 점수</h5>
                        <div className="space-y-2">
                          {Object.entries(product.requirementAnalysis.complianceScore.category_scores).map(([category, data]: [string, any]) => {
                            const categoryNames: { [key: string]: string } = {
                              'documentation': '문서화',
                              'testing': '테스트',
                              'labeling': '라벨링',
                              'timeline': '타임라인',
                              'cost_efficiency': '비용 효율성'
                            };
                            return (
                            <div key={category} className="p-2 bg-indigo-50 rounded">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-indigo-900">
                                  {categoryNames[category] || category.replace(/_/g, ' ')}
                                </span>
                                <span className="text-sm font-bold text-indigo-700">
                                  {data.score} / {data.max_score}
                                </span>
                              </div>
                              <div className="w-full bg-indigo-200 rounded-full h-2 mb-1">
                                <div
                                  className="bg-indigo-500 h-2 rounded-full"
                                  style={{ width: `${(data.score / data.max_score) * 100}%` }}
                                ></div>
                              </div>
                              {data.reasoning && (
                                <div className="text-xs text-indigo-700 mt-1">
                                  💡 {data.reasoning}
                                </div>
                              )}
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* 개선 영역 */}
                    {product.requirementAnalysis.complianceScore.improvement_areas && 
                     product.requirementAnalysis.complianceScore.improvement_areas.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-orange-900 mb-2">🎯 개선 필요 영역</h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.complianceScore.improvement_areas.map((area: any, index: number) => (
                            <div key={index} className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                              <div className="font-medium text-orange-900">{area.area_ko || area.area}</div>
                              <div className="text-xs text-orange-700 mt-1">
                                <span className="font-semibold">현재 갭:</span> {area.current_gap_ko || area.current_gap}
                              </div>
                              <div className="text-xs text-orange-700 mt-1">
                                <span className="font-semibold">실행 계획:</span> {area.action_plan_ko || area.action_plan}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  area.priority === 'high' ? 'bg-red-200 text-red-800' :
                                  area.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                  'bg-green-200 text-green-800'
                                }`}>
                                  {area.priority === 'high' ? '높은 우선순위' : area.priority === 'medium' ? '중간 우선순위' : '낮은 우선순위'}
                                </span>
                                <span className="text-xs text-orange-600">
                                  예상 노력: {area.estimated_effort}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. 시장 접근 (Market Access) */}
            {product.requirementAnalysis.marketAccess && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('marketAccess')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-sky-50 hover:bg-sky-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-sky-500" />
                    <h4 className="font-semibold text-text-primary">시장 접근 요구사항</h4>
                    <span className="px-2 py-0.5 bg-sky-200 text-sky-800 text-xs rounded-full font-medium">
                      {(product.requirementAnalysis.marketAccess.retailer_requirements?.length || 0) +
                       (product.requirementAnalysis.marketAccess.state_regulations?.length || 0)}개
                    </span>
                  </div>
                  {expandedSections.has('marketAccess') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('marketAccess') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 판매처 요구사항 */}
                    {product.requirementAnalysis.marketAccess.retailer_requirements && 
                     product.requirementAnalysis.marketAccess.retailer_requirements.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          🏪 판매처 요구사항
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.marketAccess.retailer_requirements.map((req: any, index: number) => (
                            <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                              <div className="font-medium text-blue-900 mb-2">{req.retailer}</div>
                              <div className="text-xs text-blue-700 mb-1">
                                <span className="font-semibold">필요 인증:</span>
                                <ul className="list-disc list-inside ml-2 mt-1">
                                  {(req.certifications_needed_ko || req.certifications_needed).map((cert: string, i: number) => (
                                    <li key={i}>{cert}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-xs text-blue-700 mb-1">
                                <span className="font-semibold">특별 요구사항:</span>
                                <ul className="list-disc list-inside ml-2 mt-1">
                                  {(req.specific_requirements_ko || req.specific_requirements).map((spec: string, i: number) => (
                                    <li key={i}>{spec}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                마감: {req.compliance_deadline_ko || req.compliance_deadline}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 주(州) 규정 */}
                    {product.requirementAnalysis.marketAccess.state_regulations && 
                     product.requirementAnalysis.marketAccess.state_regulations.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          🗺️ 주(州)별 규정
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.marketAccess.state_regulations.map((reg: any, index: number) => (
                            <div key={index} className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                              <div className="font-medium text-purple-900 mb-1">{reg.state}</div>
                              <div className="text-xs text-purple-700 mb-1">
                                <span className="font-semibold">규정:</span> {reg.regulation_ko || reg.regulation}
                              </div>
                              <div className="text-xs text-purple-700 mb-1">
                                <span className="font-semibold">적용 대상:</span> {reg.applies_to_ko || reg.applies_to}
                              </div>
                              <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded">
                                <span className="font-semibold">⚠️ 벌금:</span> {reg.penalty_ko || reg.penalty}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== 판례 기반 검증 결과 (신규 - 2025-10-12) ==================== */}
            
            {/* 판례 기반 검증 결과 */}
            {product.requirementAnalysis.precedentValidation && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('precedentValidation')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-indigo-500" />
                    <h4 className="font-semibold text-text-primary">판례 기반 검증</h4>
                    <span className="px-2 py-0.5 bg-indigo-200 text-indigo-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.precedentValidation.precedents_analyzed}개 판례 분석
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                      product.requirementAnalysis.precedentValidation.verdict.status === 'APPROVED' ? 'bg-green-200 text-green-800' :
                      product.requirementAnalysis.precedentValidation.verdict.status === 'REVIEW_REQUIRED' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {product.requirementAnalysis.precedentValidation.verdict.status === 'APPROVED' ? '승인' :
                       product.requirementAnalysis.precedentValidation.verdict.status === 'REVIEW_REQUIRED' ? '검토 필요' : '고위험'}
                    </span>
                  </div>
                  {expandedSections.has('precedentValidation') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('precedentValidation') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 검증 점수 */}
                    <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-lg text-center">
                      <div className="text-sm text-indigo-600 mb-2">판례 검증 점수</div>
                      <div className="text-4xl font-bold text-indigo-900">
                        {(product.requirementAnalysis.precedentValidation.validation_score * 100).toFixed(1)}
                      </div>
                      <div className="text-xs text-indigo-700 mt-1">/ 100</div>
                    </div>
                    
                    {/* 매칭된 요구사항 */}
                    {product.requirementAnalysis.precedentValidation.matched_requirements && 
                     product.requirementAnalysis.precedentValidation.matched_requirements.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          ✅ 매칭된 요구사항 ({product.requirementAnalysis.precedentValidation.matched_requirements.length}개)
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.precedentValidation.matched_requirements.map((match: any, index: number) => (
                            <div key={index} className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                              <div className="font-medium text-green-900 mb-1">{match.requirement}</div>
                              <div className="text-xs text-green-700 mb-1">판례: {match.precedent_ruling}</div>
                              <div className="text-xs text-green-600">신뢰도: {(match.confidence * 100).toFixed(1)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 누락된 요구사항 */}
                    {product.requirementAnalysis.precedentValidation.missing_requirements && 
                     product.requirementAnalysis.precedentValidation.missing_requirements.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                          ❌ 누락된 요구사항 ({product.requirementAnalysis.precedentValidation.missing_requirements.length}개)
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.precedentValidation.missing_requirements.map((missing: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                              <div className="font-medium text-red-900 mb-1">{missing.requirement}</div>
                              <div className="text-xs text-red-700 mb-1">사유: {missing.reason}</div>
                              <div className={`text-xs px-2 py-0.5 rounded ${
                                missing.severity === 'high' ? 'bg-red-200 text-red-800' :
                                missing.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                심각도: {missing.severity === 'high' ? '높음' : missing.severity === 'medium' ? '중간' : '낮음'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Red Flags */}
                    {product.requirementAnalysis.precedentValidation.red_flags && 
                     product.requirementAnalysis.precedentValidation.red_flags.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                          🚨 Red Flags ({product.requirementAnalysis.precedentValidation.red_flags.length}개)
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.precedentValidation.red_flags.map((flag: any, index: number) => (
                            <div key={index} className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                              <div className="font-medium text-orange-900 mb-1">{flag.issue}</div>
                              <div className="text-xs text-orange-700 mb-1">{flag.description}</div>
                              <div className="text-xs text-orange-800 p-2 bg-orange-100 rounded">
                                <span className="font-semibold">권장사항:</span> {flag.recommendation}
                              </div>
                              <div className={`text-xs px-2 py-0.5 rounded mt-1 ${
                                flag.severity === 'HIGH' ? 'bg-red-200 text-red-800' :
                                flag.severity === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                심각도: {flag.severity}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 최종 판정 */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">📋 최종 판정</h5>
                      <div className="text-sm text-gray-800 mb-2">{product.requirementAnalysis.precedentValidation.verdict.reason}</div>
                      {product.requirementAnalysis.precedentValidation.verdict.action_items && 
                       product.requirementAnalysis.precedentValidation.verdict.action_items.length > 0 && (
                        <div className="text-xs text-gray-700">
                          <span className="font-semibold">액션 아이템:</span>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            {product.requirementAnalysis.precedentValidation.verdict.action_items.map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== Market Access (시장 접근성) ==================== */}
            {product.requirementAnalysis.llm_summary?.market_access && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('marketAccess')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-purple-500" />
                    <h4 className="font-semibold text-text-primary">시장 접근성</h4>
                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.market_access.state_regulations?.length || 0}개 주별 규정
                    </span>
                  </div>
                  {expandedSections.has('marketAccess') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('marketAccess') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 주별 규정 */}
                    {product.requirementAnalysis.llm_summary.market_access.state_regulations && 
                     product.requirementAnalysis.llm_summary.market_access.state_regulations.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          🏛️ 주별 규정
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.market_access.state_regulations.map((regulation: any, index: number) => (
                            <div key={index} className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                              <div className="font-medium text-purple-900 mb-1">{regulation.state}: {regulation.regulation}</div>
                              <div className="text-xs text-purple-700 mb-1">{regulation.regulation_ko}</div>
                              <div className="text-xs text-purple-600 mb-1">적용 대상: {regulation.applies_to_ko}</div>
                              <div className="text-xs text-purple-800 p-2 bg-purple-100 rounded">
                                <span className="font-semibold">위반 시:</span> {regulation.penalty_ko}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 리테일러 요구사항 */}
                    {product.requirementAnalysis.llm_summary.market_access.retailer_requirements && 
                     product.requirementAnalysis.llm_summary.market_access.retailer_requirements.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          🛒 리테일러 요구사항
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.market_access.retailer_requirements.map((retailer: any, index: number) => (
                            <div key={index} className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                              <div className="font-medium text-purple-900 mb-1">{retailer.retailer}</div>
                              <div className="text-xs text-purple-700 mb-1">
                                <span className="font-semibold">준수 마감일:</span> {retailer.compliance_deadline_ko}
                              </div>
                              <div className="text-xs text-purple-700 mb-1">
                                <span className="font-semibold">필요 인증서:</span> {retailer.certifications_needed_ko?.join(', ')}
                              </div>
                              <div className="text-xs text-purple-700">
                                <span className="font-semibold">특별 요구사항:</span> {retailer.specific_requirements_ko?.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Cost Breakdown (비용 세부 분석) ==================== */}
            {product.requirementAnalysis.llm_summary?.cost_breakdown && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('costBreakdown')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-500" />
                    <h4 className="font-semibold text-text-primary">비용 세부 분석</h4>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                      상세 비용 분석
                    </span>
                  </div>
                  {expandedSections.has('costBreakdown') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('costBreakdown') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 필수 비용 */}
                    {product.requirementAnalysis.llm_summary.cost_breakdown.mandatory_costs && (
                      <div>
                        <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                          🔴 필수 비용
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(product.requirementAnalysis.llm_summary.cost_breakdown.mandatory_costs).map(([key, cost]: [string, any]) => (
                            <div key={key} className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                              <div className="font-medium text-red-900 mb-1 capitalize">{key}</div>
                              <div className="text-xs text-red-700">
                                ${cost.min} - ${cost.max} {cost.currency} ({cost.frequency})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 선택적 비용 */}
                    {product.requirementAnalysis.llm_summary.cost_breakdown.optional_costs && (
                      <div>
                        <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                          🟡 선택적 비용
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(product.requirementAnalysis.llm_summary.cost_breakdown.optional_costs).map(([key, cost]: [string, any]) => (
                            <div key={key} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                              <div className="font-medium text-yellow-900 mb-1 capitalize">{key}</div>
                              <div className="text-xs text-yellow-700">
                                ${cost.min} - ${cost.max} {cost.currency} ({cost.frequency})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 숨겨진 비용 */}
                    {product.requirementAnalysis.llm_summary.cost_breakdown.hidden_costs && (
                      <div>
                        <h5 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                          🟠 숨겨진 비용
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(product.requirementAnalysis.llm_summary.cost_breakdown.hidden_costs).map(([key, cost]: [string, any]) => (
                            <div key={key} className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                              <div className="font-medium text-orange-900 mb-1 capitalize">{key}</div>
                              <div className="text-xs text-orange-700">
                                ${cost.min} - ${cost.max} {cost.currency} ({cost.frequency})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 비용 최적화 전략 */}
                    {product.requirementAnalysis.llm_summary.cost_breakdown.cost_optimization && 
                     product.requirementAnalysis.llm_summary.cost_breakdown.cost_optimization.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          💡 비용 최적화 전략
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.cost_breakdown.cost_optimization.map((strategy: any, index: number) => (
                            <div key={index} className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                              <div className="font-medium text-green-900 mb-1">{strategy.strategy_ko}</div>
                              <div className="text-xs text-green-700 mb-1">
                                <span className="font-semibold">절약 가능:</span> {strategy.potential_savings_ko}
                              </div>
                              <div className="text-xs text-green-800 p-2 bg-green-100 rounded">
                                <span className="font-semibold">주의사항:</span> {strategy.trade_offs_ko}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Risk Matrix (위험 매트릭스) ==================== */}
            {product.requirementAnalysis.llm_summary?.risk_matrix && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('riskMatrix')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <h4 className="font-semibold text-text-primary">위험 매트릭스</h4>
                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full font-medium">
                      위험 분석
                    </span>
                  </div>
                  {expandedSections.has('riskMatrix') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('riskMatrix') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 고위험 */}
                    {product.requirementAnalysis.llm_summary.risk_matrix.high_risk && 
                     product.requirementAnalysis.llm_summary.risk_matrix.high_risk.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                          🔴 고위험
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.risk_matrix.high_risk.map((risk: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                              <div className="font-medium text-red-900 mb-1">{risk.risk_ko}</div>
                              <div className="text-xs text-red-700 mb-1">
                                <span className="font-semibold">영향도:</span> {risk.impact}
                              </div>
                              <div className="text-xs text-red-700 mb-1">
                                <span className="font-semibold">확률:</span> {risk.probability}
                              </div>
                              <div className="text-xs text-red-700 mb-1">
                                <span className="font-semibold">감지 방법:</span> {risk.detection_method_ko}
                              </div>
                              <div className="text-xs text-red-800 p-2 bg-red-100 rounded">
                                <span className="font-semibold">대응 계획:</span> {risk.contingency_plan_ko}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 중위험 */}
                    {product.requirementAnalysis.llm_summary.risk_matrix.medium_risk && 
                     product.requirementAnalysis.llm_summary.risk_matrix.medium_risk.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                          🟡 중위험
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.risk_matrix.medium_risk.map((risk: any, index: number) => (
                            <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                              <div className="font-medium text-yellow-900 mb-1">{risk.risk_ko}</div>
                              <div className="text-xs text-yellow-700 mb-1">
                                <span className="font-semibold">영향도:</span> {risk.impact}
                              </div>
                              <div className="text-xs text-yellow-700 mb-1">
                                <span className="font-semibold">확률:</span> {risk.probability}
                              </div>
                              <div className="text-xs text-yellow-800 p-2 bg-yellow-100 rounded">
                                <span className="font-semibold">모니터링:</span> {risk.monitoring_frequency_ko}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Cross Validation (교차 검증) ==================== */}
            {product.requirementAnalysis.llm_summary?.cross_validation && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('crossValidation')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-teal-50 hover:bg-teal-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-teal-500" />
                    <h4 className="font-semibold text-text-primary">교차 검증</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      product.requirementAnalysis.llm_summary.cross_validation.validation_score >= 0.8
                        ? 'bg-green-200 text-green-800'
                        : product.requirementAnalysis.llm_summary.cross_validation.validation_score >= 0.5
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      검증 점수: {(product.requirementAnalysis.llm_summary.cross_validation.validation_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  {expandedSections.has('crossValidation') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('crossValidation') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 검증 점수 */}
                    <div className="p-4 bg-teal-50 border-2 border-teal-300 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-teal-600 font-semibold">검증 점수</div>
                        <div className="text-3xl font-bold text-teal-900">
                          {(product.requirementAnalysis.llm_summary.cross_validation.validation_score * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            product.requirementAnalysis.llm_summary.cross_validation.validation_score >= 0.8
                              ? 'bg-green-500'
                              : product.requirementAnalysis.llm_summary.cross_validation.validation_score >= 0.5
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${product.requirementAnalysis.llm_summary.cross_validation.validation_score * 100}%` }}
                        />
                      </div>
                      {product.requirementAnalysis.llm_summary.cross_validation.last_updated && (
                        <div className="text-xs text-teal-700 mt-2">
                          최종 업데이트: {new Date(product.requirementAnalysis.llm_summary.cross_validation.last_updated).toLocaleDateString('ko-KR')}
                        </div>
                      )}
                    </div>

                    {/* 충돌 발견 */}
                    {product.requirementAnalysis.llm_summary.cross_validation.conflicts_found && 
                     product.requirementAnalysis.llm_summary.cross_validation.conflicts_found.length > 0 ? (
                      <div>
                        <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                          ⚠️ 발견된 충돌 ({product.requirementAnalysis.llm_summary.cross_validation.conflicts_found.length}건)
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.cross_validation.conflicts_found.map((conflict: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                              <div className="font-medium text-red-900 mb-1">{conflict.description}</div>
                              {conflict.resolution && (
                                <div className="text-xs text-red-700 mt-1">
                                  <span className="font-semibold">해결 방안:</span> {conflict.resolution}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                        <div className="font-medium text-green-900 flex items-center gap-2">
                          ✅ 규정 간 충돌 없음
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          모든 요구사항이 일관성 있게 분석되었습니다.
                        </div>
                      </div>
                    )}

                    {/* 검증 권장사항 */}
                    {product.requirementAnalysis.llm_summary.cross_validation.recommendations && 
                     product.requirementAnalysis.llm_summary.cross_validation.recommendations.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                          💡 검증 권장사항
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.cross_validation.recommendations.map((recommendation: string, index: number) => (
                            <div key={index} className="p-3 bg-teal-50 border-l-4 border-teal-400 rounded-r-lg">
                              <div className="text-sm text-teal-900">{recommendation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Execution Checklist (실행 체크리스트) ==================== */}
            {product.requirementAnalysis.llm_summary?.execution_checklist && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('executionChecklist')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare size={16} className="text-blue-500" />
                    <h4 className="font-semibold text-text-primary">실행 체크리스트</h4>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full font-medium">
                      단계별 가이드
                    </span>
                  </div>
                  {expandedSections.has('executionChecklist') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('executionChecklist') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 수입 전 */}
                    {product.requirementAnalysis.llm_summary.execution_checklist.pre_import && 
                     product.requirementAnalysis.llm_summary.execution_checklist.pre_import.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          📋 수입 전 준비사항
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.execution_checklist.pre_import.map((task: any, index: number) => (
                            <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                              <div className="font-medium text-blue-900 mb-1">{task.task_ko}</div>
                              <div className="text-xs text-blue-700 mb-1">
                                <span className="font-semibold">책임자:</span> {task.responsible_ko}
                              </div>
                              <div className="text-xs text-blue-700 mb-1">
                                <span className="font-semibold">마감일:</span> {task.deadline_ko}
                              </div>
                              <div className="text-xs text-blue-700 mb-1">
                                <span className="font-semibold">예상 시간:</span> {task.estimated_hours}시간
                              </div>
                              <div className={`text-xs px-2 py-0.5 rounded ${
                                task.priority === 'high' ? 'bg-red-200 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                우선순위: {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
                              </div>
                              <div className="text-xs text-blue-800 p-2 bg-blue-100 rounded mt-1">
                                <span className="font-semibold">성공 기준:</span> {task.success_criteria_ko}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 수입 중 */}
                    {product.requirementAnalysis.llm_summary.execution_checklist.during_import && 
                     product.requirementAnalysis.llm_summary.execution_checklist.during_import.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          🚢 수입 중 진행사항
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.execution_checklist.during_import.map((task: any, index: number) => (
                            <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                              <div className="font-medium text-blue-900 mb-1">{task.task_ko}</div>
                              <div className="text-xs text-blue-700 mb-1">
                                <span className="font-semibold">타이밍:</span> {task.timing_ko}
                              </div>
                              <div className="text-xs text-blue-700">
                                <span className="font-semibold">예상 시간:</span> {task.estimated_hours}시간
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 수입 후 */}
                    {product.requirementAnalysis.llm_summary.execution_checklist.post_import && 
                     product.requirementAnalysis.llm_summary.execution_checklist.post_import.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          ✅ 수입 후 완료사항
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.execution_checklist.post_import.map((task: any, index: number) => (
                            <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                              <div className="font-medium text-blue-900 mb-1">{task.task_ko}</div>
                              <div className="text-xs text-blue-700 mb-1">
                                <span className="font-semibold">마감일:</span> {task.deadline_ko}
                              </div>
                              <div className="text-xs text-blue-700">
                                <span className="font-semibold">예상 시간:</span> {task.estimated_hours}시간
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Improvement Areas (개선 영역) ==================== */}
            {product.requirementAnalysis.llm_summary?.improvement_areas && 
             product.requirementAnalysis.llm_summary.improvement_areas.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('improvementAreas')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-orange-500" />
                    <h4 className="font-semibold text-text-primary">개선 영역</h4>
                    <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.improvement_areas.length}개 영역
                    </span>
                  </div>
                  {expandedSections.has('improvementAreas') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('improvementAreas') && (
                  <div className="p-4 bg-white space-y-4">
                    <div className="space-y-2">
                      {product.requirementAnalysis.llm_summary.improvement_areas.map((area: any, index: number) => (
                        <div key={index} className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                          <div className="font-medium text-orange-900 mb-1">{area.area_ko}</div>
                          <div className="text-xs text-orange-700 mb-1">
                            <span className="font-semibold">현재 격차:</span> {area.current_gap_ko}
                          </div>
                          <div className="text-xs text-orange-700 mb-1">
                            <span className="font-semibold">액션 플랜:</span> {area.action_plan_ko}
                          </div>
                          <div className="text-xs text-orange-700 mb-1">
                            <span className="font-semibold">예상 노력:</span> {area.estimated_effort}
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded ${
                            area.priority === 'high' ? 'bg-red-200 text-red-800' :
                            area.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                            우선순위: {area.priority === 'high' ? '높음' : area.priority === 'medium' ? '중간' : '낮음'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== Labeling Requirements (라벨링 요구사항) ==================== */}
            {product.requirementAnalysis.labelingRequirements && 
             product.requirementAnalysis.labelingRequirements.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('labelingRequirements')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-amber-500" />
                    <h4 className="font-semibold text-text-primary">🏷️ 라벨링 요구사항</h4>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.labelingRequirements.length}개 요건
                    </span>
                  </div>
                  {expandedSections.has('labelingRequirements') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('labelingRequirements') && (
                  <div className="p-4 bg-white space-y-3">
                    {product.requirementAnalysis.labelingRequirements.map((label: any, index: number) => (
                      <div key={index} className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                        <div className="font-medium text-amber-900 mb-2">{label.element}</div>
                        <div className="text-sm text-amber-800 mb-1">
                          <span className="font-semibold">요건:</span> {label.requirement}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-amber-700 mb-2">
                          <div><span className="font-semibold">형식:</span> {label.format}</div>
                          <div><span className="font-semibold">위치:</span> {label.placement}</div>
                          <div><span className="font-semibold">언어:</span> {label.language}</div>
                          <div><span className="font-semibold">기관:</span> {label.agency}</div>
                        </div>
                        {label.penalties && (
                          <div className="text-xs text-amber-800 p-2 bg-amber-100 rounded">
                            <span className="font-semibold">위반 시:</span> {label.penalties}
                          </div>
                        )}
                        {label.source_url && (
                          <a href={label.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={10} /> 출처
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Prohibited/Restricted Substances (금지/제한 물질) ==================== */}
            {product.requirementAnalysis.prohibitedRestrictedSubstances && 
             product.requirementAnalysis.prohibitedRestrictedSubstances.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('prohibitedSubstances')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-500" />
                    <h4 className="font-semibold text-text-primary">⚠️ 금지/제한 물질</h4>
                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.prohibitedRestrictedSubstances.length}개 물질
                    </span>
                  </div>
                  {expandedSections.has('prohibitedSubstances') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('prohibitedSubstances') && (
                  <div className="p-4 bg-white space-y-3">
                    {product.requirementAnalysis.prohibitedRestrictedSubstances.map((substance: any, index: number) => (
                      <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <div className="font-medium text-red-900 mb-2">{substance.substance}</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                          substance.status === 'prohibited' ? 'bg-red-200 text-red-900' : 'bg-yellow-200 text-yellow-900'
                        }`}>
                          {substance.status === 'prohibited' ? '금지' : '제한'}
                        </div>
                        {substance.max_concentration && (
                          <div className="text-sm text-red-800 mb-1">
                            <span className="font-semibold">최대 농도:</span> {substance.max_concentration}
                          </div>
                        )}
                        <div className="text-xs text-red-700 mb-1">
                          <span className="font-semibold">관할 기관:</span> {substance.agency}
                        </div>
                        {substance.alternatives && substance.alternatives.length > 0 && (
                          <div className="text-xs text-red-800 p-2 bg-red-100 rounded">
                            <span className="font-semibold">대체 물질:</span> {substance.alternatives.join(', ')}
                          </div>
                        )}
                        {substance.source_url && (
                          <a href={substance.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={10} /> 출처
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Prior Notifications (사전 통지 요건) ==================== */}
            {product.requirementAnalysis.priorNotifications && 
             product.requirementAnalysis.priorNotifications.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('priorNotifications')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-yellow-500" />
                    <h4 className="font-semibold text-text-primary">📢 사전 통지 요건</h4>
                    <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.priorNotifications.length}개 통지
                    </span>
                  </div>
                  {expandedSections.has('priorNotifications') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('priorNotifications') && (
                  <div className="p-4 bg-white space-y-3">
                    {product.requirementAnalysis.priorNotifications.map((notification: any, index: number) => (
                      <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <div className="font-medium text-yellow-900 mb-2">{notification.type}</div>
                        <div className="text-sm text-yellow-800 mb-1">
                          <span className="font-semibold">적용 대상:</span> {notification.required_for}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-yellow-700 mb-2">
                          <div><span className="font-semibold">제출 마감:</span> {notification.deadline}</div>
                          <div><span className="font-semibold">처리 시간:</span> {notification.processing_time}</div>
                        </div>
                        <div className="text-xs text-yellow-700 mb-2">
                          <span className="font-semibold">제출 방법:</span> {notification.submission_method}
                        </div>
                        {notification.consequences_if_missed && (
                          <div className="text-xs text-yellow-800 p-2 bg-yellow-100 rounded">
                            <span className="font-semibold">누락 시:</span> {notification.consequences_if_missed}
                          </div>
                        )}
                        {notification.source_url && (
                          <a href={notification.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={10} /> 출처
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Testing Requirements (검사 요구사항) ==================== */}
            {product.requirementAnalysis.testingRequirements && 
             product.requirementAnalysis.testingRequirements.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('testingRequirements')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-teal-50 hover:bg-teal-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare size={16} className="text-teal-500" />
                    <h4 className="font-semibold text-text-primary">🧪 검사 요구사항</h4>
                    <span className="px-2 py-0.5 bg-teal-200 text-teal-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.testingRequirements.length}개 검사
                    </span>
                  </div>
                  {expandedSections.has('testingRequirements') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('testingRequirements') && (
                  <div className="p-4 bg-white space-y-3">
                    {product.requirementAnalysis.testingRequirements.map((test: any, index: number) => (
                      <div key={index} className="p-3 bg-teal-50 border-l-4 border-teal-400 rounded-r-lg">
                        <div className="font-medium text-teal-900 mb-2">{test.test}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-teal-700 mb-2">
                          <div><span className="font-semibold">요구 기관:</span> {test.required_by}</div>
                          <div><span className="font-semibold">빈도:</span> {test.frequency}</div>
                          <div><span className="font-semibold">소요 시간:</span> {test.turnaround_time}</div>
                          <div><span className="font-semibold">비용:</span> ${test.cost_per_test?.min} - ${test.cost_per_test?.max}</div>
                        </div>
                        {test.accredited_labs && test.accredited_labs.length > 0 && (
                          <div className="text-xs text-teal-700 mb-2">
                            <span className="font-semibold">인증 실험실:</span> {test.accredited_labs.join(', ')}
                          </div>
                        )}
                        {test.pass_criteria && (
                          <div className="text-xs text-teal-800 p-2 bg-teal-100 rounded">
                            <span className="font-semibold">합격 기준:</span> {test.pass_criteria}
                          </div>
                        )}
                        {test.source_url && (
                          <a href={test.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={10} /> 출처
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Third Party Certifications (제3자 인증) ==================== */}
            {product.requirementAnalysis.llm_summary?.third_party_certifications && 
             product.requirementAnalysis.llm_summary.third_party_certifications.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('thirdPartyCertifications')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-sky-50 hover:bg-sky-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-sky-500" />
                    <h4 className="font-semibold text-text-primary">🎖️ 제3자 인증</h4>
                    <span className="px-2 py-0.5 bg-sky-200 text-sky-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.third_party_certifications.length}개 인증
                    </span>
                  </div>
                  {expandedSections.has('thirdPartyCertifications') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('thirdPartyCertifications') && (
                  <div className="p-4 bg-white space-y-3">
                    {product.requirementAnalysis.llm_summary.third_party_certifications.map((cert: any, index: number) => (
                      <div key={index} className="p-3 bg-sky-50 border-l-4 border-sky-400 rounded-r-lg">
                        <div className="font-medium text-sky-900 mb-2">{cert.certification}</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                          cert.type === 'mandatory' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'
                        }`}>
                          {cert.type === 'mandatory' ? '필수' : '선택'}
                        </div>
                        <div className="text-sm text-sky-800 mb-1">
                          <span className="font-semibold">목적:</span> {cert.purpose}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-sky-700 mb-2">
                          <div><span className="font-semibold">비용:</span> ${cert.cost_range?.min} - ${cert.cost_range?.max}</div>
                          <div><span className="font-semibold">유효기간:</span> {cert.validity}</div>
                        </div>
                        {cert.recognized_bodies && cert.recognized_bodies.length > 0 && (
                          <div className="text-xs text-sky-700 mb-2">
                            <span className="font-semibold">인증 기관:</span> {cert.recognized_bodies.join(', ')}
                          </div>
                        )}
                        {cert.market_advantage && (
                          <div className="text-xs text-sky-800 p-2 bg-sky-100 rounded">
                            <span className="font-semibold">시장 이점:</span> {cert.market_advantage}
                          </div>
                        )}
                        {cert.source_url && (
                          <a href={cert.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={10} /> 출처
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Exemptions (면제 규정) ==================== */}
            {product.requirementAnalysis.exemptions && 
             product.requirementAnalysis.exemptions.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('exemptions')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-lime-50 hover:bg-lime-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-lime-500" />
                    <h4 className="font-semibold text-text-primary">✅ 면제 규정</h4>
                    <span className="px-2 py-0.5 bg-lime-200 text-lime-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.exemptions.length}개 면제
                    </span>
                  </div>
                  {expandedSections.has('exemptions') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('exemptions') && (
                  <div className="p-4 bg-white space-y-3">
                    {product.requirementAnalysis.exemptions.map((exemption: any, index: number) => (
                      <div key={index} className="p-3 bg-lime-50 border-l-4 border-lime-400 rounded-r-lg">
                        <div className="font-medium text-lime-900 mb-2">{exemption.exemption_type}</div>
                        <div className="text-sm text-lime-800 mb-2">
                          <span className="font-semibold">조건:</span> {exemption.condition_ko || exemption.condition}
                        </div>
                        <div className="text-xs text-lime-700 mb-2">
                          <span className="font-semibold">면제 항목:</span> {exemption.exempted_from_ko?.join(', ') || exemption.exempted_from?.join(', ')}
                        </div>
                        {exemption.limitations_ko && (
                          <div className="text-xs text-lime-800 p-2 bg-lime-100 rounded mb-2">
                            <span className="font-semibold">제한사항:</span> {exemption.limitations_ko}
                          </div>
                        )}
                        {exemption.how_to_claim_ko && (
                          <div className="text-xs text-lime-800 p-2 bg-lime-100 rounded">
                            <span className="font-semibold">신청 방법:</span> {exemption.how_to_claim_ko}
                          </div>
                        )}
                        {exemption.source_url && (
                          <a href={exemption.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={10} /> 출처
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Customs Clearance (통관 절차) ==================== */}
            {product.requirementAnalysis.llm_summary?.customs_clearance && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('customsClearance')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-indigo-500" />
                    <h4 className="font-semibold text-text-primary">🛃 통관 절차</h4>
                    <span className="px-2 py-0.5 bg-indigo-200 text-indigo-800 text-xs rounded-full font-medium">
                      세관 통관
                    </span>
                  </div>
                  {expandedSections.has('customsClearance') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('customsClearance') && (
                  <div className="p-4 bg-white space-y-3">
                    {/* 신고 절차 */}
                    {product.requirementAnalysis.llm_summary.customs_clearance.entry_filing && (
                      <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                        <h5 className="font-semibold text-indigo-900 mb-2">📋 신고 절차</h5>
                        <div className="text-sm text-indigo-800 mb-1">
                          <span className="font-semibold">마감일:</span> {product.requirementAnalysis.llm_summary.customs_clearance.entry_filing.deadline}
                        </div>
                        {product.requirementAnalysis.llm_summary.customs_clearance.entry_filing.required_forms && (
                          <div className="text-xs text-indigo-700">
                            <span className="font-semibold">필수 서식:</span> {product.requirementAnalysis.llm_summary.customs_clearance.entry_filing.required_forms.join(', ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 보증금 요건 */}
                    {product.requirementAnalysis.llm_summary.customs_clearance.bonds_required && (
                      <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                        <h5 className="font-semibold text-indigo-900 mb-2">💰 보증금 요건</h5>
                        <div className="text-sm text-indigo-800 mb-1">
                          <span className="font-semibold">유형:</span> {product.requirementAnalysis.llm_summary.customs_clearance.bonds_required.type}
                        </div>
                        <div className="text-sm text-indigo-800">
                          <span className="font-semibold">금액:</span> {product.requirementAnalysis.llm_summary.customs_clearance.bonds_required.amount}
                        </div>
                      </div>
                    )}

                    {/* 검사 확률 */}
                    {product.requirementAnalysis.llm_summary.customs_clearance.inspection_probability && (
                      <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                        <h5 className="font-semibold text-indigo-900 mb-2">🔍 검사 확률</h5>
                        <div className="text-sm text-indigo-800">
                          {product.requirementAnalysis.llm_summary.customs_clearance.inspection_probability}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Key Agencies (주요 기관 정보) ==================== */}
            {product.requirementAnalysis.llm_summary?.key_agencies && 
             product.requirementAnalysis.llm_summary.key_agencies.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('keyAgencies')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-500" />
                    <h4 className="font-semibold text-text-primary">🏛️ 주요 기관 정보</h4>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.key_agencies.length}개 기관
                    </span>
                  </div>
                  {expandedSections.has('keyAgencies') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('keyAgencies') && (
                  <div className="p-4 bg-white space-y-3">
                    {product.requirementAnalysis.llm_summary.key_agencies.map((agency: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
                        <div className="font-medium text-gray-900 mb-2">{agency.agency}</div>
                        <div className="text-sm text-gray-800 mb-1">
                          <span className="font-semibold">역할:</span> {agency.role}
                        </div>
                        {agency.contact && (
                          <div className="text-xs text-gray-700 mb-1">
                            <span className="font-semibold">연락처:</span> {agency.contact}
                          </div>
                        )}
                        {agency.website && (
                          <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={10} /> 공식 웹사이트
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Regulatory Updates (규정 업데이트) ==================== */}
            {product.requirementAnalysis.llm_summary?.regulatory_updates && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('regulatoryUpdates')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-pink-50 hover:bg-pink-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-pink-500" />
                    <h4 className="font-semibold text-text-primary">🔔 규정 업데이트</h4>
                    <span className="px-2 py-0.5 bg-pink-200 text-pink-800 text-xs rounded-full font-medium">
                      최신 변경사항
                    </span>
                  </div>
                  {expandedSections.has('regulatoryUpdates') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('regulatoryUpdates') && (
                  <div className="p-4 bg-white space-y-3">
                    {/* 최근 변경사항 */}
                    {product.requirementAnalysis.llm_summary.regulatory_updates.recent_changes && 
                     product.requirementAnalysis.llm_summary.regulatory_updates.recent_changes.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-pink-900 mb-2 flex items-center gap-2">
                          🆕 최근 변경사항
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.regulatory_updates.recent_changes.map((change: any, index: number) => (
                            <div key={index} className="p-3 bg-pink-50 border-l-4 border-pink-400 rounded-r-lg">
                              <div className="font-medium text-pink-900 mb-1">{change.change}</div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-pink-700 mb-2">
                                <div><span className="font-semibold">기관:</span> {change.agency}</div>
                                <div><span className="font-semibold">변경일:</span> {change.date}</div>
                                <div><span className="font-semibold">효력 발생:</span> {change.effective_date}</div>
                              </div>
                              <div className="text-xs text-pink-800 p-2 bg-pink-100 rounded">
                                <span className="font-semibold">영향:</span> {change.impact}
                              </div>
                              {change.source_url && (
                                <a href={change.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 출처
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 예정된 입법 */}
                    {product.requirementAnalysis.llm_summary.regulatory_updates.pending_legislation && (
                      <div className="p-3 bg-pink-50 border-l-4 border-pink-400 rounded-r-lg">
                        <h5 className="font-semibold text-pink-900 mb-2">⏳ 예정된 입법</h5>
                        <div className="text-sm text-pink-800">
                          {product.requirementAnalysis.llm_summary.regulatory_updates.pending_legislation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Data Completeness (데이터 완전성) ==================== */}
            {product.requirementAnalysis.llm_summary?.data_completeness && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('dataCompleteness')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-violet-50 hover:bg-violet-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-violet-500" />
                    <h4 className="font-semibold text-text-primary">📊 데이터 완전성 평가</h4>
                    <span className="px-2 py-0.5 bg-violet-200 text-violet-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.data_completeness.sources_found || 0}/{product.requirementAnalysis.llm_summary.data_completeness.sources_expected || 0} 출처
                    </span>
                  </div>
                  {expandedSections.has('dataCompleteness') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('dataCompleteness') && (
                  <div className="p-4 bg-white space-y-3">
                    {/* 출처 통계 */}
                    <div className="p-4 bg-violet-50 border-2 border-violet-300 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-violet-900">
                            {product.requirementAnalysis.llm_summary.data_completeness.sources_found || 0}
                          </div>
                          <div className="text-xs text-violet-700">발견된 출처</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-violet-900">
                            {product.requirementAnalysis.llm_summary.data_completeness.sources_expected || 0}
                          </div>
                          <div className="text-xs text-violet-700">예상 출처</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-sm text-violet-800">
                          완전성: {Math.round((product.requirementAnalysis.llm_summary.data_completeness.sources_found / product.requirementAnalysis.llm_summary.data_completeness.sources_expected) * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* 누락 영역 */}
                    {product.requirementAnalysis.llm_summary.data_completeness.missing_areas && 
                     product.requirementAnalysis.llm_summary.data_completeness.missing_areas.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-violet-900 mb-2 flex items-center gap-2">
                          ⚠️ 누락 영역
                        </h5>
                        <div className="space-y-1">
                          {product.requirementAnalysis.llm_summary.data_completeness.missing_areas.map((area: string, index: number) => (
                            <div key={index} className="text-sm text-violet-700 flex items-center gap-2">
                              <span className="text-violet-400">•</span> {area}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 권장사항 */}
                    {product.requirementAnalysis.llm_summary.data_completeness.recommendation && (
                      <div className="text-xs text-violet-800 p-3 bg-violet-100 rounded">
                        <span className="font-semibold">권장사항:</span> {product.requirementAnalysis.llm_summary.data_completeness.recommendation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Phase 1: Detailed Regulations (상세 규제 정보) ==================== */}
            {product.requirementAnalysis.llm_summary?.phase_1_detailed_regulations && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('phase1DetailedRegulations')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-slate-500" />
                    <h4 className="font-semibold text-text-primary">Phase 1: 상세 규제 정보</h4>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.phase_1_detailed_regulations.summary}
                    </span>
                  </div>
                  {expandedSections.has('phase1DetailedRegulations') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('phase1DetailedRegulations') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 카테고리 */}
                    <div className="p-3 bg-slate-50 border-l-4 border-slate-400 rounded-r-lg">
                      <div className="font-medium text-slate-900 mb-1">카테고리: {product.requirementAnalysis.llm_summary.phase_1_detailed_regulations.category}</div>
                      <div className="text-xs text-slate-700">
                        신뢰도: {(product.requirementAnalysis.llm_summary.phase_1_detailed_regulations.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    {/* 출처 정보 */}
                    {product.requirementAnalysis.llm_summary.phase_1_detailed_regulations.sources && 
                     product.requirementAnalysis.llm_summary.phase_1_detailed_regulations.sources.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          📚 출처 정보 ({product.requirementAnalysis.llm_summary.phase_1_detailed_regulations.sources.length}개)
                        </h5>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {product.requirementAnalysis.llm_summary.phase_1_detailed_regulations.sources.slice(0, 10).map((source: any, index: number) => (
                            <div key={index} className="p-2 bg-slate-50 border border-slate-200 rounded">
                              <div className="font-medium text-slate-900 text-xs mb-1">{source.title}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600">기관: {source.agency}</span>
                                <span className={`px-2 py-0.5 rounded ${
                                  source.type === '공식 사이트' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                                }`}>
                                  {source.type}
                                </span>
                                <span className="text-slate-600">관련도: {source.relevance}</span>
                              </div>
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 링크
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Phase 2: Testing Procedures (검사 절차) ==================== */}
            {product.requirementAnalysis.llm_summary?.phase_2_testing_procedures && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('phase2TestingProcedures')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare size={16} className="text-cyan-500" />
                    <h4 className="font-semibold text-text-primary">Phase 2: 검사 절차 및 방법</h4>
                    <span className="px-2 py-0.5 bg-cyan-200 text-cyan-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.phase_2_testing_procedures.methods?.length || 0}개 방법
                    </span>
                  </div>
                  {expandedSections.has('phase2TestingProcedures') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('phase2TestingProcedures') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 검사 방법 */}
                    {product.requirementAnalysis.llm_summary.phase_2_testing_procedures.methods && (
                      <div>
                        <h5 className="font-semibold text-cyan-900 mb-2 flex items-center gap-2">
                          🧪 검사 방법
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {product.requirementAnalysis.llm_summary.phase_2_testing_procedures.methods.map((method: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 출처 정보 */}
                    {product.requirementAnalysis.llm_summary.phase_2_testing_procedures.sources && 
                     product.requirementAnalysis.llm_summary.phase_2_testing_procedures.sources.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-cyan-900 mb-2 flex items-center gap-2">
                          📚 관련 출처 ({product.requirementAnalysis.llm_summary.phase_2_testing_procedures.sources.length}개)
                        </h5>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {product.requirementAnalysis.llm_summary.phase_2_testing_procedures.sources.slice(0, 10).map((source: any, index: number) => (
                            <div key={index} className="p-2 bg-cyan-50 border border-cyan-200 rounded">
                              <div className="font-medium text-cyan-900 text-xs mb-1">{source.title}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-cyan-600">기관: {source.agency}</span>
                                <span className="text-cyan-600">점수: {source.score?.toFixed(2)}</span>
                              </div>
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 링크
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Phase 3: Penalties (위반 시 처벌) ==================== */}
            {product.requirementAnalysis.llm_summary?.phase_3_penalties && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('phase3Penalties')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-500" />
                    <h4 className="font-semibold text-text-primary">Phase 3: 위반 시 처벌 및 법적 책임</h4>
                    {product.requirementAnalysis.llm_summary.phase_3_penalties.fine_range && (
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-xs rounded-full font-medium">
                        벌금 ${product.requirementAnalysis.llm_summary.phase_3_penalties.fine_range.min?.toLocaleString()} - ${product.requirementAnalysis.llm_summary.phase_3_penalties.fine_range.max?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {expandedSections.has('phase3Penalties') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('phase3Penalties') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 벌금 범위 */}
                    {product.requirementAnalysis.llm_summary.phase_3_penalties.fine_range && (
                      <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-lg">
                        <h5 className="font-semibold text-rose-900 mb-2">💰 예상 벌금 범위</h5>
                        <div className="text-2xl font-bold text-rose-900">
                          ${product.requirementAnalysis.llm_summary.phase_3_penalties.fine_range.min?.toLocaleString()} - ${product.requirementAnalysis.llm_summary.phase_3_penalties.fine_range.max?.toLocaleString()}
                        </div>
                        <div className="text-xs text-rose-700 mt-1">
                          신뢰도: {(product.requirementAnalysis.llm_summary.phase_3_penalties.fine_range.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    )}

                    {/* 조치 사항 */}
                    {product.requirementAnalysis.llm_summary.phase_3_penalties.measures && (
                      <div>
                        <h5 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                          ⚠️ 가능한 조치
                        </h5>
                        <div className="space-y-2">
                          {product.requirementAnalysis.llm_summary.phase_3_penalties.measures.import_ban_possible && (
                            <div className="p-3 bg-rose-50 border-l-4 border-rose-400 rounded-r-lg">
                              <span className="font-medium text-rose-900">수입 금지 가능</span>
                            </div>
                          )}
                          {product.requirementAnalysis.llm_summary.phase_3_penalties.measures.seizure_or_destruction && (
                            <div className="p-3 bg-rose-50 border-l-4 border-rose-400 rounded-r-lg">
                              <span className="font-medium text-rose-900">압수 또는 폐기 가능</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 법적 책임 출처 */}
                    {product.requirementAnalysis.llm_summary.phase_3_penalties.legal?.liability_refs && 
                     product.requirementAnalysis.llm_summary.phase_3_penalties.legal.liability_refs.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                          📜 법적 책임 근거
                        </h5>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {product.requirementAnalysis.llm_summary.phase_3_penalties.legal.liability_refs.map((ref: any, index: number) => (
                            <div key={index} className="p-2 bg-rose-50 border border-rose-200 rounded">
                              <div className="font-medium text-rose-900 text-xs mb-1">{ref.title}</div>
                              <div className="text-xs text-rose-700 mb-1 line-clamp-2">{ref.snippet}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-rose-600">기관: {ref.agency || 'Unknown'}</span>
                                <span className="text-rose-600">점수: {ref.score?.toFixed(2)}</span>
                              </div>
                              {ref.url && (
                                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 링크
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 집행 출처 */}
                    {product.requirementAnalysis.llm_summary.phase_3_penalties.legal?.enforcement_refs && 
                     product.requirementAnalysis.llm_summary.phase_3_penalties.legal.enforcement_refs.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                          🚨 집행 사례 근거
                        </h5>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {product.requirementAnalysis.llm_summary.phase_3_penalties.legal.enforcement_refs.map((ref: any, index: number) => (
                            <div key={index} className="p-2 bg-rose-50 border border-rose-200 rounded">
                              <div className="font-medium text-rose-900 text-xs mb-1">{ref.title}</div>
                              <div className="text-xs text-rose-700 mb-1 line-clamp-2">{ref.snippet}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-rose-600">기관: {ref.agency || 'Unknown'}</span>
                                <span className="text-rose-600">점수: {ref.score?.toFixed(2)}</span>
                              </div>
                              {ref.url && (
                                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 링크
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 관련 기관 */}
                    {product.requirementAnalysis.llm_summary.phase_3_penalties.agencies && (
                      <div>
                        <h5 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                          🏛️ 관련 기관
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {product.requirementAnalysis.llm_summary.phase_3_penalties.agencies.map((agency: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">
                              {agency}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Phase 4: Validity (인증서 갱신 및 유효성) ==================== */}
            {product.requirementAnalysis.llm_summary?.phase_4_validity && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('phase4Validity')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <h4 className="font-semibold text-text-primary">Phase 4: 인증서 갱신 및 유효성</h4>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-xs rounded-full font-medium">
                      {product.requirementAnalysis.llm_summary.phase_4_validity.validity || 'unknown'}
                    </span>
                  </div>
                  {expandedSections.has('phase4Validity') ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {expandedSections.has('phase4Validity') && (
                  <div className="p-4 bg-white space-y-4">
                    {/* 갱신 정보 */}
                    {product.requirementAnalysis.llm_summary.phase_4_validity.renewal && (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg">
                        <h5 className="font-semibold text-emerald-900 mb-2">🔄 갱신 정보</h5>
                        <div className="space-y-2">
                          <div className="text-sm text-emerald-800">
                            <span className="font-semibold">절차:</span> {product.requirementAnalysis.llm_summary.phase_4_validity.renewal.procedure}
                          </div>
                          <div className="text-sm text-emerald-800">
                            <span className="font-semibold">비용 범위:</span> {product.requirementAnalysis.llm_summary.phase_4_validity.renewal.cost_band}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 관련 기관 */}
                    {product.requirementAnalysis.llm_summary.phase_4_validity.agencies && (
                      <div>
                        <h5 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                          🏛️ 관련 기관
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {product.requirementAnalysis.llm_summary.phase_4_validity.agencies.map((agency: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                              {agency}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 증거 자료 - 비용 관련 */}
                    {product.requirementAnalysis.llm_summary.phase_4_validity.evidence?.costs && 
                     product.requirementAnalysis.llm_summary.phase_4_validity.evidence.costs.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                          💰 비용 관련 자료
                        </h5>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {product.requirementAnalysis.llm_summary.phase_4_validity.evidence.costs.slice(0, 5).map((source: any, index: number) => (
                            <div key={index} className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                              <div className="font-medium text-emerald-900 text-xs mb-1">{source.title}</div>
                              <div className="text-xs text-emerald-700 mb-1 line-clamp-2">{source.snippet}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-emerald-600">기관: {source.agency || 'Unknown'}</span>
                                <span className="text-emerald-600">점수: {source.score?.toFixed(2)}</span>
                              </div>
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 링크
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 증거 자료 - 갱신 관련 */}
                    {product.requirementAnalysis.llm_summary.phase_4_validity.evidence?.renewal && 
                     product.requirementAnalysis.llm_summary.phase_4_validity.evidence.renewal.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                          🔄 갱신 관련 자료
                        </h5>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {product.requirementAnalysis.llm_summary.phase_4_validity.evidence.renewal.slice(0, 5).map((source: any, index: number) => (
                            <div key={index} className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                              <div className="font-medium text-emerald-900 text-xs mb-1">{source.title}</div>
                              <div className="text-xs text-emerald-700 mb-1 line-clamp-2">{source.snippet}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-emerald-600">기관: {source.agency || 'Unknown'}</span>
                                <span className="text-emerald-600">점수: {source.score?.toFixed(2)}</span>
                              </div>
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 링크
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 전체 출처 */}
                    {product.requirementAnalysis.llm_summary.phase_4_validity.sources && 
                     product.requirementAnalysis.llm_summary.phase_4_validity.sources.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                          📚 전체 출처 ({product.requirementAnalysis.llm_summary.phase_4_validity.sources.length}개)
                        </h5>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {product.requirementAnalysis.llm_summary.phase_4_validity.sources.slice(0, 10).map((source: any, index: number) => (
                            <div key={index} className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                              <div className="font-medium text-emerald-900 text-xs mb-1">{source.title}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-emerald-600">기관: {source.agency}</span>
                                <span className="text-emerald-600">점수: {source.score?.toFixed(2)}</span>
                              </div>
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={10} /> 링크
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== 기존 Phase 2-4 전문 분석 결과 ==================== */}
            {/* Phase 2-4 전문 분석 결과 */}
            {product.requirementAnalysis.testingProcedures && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  🧪 검사 절차 및 비용 분석
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">검사 주기:</span>
                    <span className="font-medium text-blue-900">
                      {product.requirementAnalysis.testingProcedures.inspection_cycle === 'per_import' ? '수입시마다' :
                       product.requirementAnalysis.testingProcedures.inspection_cycle === 'annual' ? '연간' :
                       product.requirementAnalysis.testingProcedures.inspection_cycle === 'sampling' ? '샘플링' : '확인 필요'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">예상 비용:</span>
                    <span className={`font-medium ${
                      product.requirementAnalysis.testingProcedures.estimates.estimated_cost_band === 'low' ? 'text-green-700' :
                      product.requirementAnalysis.testingProcedures.estimates.estimated_cost_band === 'medium' ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {product.requirementAnalysis.testingProcedures.estimates.estimated_cost_band === 'low' ? '낮음' :
                       product.requirementAnalysis.testingProcedures.estimates.estimated_cost_band === 'medium' ? '중간' :
                       product.requirementAnalysis.testingProcedures.estimates.estimated_cost_band === 'high' ? '높음' : '미정'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">검사 방법:</span>
                    <span className="font-medium text-blue-900">
                      {product.requirementAnalysis.testingProcedures.methods.join(', ') || '확인 필요'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {product.requirementAnalysis.penalties && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  ⚖️ 위반 시 처벌 및 벌금
                </h4>
                <div className="space-y-2 text-sm">
                  {product.requirementAnalysis.penalties.fine_range.min !== null && (
                    <div className="flex justify-between">
                      <span className="text-red-700">벌금 범위:</span>
                      <span className="font-bold text-red-900">
                        ${product.requirementAnalysis.penalties.fine_range.min?.toLocaleString()} - ${product.requirementAnalysis.penalties.fine_range.max?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {product.requirementAnalysis.penalties.measures.seizure_or_destruction && (
                    <div className="p-2 bg-red-100 border border-red-300 rounded text-red-800">
                      ⚠️ 제품 압수/폐기 가능
                    </div>
                  )}
                  {product.requirementAnalysis.penalties.measures.import_ban_possible && (
                    <div className="p-2 bg-red-100 border border-red-300 rounded text-red-800">
                      ⚠️ 수입 금지 조치 가능
                    </div>
                  )}
                </div>
              </div>
            )}

            {product.requirementAnalysis.validity && (
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  ⏰ 인증 유효기간 및 갱신
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">유효기간:</span>
                    <span className="font-medium text-purple-900">
                      {product.requirementAnalysis.validity.validity === '1_year' ? '1년' :
                       product.requirementAnalysis.validity.validity === '2_years' ? '2년' :
                       product.requirementAnalysis.validity.validity === '3_years' ? '3년' : '확인 필요'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">갱신 절차:</span>
                    <span className="font-medium text-purple-900">
                      {product.requirementAnalysis.validity.renewal.procedure === 'procedure_required' ? '필요' : '확인 필요'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">갱신 비용:</span>
                    <span className="font-medium text-purple-900">
                      {product.requirementAnalysis.validity.renewal.cost_band === 'low' ? '낮음' :
                       product.requirementAnalysis.validity.renewal.cost_band === 'medium' ? '중간' :
                       product.requirementAnalysis.validity.renewal.cost_band === 'high' ? '높음' : '미정'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {product.requirementAnalysis.crossValidation && 
             product.requirementAnalysis.crossValidation.conflicts_found && 
             product.requirementAnalysis.crossValidation.conflicts_found.length > 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  ⚠️ 규정 충돌 감지
                </h4>
                <div className="space-y-2">
                  {product.requirementAnalysis.crossValidation.conflicts_found.map((conflict: any, index: number) => (
                    <div key={index} className="p-2 bg-yellow-100 border border-yellow-200 rounded text-sm">
                      <div className="font-medium text-yellow-900">{conflict.conflict_description}</div>
                      <div className="text-xs text-yellow-700 mt-1">
                        충돌 기관: {conflict.conflicting_agencies?.join(', ')}
                      </div>
                      {conflict.resolution_guidance && (
                        <div className="text-xs text-yellow-800 mt-1 p-2 bg-yellow-50 rounded">
                          💡 해결방안: {conflict.resolution_guidance}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-yellow-700">
                  검증 점수: {(product.requirementAnalysis.crossValidation.validation_score * 100).toFixed(1)}%
                </div>
              </div>
            )}

            {/* 외부 링크 */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-text-primary mb-3">관련 링크</h4>
              <div className="space-y-2">
                {(product.requirementAnalysis.sources ?? []).map((source, index) => (
                  <a 
                    key={index}
                    href={typeof source === 'string' ? source : source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
                  >
                    <ExternalLink size={14} />
                    {typeof source === 'string' ? source : source.title || source.url}
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
