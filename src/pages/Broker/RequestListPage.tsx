import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeaderBroker } from '@/components/common';
import { Package, Clock, CheckCircle, Store, Eye, Check, X, Loader2 } from 'lucide-react';
import { brokerApi, productApi } from '@/api/brokerApi';
import { useAuthStore } from '@/stores/authStore';

interface ProductReviewRequest {
  id: number;
  productId: string; // PROD-2024-001 형태의 문자열
  productName: string;
  sellerName: string;
  requestDate: string;
  price: number;
  fobPrice: number;
  origin: string;
  hsCode: string;
  category: string;
  priority: 'high' | 'normal';
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const RequestListPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<ProductReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });

  // 로그인한 사용자의 brokerId 사용
  const brokerId = user?.id;

  // 필터링된 리뷰 데이터 반환
  const getFilteredReviews = () => {
    switch (currentFilter) {
      case 'pending':
        return reviews.filter(review => review.reviewStatus === 'PENDING');
      case 'approved':
        return reviews.filter(review => review.reviewStatus === 'APPROVED');
      case 'rejected':
        return reviews.filter(review => review.reviewStatus === 'REJECTED');
      default:
        return reviews;
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filter: 'all' | 'pending' | 'approved' | 'rejected') => {
    setCurrentFilter(filter);
  };

  // 데이터 로드 함수
  const loadReviews = async () => {
    if (!isAuthenticated || !brokerId) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 모든 상태의 리뷰 목록 조회 (관세사별)
      const allReviews = await brokerApi.getReviewsByBrokerId(brokerId, 0, 100);
      
      // 상품 정보와 결합하여 완전한 데이터 생성
      const reviewsWithProductInfo = await Promise.all(
        allReviews.content.map(async (review) => {
          try {
            // 상품 ID 매핑 조회
            const mappingData = await productApi.getProductIdMapping(review.productId);
            
            // 매핑된 productId로 상품 상세 정보 조회
            const product = await productApi.getProductById(mappingData.productId);
            
            return {
              id: review.id,
              productId: mappingData.productId, // PROD-2024-001 형태로 표시
              productName: product.productName,
              sellerName: product.sellerName,
              requestDate: new Date(review.requestedAt).toLocaleString('ko-KR'),
              price: product.price,
              fobPrice: product.fobPrice,
              origin: product.originCountry,
              hsCode: product.hsCode,
              category: 'General', // 카테고리는 별도로 관리해야 함
              priority: 'normal' as const,
              reviewStatus: review.reviewStatus
            };
          } catch (error) {
            console.error(`Failed to load product ${review.productId}:`, error);
            return {
              id: review.id,
              productId: `PROD-${review.productId.toString().padStart(3, '0')}`, // 임시 ID 생성
              productName: review.productName || `상품 ${review.productId}`,
              sellerName: review.brokerName || '알 수 없음',
              requestDate: new Date(review.requestedAt).toLocaleString('ko-KR'),
              price: 0,
              fobPrice: 0,
              origin: '',
              hsCode: '',
              category: 'General',
              priority: 'normal' as const,
              reviewStatus: review.reviewStatus
            };
          }
        })
      );
      
      setReviews(reviewsWithProductInfo);
      
      // 디버깅을 위한 로그
      console.log('Loaded reviews:', reviewsWithProductInfo);
      console.log('Total reviews:', allReviews.content.length);
      console.log('Reviews by status:', {
        PENDING: allReviews.content.filter(r => r.reviewStatus === 'PENDING').length,
        APPROVED: allReviews.content.filter(r => r.reviewStatus === 'APPROVED').length,
        REJECTED: allReviews.content.filter(r => r.reviewStatus === 'REJECTED').length
      });
      
      // 통계 업데이트
      const pendingCount = allReviews.content.filter(r => r.reviewStatus === 'PENDING').length;
      const approvedCount = allReviews.content.filter(r => r.reviewStatus === 'APPROVED').length;
      const rejectedCount = allReviews.content.filter(r => r.reviewStatus === 'REJECTED').length;
      
      setStats({
        pendingCount,
        approvedCount,
        rejectedCount
      });
      
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setError('리뷰 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [brokerId]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            대기중
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            승인됨
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            반려됨
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };


  // const handleReviewProduct = (reviewId: string) => {
  //   // Navigate to detailed review page
  //   console.log(`Reviewing product: ${reviewId}`);
  // };

  const handleApproveProduct = async (reviewId: number) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review && confirm(`${review.productName}을(를) 승인하시겠습니까?`)) {
      try {
        await brokerApi.updateReviewStatus(reviewId, 'APPROVED', '상품이 승인되었습니다.');
        alert('상품이 승인되었습니다.');
        // 목록 새로고침
        loadReviews();
      } catch (error) {
        console.error('Failed to approve product:', error);
        alert('승인 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRejectProduct = async (reviewId: number) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      const reason = prompt(`${review.productName} 반려 사유를 입력해주세요:`);
      if (reason && reason.trim()) {
        try {
          await brokerApi.updateReviewStatus(reviewId, 'REJECTED', reason);
          alert('상품이 반려되었습니다.');
          // 목록 새로고침
          loadReviews();
        } catch (error) {
          console.error('Failed to reject product:', error);
          alert('반려 처리 중 오류가 발생했습니다.');
        }
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
          {/* 전체 카드 */}
          <button
            onClick={() => handleFilterChange('all')}
            className={`bg-white rounded-xl p-4 md:p-6 shadow-sm text-center transition-all duration-200 hover:shadow-md ${
              currentFilter === 'all' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Package size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : reviews.length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">전체 요청</div>
          </button>

          {/* 대기중 카드 */}
          <button
            onClick={() => handleFilterChange('pending')}
            className={`bg-white rounded-xl p-4 md:p-6 shadow-sm text-center transition-all duration-200 hover:shadow-md ${
              currentFilter === 'pending' 
                ? 'ring-2 ring-orange-500 bg-orange-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Clock size={20} className="text-orange-500" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : stats.pendingCount}
            </div>
            <div className="text-xs md:text-sm text-gray-600">대기중</div>
          </button>
          
          {/* 승인 카드 */}
          <button
            onClick={() => handleFilterChange('approved')}
            className={`bg-white rounded-xl p-4 md:p-6 shadow-sm text-center transition-all duration-200 hover:shadow-md ${
              currentFilter === 'approved' 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : stats.approvedCount}
            </div>
            <div className="text-xs md:text-sm text-gray-600">승인</div>
          </button>

          {/* 반려 카드 */}
          <button
            onClick={() => handleFilterChange('rejected')}
            className={`bg-white rounded-xl p-4 md:p-6 shadow-sm text-center transition-all duration-200 hover:shadow-md ${
              currentFilter === 'rejected' 
                ? 'ring-2 ring-red-500 bg-red-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
              <X size={20} className="text-red-500" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : stats.rejectedCount}
            </div>
            <div className="text-xs md:text-sm text-gray-600">반려</div>
          </button>
        </div>

        {/* Review List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <Loader2 size={48} className="animate-spin mx-auto mb-4" />
              <h3 className="text-lg mb-2">데이터를 불러오는 중...</h3>
              <p>잠시만 기다려주세요.</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <div className="text-6xl mb-4 opacity-30">⚠️</div>
              <h3 className="text-lg mb-2">오류가 발생했습니다</h3>
              <p>{error}</p>
              <button 
                onClick={loadReviews}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          ) : getFilteredReviews().length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-4 opacity-30">📦</div>
              <h3 className="text-lg mb-2">검토 요청이 없습니다</h3>
              <p>현재 {currentFilter === 'pending' ? '대기중인' : currentFilter === 'approved' ? '승인된' : currentFilter === 'rejected' ? '반려된' : '전체'} 검토 요청이 없습니다.</p>
            </div>
          ) : (
            getFilteredReviews().map((review) => (
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
                    <div className="flex gap-2">
                      {getPriorityBadge(review.priority)}
                      {getStatusBadge(review.reviewStatus)}
                    </div>
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
                    {review.reviewStatus === 'PENDING' && (
                      <>
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
                      </>
                    )}
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