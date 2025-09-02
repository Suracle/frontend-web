import React from 'react';
import { Clock } from 'lucide-react';

interface ReviewProductHeaderProps {
  product: {
    id: string;
    name: string;
    sellerName: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

const ReviewProductHeader: React.FC<ReviewProductHeaderProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="text-gray-600 mb-2">상품 ID: {product.id}</div>
          <div className="flex items-center gap-2 text-gray-600">
            <i className="fas fa-store"></i>
            판매자: {product.sellerName}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Clock size={16} />
            검토 대기
          </div>
          <div className="text-gray-600 text-sm">{product.requestDate}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProductHeader;
