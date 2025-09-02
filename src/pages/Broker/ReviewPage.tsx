import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderBroker, ToastNotification } from '@/components/common';
import { 
  ReviewProductHeader, 
  ReviewForm 
} from '@/components/broker';
import { 
  ProductInfoGrid,
  TariffAnalysisCard,
  RequirementsAnalysisCard,
  PrecedentsAnalysisCard
} from '@/components/common';

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  fobPrice: number;
  origin: string;
  hsCode: string;
  sellerName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock product data
  const mockProducts: ProductDetail[] = [
    {
      id: 'REV001',
      name: '프리미엄 한국 인삼 엑기스',
      price: 89.99,
      fobPrice: 65.00,
      origin: '대한민국',
      hsCode: '1211.20.10',
      sellerName: '김판매자',
      requestDate: '2024.03.25 09:30',
      status: 'pending'
    },
    {
      id: 'REV002',
      name: '전통 한국 도자기 세트',
      price: 199.99,
      fobPrice: 150.00,
      origin: '대한민국',
      hsCode: '6912.00.48',
      sellerName: '김판매자자',
      requestDate: '2024.03.25 11:15',
      status: 'pending'
    },
    {
      id: 'REV003',
      name: '제주 프리미엄 녹차',
      price: 45.99,
      fobPrice: 28.00,
      origin: '대한민국',
      hsCode: '0902.10.10',
      sellerName: '김판매자자',
      requestDate: '2024.03.24 16:20',
      status: 'pending'
    },
    {
      id: 'REV004',
      name: '한국 뷰티 스킨케어 세트',
      price: 124.99,
      fobPrice: 95.00,
      origin: '대한민국',
      hsCode: '3304.99.00',
      sellerName: '김판매자',
      requestDate: '2024.03.24 14:45',
      status: 'pending'
    },
    {
      id: 'REV005',
      name: '한국 전통 한복 세트',
      price: 299.99,
      fobPrice: 220.00,
      origin: '대한민국',
      hsCode: '6217.10.10',
      sellerName: '김판매자',
      requestDate: '2024.03.24 10:30',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Load product data based on ID
    const foundProduct = mockProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }

    // Load draft from localStorage
    const draft = localStorage.getItem(`review_draft_${id}`);
    if (draft) {
      setReviewComment(draft);
    }
  }, [id]);

  // Auto-save draft
  useEffect(() => {
    if (reviewComment && id) {
      localStorage.setItem(`review_draft_${id}`, reviewComment);
    }
  }, [reviewComment, id]);



  const submitReview = (decision: 'approved' | 'rejected') => {
    if (!reviewComment.trim()) {
      alert('검토 의견을 작성해주세요.');
      return;
    }

    const confirmMessage = decision === 'approved' ? 
      '이 상품을 승인하시겠습니까?' : 
      '이 상품을 반려하시겠습니까?';
    
    if (confirm(confirmMessage)) {
      setIsSubmitting(true);
      
      // Show toast notification
      setToastMessage(decision === 'approved' ? '상품이 승인되었습니다.' : '상품이 반려되었습니다.');
      setShowToast(true);
      
      // Simulate API call
      setTimeout(() => {
        setShowToast(false);
        setIsSubmitting(false);
        
        // Clear draft
        localStorage.removeItem(`review_draft_${id}`);
        
        alert(`검토가 완료되었습니다.\n\n결정: ${decision === 'approved' ? '승인' : '반려'}\n의견: ${reviewComment}\n\n판매자에게 알림이 전송되었습니다.`);
        
        // Navigate back to dashboard
        navigate('/broker/requests');
      }, 2000);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderBroker />
        <div className="max-w-6xl mx-auto px-5 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600">상품을 찾을 수 없습니다.</p>
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
        <ProductInfoGrid product={product} />

        {/* AI Analysis Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TariffAnalysisCard product={product} />
          <RequirementsAnalysisCard product={{...product, analysisComplete: true}} />
          <PrecedentsAnalysisCard product={{...product, analysisComplete: true}} />
        </div>

        {/* Comments Section */}
        {/* <CommentsSection product={product} /> */}

        {/* Review Section */}
        <ReviewForm
          reviewComment={reviewComment}
          onCommentChange={setReviewComment}
          onSubmitReview={submitReview}
          onGoBack={goBack}
          isSubmitting={isSubmitting}
        />
      </main>

      <ToastNotification show={showToast} message={toastMessage} />
    </div>
  );
};

export default ReviewPage;