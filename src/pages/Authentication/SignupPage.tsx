import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Building2, Check, UserPlus } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    accountType: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 다국어 지원
  const translations = {
    ko: {
      brandName: "K-브릿지 이커머스",
      brandSlogan: "한국의 최고를 미국으로, 쉽고 간편하게",
      brandDescription: "새로운 미국 관세 변화가 걱정되시나요? 저희가 해결해드립니다. AI 플랫폼으로 관세와 규정을 즉시 명확하게 파악하세요.",
      welcomeTitle: "회원가입",
      welcomeSubtitle: "새로운 계정을 만드세요",
      signUpButton: "회원가입",
      newUser: "이미 계정이 있으신가요?",
      createAccount: "로그인",
      clearCalculation: "명확한 관세 계산",
      updateRegulations: "업데이트 규정 반영",
      professionalReview: "전문 관세사 검토",
      accountType: "계정 유형",
      accountTypePlaceholder: "계정 유형을 선택해주세요",
      buyer: "구매자",
      seller: "판매자",
      broker: "관세사 (Customs Broker)",
      name: "이름",
      lastName: "성",
      companyName: "회사명",
      email: "이메일",
      password: "비밀번호",
      phone: "전화번호",
      agreeToTerms: "이용약관 및 개인정보처리방침에 동의합니다",
    },
    en: {
      brandName: "The K-Bridge E-commerce",
      brandSlogan: "Bridging Korea's Best to the US, Effortlessly",
      brandDescription: "Worried about the new US customs changes? We've got you covered. Our AI platform provides instant clarity on tariffs and regulations.",
      welcomeTitle: "Sign Up",
      welcomeSubtitle: "Start free and experience the benefits of smart trade",
      signUpButton: "Sign Up",
      newUser: "Already have an account?",
      createAccount: "Sign In",
      clearCalculation: "Accurate Customs Calculation",
      updateRegulations: "Update Regulation Reflection",
      professionalReview: "Professional Customs Review",
      accountType: "Account Type",
      accountTypePlaceholder: "Select Account Type",
      buyer: "Buyer",
      seller: "Seller",
      broker: "Customs Broker",
      name: "Enter your name",
      lastName: "last name",
      companyName: "company name",
      email: "email",
      password: "password",
      confirmPassword: "password",
      phone: "phone number",
      agreeToTerms: "I agree to the terms and privacy policy",
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = '이메일을 입력해주세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';
    if (formData.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    if (!formData.firstName) newErrors.firstName = '이름을 입력해주세요';
    if (!formData.lastName) newErrors.lastName = '성을 입력해주세요';
    if (!formData.companyName) newErrors.companyName = '회사명을 입력해주세요';
    if (!formData.phone) newErrors.phone = '전화번호를 입력해주세요';
    if (!formData.accountType || formData.accountType === 'default') {
      newErrors.accountType = '계정 유형을 선택해주세요';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = '이용약관에 동의해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: 회원가입 로직 구현
      console.log('Signup attempt:', formData);
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
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check size={20} className="text-white-400" />
                  <span>{translations[currentLanguage].clearCalculation} </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check size={20} className="text-white-400" />
                  <span>{translations[currentLanguage].updateRegulations}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check size={20} className="text-white-400" />
                  <span>{translations[currentLanguage].professionalReview}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div className="flex-1 flex flex-col justify-center" style={{ padding: '60px 50px' }}>
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-primary mb-2" style={{ fontSize: '28px', fontWeight: '600' }}>
                  {translations[currentLanguage].welcomeTitle}
                </h2>
                <p className="text-text-secondary mb-10" style={{ fontSize: '16px' }}>
                  {translations[currentLanguage].welcomeSubtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-1">
                      {translations[currentLanguage].name} *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                        errors.firstName ? 'border-error' : 'border-border'
                      }`}
                      placeholder={translations[currentLanguage].name}
                      required
                    />
                    {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">
                      {translations[currentLanguage].lastName} *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                        errors.lastName ? 'border-error' : 'border-border'
                      }`}
                      placeholder={translations[currentLanguage].lastName}
                      required
                    />
                    {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-primary mb-1">
                    {translations[currentLanguage].companyName} *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.companyName ? 'border-error' : 'border-border'
                    }`}
                    placeholder={translations[currentLanguage].companyName}
                    required
                  />
                  {errors.companyName && <p className="text-error text-xs mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                    {translations[currentLanguage].email} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.email ? 'border-error' : 'border-border'
                    }`}
                    placeholder={translations[currentLanguage].email}
                    required
                  />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                </div>

                {/* <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-primary mb-1">
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.phone ? 'border-error' : 'border-border'
                    }`}
                    placeholder="전화번호"
                    required
                  />
                  {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
                </div> */}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
                    {translations[currentLanguage].password} *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.password ? 'border-error' : 'border-border'
                    }`}
                    placeholder={translations[currentLanguage].password}
                    required
                  />
                  {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-1">{translations[currentLanguage].accountType}</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.accountType ? 'border-error' : 'border-border'
                    }`}
                    required
                  >
                    <option value="default">{translations[currentLanguage].accountTypePlaceholder}</option>
                    <option value="buyer">{translations[currentLanguage].buyer}</option>
                    <option value="seller">{translations[currentLanguage].seller}</option>
                    <option value="broker">{translations[currentLanguage].broker}</option>
                  </select>
                  {errors.accountType && <p className="text-error text-xs mt-1">{errors.accountType}</p>}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-text-secondary">
                    <span className="text-error">*</span> {translations[currentLanguage].agreeToTerms}
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-error text-xs">{errors.agreeToTerms}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  style={{ fontSize: '16px' }}
                >
                  <UserPlus size={20} />
                  {translations[currentLanguage].signUpButton}
                </button>

                <div className="text-center">
                  <span className="text-text-secondary">{translations[currentLanguage].newUser} </span>
                  <Link to="/login" className="text-primary hover:underline font-semibold">
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

export default SignupPage;
