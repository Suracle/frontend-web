import React from 'react';
import { Building2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-100">
      <div className="max-w-6xl mx-auto px-4 md:px-5 flex items-center justify-between h-[60px] md:h-[70px]">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold text-red-600">
          <Building2 size={20} className="md:w-6 md:h-6" />
          <span>K-Bridge</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
