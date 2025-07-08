import React from 'react';

import grayLogoImage from "@/assests/images/Qubic-gray-logo.png"

export default function Footer() {
  return (
    <footer className=" text-slate-300 py-4 px-6 ">
      <div className="flex items-center justify-center gap-10  max-w-7xl mx-auto">
        {/* Left side - Logo and copyright */}
        <div className="flex items-center space-x-3">
        <img src={grayLogoImage} alt="Logo img" />
          <span className="text-[#808B9B]">© 2025 Qubic</span>
        </div>

        {/* Right side - Links and version */}
        <div className="flex items-center space-x-3 text-sm">
          <a href="#" className="text-white hover:text-blue-500 transition-colors">
            Terms of service
          </a>
          <span className="text-[#9E9E9E] ">•</span>
          <a href="#" className="text-white hover:text-blue-500 transition-colors">
            Privacy Policy
          </a>
          <span className="text-[#9E9E9E] ">•</span>
          
          <span className="text-white ml-4">Version 1.0.2</span>
        </div>
      </div>
    </footer>
  );
}