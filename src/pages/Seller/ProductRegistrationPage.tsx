import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderSeller, Chatbot } from '@/components/common';
import { PlusCircle } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  hsCode: string;
}

const ProductRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    origin: '',
    hsCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.name) newErrors.name = '상품명을 입력해주세요';
    if (!formData.description) newErrors.description = '상품 설명을 입력해주세요';
    if (formData.price <= 0) newErrors.price = '가격을 입력해주세요';
    if (formData.stock < 0) newErrors.stock = 'FOB 가격을 입력해주세요';
    if (!formData.origin) newErrors.origin = '원산지를 입력해주세요';
    if (!formData.hsCode) newErrors.hsCode = 'HS코드를 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // TODO: 실제 API 호출로 대체
      console.log('Product registration:', formData);
      
      // 성공 시 상품 목록 페이지로 이동
      setTimeout(() => {
        navigate('/seller/products');
      }, 1000);
    } catch (error) {
      console.error('Product registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
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
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                        상품명 *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.name ? 'border-error' : 'border-border'
                        }`}
                        placeholder="예: 프리미엄 한국 인삼 엑기스"
                        required
                      />
                      {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
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
                      <label htmlFor="stock" className="block text-sm font-medium text-text-primary mb-2">
                        FOB 가격 (USD) *
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.stock ? 'border-error' : 'border-border'
                        }`}
                        placeholder="120.00"
                        required
                      />
                      {errors.stock && <p className="text-error text-xs mt-1">{errors.stock}</p>}
                    </div>

                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-text-primary mb-2">
                        원산지 *
                      </label>
                      <input
                        type="text"
                        id="origin"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.origin ? 'border-error' : 'border-border'
                        }`}
                        placeholder="대한민국"
                        required
                      />
                      {errors.origin && <p className="text-error text-xs mt-1">{errors.origin}</p>}
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
                        placeholder="상품의 특징, 용도, 성분 등을 상세히 입력해주세요. 정확한 HS코드 분류를 위해 가능한 상세하게 작성해주세요."
                        required
                      />
                      {errors.description && <p className="text-error text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="hsCode" className="block text-sm font-medium text-text-primary mb-2">
                        HS코드
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
                          placeholder="AI가 추천하는 HS코드를 선택하거나 직접 입력하세요"
                          readOnly
                        />
                        <button 
                          type="button" 
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                          onClick={() => {
                            // TODO: HS코드 확인 로직 구현
                            console.log('HS코드 확인');
                          }}
                        >
                          <i className="fas fa-magic"></i>
                          HS코드 확인
                        </button>
                      </div>
                      {errors.hsCode && <p className="text-error text-xs mt-1">{errors.hsCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

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
