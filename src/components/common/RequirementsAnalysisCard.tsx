import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface RequirementsAnalysisCardProps {
  product: {
    analysisComplete: boolean;
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
        {product.analysisComplete ? (
          <div className="text-text-primary leading-relaxed mb-4">
            <strong>FDA 규정 준수 필요</strong><br/><br/>
            1. <strong>시설 등록:</strong> FDA에 제조시설 등록 필요<br/>
            2. <strong>제품 분류:</strong> 건강기능식품 (Dietary Supplement)로 분류<br/>
            3. <strong>라벨링 요건:</strong> 영양성분표 및 건강기능 표시 규정 준수<br/>
            4. <strong>Good Manufacturing Practice (GMP)</strong> 인증 필요<br/><br/>
            <strong>추가 검사:</strong> 중금속, 농약 잔류물질 검사 권장
          </div>
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p>AI가 수입 요건을 분석하고 있습니다...</p>
          </div>
        )}
        {product.analysisComplete && (
          <a 
            href="https://www.fda.gov/food/dietary-supplements" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
          >
            <ExternalLink size={14} />
            FDA 건강기능식품 규정 확인
          </a>
        )}
      </div>
    </div>
  );
};

export default RequirementsAnalysisCard;
