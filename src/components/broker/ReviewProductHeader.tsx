import React from 'react';
import { Clock, Check, X } from 'lucide-react';

interface ReviewProductHeaderProps {
  product: {
    id: number;
    productId: string; // PROD-2024-001 형태
    name: string;
    sellerName: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  onStatusChange?: (newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => void;
}

const ReviewProductHeader: React.FC<ReviewProductHeaderProps> = ({ product, onStatusChange }) => {
  // 상태별 배지 설정
  const getStatusBadge = () => {
    switch (product.status) {
      case 'pending':
        return {
          bgColor: 'bg-orange-500',
          icon: <Clock size={16} />,
          text: '검토 대기'
        };
      case 'approved':
        return {
          bgColor: 'bg-green-500',
          icon: <Check size={16} />,
          text: '승인됨'
        };
      case 'rejected':
        return {
          bgColor: 'bg-red-500',
          icon: <X size={16} />,
          text: '반려됨'
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          icon: <Clock size={16} />,
          text: '알 수 없음'
        };
    }
  };

  const statusBadge = getStatusBadge();

  // 클릭/우클릭 이벤트 핸들러
  const handleStatusClick = (event: React.MouseEvent) => {
    if (!onStatusChange) return;

    if (event.type === 'click') {
      // 클릭: 승인/반려 취소 (PENDING으로 변경)
      if (product.status !== 'pending') {
        onStatusChange('PENDING');
      }
    } else if (event.type === 'contextmenu') {
      // 우클릭: 승인/반려 토글
      event.preventDefault();
      if (product.status === 'approved') {
        onStatusChange('REJECTED');
      } else if (product.status === 'rejected') {
        onStatusChange('APPROVED');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="text-gray-600 mb-2">상품 ID: {product.productId}</div>
          <div className="flex items-center gap-2 text-gray-600">
            <i className="fas fa-store"></i>
            판매자: {product.sellerName}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div 
            className={`${statusBadge.bgColor} text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity select-none`}
            onClick={handleStatusClick}
            onContextMenu={handleStatusClick}
            title={product.status !== 'pending' ? '클릭: 취소, 우클릭: 토글' : ''}
          >
            {statusBadge.icon}
            {statusBadge.text}
          </div>
          <div className="text-gray-600 text-sm">{product.requestDate}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProductHeader;
