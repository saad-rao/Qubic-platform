import { useState, useEffect, createContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DashboardStats from "./DashboardStats";
import ContributionForm from "./ContributionForm";
import Leaderboard from "./Leaderboard";
import Analytics from "./Analytics";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export type Section = 'dashboard' | 'contributions' | 'leaderboard' | 'analytics';

export const SectionContext = createContext<{
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}>({
  activeSection: 'dashboard',
  setActiveSection: () => {},
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardStats />;
      case 'contributions':
        return <ContributionForm />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'analytics':
        return <Analytics />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      <div
        className={cn(
          "min-h-screen transition-colors duration-200",
          theme === "light"
            ? "bg-[#FEF8E8] text-[#302A36]"
            : "bg-[#302A36] text-white"
        )}
      >
        <Header onMenuClick={() => {}} />
         
        <div className="flex pt-16 min-h-screen">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden md:block">
            <Sidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isOpen={true}
              onClose={() => {}}
            />
          </div>
          <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
            <div className="max-w-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SectionContext.Provider>
  );
} 