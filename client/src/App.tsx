import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import VisitorsView from "./components/VisitorsView";
import Dashboard from "./pages/dashboard";
import { useWallet } from "@/hooks/useWallet";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/hooks/useWallet";

function ProtectedRoute({ element }: { element: React.ReactElement }) {
  const { isConnected } = useWallet();
  return isConnected ? element : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <WalletProvider>
            <BrowserRouter>
              <Routes>
                {/* Visitor route: no dashboard layout */}
                <Route path="/" element={<Layout><VisitorsView /></Layout>} />

                {/* Dashboard route: uses dashboard layout */}
                <Route
                  path="/dashboard"
                  element={
                    <DashboardLayout>
                      <ProtectedRoute element={<Dashboard />} />
                    </DashboardLayout>
                  }
                />
                {/* Add other routes as needed */}
              </Routes>
            </BrowserRouter>
          </WalletProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}