import React from 'react';

import grayLogoImage from "@/assests/images/Qubic-gray-logo.png"

export default function Footer() {
  return (
    <footer className="text-slate-300 py-4 px-6">
    <div className="flex flex-col md:flex-row items-center justify-center md:justify-center gap-4 md:gap-10 max-w-7xl mx-auto">
      {/* Left side - Logo and copyright */}
      <div className="flex items-center space-x-3">
      <img src={grayLogoImage} alt="Logo img" />
        <span className="text-[#808B9B]">© 2025 Qubic</span>
      </div>

      {/* Right side - Links and version */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-sm">
        <div className="flex items-center space-x-3">
          <a href="#" className="text-white hover:text-blue-500 transition-colors">
            Terms of service
          </a>
          <span className="text-[#9E9E9E]">•</span>
          <a href="#" className="text-white hover:text-blue-500 transition-colors">
            Privacy Policy
          </a>
        </div>
        <div className="flex items-center">
          <span className="text-[#9E9E9E] hidden sm:inline">•</span>
          <span className="text-white sm:ml-4">Version 1.0.2</span>
        </div>
      </div>
    </div>
  </footer>
  );
}