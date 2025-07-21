import { useState, useEffect, createContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "@/hooks/useTheme";

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
  const { theme } = useTheme();
  return (
    <div
      className={
        theme === "light"
          ? "min-h-screen bg-[#FEF8E8] text-[#302A36]"
          : "min-h-screen bg-[#302A36] text-white"
      }
    >
      <Header onMenuClick={() => {}} />
      <main>
        {children}
      </main>
    </div>
  );
}
