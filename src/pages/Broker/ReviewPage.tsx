import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderBroker, ProductInfoCard, ToastNotification } from '@/components/common';
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
import { brokerApi, productApi, type BrokerReviewResponse } from '@/api/brokerApi';

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  fobPrice: number;
  origin: string;
  hsCode: string;
  sellerName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  productId: string;
  description: string;
}

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
      
      // 상품 ID 매핑 조회
      const mappingData = await productApi.getProductIdMapping(reviewData.productId);
      console.log('Product ID mapping:', mappingData);
      
      // 매핑된 productId로 상품 상세 정보 조회
      const productData = await productApi.getProductById(mappingData.productId);
      console.log('Product data loaded:', productData);
      
      // ProductDetail 형태로 변환
      const productDetail: ProductDetail = {
        id: productData.id,
        name: productData.productName,
        price: productData.price,
        fobPrice: productData.fobPrice,
        origin: productData.originCountry,
        hsCode: productData.hsCode,
        sellerName: productData.sellerName,
        requestDate: new Date(reviewData.requestedAt).toLocaleString('ko-KR'),
        status: reviewData.reviewStatus.toLowerCase() as 'pending' | 'approved' | 'rejected',
        productId: productData.productId,
        description: productData.description
      };
      
      setProduct(productDetail);
      
      // PENDING 상태일 때만 기존 리뷰 코멘트 설정 (편집 가능)
      if (reviewData.reviewStatus === 'PENDING' && reviewData.reviewComment) {
        setReviewComment(reviewData.reviewComment);
      }
      
    } catch (error) {
      console.error('Failed to load review data:', error);
      setError('리뷰 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 요구사항 분석 조회
  const fetchRequirementAnalysis = async (productId: string) => {
    try {
      setRequirementLoading(true);
      // TODO: 실제로는 API에서 productId 매핑을 제공해야 함
      // 현재는 임시로 하드코딩된 매핑 사용
      const dbProductId = parseInt(productId.replace('REV', '')) + 1; // REV001 -> 2, REV002 -> 3, etc.
      const analysis = await requirementApi.getRequirementAnalysis(dbProductId);
      setRequirementAnalysis(analysis);
    } catch (error) {
      console.error('Failed to fetch requirement analysis:', error);
    } finally {
      setRequirementLoading(false);
    }
  };

  useEffect(() => {
    loadReviewData();
  }, [id]);

  useEffect(() => {
    if (product) {
      // 요구사항 분석 데이터 조회
      fetchRequirementAnalysis(product.productId);
    }
  }, [product]);

  // Auto-save draft
  useEffect(() => {
    if (reviewComment && id) {
      localStorage.setItem(`review_draft_${id}`, reviewComment);
    }
  }, [reviewComment, id]);



  const submitReview = async (decision: 'approved' | 'rejected') => {
    if (!reviewComment.trim()) {
      alert('검토 의견을 작성해주세요.');
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
        
        // API 호출
        await brokerApi.updateReviewStatus(
          review.id,
          decision.toUpperCase() as 'APPROVED' | 'REJECTED',
          reviewComment
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
        <ReviewProductHeader product={product} />

        {/* Product Information Grid */}
        <ProductInfoGrid product={{
          ...product,
          hsCodeDescription: 'HS Code Description', // 실제로는 API에서 가져와야 함
        }} />

        {/* AI Analysis Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TariffAnalysisCard product={product} />
          <RequirementsAnalysisCard product={{
            analysisComplete: !!requirementAnalysis,
            requirementAnalysis: requirementAnalysis || undefined,
            loading: requirementLoading
          }} />
          <PrecedentsAnalysisCard product={{...product, analysisComplete: true}} />
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