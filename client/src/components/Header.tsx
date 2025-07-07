import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Menu, Box } from "lucide-react";
import logoImage from "@/assests/images/Qubic-Symbol-White.png"

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isConnected, connect, disconnect, isConnecting } = useWallet();

  return (
    <header className="bg-gray-900/50 backdrop-blur-md border-b border-[#00D4FF]/20 fixed w-full top-0 z-40">
      <div className="flex items-center justify-between p-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#00D4FF] hover:text-[#7B2CBF] hover:bg-transparent"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8  rounded-lg flex items-center justify-center">
            {/* <Box className="text-white text-lg" /> */}
            <img src={logoImage} alt="Logo img" />
          </div>
          <h1 className="text-xl font-bold">Ambassador platform</h1>
        </div>
        
        {/* Wallet Connection */}
        <div className="flex items-center space-x-4">
          {isConnected && user && (
            <div className="hidden sm:block bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm">
              <span className="mr-2">🔗</span>
              <span>{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
            </div>
          )}
          
          <Button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className="bg-gradient-to-r from-[#B0F9FE] to-[#B0F9FE] text-[#16192B] text-[18px] px-6 py-2 font-semibold  transition-all duration-300 "
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </header>
  );
}
