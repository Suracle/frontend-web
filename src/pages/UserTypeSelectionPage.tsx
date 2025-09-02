import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle, UserTypeCard, PlatformFeatures, WorkflowExplanation } from '@/components/common';

const UserTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'buyer',
      title: '구매자',
      description: '상품을 구매하고 싶으신가요?',
      icon: 'fas fa-shopping-cart',
      color: 'var(--primary)',
      path: '/buyer/products',
      features: [
        '다양한 상품 검색 및 비교',
        'AI 관세 계산 및 요건 분석',
        '실시간 배송 추적',
        '고객 리뷰 및 평점'
      ]
    },
    {
      id: 'seller',
      title: '판매자',
      description: '상품을 판매하고 싶으신가요?',
      icon: 'fas fa-store',
      color: 'var(--secondary)',
      path: '/seller/products',
      features: [
        '간편한 상품 등록 및 관리',
        'AI HS코드 추천 및 분석',
        '실시간 주문 현황 확인',
        '관세사 검토 요청'
      ]
    },
    {
      id: 'broker',
      title: '관세사 (Customs Broker)',
      description: '무역 중개 및 관세 서비스를 제공하시나요?',
      icon: 'fas fa-handshake',
      color: 'var(--accent-cream)',
      path: '/broker/requests',
      features: [
        'AI 분석 리포트 검토',
        '승인/반려 및 코멘트',
        '수입/수출 요청 관리',
        '전문적인 관세 컨설팅'
      ]
    }
  ];

  const handleUserTypeSelect = (userType: string) => {
    const selectedType = userTypes.find(type => type.id === userType);
    if (selectedType) {
      navigate(selectedType.path);
    }
  };

  const platformFeatures = [
    {
      icon: 'fas fa-robot',
      title: 'AI 무역 어시스턴트',
      description: 'HS코드 추천, 관세 계산, 수입 요건 분석을 AI가 자동으로 수행'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '안전한 거래',
      description: '엄격한 보안 시스템과 검증된 거래 프로세스'
    },
    {
      icon: 'fas fa-globe',
      title: '글로벌 네트워크',
      description: '전 세계 150개국 이상의 파트너와 연결'
    }
  ];

  const workflowSteps = [
    {
      number: 1,
      title: '사용자 유형 선택',
      description: '구매자, 판매자, 관세사 중 선택'
    },
    {
      number: 2,
      title: '회원가입/로그인',
      description: '이메일과 패스워드로 계정 생성'
    },
    {
      number: 3,
      title: 'AI 분석 및 서비스',
      description: '자동화된 무역 관련 분석 제공'
    },
    {
      number: 4,
      title: '관세사 검토',
      description: '전문가의 최종 검토 및 승인'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-accent font-['-apple-system',BlinkMacSystemFont,'Segoe_UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif]">
      <LanguageToggle />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header with Brand Mark */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <i className="fas fa-bridge text-5xl text-red-600"></i>
              <h1 className="text-5xl font-bold text-red-600">K-Bridge</h1>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            글로벌 무역을 위한 스마트한 플랫폼
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                               구매자, 판매자, 관세사(Customs Broker)를 위한 통합 무역 솔루션을 경험해보세요
          </p>
          
          {/* Login/Signup Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <i className="fas fa-sign-in-alt"></i>
              로그인
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold border-2 border-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
            >
              <i className="fas fa-user-plus"></i>
              회원가입
            </button>
          </div>
        </div>

        {/* User Type Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-16">
          {userTypes.map((userType) => (
            <UserTypeCard
              key={userType.id}
              userType={userType}
              onSelect={handleUserTypeSelect}
            />
          ))}
        </div>

        {/* Platform Features */}
        <PlatformFeatures
          title="K-Bridge 플랫폼의 핵심 기능"
          features={platformFeatures}
        />

        {/* Workflow Explanation */}
        <WorkflowExplanation
          title="플랫폼 이용 흐름"
          steps={workflowSteps}
        />

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-red-600 hover:underline font-medium"
            >
              로그인하기
            </button>
            {' '}또는{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-red-600 hover:underline font-medium"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;
