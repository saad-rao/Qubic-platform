import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

import logoImage from "@/assests/images/Qubic-Symbol-White.png"

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isConnected, connect, disconnect, isConnecting } = useWallet();

  return (
    <header className="bg-[#302A36] backdrop-blur-md border-b border-[#00D4FF]/20 fixed w-full top-0 z-40">
      <div className="flex items-center justify-between p-4">
        {/* Mobile Menu Button */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#00D4FF] hover:text-[#7B2CBF] hover:bg-transparent"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button> */}
        
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
            className=" group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white bg-gradient-to-r from-[#302A36] via-[#6e7d49] to-[#D0FF5F] rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-[#D0FF5F]/40 focus:outline-none focus:ring-4 focus:ring-[#D0FF5F]/50 "
          >
             <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </header>
  );
}
