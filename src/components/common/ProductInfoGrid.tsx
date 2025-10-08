import React from 'react';
import ProductInfoCard from './ProductInfoCard';
import ProductDescriptionCard from './ProductDescriptionCard';

interface ProductInfoGridProps {
  product: {
    price: number;
    fobPrice: number;
    origin: string;
    hsCode: string;
    hsCodeDescription: string;
    usTariffRate?: number;    // 관세율 (선택사항)
    reasoning?: string;       // 관세 관련 설명 (선택사항)
    description: string;
  };
}

const ProductInfoGrid: React.FC<ProductInfoGridProps> = ({ product }) => {
  return (
    <div className="space-y-5 mb-8">
      {/* 기본 정보 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ProductInfoCard
          label="상품 가격"
          value={product.price}
          description="미국 시장 판매 가격"
          isPrice={true}
        />
        
        <ProductInfoCard
          label="FOB 가격"
          value={product.fobPrice}
          description="관세 계산 기준 가격"
          isPrice={true}
        />
        
        <ProductInfoCard
          label="원산지"
          value={product.origin}
          description="제품 제조 국가"
        />
        
        <ProductInfoCard
          label="HS코드"
          value={product.hsCode}
          description={product.hsCodeDescription || "HS 코드 설명을 불러오는 중..."}
        />
      </div>
      
      {/* 상품 설명 카드 - 전체 너비 */}
      <ProductDescriptionCard description={product.description} />
    </div>
  );
};

export default ProductInfoGrid;
