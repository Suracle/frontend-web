import React from 'react';
import { Building2, ShoppingCart } from 'lucide-react';

const HeaderBuyer: React.FC = () => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-100">
      <div className="max-w-6xl mx-auto px-4 md:px-5 flex items-center justify-between h-[60px] md:h-[70px]">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold text-red-600">
          <Building2 size={20} className="md:w-6 md:h-6" />
          <span>K-Bridge E-commerce</span>
        </div>

        {/* User Info */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <div className="bg-accent-cream text-primary px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
            <ShoppingCart size={16} />
            US Buyer
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBuyer;
