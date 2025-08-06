import React from 'react';
import { useLanguage, languages, Language } from '@/hooks/useLanguage';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'mobile';
}

export default function LanguageSelector({ className, variant = 'default' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const currentLanguage = languages[language];

  if (variant === 'mobile') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-[#D0FF5F] transition-colors bg-transparent focus:outline-none",
            theme === "light" ? "hover:border-[#302A36]/30" : "hover:border-[#00D4FF]/30"
          )}
          aria-label={t('select.language')}
        >
          <Globe className={cn(
            "h-5 w-5 transition-colors duration-200",
            theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
          )} />
          <span className={cn(
            "text-sm font-medium transition-colors duration-200",
            theme === "light" ? "text-[#302A36]" : "text-white"
          )}>
            {currentLanguage.flag}
          </span>
        </button>

        {isOpen && (
          <div className={cn(
            "absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg border z-50",
            theme === "light" 
              ? "bg-[#FEF8E8] border-[#302A36]/20" 
              : "bg-[#302A36] border-[#00D4FF]/20"
          )}>
            <div className="py-2">
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code as Language)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-200",
                    language === code
                      ? theme === "light"
                        ? "bg-[#00D4FF]/20 text-[#302A36]"
                        : "bg-[#00D4FF]/20 text-[#00D4FF]"
                      : theme === "light"
                        ? "hover:bg-[#302A36]/10 text-[#302A36]"
                        : "hover:bg-gray-800/50 text-white"
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg border border-transparent hover:border-[#D0FF5F] transition-colors bg-transparent focus:outline-none",
          theme === "light" ? "hover:border-[#302A36]/30" : "hover:border-[#00D4FF]/30",
          className
        )}
        aria-label={t('select.language')}
      >
        <Globe className={cn(
          "h-4 w-4 transition-colors duration-200",
          theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
        )} />
        <span className={cn(
          "text-sm font-medium transition-colors duration-200",
          theme === "light" ? "text-[#302A36]" : "text-white"
        )}>
          {currentLanguage.flag}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-colors duration-200",
          theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
        )} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg border z-50",
          theme === "light" 
            ? "bg-[#FEF8E8] border-[#302A36]/20" 
            : "bg-[#302A36] border-[#00D4FF]/20"
        )}>
          <div className="py-2">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-200",
                  language === code
                    ? theme === "light"
                      ? "bg-[#00D4FF]/20 text-[#302A36]"
                      : "bg-[#00D4FF]/20 text-[#00D4FF]"
                    : theme === "light"
                      ? "hover:bg-[#302A36]/10 text-[#302A36]"
                      : "hover:bg-gray-800/50 text-white"
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 