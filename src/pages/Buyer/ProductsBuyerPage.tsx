import React, { useState, useEffect } from 'react';
import { HeaderBuyer, Chatbot } from '@/components/common';
import { Leaf, Sparkles, Coffee, Utensils, Calculator, Search, Filter } from 'lucide-react';
import { productApi } from '@/api/productApi';
import type { ProductListResponse, PaginatedResponse } from '@/types';

interface Product {
  id: number;
  sellerId: number;
  sellerName: string;
  productId: string;
  productName: string;
  description: string;
  price: number;
  fobPrice: number;
  originCountry: string;
  hsCode: string;
  usTariffRate?: number;  // HS 코드 기반 관세율
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
  createdAt: string;
}

const ProductsBuyerPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [tariffInfo, setTariffInfo] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0
  });

  // 상품 목록 조회
  const fetchProducts = async (page: number = 0, searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let response: PaginatedResponse<ProductListResponse>;
      if (searchQuery && searchQuery.trim()) {
        response = await productApi.searchProductsByName(searchQuery, page, pagination.size);
      } else {
        response = await productApi.getProducts(page, pagination.size);
      }
      
      setProducts(response.content as Product[]);
      setPagination(prev => ({
        ...prev,
        page: response.pageable.pageNumber,
        totalPages: response.totalPages,
        totalElements: response.totalElements
      }));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('상품을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Initialize quantities
    const initialQuantities: Record<string, number> = {};
    products.forEach(product => {
      initialQuantities[product.productId] = 1;
    });
    setQuantities(initialQuantities);
  }, [products]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    fetchProducts(0, query);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchTerm);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getIcon = (hsCode: string) => {
    // HS코드 기반으로 아이콘 결정
    if (hsCode.startsWith('12')) return <Leaf size={48} />;
    if (hsCode.startsWith('33')) return <Sparkles size={48} />;
    if (hsCode.startsWith('09')) return <Coffee size={48} />;
    if (hsCode.startsWith('69')) return <Utensils size={48} />;
    return <Leaf size={48} />;
  };

  const calculateTariff = (productId: string) => {
    const product = products.find(p => p.productId === productId);
    const quantity = quantities[productId] || 1;
    
    if (!product) {
      alert('상품 정보를 찾을 수 없습니다.');
      return;
    }
    
    // HS 코드 기반 실제 관세율 사용
    const tariffRate = product.usTariffRate || 0; // HS 코드 테이블의 us_tariff_rate 사용
    const totalFobValue = product.fobPrice * quantity;
    const tariffAmount = totalFobValue * tariffRate; // 이미 소수점 형태 (0.15 = 15%)
    const totalWithTariff = totalFobValue + tariffAmount;
    
    setTariffInfo(prev => ({
      ...prev,
      [productId]: {
        tariffRate,
        tariffAmount,
        totalWithTariff,
        show: true
      }
    }));
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBuyer />
      
      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Korean Products</h1>
          <p className="text-text-secondary">Discover premium Korean products with AI-powered customs insights</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors flex items-center gap-2">
            <Filter size={20} />
            Filter
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => fetchProducts()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              {/* Product Image */}
              <div className="relative bg-gradient-secondary from-accent-cream to-secondary flex items-center justify-center" style={{ height: '200px' }}>
                <div className="text-white opacity-70">
                  {getIcon(product.hsCode)}
                </div>
                <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-primary px-2 py-1 rounded-xl text-xs font-semibold">
                  {product.originCountry}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                  {product.productName}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-primary mb-4">
                  {formatPrice(product.price)}
                </div>
                <div className="text-xs text-text-secondary mb-4">
                  HS Code: {product.hsCode} | Seller: {product.sellerName}
                </div>

                 {/* Quantity Section */}
                 <div className="mb-4">
                   <div className="text-sm font-medium text-text-primary mb-2">Quantity</div>
                   <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-2">
                     <input
                       type="number"
                       min="1"
                       value={quantities[product.productId] || 1}
                       onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus-ring-primary"
                     />
                     <button
                       onClick={() => calculateTariff(product.productId)}
                       className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
                     >
                       <Calculator size={16} />
                       <span className="hidden xs:inline">Calculate</span>
                     </button>
                   </div>
                 </div>

                {/* Tariff Info */}
                {tariffInfo[product.productId]?.show && (
                  <div className="bg-accent-cream p-3 rounded-lg mt-auto">
                    <div className="text-xs text-text-primary mb-2">
                      Estimated Tariff: {formatPrice(tariffInfo[product.productId].tariffAmount)}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      Total with tariff: {formatPrice(tariffInfo[product.productId].totalWithTariff)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              이전
            </button>
            <span className="text-text-secondary">
              {pagination.page + 1} / {pagination.totalPages} 페이지
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              다음
            </button>
          </div>
        )}

        {/* AI Chatbot */}
        <Chatbot 
          title="AI Trade Assistant"
          placeholder="Ask about import requirements..."
          welcomeMessage="Hello! I'm your AI trade assistant. Ask me about import requirements, regulations, or any product-specific concerns for purchasing from Korea."
          sessionType="BUYER_PURCHASE_INQUIRY"
        />
      </main>
    </div>
  );
};

export default ProductsBuyerPage;

