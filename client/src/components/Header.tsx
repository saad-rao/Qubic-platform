import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import React from "react";
import logoImage from "@/assests/images/Qubic-Symbol-White.png"
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Sun, Moon, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSelector from "./LanguageSelector";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isConnected, connect, disconnect, isConnecting } = useWallet();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === "light";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Redirect to dashboard after successful connection
  React.useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  return (
    <>
      <header
        className={
          isLight
            ? "bg-[#FEF8E8] backdrop-blur-md border-b border-[#302A36]/20 fixed w-full top-0 z-40"
            : "bg-[#302A36] backdrop-blur-md border-b border-[#00D4FF]/20 fixed w-full top-0 z-40"
        }
      >
        <div className="flex items-center justify-between p-4">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle - Only show on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg border border-transparent hover:border-[#D0FF5F] transition-colors bg-transparent focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className={isLight ? "h-6 w-6 text-[#302A36]" : "h-6 w-6 text-[#D0FF5F]"} />
            </button>
            
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img
                src={logoImage}
                alt="Logo img"
                style={isLight ? { filter: "brightness(0)" } : {}}
              />
            </div>
            <h1 className={cn(
              "text-lg md:text-xl font-heading transition-colors duration-200",
              isLight ? "text-[#302A36]" : "text-white"
            )}>
              {t('ambassador.platform')}
            </h1>
          </div>
          
          {/* Desktop Controls - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-transparent hover:border-[#D0FF5F] transition-colors bg-transparent focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 md:h-6 md:w-6 text-[#D0FF5F]" />
              ) : (
                <Moon className="h-5 w-5 md:h-6 md:w-6 text-[#302A36]" />
              )}
            </button>
            
            {/* Wallet Status */}
            {isConnected && user && (
              <div className={cn(
                "flex bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm items-center",
                isLight ? "bg-[#302A36]/10 border-[#302A36]/30 text-[#302A36]" : "text-white"
              )}>
                <span className="mr-2">🔗</span>
                <span className="font-mono">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
              </div>
            )}
            
            <Button
              onClick={isConnected ? disconnect : connect}
              disabled={isConnecting}
              className={cn(
                "font-heading group relative inline-flex items-center justify-center px-6 py-3 font-bold rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4",
                isLight
                  ? "text-[#302A36] bg-gradient-to-r from-[#FEF8E8] via-[#e6e0d0] to-[#e6e0d0] hover:shadow-[#302A36]/20 focus:ring-[#302A36]/30"
                  : "text-white bg-gradient-to-r from-[#302A36] via-[#6e7d49] to-[#D0FF5F] hover:shadow-[#D0FF5F]/40 focus:ring-[#D0FF5F]/50"
              )}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              {isConnecting
                ? t('connecting')
                : isConnected && user
                  ? t('connected')
                  : t('connect.wallet')}
            </Button>
          </div>

          {/* Mobile Wallet Button - Only show on mobile */}
          <div className="md:hidden">
            <Button
              onClick={isConnected ? disconnect : connect}
              disabled={isConnecting}
              className={cn(
                "font-heading group relative inline-flex items-center justify-center px-3 py-2 font-bold rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4",
                isLight
                  ? "text-[#302A36] bg-gradient-to-r from-[#FEF8E8] via-[#e6e0d0] to-[#e6e0d0] hover:shadow-[#302A36]/20 focus:ring-[#302A36]/30"
                  : "text-white bg-gradient-to-r from-[#302A36] via-[#6e7d49] to-[#D0FF5F] hover:shadow-[#D0FF5F]/40 focus:ring-[#D0FF5F]/50"
              )}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              {isConnecting
                ? '...'
                : isConnected && user
                  ? '✓'
                  : t('connect')}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}
