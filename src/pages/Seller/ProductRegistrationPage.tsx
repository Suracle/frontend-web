import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderSeller, Chatbot } from '@/components/common';
import { PlusCircle } from 'lucide-react';
import { productApi } from '@/api/productApi';
import { useAuthStore } from '@/stores/authStore';
import { HsCodeAnalysis } from '@/components/seller';
import type { ProductRequest } from '@/types';

interface ProductFormData {
  productName: string;
  description: string;
  price: number;
  fobPrice: number;
  originCountry: string;
  hsCode: string;
  hsCodeDescription?: string;  // AI 분석 결과
  usTariffRate?: number;       // AI 분석 결과
  reasoning?: string;          // HS 코드 추천 근거
  tariffReasoning?: string;    // 관세율 적용 근거
}

const ProductRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    description: '',
    price: 0,
    fobPrice: 0,
    originCountry: '',
    hsCode: '',
    hsCodeDescription: undefined,
    usTariffRate: undefined,
    reasoning: undefined,
    tariffReasoning: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHsCodeAnalysis, setShowHsCodeAnalysis] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName) newErrors.productName = '상품명을 입력해주세요';
    if (!formData.description) newErrors.description = '상품 설명을 입력해주세요';
    if (formData.price <= 0) newErrors.price = '가격을 입력해주세요';
    if (formData.fobPrice <= 0) newErrors.fobPrice = 'FOB 가격을 입력해주세요';
    if (!formData.originCountry) newErrors.originCountry = '원산지를 입력해주세요';
    if (!formData.hsCode) newErrors.hsCode = 'HS코드를 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleHsCodeSelected = (hsCode: string, hsCodeDescription: string, usTariffRate: number, reasoning: string, tariffReasoning: string) => {
    setFormData(prev => ({
      ...prev,
      hsCode: hsCode,
      hsCodeDescription: hsCodeDescription,
      usTariffRate: usTariffRate,
      reasoning: reasoning,
      tariffReasoning: tariffReasoning
    }));
    setShowHsCodeAnalysis(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 로그인된 사용자 확인
    if (!user?.id) {
      setErrors({ submit: '로그인이 필요합니다.' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 로그인된 사용자의 ID 사용
      const sellerId = user.id;
      
      const productRequest: ProductRequest = {
        productName: formData.productName,
        description: formData.description,
        price: formData.price,
        fobPrice: formData.fobPrice,
        originCountry: formData.originCountry,
        hsCode: formData.hsCode,
        hsCodeDescription: formData.hsCodeDescription,  // AI 분석 결과
        usTariffRate: formData.usTariffRate,           // AI 분석 결과
        reasoning: formData.reasoning,                  // HS 코드 추천 근거
        tariffReasoning: formData.tariffReasoning,      // 관세율 적용 근거
        status: 'DRAFT',
        isActive: true
      };

      await productApi.createProduct(productRequest, sellerId);
      
      // 성공 시 상품 목록 페이지로 이동
      navigate('/seller/products');
    } catch (error) {
      console.error('Product registration failed:', error);
      setErrors({ submit: '상품 등록에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSeller />
      
      <div className="flex">
        {/* Sidebar removed */}
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">새 상품 등록</h1>
              <p className="text-text-secondary">미국 시장 진출을 위한 상품 정보를 입력해주세요. AI가 HS코드와 관세 정보를 자동으로 분석해드립니다.</p>
            </div>

              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-primary to-secondary p-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <PlusCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">상품 정보 입력</h2>
                    <p className="text-white opacity-90 text-sm">정확한 정보를 입력하시면 더 정확한 관세 분석을 받으실 수 있습니다.</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="productName" className="block text-sm font-medium text-text-primary mb-2">
                        상품명 *
                      </label>
                      <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.productName ? 'border-error' : 'border-border'
                        }`}
                        placeholder="예: Premium Vitamin C Serum"
                        required
                      />
                      {errors.productName && <p className="text-error text-xs mt-1">{errors.productName}</p>}
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-text-primary mb-2">
                        상품 가격 (USD) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.price ? 'border-error' : 'border-border'
                        }`}
                        placeholder="99.99"
                        required
                      />
                      {errors.price && <p className="text-error text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <label htmlFor="fobPrice" className="block text-sm font-medium text-text-primary mb-2">
                        FOB 가격 (USD) *
                      </label>
                      <input
                        type="number"
                        id="fobPrice"
                        name="fobPrice"
                        value={formData.fobPrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.fobPrice ? 'border-error' : 'border-border'
                        }`}
                        placeholder="120.00"
                        required
                      />
                      {errors.fobPrice && <p className="text-error text-xs mt-1">{errors.fobPrice}</p>}
                    </div>

                    <div>
                      <label htmlFor="originCountry" className="block text-sm font-medium text-text-primary mb-2">
                        원산지 *
                      </label>
                      <input
                        type="text"
                        id="originCountry"
                        name="originCountry"
                        value={formData.originCountry}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.originCountry ? 'border-error' : 'border-border'
                        }`}
                        placeholder="KOR"
                        required
                      />
                      {errors.originCountry && <p className="text-error text-xs mt-1">{errors.originCountry}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
                        상품 설명 *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-vertical ${
                          errors.description ? 'border-error' : 'border-border'
                        }`}
                        placeholder="상품의 특징, 용도, 성분 등을 상세히 영어로 입력해주세요. 정확한 HS코드 분류를 위해 가능한 상세하게 작성해주세요."
                        required
                      />
                      {errors.description && <p className="text-error text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="hsCode" className="block text-sm font-medium text-text-primary mb-2">
                        HS코드 *
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          id="hsCode"
                          name="hsCode"
                          value={formData.hsCode}
                          onChange={handleInputChange}
                          className={`flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            errors.hsCode ? 'border-error' : 'border-border'
                          }`}
                          placeholder="HS코드를 입력하세요 (예: 3304.10.00.00)"
                          required
                        />
                        <button 
                          type="button" 
                          className="px-6 py-3 bg-gradient-primary to-secondary text-white rounded-lg font-semibold hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                          onClick={() => setShowHsCodeAnalysis(!showHsCodeAnalysis)}
                        >
                          <i className="fas fa-magic"></i>
                          {showHsCodeAnalysis ? '분석 숨기기' : 'HS코드 확인'}
                        </button>
                      </div>
                      {errors.hsCode && <p className="text-error text-xs mt-1">{errors.hsCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* HS코드 분석 섹션 */}
              {showHsCodeAnalysis && (
                <HsCodeAnalysis
                  productName={formData.productName}
                  productDescription={formData.description}
                  onHsCodeSelected={handleHsCodeSelected}
                />
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 justify-end pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate('/seller/products')}
                  className="px-7 py-3 border-2 border-border text-text-primary rounded-lg font-semibold hover:bg-light-gray transition-all duration-300 flex items-center gap-2"
                >
                  <i className="fas fa-arrow-left"></i>
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 bg-gradient-primary to-secondary text-white rounded-lg font-semibold hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  {isSubmitting ? '등록 중...' : '상품 등록'}
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Chatbot */}
        <Chatbot 
          title="AI 무역 어시스턴트"
          placeholder="메시지를 입력하세요..."
          welcomeMessage="AI 어시스턴트가 상품 등록을 도와드립니다.\n궁금한 점이 있으시면 언제든 문의하세요!"
        />
      </div>

    </div>
  );
};

export default ProductRegistrationPage;
