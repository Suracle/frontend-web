import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderSeller, ToastNotification, Chatbot } from '@/components/common';
import { ProductHeader, CommentsSection } from '@/components/seller';
import { ProductInfoGrid, TariffAnalysisCard, RequirementsAnalysisCard, PrecedentsAnalysisCard } from '@/components/common';
import { ArrowLeft } from 'lucide-react';
import { productApi } from '@/api/productApi';
import { requirementApi, type RequirementAnalysisResponse } from '@/api/requirementApi';
import type { ProductResponse } from '@/types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [requirementAnalysis, setRequirementAnalysis] = useState<RequirementAnalysisResponse | null>(null);
  const [requirementLoading, setRequirementLoading] = useState(false);

  // 상품 상세 정보 조회
  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await productApi.getProductById(id);
      setProduct(response);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('상품 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 요구사항 분석 조회
  const fetchRequirementAnalysis = async (productId: number) => {
    try {
      setRequirementLoading(true);
      const analysis = await requirementApi.getRequirementAnalysis(productId);
      setRequirementAnalysis(analysis);
    } catch (error) {
      console.error('Failed to fetch requirement analysis:', error);
    } finally {
      setRequirementLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRequirementAnalysis(product.id);
    }
  }, [product]);



  const requestReview = () => {
    if (!product) return;
    
    setProduct(prev => prev ? { ...prev, status: 'PENDING_REVIEW' } : null);
    setToastMessage('관세사 검토 요청이 전송되었습니다.');
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProduct}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">상품을 찾을 수 없습니다.</p>
          <button 
            onClick={() => navigate('/seller/products')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            상품 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSeller />
      
      <div className="flex">
        <main className="flex-1 max-w-6xl mx-auto px-5 py-8">
        <ProductHeader 
          product={{
            id: product.id.toString(),
            name: product.productName,
            status: product.status === 'DRAFT' ? 'not_reviewed' : 
                   product.status === 'PENDING_REVIEW' ? 'pending' :
                   product.status === 'APPROVED' ? 'approved' : 'rejected',
            analysisComplete: true
          }}
          onRequestReview={requestReview} 
        />
        
        <ProductInfoGrid product={{
          price: product.price,
          fobPrice: product.fobPrice,
          origin: product.originCountry,
          hsCode: product.hsCode
        }} />
        
        {/* AI Analysis Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <TariffAnalysisCard product={{
            hsCode: product.hsCode,
            fobPrice: product.fobPrice
          }} />
          <RequirementsAnalysisCard product={{
            analysisComplete: !!requirementAnalysis,
            requirementAnalysis: requirementAnalysis || undefined,
            loading: requirementLoading
          }} />
          <PrecedentsAnalysisCard product={{
            analysisComplete: true
          }} />
        </div>
        
        <CommentsSection product={{
          status: product.status === 'DRAFT' ? 'not_reviewed' : 
                 product.status === 'PENDING_REVIEW' ? 'pending' :
                 product.status === 'APPROVED' ? 'approved' : 'rejected'
        }} />

        {/* Action Buttons */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={goBack}
            className="px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            돌아가기
          </button>
        </div>
        </main>

        {/* Chatbot */}
        <Chatbot 
          title="AI 무역 어시스턴트"
          placeholder="메시지를 입력하세요..."
          welcomeMessage="AI 어시스턴트가 상품 관리와 관세 분석을 도와드립니다.\n궁금한 점이 있으시면 언제든 문의하세요!"
        />
      </div>

      <ToastNotification show={showToast} message={toastMessage} />
    </div>
  );
};

export default ProductDetailPage;
