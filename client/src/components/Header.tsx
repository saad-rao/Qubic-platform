import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import React from "react";
import logoImage from "@/assests/images/Qubic-Symbol-White.png"
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isConnected, connect, disconnect, isConnecting } = useWallet();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // Redirect to dashboard after successful connection
  React.useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  return (
    <header
      className={
        isLight
          ? "bg-[#FEF8E8] backdrop-blur-md border-b border-[#302A36]/20 fixed w-full top-0 z-40"
          : "bg-[#302A36] backdrop-blur-md border-b border-[#00D4FF]/20 fixed w-full top-0 z-40"
      }
    >
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img
              src={logoImage}
              alt="Logo img"
              style={isLight ? { filter: "brightness(0)" } : {}}
            />
          </div>
          <h1 className={isLight ? "text-xl font-heading text-[#302A36]" : "text-xl font-heading"}>Ambassador platform</h1>
        </div>
        {/* Wallet Connection & Theme Toggle */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-transparent hover:border-[#D0FF5F] transition-colors bg-transparent focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6 text-[#D0FF5F]" />
            ) : (
              <Moon className="h-6 w-6 text-[#302A36]" />
            )}
          </button>
          {isConnected && user && (
            <div className={isLight ? "bg-[#302A36]/10 border border-[#302A36]/30 px-3 py-1 rounded-full text-sm flex items-center text-[#302A36]" : "bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm flex items-center"}>
              <span className="mr-2">🔗</span>
              <span className="font-mono">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
            </div>
          )}
          <Button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className={
              isLight
                ? "font-heading group relative inline-flex items-center justify-center px-6 py-3 font-bold text-[#302A36] bg-gradient-to-r from-[#FEF8E8] via-[#e6e0d0] to-[#e6e0d0] rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-[#302A36]/20 focus:outline-none focus:ring-4 focus:ring-[#302A36]/30"
                : "font-heading group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white bg-gradient-to-r from-[#302A36] via-[#6e7d49] to-[#D0FF5F] rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-[#D0FF5F]/40 focus:outline-none focus:ring-4 focus:ring-[#D0FF5F]/50 "
            }
          >
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            {isConnecting
              ? 'Connecting...'
              : isConnected && user
                ? 'Connected'
                : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </header>
  );
}
