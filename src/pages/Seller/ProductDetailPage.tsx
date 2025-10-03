import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderSeller, ToastNotification, Chatbot, AnalysisTriggerButton } from '@/components/common';
import { ProductHeader, CommentsSection } from '@/components/seller';
import { ProductInfoGrid, TariffAnalysisCard, RequirementsAnalysisCard, PrecedentsAnalysisCard } from '@/components/common';
import { ArrowLeft } from 'lucide-react';

import { requirementApi, type RequirementAnalysisResponse } from '@/api/requirementApi';
import { productApi, type PrecedentsResponse } from '@/api/productApi';
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
  const [precedentsAnalysis, setPrecedentsAnalysis] = useState<PrecedentsResponse | null>(null);
  const [precedentsLoading, setPrecedentsLoading] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<{ analysisAvailable: boolean } | null>(null);

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

  // 판례 분석 조회
  const fetchPrecedentsAnalysis = async (productId: string) => {
    try {
      setPrecedentsLoading(true);
      console.log("Fetching precedents for productId:", productId); 
      const analysis = await productApi.getProductPrecedents(productId); 
      console.log("Precedents analysis result:", analysis);
      setPrecedentsAnalysis(analysis);
    } catch (error) {
      console.error('Failed to fetch precedents analysis:', error);
    } finally {
      setPrecedentsLoading(false);
    }
  };

  // 분석 상태 조회
  const fetchAnalysisStatus = async (productId: string) => {
    try {
      const status = await productApi.getAnalysisStatus(productId);
      setAnalysisStatus(status);
    } catch (error) {
      console.error('Failed to fetch analysis status:', error);
    }
  };

  // 분석 완료 후 데이터 새로고침
  const handleAnalysisComplete = () => {
    if (product) {
      // 분석 결과 새로고침
      fetchRequirementAnalysis(product.id);
      fetchPrecedentsAnalysis(product.productId);
      
      // 성공 메시지 표시
      setToastMessage('상품 분석이 완료되었습니다. 결과를 확인해주세요.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // 분석 실패 시 처리
  const handleAnalysisError = () => {
    setToastMessage('분석 실행 중 오류가 발생했습니다. 다시 시도해주세요.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRequirementAnalysis(product.id);
      fetchPrecedentsAnalysis(product.productId);
      fetchAnalysisStatus(product.productId);
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
            analysisComplete: !!precedentsAnalysis,
            precedentsAnalysis: precedentsAnalysis || undefined,
            loading: precedentsLoading
          }}
          onRequestReview={requestReview} 
        />
        
        {/* 분석 실행 버튼 */}
        {analysisStatus?.analysisAvailable && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI 분석</h3>
                <p className="text-sm text-gray-600">
                  {product.hsCode ? 
                    `HS코드 ${product.hsCode}에 대한 요구사항, 관세, 판례를 분석합니다.` :
                    '상품의 요구사항, 관세, 판례를 분석합니다.'
                  }
                </p>
              </div>
              <AnalysisTriggerButton
                productId={product.productId}
                analysisType="all"
                onAnalysisComplete={handleAnalysisComplete}
                onAnalysisError={handleAnalysisError}
                className="ml-4"
              />
            </div>
          </div>
        )}

        {/* HS코드가 없는 경우 안내 */}
        {!analysisStatus?.analysisAvailable && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg shadow-sm border border-yellow-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">AI 분석 불가</h3>
                <p className="text-sm text-yellow-700">
                  HS코드가 없어 AI 분석을 실행할 수 없습니다. 상품 정보를 수정하여 HS코드를 추가해주세요.
                </p>
              </div>
            </div>
          </div>
        )}

        <ProductInfoGrid product={{
          price: product.price,
          fobPrice: product.fobPrice,
          origin: product.originCountry,
          hsCode: product.hsCode,
          hsCodeDescription: product.hsCodeDescription,
          description: product.description
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
            analysisComplete: !!precedentsAnalysis,
            precedentsAnalysis: precedentsAnalysis || undefined,
            loading: precedentsLoading
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
