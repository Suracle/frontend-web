import React from 'react';
import { Building2, Gavel } from 'lucide-react';
import LogoutButton from './LogoutButton';
import { Link } from 'react-router-dom';

const HeaderBroker: React.FC = () => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-100">
      <div className="max-w-6xl mx-auto px-4 md:px-5 flex items-center justify-between h-[60px] md:h-[70px]">
        {/* Logo */}
        <Link className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold text-red-600"
             to="/broker/requests"
          >
          
          <Building2 size={20} className="md:w-6 md:h-6" />
          <span>K-Bridge E-commerce</span>
          </Link>

        {/* User Info */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <div className="bg-accent-cream text-primary px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
            <Gavel size={16} />
            관세사
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default HeaderBroker;
