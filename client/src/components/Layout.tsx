import { useState, useEffect, createContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Section = 'dashboard' | 'contributions' | 'leaderboard' | 'analytics';

// Context to provide section state to children
export const SectionContext = createContext<{
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}>({
  activeSection: 'dashboard',
  setActiveSection: () => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#302A36] text-white">
      <Header onMenuClick={() => {}} />
      <main>
        {children}
      </main>
    </div>
  );
}
