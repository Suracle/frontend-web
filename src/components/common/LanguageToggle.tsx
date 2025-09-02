import React, { useState } from 'react';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const [currentLang, setCurrentLang] = useState<'ko' | 'en'>('ko');

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'ko' ? 'en' : 'ko');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`absolute top-3 right-3 md:top-5 md:right-5 bg-white border-2 border-secondary rounded-full px-3 py-1 md:px-4 md:py-2 cursor-pointer flex items-center gap-1 md:gap-2 font-medium text-primary transition-all duration-300 hover:bg-secondary hover:text-white z-10 text-sm md:text-base ${className}`}
    >
      <i className="fas fa-globe"></i>
      <span>{currentLang === 'ko' ? '한국어' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;
