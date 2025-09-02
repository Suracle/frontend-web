import React from 'react';
import ProductInfoCard from './ProductInfoCard';

interface ProductInfoGridProps {
  product: {
    price: number;
    fobPrice: number;
    origin: string;
    hsCode: string;
  };
}

const ProductInfoGrid: React.FC<ProductInfoGridProps> = ({ product }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
        description="인삼 및 그 제품 (건조, 분쇄 또는 분말)"
      />
    </div>
  );
};

export default ProductInfoGrid;
