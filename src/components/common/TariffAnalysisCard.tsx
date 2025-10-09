import React from 'react';
import { Calculator, ExternalLink } from 'lucide-react';

interface TariffAnalysisCardProps {
  product: {
    hsCode: string;
    fobPrice: number;
    originCountry?: string;  // 원산지
    usTariffRate?: number;  // 최종 관세율
    tariffReasoning?: string;     // 관세율 적용 근거
  };
}

const TariffAnalysisCard: React.FC<TariffAnalysisCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // 관세율 계산 (AI 분석 결과 우선, 없으면 0%)
  const finalTariffRate = product.usTariffRate !== undefined ? product.usTariffRate : 0;
  
  // 1개 및 10개 예상 관세 계산
  const tariff1Qty = (product.fobPrice * finalTariffRate);
  const tariff10Qty = (product.fobPrice * 10 * finalTariffRate);
  const total1Qty = product.fobPrice + tariff1Qty;
  const total10Qty = (product.fobPrice * 10) + tariff10Qty;

  // USITC 공식 링크 생성 (HS 코드별 상세 정보)
  const hsCodeClean = product.hsCode.replace(/\./g, '');
  const usitcUrl = `https://hts.usitc.gov/search?query=${hsCodeClean}`;

  // 관세 적용 근거 텍스트 생성 (폴백)
  const getTariffRationale = () => {
    if (finalTariffRate === 0) {
      return `기본 관세율이 0% 적용됩니다.`;
    } else {
      return `현재 관세율 ${(finalTariffRate * 100).toFixed(1)}%가 적용됩니다.`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-secondary from-accent-cream to-secondary p-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <Calculator size={18} className="text-primary" />
        </div>
        <div className="text-lg font-semibold text-text-primary">관세 분석 리포트</div>
      </div>
      <div className="p-6 space-y-4">
        {/* 관세율 정보 */}
        <div>
          <h4 className="font-semibold text-text-primary mb-2">📊 최종 관세율: {(finalTariffRate * 100).toFixed(1)}%</h4>
        </div>

        {/* 관세 적용 근거 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 leading-relaxed">
            {product.tariffReasoning || getTariffRationale()}
          </p>
        </div>

        {/* 예상 관세 (1개 & 10개) */}
        <div>
          <h4 className="font-semibold text-text-primary mb-2">💰 예상 관세</h4>
          <div className="space-y-2">
            {/* 1개 */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-text-secondary">1개 수입 시</span>
                <span className="text-sm font-bold text-primary">{formatPrice(tariff1Qty)}</span>
              </div>
              <div className="text-xs text-text-secondary">
                FOB {formatPrice(product.fobPrice)} + 관세 {formatPrice(tariff1Qty)} = <strong>{formatPrice(total1Qty)}</strong>
              </div>
            </div>
            
            {/* 10개 */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-text-secondary">10개 수입 시</span>
                <span className="text-sm font-bold text-primary">{formatPrice(tariff10Qty)}</span>
              </div>
              <div className="text-xs text-text-secondary">
                FOB {formatPrice(product.fobPrice * 10)} + 관세 {formatPrice(tariff10Qty)} = <strong>{formatPrice(total10Qty)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 공식 자료 링크 */}
        <div className="pt-2 border-t border-gray-200">
          <a 
            href={usitcUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
          >
            <ExternalLink size={14} />
            USITC 공식 사이트에서 확인
          </a>
        </div>
      </div>
    </div>
  );
};

export default TariffAnalysisCard;
