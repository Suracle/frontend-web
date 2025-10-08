import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderBroker, ToastNotification } from '@/components/common';
import { 
  ReviewProductHeader, 
  ReviewForm,
  ReviewDisplay
} from '@/components/broker';
import { ArrowLeft } from 'lucide-react';
import { 
  ProductInfoGrid,
  TariffAnalysisCard,
  RequirementsAnalysisCard,
  PrecedentsAnalysisCard
} from '@/components/common';
import { requirementApi, type RequirementAnalysisResponse } from '@/api/requirementApi';
import { brokerApi, type BrokerReviewResponse } from '@/api/brokerApi';
import { productApi, type PrecedentsResponse } from '@/api/productApi';

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  fobPrice: number;
  origin: string;
  hsCode: string;
  hsCodeDescription?: string;
  usTariffRate?: number;
  tariffReasoning?: string;
  sellerName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  productId: string;
  description: string;
}

/**
 * ReviewPage - 브로커 리뷰 페이지 (기존)
 * 
 * 이 페이지는 기존에 있던 리뷰 페이지로, URL 경로가 /broker/review/:id 입니다.
 * 새로운 ReviewDetailPage(/broker/review-detail/:id)와 구분됩니다.
 * 
 * 주요 기능:
 * - 리뷰 데이터 로드 및 표시
 * - AI 분석 카드들 (관세, 요구사항, 판례)
 * - 리뷰 작성 및 제출
 * - 키보드 단축키 지원
 */
