import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, User, Medal, Star, TrendingUp } from "lucide-react";
import Charts from "./Charts";
import RecentActivity from "./RecentActivity";
import { useWallet } from "@/hooks/useWallet";
import type { DashboardStats } from "@shared/schema";

export default function DashboardStats() {
  const { user } = useWallet();
  
  const { data: statsData, isLoading } = useQuery<{ stats: DashboardStats }>({
    queryKey: [user ? `/api/dashboard/${user.walletAddress}` : '/api/dashboard'],
    enabled: true
  });

  const stats = statsData?.stats;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-900/50 backdrop-blur-md border-[#00D4FF]/20 animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-800/50 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 backdrop-blur-md border-[#00D4FF]/20 gradient-bg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A5A5A5] text-sm">Total Contributions</p>
                <h3 className="text-3xl font-bold text-[#00D4FF]">
                  {stats?.totalContributions?.toLocaleString() || '0'}
                </h3>
              </div>
              <div className="text-[#00D4FF] text-2xl">
                <BarChart3 className="h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-400">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              +{stats?.weeklyGrowth || 0}% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-md border-[#7B2CBF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A5A5A5] text-sm">Your Contributions</p>
                <h3 className="text-3xl font-bold text-[#7B2CBF]">
                  {stats?.userContributions || 0}
                </h3>
              </div>
              <div className="text-[#7B2CBF] text-2xl">
                <User className="h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-400">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              +3 this week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-md border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A5A5A5] text-sm">Your Rank</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {stats?.userRank ? `#${stats.userRank}` : 'N/A'}
                </h3>
              </div>
              <div className="text-green-400 text-2xl">
                <Medal className="h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-400">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              Up 2 positions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-md border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A5A5A5] text-sm">Total Points</p>
                <h3 className="text-3xl font-bold text-yellow-400">
                  {stats?.totalPoints || 0}
                </h3>
              </div>
              <div className="text-yellow-400 text-2xl">
                <Star className="h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-400">
              <TrendingUp className="inline h-4 w-4 mr-1" />
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
