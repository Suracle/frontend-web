import React from 'react';
import { Clock, CheckCircle, XCircle, Send } from 'lucide-react';

interface ProductHeaderProps {
  product: {
    id: string;
    name: string;
    status: 'not_reviewed' | 'pending' | 'approved' | 'rejected';
    analysisComplete: boolean;
    precedentsAnalysis?: any;  // 판례 분석 결과 (선택사항)
    loading?: boolean;         // 로딩 상태 (선택사항)
  };
  onRequestReview: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product, onRequestReview }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      not_reviewed: { 
        color: 'bg-gray-100 text-gray-600', 
        label: '미검토',
        icon: <div className="w-3 h-3 rounded-full bg-gray-400"></div>
      },
      pending: { 
        color: 'bg-orange-100 text-orange-600', 
        label: '검토 대기',
        icon: <Clock size={12} />
      },
      approved: { 
        color: 'bg-green-100 text-green-600', 
        label: '승인 완료',
        icon: <CheckCircle size={12} />
      },
      rejected: { 
        color: 'bg-red-100 text-red-600', 
        label: '반려됨',
        icon: <XCircle size={12} />
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text-primary mb-2">{product.name}</h1>
          <div className="text-text-secondary text-sm mb-4">상품 ID: {product.id}</div>
          <div className="flex items-center gap-3">
            {getStatusBadge(product.status)}
            <button
              onClick={onRequestReview}
              disabled={!product.analysisComplete || product.status === 'pending' || product.status === 'approved' || product.status === 'rejected'}
              className={`px-5 py-2 rounded-full font-semibold flex items-center gap-2 transition-all ${
                product.analysisComplete && product.status === 'not_reviewed'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
              {product.status === 'pending' ? '검토 대기 중' : 
               product.status === 'approved' || product.status === 'rejected' ? '관세사 검토 완료' : 
               '관세사 검토 요청'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
