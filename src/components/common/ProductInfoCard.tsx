import React from 'react';

interface ProductInfoCardProps {
  label: string;
  value: string | number;
  description: string;
  isPrice?: boolean;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ label, value, description, isPrice = false }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const displayValue = isPrice && typeof value === 'number' ? formatPrice(value) : value;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-primary">
      <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">{label}</div>
      <div className="text-xl font-bold text-text-primary">{displayValue}</div>
      <div className="text-sm text-text-secondary mt-1">{description}</div>
    </div>
  );
};

export default ProductInfoCard;
