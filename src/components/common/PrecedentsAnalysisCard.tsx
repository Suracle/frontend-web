import React from 'react';
import { Gavel, ExternalLink } from 'lucide-react';

interface PrecedentsAnalysisCardProps {
  product: {
    analysisComplete: boolean;
  };
}

const PrecedentsAnalysisCard: React.FC<PrecedentsAnalysisCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-secondary from-accent-cream to-secondary p-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <Gavel size={18} className="text-primary" />
        </div>
        <div className="text-lg font-semibold text-text-primary">관련 판례 분석</div>
      </div>
      <div className="p-6">
        {product.analysisComplete ? (
          <div className="text-text-primary leading-relaxed mb-4">
            <strong>주요 판례 및 사례</strong><br/><br/>
            <strong>2023년 사례:</strong> 한국산 홍삼 제품의 FDA 시설등록 누락으로 인한 통관 지연<br/>
            <strong>2022년 판례:</strong> 라벨링 불완전으로 인한 반송 사례 발생<br/>
            <strong>2024년 최신 동향:</strong> 건강기능식품 표시 규정 강화<br/><br/>
            <strong>권장사항:</strong> 사전 FDA 컨설팅 및 라벨 검토 필요
          </div>
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p>AI가 관련 판례를 분석하고 있습니다...</p>
          </div>
        )}
        {product.analysisComplete && (
          <a 
            href="https://www.cbp.gov/trade/rulings" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
          >
            <ExternalLink size={14} />
            CBP 판례 데이터베이스 확인
          </a>
        )}
      </div>
    </div>
  );
};

export default PrecedentsAnalysisCard;
