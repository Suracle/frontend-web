import React from 'react';
import { Building2 } from 'lucide-react';

interface BrandSectionProps {
  brandName: string;
  brandSlogan: string;
  brandDescription: string;
  showLoginButtons?: boolean;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const BrandSection: React.FC<BrandSectionProps> = ({
  brandName,
  brandSlogan,
  brandDescription,
  showLoginButtons = false,
  onLoginClick,
  onSignupClick
}) => {
  return (
    <div className="flex-1 bg-gradient-primary text-white flex flex-col justify-center relative" style={{ padding: '60px 50px' }}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8" style={{ fontSize: '32px', fontWeight: '700' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>{brandName}</div>
        </div>
        <h2 className="mb-6" style={{ fontSize: '28px', fontWeight: '600', lineHeight: '1.3' }}>
          {brandSlogan}
        </h2>
        <p className="opacity-90 mb-8" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          {brandDescription}
        </p>
        
        {showLoginButtons && (
          <div className="flex items-center gap-4">
            <button
              onClick={onLoginClick}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <i className="fas fa-sign-in-alt"></i>
              로그인
            </button>
            <button
              onClick={onSignupClick}
              className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-white hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <i className="fas fa-user-plus"></i>
              회원가입
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandSection;
