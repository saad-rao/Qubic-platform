import DashboardStats from "../components/DashboardStats";
import ContributionForm from "../components/ContributionForm";
import Leaderboard from "../components/Leaderboard";
import Analytics from "../components/Analytics";
import Charts from "../components/Charts";

export default function Dashboard() {
  return (
    <>
      <DashboardStats />
      <ContributionForm />
      <Leaderboard />
      <Analytics />
      <Charts />
    </>
  );
}


