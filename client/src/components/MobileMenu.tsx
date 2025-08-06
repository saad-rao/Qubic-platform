import React from 'react';
import { X, Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage, languages, Language } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        theme === "light"
          ? "bg-[#FEF8E8] border-r border-[#302A36]/20"
          : "bg-[#302A36] border-r border-[#00D4FF]/20"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={cn(
            "text-lg font-semibold font-heading",
            theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
          )}>
            Menu
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg border border-transparent hover:border-[#D0FF5F] transition-colors bg-transparent focus:outline-none",
              theme === "light" ? "hover:border-[#302A36]/30" : "hover:border-[#00D4FF]/30"
            )}
            aria-label="Close menu"
          >
            <X className={cn(
              "h-5 w-5 transition-colors duration-200",
              theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
            )} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-6">
          {/* Language Selection */}
          <div className="space-y-3">
            <h3 className={cn(
              "text-sm font-semibold flex items-center space-x-2",
              theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
            )}>
              <Globe className="h-4 w-4" />
              <span>{t('select.language')}</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code as Language)}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left",
                    language === code
                      ? theme === "light"
                        ? "bg-[#00D4FF]/20 text-[#302A36] border border-[#00D4FF]/30"
                        : "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30"
                      : theme === "light"
                        ? "hover:bg-[#302A36]/10 text-[#302A36]"
                        : "hover:bg-gray-800/50 text-white"
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                  {language === code && (
                    <div className="ml-auto w-2 h-2 bg-[#00D4FF] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="space-y-3">
            <h3 className={cn(
              "text-sm font-semibold flex items-center space-x-2",
              theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
            )}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </h3>
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                theme === "light"
                  ? "bg-[#302A36]/10 text-[#302A36] hover:bg-[#302A36]/20"
                  : "bg-gray-800/50 text-white hover:bg-gray-700/50"
              )}
            >
              <span className="text-sm font-medium">
                {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </span>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors duration-200 relative",
                theme === "dark" ? "bg-[#00D4FF]" : "bg-[#302A36]"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                  theme === "dark" ? "right-1" : "left-1"
                )} />
              </div>
            </button>
          </div>

          {/* Additional Info */}
          <div className={cn(
            "p-4 rounded-lg",
            theme === "light" ? "bg-[#302A36]/5" : "bg-gray-800/30"
          )}>
            <p className={cn(
              "text-xs text-center",
              theme === "light" ? "text-[#302A36]/70" : "text-gray-400"
            )}>
              {t('ambassador.platform')} - {t('footer.version')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 