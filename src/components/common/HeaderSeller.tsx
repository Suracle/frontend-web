import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Building2, Store, ChevronRight, LogOut } from 'lucide-react';
import LogoutButton from './LogoutButton';

const HeaderSeller: React.FC = () => {
  const location = useLocation();
  const isProductRegistrationPage = location.pathname === '/seller/products/register';

  return (
    <header className="bg-white shadow-lg sticky top-0 z-100">
      <div className="max-w-6xl mx-auto px-4 md:px-5 flex items-center justify-between h-[60px] md:h-[70px]">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold text-red-600">
          <Building2 size={20} className="md:w-6 md:h-6" />
          <span>K-브릿지 이커머스</span>
        </div>

        {/* Breadcrumb Navigation - Only show on product registration page */}
        {isProductRegistrationPage && (
          <nav className="flex items-center gap-2 text-sm text-text-secondary">
            <Link 
              to="/seller/products" 
              className="text-primary hover:text-secondary transition-colors"
            >
              대시보드
            </Link>
            <ChevronRight size={16} />
            <span className="text-text-primary">상품 등록</span>
          </nav>
        )}

        {/* User Info */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <div className="bg-accent-cream text-primary px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
            <Store size={16} />
            한국 판매자
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default HeaderSeller;
