import React from 'react';
import LogoImage from "@/assests/images/Qubic-Symbol-White.png"
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === "light";
  return (
    <footer className={isLight ? "py-4 px-6 bg-[#FEF8E8]" : "text-slate-300 py-4 px-6"}>
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-center gap-4 md:gap-10 max-w-7xl mx-auto">
        {/* Left side - Logo and copyright */}
        <div className="flex items-center">
          <img className='w-8 h-8' src={LogoImage} alt="Logo img" style={isLight ? { filter: "brightness(0)" } : {}} />
          <span className={isLight ? "text-[#302A36] ml-2" : "text-[#808B9B] ml-2"}>{t('footer.copyright')}</span>
        </div>
        {/* Right side - Links and version */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-sm">
          <div className="flex items-center space-x-3">
            <a href="#" className={isLight ? "text-[#302A36] hover:text-blue-500 transition-colors" : "text-white hover:text-blue-500 transition-colors"}>
              {t('footer.terms')}
            </a>
            <span className={isLight ? "text-[#302A36]" : "text-[#9E9E9E]"}>•</span>
            <a href="#" className={isLight ? "text-[#302A36] hover:text-blue-500 transition-colors" : "text-white hover:text-blue-500 transition-colors"}>
              {t('footer.privacy')}
            </a>
          </div>
          <div className="flex items-center">
            <span className={isLight ? "text-[#302A36] hidden sm:inline" : "text-[#9E9E9E] hidden sm:inline"}>•</span>
            <span className={isLight ? "text-[#302A36] sm:ml-4" : "text-white sm:ml-4"}>{t('footer.version')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}