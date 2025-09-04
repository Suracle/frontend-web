import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeaderSeller } from '@/components/common';
import { Plus, Package, Clock, CheckCircle, TrendingUp, Edit, Trash2, Leaf, Sparkles, Coffee, Utensils, Shirt } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  image: string;
  createdAt: string;
  hsCode: string;
  icon: string; // Font Awesome 아이콘 클래스 추가
}

const ProductsSellerPage: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: '프리미엄 한국 인삼 엑기스',
      description: '6년근 홍삼을 사용한 고품질 인삼 엑기스',
      category: '건강식품',
      price: 89.99,
      stock: 50,
      status: 'active',
      image: 'https://via.placeholder.com/100x100',
      createdAt: '2024-03-15',
      hsCode: '1211.20.10',
      icon: 'leaf', // 인삼 엑기스용 아이콘
    },
    {
      id: '2',
      name: '한국 뷰티 스킨케어 세트',
      description: '프리미엄 K-뷰티 제품 4종 세트',
      category: '화장품',
      price: 124.99,
      stock: 100,
      status: 'pending',
      image: 'https://via.placeholder.com/100x100',
      createdAt: '2024-03-20',
      hsCode: '3304.99.00',
      icon: 'sparkles', // 스킨케어용 아이콘
    },
    {
      id: '3',
      name: '전통 한국 도자기 세트',
      description: '전통 기법으로 제작된 수공예 도자기',
      category: '공예품',
      price: 199.99,
      stock: 30,
      status: 'active',
      image: 'https://via.placeholder.com/100x100',
      createdAt: '2024-03-10',
      hsCode: '6912.00.48',
      icon: 'coffee', // 도자기용 아이콘
    },
    {
      id: '4',
      name: '제주 프리미엄 녹차',
      description: '제주도 유기농 녹차잎 프리미엄 등급',
      category: '차류',
      price: 45.99,
      stock: 200,
      status: 'pending',
      image: 'https://via.placeholder.com/100x100',
      createdAt: '2024-03-22',
      hsCode: '0902.10.10',
      icon: 'leaf', // 녹차용 아이콘
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // 컴포넌트 마운트 시 필요한 초기화 작업
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { 
        color: 'bg-green-100 text-green-800 border border-green-200', 
        label: '승인 완료',
        icon: <CheckCircle size={12} />
      },
      inactive: { 
        color: 'bg-gray-100 text-gray-800 border border-gray-200', 
        label: '비활성',
        icon: <div className="w-3 h-3 rounded-full bg-gray-400"></div>
      },
      pending: { 
        color: 'bg-orange-100 text-orange-800 border border-orange-200', 
        label: '검토 대기',
        icon: <Clock size={12} />
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

  // 아이콘 매핑 함수
  const getIcon = (iconName: string) => {
    const iconMap = {
      leaf: <Leaf size={20} />,
      sparkles: <Sparkles size={20} />,
      coffee: <Coffee size={20} />,
      utensils: <Utensils size={20} />,
      shirt: <Shirt size={20} />
    };
    return iconMap[iconName as keyof typeof iconMap] || <Package size={20} />;
  };

  // 요약 통계 계산
  const totalProducts = products.length;
  const pendingReview = products.filter(p => p.status === 'pending').length;
  const approved = products.filter(p => p.status === 'active').length;
  const unreviewed = products.filter(p => p.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSeller />
      
      <main className="max-w-6xl mx-auto px-5 py-8">
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
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Package size={20} className="text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">전체 상품</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{pendingReview}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{approved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">미검토</p>
                    <p className="text-2xl font-bold text-gray-900">{unreviewed}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">검색</label>
                  <input
                    type="text"
                    placeholder="상품명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus-ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">카테고리</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus-ring-primary"
                  >
                    <option value="all">전체 카테고리</option>
                    <option value="건강식품">건강식품</option>
                    <option value="화장품">화장품</option>
                    <option value="공예품">공예품</option>
                    <option value="차류">차류</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">상태</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus-ring-primary"
                  >
                    <option value="all">전체 상태</option>
                    <option value="active">승인 완료</option>
                    <option value="inactive">비활성</option>
                    <option value="pending">검토 대기</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors duration-200">
                    필터 적용
                  </button>
                </div>
              </div>
            </div>

            {/* Products List */}
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
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4">
                          <Link 
                            to={`/seller/products/${product.id}`}
                            className="flex items-center hover:text-primary transition-colors"
                          >
                            <div className="bg-accent-cream text-primary flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              {getIcon(product.icon)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-text-primary">
                                {product.name}
                              </div>
                              <div className="text-sm text-text-secondary">{product.description}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-primary">
                          <Link to={`/seller/products/${product.id}`} className="hover:text-primary transition-colors">
                            {formatPrice(product.price)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-primary">
                          <Link to={`/seller/products/${product.id}`} className="hover:text-primary transition-colors">
                            {product.hsCode}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/seller/products/${product.id}`} className="hover:text-primary transition-colors">
                            {getStatusBadge(product.status)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-primary">
                          <Link to={`/seller/products/${product.id}`} className="hover:text-primary transition-colors">
                            {product.createdAt}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: 편집 기능 구현
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: 삭제 기능 구현
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
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-4 hover:bg-gray-50">
                      <Link to={`/seller/products/${product.id}`} className="block">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {getIcon(product.icon)}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="text-sm font-medium text-text-primary truncate">
                                {product.name}
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
                                HS코드: {product.hsCode} • {product.createdAt}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900 p-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // TODO: 편집 기능 구현
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 p-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // TODO: 삭제 기능 구현
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

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                총 {filteredProducts.length}개 상품
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">1</span>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </main>
    </div>
  );
};

export default ProductsSellerPage;
