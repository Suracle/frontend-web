import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { hsGraphGatewayApi, type HsCodeAnalysisRequest, type HsCodeSuggestion } from '@/api/hsGraphGatewayApi';

interface HsCodeAnalysisProps {
  productName: string;
  productDescription: string;
  onHsCodeSelected: (hsCode: string, hsCodeDescription: string, usTariffRate: number, reasoning: string, tariffReasoning: string) => void;
}

const HsCodeAnalysis: React.FC<HsCodeAnalysisProps> = ({
  productName,
  productDescription,
  onHsCodeSelected
}) => {
  const [suggestions, setSuggestions] = useState<HsCodeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHsCode, setSelectedHsCode] = useState<string | null>(null);
  const [analysisSessionId, setAnalysisSessionId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!productName.trim() || !productDescription.trim()) {
      setError('상품명과 상품 설명을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: HsCodeAnalysisRequest = {
        productName: productName.trim(),
        productDescription: productDescription.trim(),
        analysisSessionId: analysisSessionId || undefined
      };

      const response = await hsGraphGatewayApi.analyze(request);
      setSuggestions(response.suggestions);
      setAnalysisSessionId(response.analysisSessionId);
    } catch (err) {
      console.error('HS코드 분석 실패:', err);
      setError('HS코드 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (suggestion: HsCodeSuggestion) => {
    setSelectedHsCode(suggestion.hsCode);
    
    // AI 분석 결과의 모든 정보를 전달
    const hsCodeDescription = suggestion.hierarchicalDescription?.combinedDescription || suggestion.description;
    const usTariffRate = suggestion.usTariffRate || 0;
    const reasoning = suggestion.reasoning || '';
    const tariffReasoning = suggestion.tariffReasoning || '';
    
    onHsCodeSelected(suggestion.hsCode, hsCodeDescription, usTariffRate, reasoning, tariffReasoning);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (score: number) => {
    if (score >= 0.8) return '매우 높음';
    if (score >= 0.6) return '높음';
    if (score >= 0.4) return '보통';
    return '낮음';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border mt-4">
      {/* Header */}
      <div className="bg-gradient-primary to-secondary p-4 text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">HS코드 AI 분석</h3>
            <p className="text-white opacity-90 text-sm mt-1">상품 정보를 분석하여 적합한 HS코드를 추천해드립니다</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-search text-xl text-primary"></i>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">HS코드 분석 시작</h3>
            <p className="text-text-secondary text-sm mb-4">
              상품명과 설명을 바탕으로 AI가 가장 적합한 HS코드를 찾아드립니다.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-2 bg-gradient-primary to-secondary text-white rounded-lg font-semibold hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  분석 중...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i>
                  분석 시작
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-text-primary mb-1">추천된 HS코드</h3>
              <p className="text-text-secondary text-sm">정확도 순으로 3개의 HS코드를 추천해드립니다. 가장 적합한 것을 선택해주세요.</p>
            </div>

            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.hsCode}
                  className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                    selectedHsCode === suggestion.hsCode
                      ? 'border-green-500 bg-green-50'
                      : 'border-border hover:border-primary hover:shadow-md'
                  }`}
                >
                  {/* Header with HS Code and Confidence */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                          {index + 1}순위
                        </span>
                        <span className={`text-xs font-medium ${getConfidenceColor(suggestion.confidenceScore)}`}>
                          정확도: {getConfidenceText(suggestion.confidenceScore)} ({(suggestion.confidenceScore * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-text-primary mb-4">
                        {suggestion.hsCode}
                      </h4>
                    </div>
                    {selectedHsCode === suggestion.hsCode && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>

                  {/* 3개 카드 구조 */}
                  <div className="space-y-3">
                    {/* 1. HS 코드 설명 카드 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <h6 className="font-semibold text-blue-800 text-sm">📋 HS 코드 설명</h6>
                        {suggestion.usitcUrl && (
                          <a
                            href={suggestion.usitcUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="USITC 공식 사이트에서 확인"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                      <div className="text-sm text-blue-700 leading-relaxed">
                        {suggestion.hierarchicalDescription?.combinedDescription || suggestion.description || 'HS 코드 설명을 불러오는 중입니다...'}
                      </div>
                    </div>

                    {/* 2. HS 코드 추천 근거 카드 */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h6 className="font-semibold text-green-800 text-sm mb-3">💡 HS 코드 추천 근거</h6>
                      <div className="text-sm text-green-700 leading-relaxed">
                        {suggestion.reasoning || '추천 근거를 불러오는 중입니다...'}
                      </div>
                    </div>

                    {/* 3. 관세율 카드 */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h6 className="font-semibold text-orange-800 text-sm mb-3">📊 관세율 정보</h6>
                      
                      {/* 최종 관세율 */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-orange-800 text-base">최종 관세율:</span>
                        <span className="font-bold text-2xl text-primary">
                          {(suggestion.usTariffRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* 관세 근거 설명 */}
                      <div className="text-sm text-orange-700 leading-relaxed">
                        <div className="mb-2">
                          <span className="font-medium">관세 적용 근거:</span>
                        </div>
                        <div className="pl-2">
                          {suggestion.baseTariffRate !== undefined && (
                            <div className="mb-1">
                              • 기본 관세율: {(suggestion.baseTariffRate * 100).toFixed(1)}%{suggestion.baseTariffRate === 0 && ''}
                            </div>
                          )}
                          {suggestion.reciprocalTariffRate !== undefined && suggestion.reciprocalTariffRate > 0 && (
                            <div className="mb-1">
                              • 상호관세 추가: +{(suggestion.reciprocalTariffRate * 100).toFixed(1)}% (2025.08.07 발효)
                            </div>
                          )}
                          <div className="mt-2 text-xs text-orange-600">
                            {suggestion.baseTariffRate === 0 && suggestion.reciprocalTariffRate !== undefined && suggestion.reciprocalTariffRate > 0 
                              ? '기본 관세율은 0%이나, 2025년 8월 7일부터 미국 상호관세 정책에 따라 15%의 추가 관세가 부과됩니다.'
                              : suggestion.reciprocalTariffRate !== undefined && suggestion.reciprocalTariffRate > 0 
                              ? '2025년 8월 7일부터 미국 상호관세 정책에 따라 15%의 추가 관세가 부과되어 최종 관세율에 반영되었습니다.'
                              : suggestion.baseTariffRate === 0
                              ? '기본 관세율이 0% 적용됩니다.'
                              : '현재 적용되는 기본 관세율입니다.'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 선택 버튼 */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleSelect(suggestion)}
                      disabled={selectedHsCode === suggestion.hsCode}
                      className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        selectedHsCode === suggestion.hsCode
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-gradient-primary to-secondary text-white hover:transform hover:-translate-y-0.5 hover:shadow-lg'
                      }`}
                    >
                      {selectedHsCode === suggestion.hsCode ? '선택됨' : '선택'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HsCodeAnalysis;