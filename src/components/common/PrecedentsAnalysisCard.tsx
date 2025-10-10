import React, { useState } from 'react';
import { Gavel, ExternalLink, FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import type { PrecedentsResponse, PrecedentDetail } from '@/api/productApi';

interface PrecedentsAnalysisCardProps {
  product: {
    analysisComplete: boolean;
    precedentsAnalysis?: PrecedentsResponse;
    loading?: boolean;
  };
}

const PrecedentsAnalysisCard: React.FC<PrecedentsAnalysisCardProps> = ({ product }) => {
  const { analysisComplete, precedentsAnalysis, loading } = product;
  
  // 각 케이스의 펼침/접힘 상태 관리
  const [expandedSuccessCases, setExpandedSuccessCases] = useState<Set<number>>(new Set());
  const [expandedFailureCases, setExpandedFailureCases] = useState<Set<number>>(new Set());
  
  const toggleSuccessCase = (index: number) => {
    const newExpanded = new Set(expandedSuccessCases);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSuccessCases(newExpanded);
  };
  
  const toggleFailureCase = (index: number) => {
    const newExpanded = new Set(expandedFailureCases);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFailureCases(newExpanded);
  };

  // precedents_data가 있으면 사용, 없으면 빈 배열
  const precedentsData: PrecedentDetail[] = precedentsAnalysis?.precedents_data || [];

  // Case ID로 판례 링크 찾기 (개선된 버전)
  const findPrecedentLink = (caseText: string): string | null => {
    const caseIdMatch = caseText.match(/CBP-[a-zA-Z0-9]+/);
    if (!caseIdMatch) return null;
    
    const caseId = caseIdMatch[0];
    
    // precedents_data에서 찾기
    const precedent = precedentsData.find(p => p.case_id === caseId);
    if (precedent?.link) {
      return precedent.link;
    }
    
    // successCases나 failureCases 텍스트에서 직접 링크 찾기
    // 예: "CBP-657409bb: https://example.com"
    const linkMatch = caseText.match(/https?:\/\/[^\s]+/);
    if (linkMatch) {
      return linkMatch[0];
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header - 원래대로 유지 */}
      <div className="bg-gradient-secondary from-accent-cream to-secondary px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Gavel className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">관련 판례 분석</h3>
            <p className="text-sm text-gray-600">Tavily 실시간 CBP 데이터 기반 분석</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI가 실시간 CBP 판례를 검색하고 있습니다...</p>
            <p className="text-sm text-gray-400 mt-2">Tavily Search API 활용 중</p>
          </div>
        ) : analysisComplete && precedentsAnalysis ? (
          <div className="space-y-6">
            
            {/* 신뢰도 표시 */}
            <div className="mb-4">
              <strong>신뢰도:</strong> {(precedentsAnalysis.confidence_score * 100).toFixed(0)}%
            </div>
            
            {/* 실제 판례 데이터 (precedents_data 사용) */}
            {precedentsData.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  실제 CBP 판례 데이터
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {precedentsData.length}건 검색됨
                  </span>
                </h4>
                
                <div className="space-y-3">
                  {precedentsData.map((precedent, index) => (
                    <div 
                      key={index} 
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Case ID & Status */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                              {precedent.case_id}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                              precedent.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800' 
                                : precedent.status === 'DENIED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {precedent.status === 'APPROVED' ? '✓ 승인' : 
                               precedent.status === 'DENIED' ? '✗ 거부' : 
                               precedent.status}
                            </span>
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                              {precedent.source === 'tavily_search' ? '🔍 Tavily 검색' : precedent.source}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h5 className="font-semibold text-gray-900 mb-2 text-base">
                            {precedent.title}
                          </h5>
                          
                          {/* Description */}
                          {precedent.description && (
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                              {precedent.description}
                            </p>
                          )}
                          
                          {/* HS Code */}
                          <div className="mt-3 text-xs text-gray-500">
                            HS Code: <span className="font-mono font-medium text-gray-700">{precedent.hs_code}</span>
                          </div>
                        </div>
                        
                        {/* Link Button */}
                        {precedent.link && (
                          <a
                            href={precedent.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                            title="CBP 원본 문서 보기"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Success Cases - 아코디언 형식 */}
            {precedentsAnalysis.success_cases && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <strong className="text-green-800 text-base">승인된 사례</strong>
                </div>
                {precedentsAnalysis.success_cases.length > 0 ? (
                  <ul className="space-y-2">
                    {precedentsAnalysis.success_cases.map((successCase, index) => {
                      const link = findPrecedentLink(successCase);
                      const caseIdMatch = successCase.match(/CBP-[a-zA-Z0-9]+/);
                      const caseId = caseIdMatch ? caseIdMatch[0] : `Case ${index + 1}`;
                      const isExpanded = expandedSuccessCases.has(index);
                      
                      return (
                        <li key={index} className="bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between p-3">
                            <button
                              onClick={() => toggleSuccessCase(index)}
                              className="flex items-center gap-2 flex-1 text-left hover:bg-green-50 -m-3 p-3 rounded-lg transition-colors min-w-0"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                              )}
                              {link ? (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-mono text-green-700 font-medium hover:text-green-900 hover:underline flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {caseId}
                                  <ExternalLink className="w-3 h-3 inline" />
                                </a>
                              ) : (
                                <span className="text-sm font-mono text-green-800 font-medium">{caseId}</span>
                              )}
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="px-3 pb-3 pt-1 text-sm text-green-700 border-t border-green-100 bg-green-50/50">
                              {successCase}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600 italic">승인된 사례가 없습니다.</p>
                )}
              </div>
            )}
            
            {/* Review Cases - 아코디언 형식 */}
            {precedentsAnalysis.review_cases && precedentsAnalysis.review_cases.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <strong className="text-yellow-800 text-base">검토 필요 사례</strong>
                </div>
                <ul className="space-y-2">
                  {precedentsAnalysis.review_cases.map((reviewCase, index) => {
                    const link = findPrecedentLink(reviewCase);
                    const directLink = precedentsData.find(p => reviewCase.includes(p.case_id))?.link;
                    const finalLink = link || directLink;
                    const caseIdMatch = reviewCase.match(/CBP-[a-zA-Z0-9]+/);
                    const caseId = caseIdMatch ? caseIdMatch[0] : `Case ${index + 1}`;
                    const isExpanded = expandedFailureCases.has(index);
                    
                    return (
                      <li key={index} className="bg-white rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between p-3">
                          <button
                            onClick={() => toggleFailureCase(index)}
                            className="flex items-center gap-2 flex-1 text-left hover:bg-yellow-50 -m-3 p-3 rounded-lg transition-colors min-w-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                            )}
                            {finalLink ? (
                              <a
                                href={finalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-yellow-700 font-medium hover:text-yellow-900 hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {caseId}
                                <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            ) : (
                              <span className="text-sm font-mono text-yellow-800 font-medium">{caseId}</span>
                            )}
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 text-sm text-yellow-700 border-t border-yellow-100 bg-yellow-50/50">
                            {reviewCase}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Failure Cases - 아코디언 형식 */}
            {precedentsAnalysis.failure_cases && precedentsAnalysis.failure_cases.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <strong className="text-red-800 text-base">거부된 사례</strong>
                </div>
                <ul className="space-y-2">
                  {precedentsAnalysis.failure_cases.map((failureCase, index) => {
                    const link = findPrecedentLink(failureCase);
                    const directLink = precedentsData.find(p => failureCase.includes(p.case_id))?.link;
                    const finalLink = link || directLink;
                    const caseIdMatch = failureCase.match(/CBP-[a-zA-Z0-9]+/);
                    const caseId = caseIdMatch ? caseIdMatch[0] : `Case ${index + 1}`;
                    const isExpanded = expandedFailureCases.has(index);
                    
                    return (
                      <li key={index} className="bg-white rounded-lg border border-red-200">
                        <div className="flex items-center justify-between p-3">
                          <button
                            onClick={() => toggleFailureCase(index)}
                            className="flex items-center gap-2 flex-1 text-left hover:bg-red-50 -m-3 p-3 rounded-lg transition-colors min-w-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-red-600 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                            {finalLink ? (
                              <a
                                href={finalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-red-700 font-medium hover:text-red-900 hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {caseId}
                                <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            ) : (
                              <span className="text-sm font-mono text-red-800 font-medium">{caseId}</span>
                            )}
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 text-sm text-red-700 border-t border-red-100 bg-red-50/50">
                            {failureCase}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {/* Actionable Insights */}
            {precedentsAnalysis.actionable_insights && precedentsAnalysis.actionable_insights.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <strong className="text-blue-800 text-base">실행 가능한 인사이트</strong>
                </div>
                <ul className="space-y-2">
                  {precedentsAnalysis.actionable_insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                      <span className="text-blue-500 mt-0.5">→</span>
                      <span className="flex-1">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Risk Factors */}
            {precedentsAnalysis.risk_factors && precedentsAnalysis.risk_factors.length > 0 && (
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <strong className="text-orange-800 text-base">위험 요소</strong>
                </div>
                <ul className="space-y-2">
                  {precedentsAnalysis.risk_factors.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                      <span className="text-orange-500 mt-0.5">⚠</span>
                      <span className="flex-1">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Recommended Action */}
            {precedentsAnalysis.recommended_action && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <strong className="text-purple-800 text-base">권장 조치</strong>
                </div>
                <p className="text-sm text-purple-700 leading-relaxed pl-7">
                  {precedentsAnalysis.recommended_action}
                </p>
              </div>
            )}

            {/* Reference Links */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <a
                href="https://www.cbp.gov/trade/rulings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <ExternalLink size={16} />
                CBP 판례 DB
              </a>
              <a
                href="https://rulings.cbp.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
              >
                <FileText size={16} />
                CROSS Rulings
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">판례 분석 데이터를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrecedentsAnalysisCard;
