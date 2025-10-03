import React, { useState } from 'react';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { productApi } from '@/api/productApi';

interface AnalysisTriggerButtonProps {
  productId: string;
  analysisType: 'all' | 'requirements' | 'tariff' | 'precedents';
  onAnalysisComplete?: () => void;
  onAnalysisError?: () => void;
  className?: string;
}

export const AnalysisTriggerButton: React.FC<AnalysisTriggerButtonProps> = ({
  productId,
  analysisType,
  onAnalysisComplete,
  onAnalysisError,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  const handleAnalysis = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      let result;
      switch (analysisType) {
        case 'all':
          result = await productApi.triggerAnalysis(productId);
          break;
        case 'requirements':
          result = await productApi.triggerRequirementsAnalysis(productId);
          break;
        case 'tariff':
          result = await productApi.triggerTariffAnalysis(productId);
          break;
        case 'precedents':
          result = await productApi.triggerAnalysis(productId); // precedents는 전체 분석에 포함
          break;
        default:
          throw new Error('Invalid analysis type');
      }
      
      if (result.success) {
        setLastAnalysis(new Date());
        onAnalysisComplete?.();
        
        // 성공 시 버튼 색상 변경
        setTimeout(() => {
          // 3초 후 버튼 색상을 원래대로 복원
        }, 3000);
      } else {
        throw new Error(result.message || '분석 실행에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      // 에러 처리
      if (onAnalysisError) {
        onAnalysisError();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return '재분석 중...';
    
    switch (analysisType) {
      case 'all':
        return lastAnalysis ? '전체 재분석' : '전체 분석 실행';
      case 'requirements':
        return lastAnalysis ? '요구사항 재분석' : '요구사항 분석';
      case 'tariff':
        return lastAnalysis ? '관세 재분석' : '관세 분석';
      case 'precedents':
        return lastAnalysis ? '판례 재분석' : '판례 분석';
      default:
        return lastAnalysis ? '재분석' : '분석 실행';
    }
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    
    if (lastAnalysis) {
      return <RefreshCw className="h-4 w-4" />;
    }
    
    return <Play className="h-4 w-4" />;
  };

  return (
    <button
      onClick={handleAnalysis}
      disabled={isLoading}
      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${lastAnalysis ? 'bg-green-600 hover:bg-green-700 text-white' : 'border border-gray-300 hover:bg-gray-50'} ${className}`}
    >
      {getButtonIcon()}
      <span className="ml-2">{getButtonText()}</span>
    </button>
  );
};

export default AnalysisTriggerButton;
