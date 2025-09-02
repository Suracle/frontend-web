import React from 'react';
import { Calculator, ExternalLink } from 'lucide-react';

interface TariffAnalysisCardProps {
  product: {
    hsCode: string;
    fobPrice: number;
  };
}

const TariffAnalysisCard: React.FC<TariffAnalysisCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-secondary from-accent-cream to-secondary p-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <Calculator size={18} className="text-primary" />
        </div>
        <div className="text-lg font-semibold text-text-primary">관세 분석 리포트</div>
      </div>
      <div className="p-6">
        <div className="text-text-primary leading-relaxed mb-4">
          <strong>관세율: 0.0%</strong><br/><br/>
          미국은 한국산 인삼 제품에 대해 무관세를 적용합니다. HS코드 {product.hsCode}에 해당하는 인삼 및 그 제품은 한-미 FTA 협정에 따라 관세가 면제됩니다.<br/><br/>
          <strong>예상 관세:</strong> $0.00 (FOB 가격 {formatPrice(product.fobPrice)} 기준)
        </div>
        <a 
          href="https://www.cbp.gov/trade/tariff" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
        >
          <ExternalLink size={14} />
          미국 관세청 자료 확인
        </a>
      </div>
    </div>
  );
};

export default TariffAnalysisCard;
