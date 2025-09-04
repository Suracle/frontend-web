import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, LogIn, Eye, EyeOff, Building2 } from 'lucide-react';
import { userApi, type LoginRequest } from '../../api/userApi';
import { useAuthStore } from '@/stores/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accountType: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 다국어 지원
  const translations = {
    ko: {
      brandName: "K-브릿지 이커머스",
      brandSlogan: "한국의 최고를 미국으로, 쉽고 간편하게",
      brandDescription: "새로운 미국 관세 변화가 걱정되시나요? 저희가 해결해드립니다. AI 플랫폼으로 관세와 규정을 즉시 명확하게 파악하세요.",
      welcomeTitle: "다시 오신 것을 환영합니다",
      welcomeSubtitle: "무역 인텔리전스 대시보드에 로그인하세요",
      emailLabel: "이메일 주소",
      emailPlaceholder: "이메일을 입력하세요",
      passwordLabel: "비밀번호",
      passwordPlaceholder: "비밀번호를 입력하세요",
      accountTypeLabel: "계정 유형",
      selectRole: "역할을 선택하세요",
      sellerOption: "판매자 (한국 수출업체)",
      buyerOption: "구매자 (미국 수입업체)",
      customsOption: "관세사 (Customs Broker)",
      signInButton: "로그인",
      newUser: "K-브릿지가 처음이신가요?",
      createAccount: "계정 만들기",
      rememberMe: "로그인 상태 유지",
      forgotPassword: "비밀번호 찾기"
    },
    en: {
      brandName: "The K-Bridge E-commerce",
      brandSlogan: "Bridging Korea's Best to the US, Effortlessly",
      brandDescription: "Worried about the new US customs changes? We've got you covered. Our AI platform provides instant clarity on tariffs and regulations.",
      welcomeTitle: "Welcome Back",
      welcomeSubtitle: "Sign in to access your trade intelligence dashboard",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      accountTypeLabel: "Account Type",
      selectRole: "Select your role",
      sellerOption: "Korean Exporter",
      buyerOption: "US Buyer",
      customsOption: "Customs Broker",
      signInButton: "Sign In",
      newUser: "New to The K-Bridge?",
      createAccount: "Create Account",
      rememberMe: "Keep me logged in",
      forgotPassword: "Forgot Password"
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 백엔드 API 호출을 위한 데이터 변환
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      const response = await userApi.login(loginData);
      
      // Zustand 스토어에 사용자 정보 저장
      login(response);
      
      // 계정 유형에 따른 페이지 이동
      switch (response.userType) {
        case 'SELLER':
          navigate('/seller/products');
          break;
        case 'BUYER':
          navigate('/buyer/products');
          break;
        case 'BROKER':
          navigate('/broker/requests');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-accent flex items-center justify-center p-5">
      <button
        onClick={toggleLanguage}
        className="absolute top-5 right-5 bg-white border-2 border-secondary rounded-full px-4 py-2 cursor-pointer flex items-center gap-2 font-medium text-primary transition-all duration-300 hover:bg-secondary hover:text-white z-10"
      >
        <Globe size={16} />
        <span>{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
      </button>
      
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
          {/* Brand Section */}
          <div className="flex-1 bg-gradient-primary text-white flex flex-col justify-center relative" style={{ padding: '60px 50px' }}>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8" style={{ fontSize: '32px', fontWeight: '700' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <div>{translations[currentLanguage].brandName}</div>
              </div>
              <h2 className="mb-6" style={{ fontSize: '28px', fontWeight: '600', lineHeight: '1.3' }}>
                {translations[currentLanguage].brandSlogan}
              </h2>
              <p className="opacity-90 mb-8" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {translations[currentLanguage].brandDescription}
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="flex-1 flex flex-col justify-center" style={{ padding: '60px 50px' }}>
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-primary mb-2" style={{ fontSize: '28px', fontWeight: '600' }}>
                  {translations[currentLanguage].welcomeTitle}
                </h2>
                <p className="text-text-secondary mb-10" style={{ fontSize: '16px' }}>
                  {translations[currentLanguage].welcomeSubtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="email" className="block text-primary mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    {translations[currentLanguage].emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg focus-ring-primary transition-colors"
                    style={{ fontSize: '16px', padding: '16px 20px' }}
                    placeholder={translations[currentLanguage].emailPlaceholder}
                    required
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="password" className="block text-primary mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    {translations[currentLanguage].passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg focus-ring-primary transition-colors pr-12"
                      style={{ fontSize: '16px', padding: '16px 20px' }}
                      placeholder={translations[currentLanguage].passwordPlaceholder}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-text-secondary">
                      {translations[currentLanguage].rememberMe}
                    </span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    {translations[currentLanguage].forgotPassword}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontSize: '16px' }}
                >
                  <LogIn size={20} />
                  {isLoading ? '로그인 중...' : translations[currentLanguage].signInButton}
                </button>

                <div className="text-center">
                  <span className="text-text-secondary">{translations[currentLanguage].newUser} </span>
                  <Link to="/signup" className="text-primary hover:underline font-semibold">
                    {translations[currentLanguage].createAccount}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
