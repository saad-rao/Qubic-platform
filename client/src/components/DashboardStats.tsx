import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, User, Medal, Star, TrendingUp } from "lucide-react";
import Charts from "./Charts";
import RecentActivity from "./RecentActivity";
import { useWallet } from "@/hooks/useWallet";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types/dashboard";

export default function DashboardStats() {
  const { user } = useWallet();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const { data: statsData, isLoading } = useQuery<{ stats: DashboardStats }>({
    queryKey: [user ? `/api/dashboard/${user.walletAddress}` : '/api/dashboard'],
    enabled: true
  });

  const stats = statsData?.stats;

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className={cn(
              "backdrop-blur-md animate-pulse transition-all duration-200 transform hover:scale-[1.02]",
              theme === "light" 
                ? "bg-[#FEF8E8] border-[#302A36]/20" 
                : "bg-[#302A36] border-[#00D4FF]/20"
            )}>
              <CardContent className="p-4 md:p-6">
                <div className={cn(
                  "h-12 md:h-16 rounded",
                  theme === "light" ? "bg-[#302A36]/10" : "bg-gray-800/50"
                )}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className={cn(
          "backdrop-blur-md gradient-bg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg",
          theme === "light" 
            ? "bg-[#FEF8E8] border-[#00D4FF]/20" 
            : "bg-[#302A36] border-[#00D4FF]/20"
        )}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-xs md:text-sm transition-colors duration-200",
                  theme === "light" ? "text-[#FEF8E8]" : "text-[#FEF8E8]"
                )}>
                  
                  {t('total.contributions')}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-[#00D4FF]">
                  {stats?.totalContributions?.toLocaleString() || '0'}
                </h3>
              </div>
              <div className="text-[#00D4FF] text-xl md:text-2xl">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-green-400">
              <TrendingUp className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
              +{stats?.weeklyGrowth || 0}% from last week
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "backdrop-blur-md transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg",
          theme === "light" 
            ? "bg-[#FEF8E8] border-[#7B2CBF]/20" 
            : "bg-gray-900/50 border-[#7B2CBF]/20"
        )}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-xs md:text-sm transition-colors duration-200",
                  theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
                )}>
                  {/* Your Contributions */}
                  {t('contributions')}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-[#7B2CBF]">
                  {stats?.userContributions || 0}
                </h3>
              </div>
              <div className="text-[#7B2CBF] text-xl md:text-2xl">
                <User className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-green-400">
              <TrendingUp className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
              +3 this week
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "backdrop-blur-md transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg",
          theme === "light" 
            ? "bg-[#FEF8E8] border-green-500/20" 
            : "bg-gray-900/50 border-green-500/20"
        )}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-xs md:text-sm transition-colors duration-200",
                  theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
                )}>
                  {/* Your Rank */}
                  {t('rank')}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-green-400">
                  {stats?.userRank ? `#${stats.userRank}` : 'N/A'}
                </h3>
              </div>
              <div className="text-green-400 text-xl md:text-2xl">
                <Medal className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-green-400">
              <TrendingUp className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
              Up 2 positions
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "backdrop-blur-md transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg",
          theme === "light" 
            ? "bg-[#FEF8E8] border-yellow-500/20" 
            : "bg-gray-900/50 border-yellow-500/20"
        )}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-xs md:text-sm transition-colors duration-200",
                  theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
                )}>
                  {/* Total Points */}
                  {t('total.points')}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {stats?.totalPoints || 0}
                </h3>
              </div>
              <div className="text-yellow-400 text-xl md:text-2xl">
                <Star className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-green-400">
              <TrendingUp className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
              +5 points this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Charts />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
