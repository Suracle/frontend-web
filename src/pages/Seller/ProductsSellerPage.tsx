import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeaderSeller, Chatbot } from '@/components/common';
import { Plus, Package, Clock, CheckCircle, TrendingUp, Trash2, Leaf, Sparkles, Coffee, Utensils, X } from 'lucide-react';
import { productApi } from '@/api/productApi';
import { useAuthStore } from '@/stores/authStore';

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
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
  createdAt: string;
}

const ProductsSellerPage: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0
  });

  // 통계 조회 (검색/필터링 없이 전체 상품 기준)
  const fetchStats = async () => {
    try {
      if (!user?.id) return;
      const sellerId = user.id;
      
      // 전체 상품 조회 (페이지네이션 없이)
      const response = await productApi.searchProductsBySellerIdAndNameAndStatus(sellerId, null, 'all', 0, 1000);
      const allProducts = response.content as Product[];
      
      setStats({
        totalProducts: allProducts.length,
        pendingReview: allProducts.filter(p => p.status === 'PENDING_REVIEW').length,
        approved: allProducts.filter(p => p.status === 'APPROVED').length,
        rejected: allProducts.filter(p => p.status === 'REJECTED').length
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // 상품 목록 조회
  const fetchProducts = async (page: number = 0, searchQuery?: string, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // 로그인된 사용자의 ID 사용
      if (!user?.id) {
        setError('로그인이 필요합니다.');
        return;
      }
      const sellerId = user.id;
      
      // 통합된 API 사용 (검색어가 없으면 null로 전달)
      const searchTerm = searchQuery && searchQuery.trim() ? searchQuery : null;
      const statusFilter = status || selectedStatus;
      const response = await productApi.searchProductsBySellerIdAndNameAndStatus(sellerId, searchTerm, statusFilter, page, pagination.size);
      
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
    fetchStats();
    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    fetchProducts(0, query);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    // 현재 검색어와 새로운 상태로 새로고침
    fetchProducts(0, searchTerm, status);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchTerm);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) return;
    
    try {
      if (!user?.id) {
        alert('로그인이 필요합니다.');
        return;
      }
      const sellerId = user.id;
      await productApi.deleteProduct(productId, sellerId);
      
      // 삭제 후 목록과 통계 모두 새로고침
      fetchProducts(pagination.page, searchTerm);
      fetchStats();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      APPROVED: { 
        color: 'bg-green-100 text-green-800 border border-green-200', 
        label: '승인 완료',
        icon: <CheckCircle size={12} />
      },
      DRAFT: { 
        color: 'bg-gray-100 text-gray-800 border border-gray-200', 
        label: '초안',
        icon: <div className="w-3 h-3 rounded-full bg-gray-400"></div>
      },
      PENDING_REVIEW: { 
        color: 'bg-orange-100 text-orange-800 border border-orange-200', 
        label: '검토 대기',
        icon: <Clock size={12} />
      },
      REJECTED: { 
        color: 'bg-red-100 text-red-800 border border-red-200', 
        label: '반려',
        icon: <div className="w-3 h-3 rounded-full bg-red-400"></div>
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-2`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // 아이콘 매핑 함수 (HS코드 기반)
  const getIcon = (hsCode: string) => {
    if (hsCode.startsWith('12')) return <Leaf size={20} />;
    if (hsCode.startsWith('33')) return <Sparkles size={20} />;
    if (hsCode.startsWith('09')) return <Coffee size={20} />;
    if (hsCode.startsWith('69')) return <Utensils size={20} />;
    return <Package size={20} />;
  };

  // 요약 통계는 stats 상태에서 가져옴 (검색/필터링에 영향받지 않음)

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSeller />
      
      <div className="flex">
        <main className="flex-1 max-w-6xl mx-auto px-5 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">상품 관리</h1>
            <p className="text-text-secondary mt-2">판매 중인 상품을 관리하고 새로운 상품을 등록하세요</p>
          </div>
          
          <Link to="/seller/products/register" className="bg-gradient-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2">
            <Plus size={20} />
            상품 등록
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package size={20} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 상품</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock size={20} className="text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">검토 대기</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">승인 완료</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <X size={20} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">반려</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">검색</label>
              <input
                type="text"
                placeholder="상품명으로 검색..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus-ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">상태</label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus-ring-primary"
              >
                <option value="all">전체 상태</option>
                <option value="APPROVED">승인 완료</option>
                <option value="DRAFT">초안</option>
                <option value="PENDING_REVIEW">검토 대기</option>
                <option value="REJECTED">반려</option>
              </select>
            </div>
            
          </div>
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

        {/* Products List */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-text-primary">등록 상품 목록</h3>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">상품 정보</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">가격</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">HS코드</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">상태</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">등록일</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-primary">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4">
                        <Link 
                          to={`/seller/products/${product.productId}`}
                          className="flex items-center hover:text-primary transition-colors"
                        >
                          <div className="bg-accent-cream text-primary flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getIcon(product.hsCode)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-text-primary">
                              {product.productName}
                            </div>
                            <div className="text-sm text-text-secondary">{product.description}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        <Link to={`/seller/products/${product.productId}`} className="hover:text-primary transition-colors">
                          {formatPrice(product.price)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        <Link to={`/seller/products/${product.productId}`} className="hover:text-primary transition-colors">
                          {product.hsCode}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/seller/products/${product.productId}`} className="hover:text-primary transition-colors">
                          {getStatusBadge(product.status)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        <Link to={`/seller/products/${product.productId}`} className="hover:text-primary transition-colors">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.productId);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-200">
                {products.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50">
                    <Link to={`/seller/products/${product.productId}`} className="block">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getIcon(product.hsCode)}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="text-sm font-medium text-text-primary truncate">
                              {product.productName}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                              {product.description}
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm font-semibold text-text-primary">
                                {formatPrice(product.price)}
                              </span>
                              {getStatusBadge(product.status)}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                              HS코드: {product.hsCode} • {new Date(product.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          <button 
                            className="text-red-600 hover:text-red-900 p-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteProduct(product.productId);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              총 {pagination.totalElements}개 상품
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                {pagination.page + 1} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
        </main>

        {/* Chatbot */}
        <Chatbot 
          title="AI 무역 어시스턴트"
          placeholder="메시지를 입력하세요..."
          welcomeMessage="AI 어시스턴트가 상품 관리와 판매 전략을 도와드립니다. 궁금한 점이 있으시면 언제든 문의하세요!"
        />
      </div>
    </div>
  );
};

export default ProductsSellerPage;