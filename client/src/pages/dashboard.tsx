import { useContext } from "react";
import { SectionContext } from "../components/DashboardLayout";
import DashboardStats from "../components/DashboardStats";
import ContributionForm from "../components/ContributionForm";
import Leaderboard from "../components/Leaderboard";
import Analytics from "../components/Analytics";

export default function Dashboard() {
  const { activeSection } = useContext(SectionContext);

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
    <div className="w-full">
      {renderContent()}
    </div>
  );
}


