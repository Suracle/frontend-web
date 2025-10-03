import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderSeller, ToastNotification, Chatbot } from '@/components/common';
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
  const [analysisStatus, setAnalysisStatus] = useState<{ 
    analysisAvailable: boolean;
    analysisInProgress: boolean;
    analysisComplete: boolean;
    precedentsComplete: boolean;
    requirementsComplete: boolean;
  } | null>(null);

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

  // 분석 상태 폴링 (분석 중일 때만)
  useEffect(() => {
    if (!product || !analysisStatus?.analysisInProgress) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await productApi.getAnalysisStatus(product.productId);
        
        // 새로운 분석 완료 체크
        if (analysisStatus && !analysisStatus.precedentsComplete && status.precedentsComplete) {
          setToastMessage('✅ 판례 분석이 완료되었습니다!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          fetchPrecedentsAnalysis(product.productId);
        }
        
        if (analysisStatus && !analysisStatus.requirementsComplete && status.requirementsComplete) {
          setToastMessage('✅ 요구사항 분석이 완료되었습니다!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          fetchRequirementAnalysis(product.id);
        }
        
        setAnalysisStatus(status);
        
        // 전체 분석이 완료되면 데이터 새로고침
        if (status.analysisComplete) {
          setToastMessage('🎉 모든 분석이 완료되었습니다! 요구사항과 판례 정보를 확인하세요.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        }
      } catch (error) {
        console.error('분석 상태 폴링 실패:', error);
      }
    }, 3000); // 3초마다 폴링

    return () => clearInterval(pollInterval);
  }, [product, analysisStatus?.analysisInProgress]);

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
            analysisComplete: !!precedentsAnalysis
          }}
          onRequestReview={requestReview} 
        />
        

        {/* 분석 중일 때 표시 */}
        {analysisStatus?.analysisInProgress && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">🔄 AI 분석 진행 중</h3>
                <p className="text-sm text-blue-700">
                  상품의 요구사항과 판례를 분석하고 있습니다. 잠시만 기다려주세요...
                </p>
                {/* 분석 단계별 진행 상황 */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">판례 분석</span>
                    {analysisStatus.precedentsComplete ? (
                      <span className="text-xs text-green-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        완료
                      </span>
                    ) : (
                      <span className="text-xs text-blue-600 flex items-center">
                        <div className="animate-spin w-3 h-3 mr-1">
                          <div className="w-full h-full border border-blue-600 border-t-transparent rounded-full"></div>
                        </div>
                        진행 중
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">요구사항 분석</span>
                    {analysisStatus.requirementsComplete ? (
                      <span className="text-xs text-green-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        완료
                      </span>
                    ) : (
                      <span className="text-xs text-blue-600 flex items-center">
                        <div className="animate-spin w-3 h-3 mr-1">
                          <div className="w-full h-full border border-blue-600 border-t-transparent rounded-full"></div>
                        </div>
                        진행 중
                      </span>
                    )}
                  </div>
                </div>
              </div>
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