const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirementAnalysis, setRequirementAnalysis] = useState<RequirementAnalysisResponse | null>(null);
  const [requirementLoading, setRequirementLoading] = useState(false);
  const [precedentsAnalysis, setPrecedentsAnalysis] = useState<PrecedentsResponse | null>(null);
  const [precedentsLoading, setPrecedentsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<BrokerReviewResponse | null>(null);

  // 데이터 로드 함수
  const loadReviewData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 리뷰 정보 조회
      const reviewId = parseInt(id);
      console.log('Loading review data for ID:', reviewId);
      const reviewData = await brokerApi.getReviewById(reviewId);
      console.log('Review data loaded:', reviewData);
      setReview(reviewData);
      
      // 상품 정보 조회 - reviewData.productId는 숫자이므로 API로 매핑 정보를 조회
      console.log('Product ID from review:', reviewData.productId, 'Type:', typeof reviewData.productId);
      
      let productData;
      try {
        // 상품 ID 매핑 조회 시도
        const mappingData = await productApi.getProductIdMapping(reviewData.productId);
        console.log('Product ID mapping:', mappingData);
        
        // 매핑된 productId로 상품 상세 정보 조회
        productData = await productApi.getProductById(mappingData.productId);
        console.log('Product data loaded:', productData);
      } catch (mappingError) {
        console.warn('Product ID mapping failed, trying direct approach:', mappingError);
        
        // 매핑 API가 실패한 경우, productId를 직접 사용하여 상품 정보 조회 시도
        try {
          productData = await productApi.getProductById(reviewData.productId.toString());
          console.log('Product data loaded directly:', productData);
        } catch (directError) {
          console.error('Direct product fetch also failed:', directError);
          throw new Error('상품 정보를 불러올 수 없습니다. 상품 ID: ' + reviewData.productId);
        }
      }
      
      // ProductDetail 형태로 변환
      const productDetail: ProductDetail = {
        id: productData.id,
        name: productData.productName,
        price: productData.price,
        fobPrice: productData.fobPrice,
        origin: productData.originCountry,
        hsCode: productData.hsCode,
        hsCodeDescription: productData.hsCodeDescription,
        usTariffRate: productData.usTariffRate,
        tariffReasoning: productData.tariffReasoning,
        sellerName: productData.sellerName,
        requestDate: new Date(reviewData.requestedAt).toLocaleString('ko-KR'),
        status: reviewData.reviewStatus.toLowerCase() as 'pending' | 'approved' | 'rejected',
        productId: productData.productId,
        description: productData.description
      };
      
      setProduct(productDetail);
      
      // PENDING 상태일 때는 빈 코멘트로 시작 (관세사가 직접 작성)
      // 초기 요청 메시지는 표시하지 않음
      setReviewComment('');
      
    } catch (error) {
      console.error('Failed to load review data:', error);
      setError('리뷰 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 요구사항 분석 조회
  const fetchRequirementAnalysis = async (productId: number) => {
    try {
      setRequirementLoading(true);
      
      // 기존 requirementApi 사용
      const analysis = await requirementApi.getRequirementAnalysis(productId);
      setRequirementAnalysis(analysis);
    } catch (error) {
      console.error('Failed to fetch requirement analysis:', error);
      // 에러가 발생해도 UI는 계속 동작하도록 함
    } finally {
      setRequirementLoading(false);
    }
  };


  // 판례 분석 조회
  const fetchPrecedentsAnalysis = async (productId: number) => {
    try {
      setPrecedentsLoading(true);
      console.log("Fetching precedents for productId:", productId); 
      
      // 먼저 productId 매핑을 통해 문자열 productId 조회
      const mapping = await productApi.getProductIdMapping(productId);
      const stringProductId = mapping.productId;
      
      // 기존 getProductPrecedents API 사용
      const analysis = await productApi.getProductPrecedents(stringProductId);
      console.log("Precedents analysis result:", analysis);
      setPrecedentsAnalysis(analysis);
    } catch (error) {
      console.error('Failed to fetch precedents analysis:', error);
    } finally {
      setPrecedentsLoading(false);
    }
  };

  useEffect(() => {
    loadReviewData();
  }, [id]);

  useEffect(() => {
    if (product) {
      // broker_reviews.product_id는 숫자이므로 그대로 사용
      const numericProductId = product.id;
      fetchRequirementAnalysis(numericProductId);
      fetchPrecedentsAnalysis(numericProductId);
    }
  }, [product]);

  // Auto-save draft
  useEffect(() => {
    if (reviewComment && id) {
      localStorage.setItem(`review_draft_${id}`, reviewComment);
    }
  }, [reviewComment, id]);

  // 상태 변경 핸들러 (승인/반려 취소)
  const handleStatusChange = async (newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (!review) return;

    const currentStatus = review.reviewStatus;
    const productName = product?.name || '상품';

    // 취소 가능한 상태인지 확인
    if (currentStatus === 'PENDING') {
      alert('대기중인 상태는 취소할 수 없습니다.');
      return;
    }

    const action = newStatus === 'PENDING' ? '취소' : 
                   newStatus === 'APPROVED' ? '승인' : '반려';
    const currentAction = currentStatus === 'APPROVED' ? '승인' : '반려';

    if (confirm(`${productName}의 ${currentAction}을 ${action}하시겠습니까?`)) {
      try {
        setIsSubmitting(true);
        
        const comment = newStatus === 'PENDING' ? 
          `${currentAction}이 취소되었습니다.` : 
          `상품이 ${action}되었습니다.`;

        await brokerApi.updateReviewStatus(review.id, newStatus, comment);
        
        setToastMessage(`${currentAction}이 ${action}되었습니다.`);
        setShowToast(true);
        
        // 데이터 새로고침
        await loadReviewData();
        
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        
      } catch (error) {
        console.error('Failed to update review status:', error);
        alert('상태 변경 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };



  const submitReview = async (decision: 'approved' | 'rejected') => {
    // 반려 시에만 의견 필수
    if (decision === 'rejected' && !reviewComment.trim()) {
      alert('반려 시에는 검토 의견을 작성해주세요.');
      return;
    }

    if (!review) {
      alert('리뷰 정보를 찾을 수 없습니다.');
      return;
    }

    const confirmMessage = decision === 'approved' ? 
      '이 상품을 승인하시겠습니까?' : 
      '이 상품을 반려하시겠습니까?';
    
    if (confirm(confirmMessage)) {
      try {
        setIsSubmitting(true);
        
        // 승인 시 의견이 없으면 기본 메시지 사용
        const comment = reviewComment.trim() || (decision === 'approved' ? '상품이 승인되었습니다.' : '');
        
        // API 호출
        await brokerApi.updateReviewStatus(
          review.id,
          decision.toUpperCase() as 'APPROVED' | 'REJECTED',
          comment
        );
        
        // Show toast notification
        setToastMessage(decision === 'approved' ? '상품이 승인되었습니다.' : '상품이 반려되었습니다.');
        setShowToast(true);
        
        // Clear draft
        localStorage.removeItem(`review_draft_${id}`);
        
        // Navigate back to dashboard after delay
        setTimeout(() => {
          setShowToast(false);
          navigate('/broker/requests');
        }, 2000);
        
      } catch (error) {
        console.error('Failed to submit review:', error);
        alert('리뷰 제출 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    if (reviewComment.trim()) {
      if (confirm('작성 중인 내용이 사라집니다. 정말 돌아가시겠습니까?')) {
        navigate('/broker/requests');
      }
    } else {
      navigate('/broker/requests');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        goBack();
      }
      
      // Ctrl/Cmd + Enter to approve
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (reviewComment.trim()) {
          submitReview('approved');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [reviewComment]);

  // Prevent navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (reviewComment.trim()) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [reviewComment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderBroker />
        <div className="max-w-6xl mx-auto px-5 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderBroker />
        <div className="max-w-6xl mx-auto px-5 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-30">⚠️</div>
            <p className="text-gray-600 mb-4">{error || '상품을 찾을 수 없습니다.'}</p>
            <button 
              onClick={loadReviewData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBroker />
      
      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* Product Header */}
        <ReviewProductHeader 
          product={product} 
          onStatusChange={handleStatusChange}
        />

        {/* Product Information Grid */}
        <ProductInfoGrid product={{
          ...product,
          hsCodeDescription: product.hsCodeDescription || 'HS Code Description',
        }} />

        {/* AI Analysis Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <TariffAnalysisCard product={{
            hsCode: product.hsCode,
            fobPrice: product.fobPrice,
            originCountry: product.origin,
            usTariffRate: product.usTariffRate,
            tariffReasoning: product.tariffReasoning
          }} />
          <RequirementsAnalysisCard product={{
            analysisComplete: !!requirementAnalysis,
            requirementAnalysis: requirementAnalysis || undefined,
            loading: requirementLoading
          }} />
          <PrecedentsAnalysisCard product={{
            analysisComplete: !!precedentsAnalysis,
            precedentsAnalysis: precedentsAnalysis || undefined,
            loading: precedentsLoading
          }} />
        </div>

        {/* Comments Section */}
        {/* <CommentsSection product={product} /> */}

        {/* Review Section - 상태에 따라 다른 컴포넌트 표시 */}
        {review?.reviewStatus === 'PENDING' ? (
          <ReviewForm
            reviewComment={reviewComment}
            onCommentChange={setReviewComment}
            onSubmitReview={submitReview}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ReviewDisplay
            reviewComment={review?.reviewComment || ''}
            reviewStatus={review?.reviewStatus as 'APPROVED' | 'REJECTED'}
            reviewedAt={review?.reviewedAt || new Date().toISOString()}
            reviewerName="관세사"
          />
        )}

        {/* Navigation - 하단 오른쪽에 작은 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={goBack}
              className="bg-white px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-md"
            >
              <ArrowLeft size={18} />
              목록으로 돌아가기
            </button>
          </div>
      </main>

      <ToastNotification show={showToast} message={toastMessage} />
    </div>
  );
};

export default ReviewPage;