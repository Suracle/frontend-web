import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderSeller, ToastNotification } from '@/components/common';
import { ProductHeader, CommentsSection } from '@/components/seller';
import { ProductInfoGrid, TariffAnalysisCard, RequirementsAnalysisCard, PrecedentsAnalysisCard } from '@/components/common';
import { ArrowLeft } from 'lucide-react';

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  fobPrice: number;
  origin: string;
  hsCode: string;
  status: 'not_reviewed' | 'pending' | 'approved' | 'rejected';
  analysisComplete: boolean;
  rejectionComment?: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mock data - 실제로는 API에서 가져올 데이터
  const mockProducts: ProductDetail[] = [
    {
      id: '1',
      name: '프리미엄 한국 인삼 엑기스',
      description: '6년근 홍삼을 사용한 고품질 인삼 엑기스로, 건강 증진에 도움을 주는 프리미엄 제품입니다.',
      price: 89.99,
      fobPrice: 65.00,
      origin: '대한민국',
      hsCode: '1211.20.10',
      status: 'pending',
      analysisComplete: false,
    },
    {
      id: '2',
      name: '한국 뷰티 스킨케어 세트',
      description: '프리미엄 K-뷰티 제품 4종 세트로, 클렌저, 토너, 세럼, 모이스처라이저가 포함되어 있습니다.',
      price: 124.99,
      fobPrice: 95.00,
      origin: '대한민국',
      hsCode: '3304.99.00',
      status: 'not_reviewed',
      analysisComplete: false,
    }
  ];

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === id) || mockProducts[0];
    setProduct(foundProduct);
    
    // AI 분석 시뮬레이션
    setTimeout(() => {
      setProduct(prev => prev ? { ...prev, analysisComplete: true } : null);
    }, 5000);
  }, [id]);



  const requestReview = () => {
    if (!product?.analysisComplete) {
      alert('AI 분석이 완료된 후에 관세사 검토를 요청할 수 있습니다.');
      return;
    }

    setProduct(prev => prev ? { ...prev, status: 'pending' } : null);
    setToastMessage('관세사 검토 요청이 전송되었습니다.');
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const goBack = () => {
    window.history.back();
  };

  if (!product) {
    return <div className="min-h-screen bg-light-gray flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-secondary">상품 정보를 불러오는 중...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <HeaderSeller />
      
      <main className="max-w-6xl mx-auto px-5 py-8">
        <ProductHeader 
          product={product} 
          onRequestReview={requestReview} 
        />
        
        <ProductInfoGrid product={product} />
        
        {/* AI Analysis Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <TariffAnalysisCard product={product} />
          <RequirementsAnalysisCard product={product} />
          <PrecedentsAnalysisCard product={product} />
        </div>
        
        <CommentsSection product={product} />

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button 
            onClick={goBack}
            className="px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            돌아가기
          </button>
        </div>
      </main>

      <ToastNotification show={showToast} message={toastMessage} />
    </div>
  );
};

export default ProductDetailPage;
