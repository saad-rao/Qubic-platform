import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DashboardStats from "./DashboardStats";
import ContributionForm from "./ContributionForm";
import Leaderboard from "./Leaderboard";
import Analytics from "./Analytics";
import VisitorView from "./VisitorsView";


type Section = 'dashboard' | 'contributions' | 'leaderboard' | 'analytics';

export default function Layout() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const renderContent = () => {
  
  //   switch (activeSection) {
  //     case 'dashboard':
  //       return <DashboardStats />;
  //     case 'contributions':
  //       return <ContributionForm />;
  //     case 'leaderboard':
  //       return <Leaderboard />;
  //     case 'analytics':
  //       return <Analytics />;
  //     default:
  //       return <DashboardStats />;
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#302A36] text-white font-['Space Grotesk']">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main >
      <VisitorView />
          {/* {renderContent()} */}
        
        </main>
      {/* <div className="flex pt-16">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 space-y-6 md:ml-0 ml-0">
          {renderContent()}
        </main>
      </div> */}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
