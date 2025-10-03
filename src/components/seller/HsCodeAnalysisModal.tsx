import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { hsCodeAnalysisApi } from '@/api/hsCodeAnalysisApi';
import { hsGraphGatewayApi, type HsCodeAnalysisRequest, type HsCodeSuggestion } from '@/api/hsGraphGatewayApi';

interface HsCodeAnalysisProps {
  productName: string;
  productDescription: string;
  onHsCodeSelected: (hsCode: string, description: string) => void;
}

const HsCodeAnalysis: React.FC<HsCodeAnalysisProps> = ({
  productName,
  productDescription,
  onHsCodeSelected
}) => {
  const [suggestions, setSuggestions] = useState<HsCodeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
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

      // const response = await hsCodeAnalysisApi.analyzeHsCode(request);
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
    if (!analysisSessionId) return;

    try {
      await hsCodeAnalysisApi.selectHsCode({
        analysisId: suggestion.id,
        analysisSessionId: analysisSessionId
      });

      setSelectedId(suggestion.id);
      onHsCodeSelected(suggestion.hsCode, suggestion.description);
    } catch (err) {
      console.error('HS코드 선택 실패:', err);
      setError('HS코드 선택에 실패했습니다. 다시 시도해주세요.');
    }
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

            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`border-2 rounded-lg p-4 transition-all duration-200 ${selectedId === suggestion.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-border hover:border-primary hover:shadow-md'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                          {index + 1}순위
                        </span>
                        <span className={`text-xs font-medium ${getConfidenceColor(suggestion.confidenceScore)}`}>
                          정확도: {getConfidenceText(suggestion.confidenceScore)} ({(suggestion.confidenceScore * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-text-primary mb-1">
                        {suggestion.hsCode}
                      </h4>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {suggestion.description}
                      </p>
                    </div>
                    {selectedId === suggestion.id && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>

                  <div className="bg-light-gray rounded-lg p-3 mb-3">
                    <h5 className="font-semibold text-text-primary text-sm mb-1">추천 근거</h5>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {suggestion.reasoning}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-text-secondary">
                      <span className="font-medium">미국 관세율: </span>
                      <span className="text-primary font-semibold">
                        {(suggestion.usTariffRate * 100).toFixed(2)}%
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelect(suggestion)}
                      disabled={selectedId === suggestion.id}
                      className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200 ${selectedId === suggestion.id
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-gradient-primary to-secondary text-white hover:transform hover:-translate-y-0.5 hover:shadow-lg'
                        }`}
                    >
                      {selectedId === suggestion.id ? '선택됨' : '선택'}
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
