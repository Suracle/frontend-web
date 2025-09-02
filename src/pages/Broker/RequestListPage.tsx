import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeaderBroker } from '@/components/common';
import { Clock, CheckCircle, Store, Eye, Check, X } from 'lucide-react';

interface ProductReviewRequest {
  id: string;
  productId: string;
  productName: string;
  sellerName: string;
  requestDate: string;
  price: number;
  fobPrice: number;
  origin: string;
  hsCode: string;
  category: string;
  priority: 'high' | 'normal';
}

const RequestListPage: React.FC = () => {
  const [reviews] = useState<ProductReviewRequest[]>([
    {
      id: 'REV001',
      productId: 'PRD001',
      productName: '프리미엄 한국 인삼 엑기스',
      sellerName: '김판매자',
      requestDate: '2024.03.25 09:30',
      price: 89.99,
      fobPrice: 65.00,
      origin: '대한민국',
      hsCode: '1211.20.10',
      category: 'Health & Wellness',
      priority: 'normal'
    },
    {
      id: 'REV002',
      productId: 'PRD003',
      productName: '전통 한국 도자기 세트',
      sellerName: '김판매자자',
      requestDate: '2024.03.25 11:15',
      price: 199.99,
      fobPrice: 150.00,
      origin: '대한민국',
      hsCode: '6912.00.48',
      category: 'Home & Living',
      priority: 'normal'
    },
    {
      id: 'REV003',
      productId: 'PRD004',
      productName: '제주 프리미엄 녹차',
      sellerName: '김판매자자',
      requestDate: '2024.03.24 16:20',
      price: 45.99,
      fobPrice: 28.00,
      origin: '대한민국',
      hsCode: '0902.10.10',
      category: 'Food & Beverage',
      priority: 'normal'
    },
    {
      id: 'REV004',
      productId: 'PRD002',
      productName: '한국 뷰티 스킨케어 세트',
      sellerName: '김판매자',
      requestDate: '2024.03.24 14:45',
      price: 124.99,
      fobPrice: 95.00,
      origin: '대한민국',
      hsCode: '3304.99.00',
      category: 'Beauty & Cosmetics',
      priority: 'normal'
    },
    {
      id: 'REV005',
      productId: 'PRD005',
      productName: '한국 전통 한복 세트',
      sellerName: '김판매자',
      requestDate: '2024.03.24 10:30',
      price: 299.99,
      fobPrice: 220.00,
      origin: '대한민국',
      hsCode: '6217.10.10',
      category: 'Fashion & Apparel',
      priority: 'normal'
    }
  ]);

  const [currentFilter] = useState('all');

  useEffect(() => {
    console.log('RequestListPage mounted');
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          긴급
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        일반
      </span>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (currentFilter === 'urgent') {
      return review.priority === 'high';
    } else if (currentFilter === 'normal') {
      return review.priority === 'normal';
    }
    return true;
  });

  // const handleReviewProduct = (reviewId: string) => {
  //   // Navigate to detailed review page
  //   console.log(`Reviewing product: ${reviewId}`);
  // };

  const handleApproveProduct = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review && confirm(`${review.productName}을(를) 승인하시겠습니까?`)) {
      alert('상품이 승인되었습니다.');
      // In real implementation, update status and remove from list
    }
  };

  const handleRejectProduct = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      const reason = prompt(`${review.productName} 반려 사유를 입력해주세요:`);
      if (reason && reason.trim()) {
        alert('상품이 반려되었습니다.');
        // In real implementation, update status with rejection reason
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBroker />
      
      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">검토 요청 대시보드</h1>
          <p className="text-gray-600">판매자들의 상품 검토 요청을 확인하고 처리하세요</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock size={24} className="text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">5</div>
            <div className="text-sm text-gray-600">대기중인 요청</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">23</div>
            <div className="text-sm text-gray-600">이번 주 완료</div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-4 opacity-30">📦</div>
              <h3 className="text-lg mb-2">검토 요청이 없습니다</h3>
              <p>현재 {currentFilter === 'urgent' ? '긴급' : currentFilter === 'normal' ? '일반' : ''} 검토 요청이 없습니다.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-800 mb-1">{review.productName}</div>
                    <div className="text-sm text-gray-500 mb-2">상품 ID: {review.productId}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Store size={16} />
                      {review.sellerName}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getPriorityBadge(review.priority)}
                    <div className="text-xs text-gray-500">{review.requestDate}</div>
                  </div>
                </div>

                {/* Review Body */}
                <div className="p-6">
                  {/* Product Details */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1">판매 가격</div>
                      <div className="font-semibold text-gray-800">{formatPrice(review.price)}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1">FOB 가격</div>
                      <div className="font-semibold text-gray-800">{formatPrice(review.fobPrice)}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1">원산지</div>
                      <div className="font-semibold text-gray-800">{review.origin}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1">HS코드</div>
                      <div className="font-semibold text-gray-800">{review.hsCode}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1">카테고리</div>
                      <div className="font-semibold text-gray-800">{review.category}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end">
                    <Link
                      to={`/broker/review/${review.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={16} />
                      상세 검토
                    </Link>
                    <button
                      onClick={() => handleApproveProduct(review.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} />
                      승인
                    </button>
                    <button
                      onClick={() => handleRejectProduct(review.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
                    >
                      <X size={16} />
                      반려
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestListPage;