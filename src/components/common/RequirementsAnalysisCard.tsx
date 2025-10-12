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
import { FileText, ExternalLink, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, TrendingUp, DollarSign, Lightbulb, Clock } from 'lucide-react';
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
            {product.requirementAnalysis.estimatedCosts && (
              <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('costs')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-teal-50 hover:bg-teal-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-teal-500" />
                    <h4 className="font-semibold text-text-primary">예상 비용</h4>
                    <span className="px-2 py-0.5 bg-teal-200 text-teal-800 text-xs rounded-full font-medium">
                      ${product.requirementAnalysis.estimatedCosts.total.min.toLocaleString()} - ${product.requirementAnalysis.estimatedCosts.total.max.toLocaleString()}
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
                            ${product.requirementAnalysis.estimatedCosts.total.min.toLocaleString()} - ${product.requirementAnalysis.estimatedCosts.total.max.toLocaleString()} {product.requirementAnalysis.estimatedCosts.total.currency}
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
                              ${product.requirementAnalysis.estimatedCosts.testing.min.toLocaleString()} - ${product.requirementAnalysis.estimatedCosts.testing.max.toLocaleString()}
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
                              ${product.requirementAnalysis.estimatedCosts.legal_review.min.toLocaleString()} - ${product.requirementAnalysis.estimatedCosts.legal_review.max.toLocaleString()}
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
                              ${product.requirementAnalysis.estimatedCosts.certification.min.toLocaleString()} - ${product.requirementAnalysis.estimatedCosts.certification.max.toLocaleString()}
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
