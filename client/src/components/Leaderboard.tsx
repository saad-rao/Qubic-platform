import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@shared/schema";
import { useTheme } from "@/hooks/useTheme";

export default function Leaderboard() {
  const { data: leaderboardData, isLoading } = useQuery<{ leaderboard: LeaderboardEntry[] }>({
    queryKey: ['/api/leaderboard'],
  });
  const { theme } = useTheme();
  const isLight = theme === "light";
  const leaderboard = leaderboardData?.leaderboard || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return isLight ? 'text-yellow-600' : 'text-yellow-400';
      case 2: return isLight ? 'text-gray-600' : 'text-gray-400';
      case 3: return isLight ? 'text-orange-600' : 'text-orange-400';
      default: return isLight ? 'text-[#302A36]' : 'text-white';
    }
  };

  const getInitials = (address: string) => {
    return `A${address.slice(-1)}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className={isLight ? "bg-[#FEF8E8] border-[#302A36]/20 animate-pulse" : "bg-[#302A36] backdrop-blur-md border-[#00D4FF]/20 animate-pulse"}>
          <CardContent className="p-6">
            <div className={isLight ? "h-96 bg-[#FEF8E8] rounded" : "h-96 bg-gray-800/50 rounded"}></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={isLight ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] backdrop-blur-md border-[#00D4FF]/20"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={isLight ? "text-2xl font-bold text-[#302A36] flex items-center font-heading" : "text-2xl font-bold text-[#D0FF5F] flex items-center font-heading"}>
              <Trophy className="h-6 w-6 mr-2" />
              Ambassador Leaderboard
            </CardTitle>
            <div className="flex space-x-2">
              <Button className={isLight ? "px-4 py-2 bg-[#302A36]/10 text-[#302A36] border border-[#302A36]/30 font-medium hover:bg-[#302A36]/20" : "px-4 py-2 bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 font-medium hover:bg-[#00D4FF]/30"}>
                This Week
              </Button>
              <Button variant="outline" className={isLight ? "px-4 py-2 bg-[#FEF8E8] text-[#302A36] border-[#302A36]/30 hover:bg-[#e6e0d0]" : "px-4 py-2 bg-gray-800 text-[#A5A5A5] border-gray-600 hover:bg-gray-700"}>
                All Time
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={isLight ? "border-b border-[#302A36]/20 hover:bg-transparent" : "border-b border-gray-700 hover:bg-transparent"}>
                  <TableHead className={isLight ? "text-[#302A36] font-medium" : "text-[#FEFBEB] font-medium"}>Rank</TableHead>
                  <TableHead className={isLight ? "text-[#302A36] font-medium" : "text-[#FEFBEB] font-medium"}>Ambassador</TableHead>
                  <TableHead className={isLight ? "text-[#302A36] font-medium" : "text-[#FEFBEB] font-medium"}>Points</TableHead>
                  <TableHead className={isLight ? "text-[#302A36] font-medium" : "text-[#FEFBEB] font-medium"}>Contributions</TableHead>
                  <TableHead className={isLight ? "text-[#302A36] font-medium" : "text-[#FEFBEB] font-medium"}>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user) => (
                  <TableRow key={user.walletAddress} className={isLight ? "border-b border-[#302A36]/10 hover:bg-[#e6e0d0] transition-colors" : "border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getRankIcon(user.rank)}</span>
                        <span className={`font-bold ${getRankColor(user.rank)}`}>
                          #{user.rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={isLight ? "w-10 h-10 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full flex items-center justify-center" : "w-10 h-10 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full flex items-center justify-center"}>
                          <span className={isLight ? "font-bold text-sm text-[#302A36]" : "font-bold text-sm"}>
                            {getInitials(user.walletAddress)}
                          </span>
                        </div>
                        <div>
                          <p className={isLight ? "font-medium text-[#302A36]" : "font-medium"}>
                            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                          </p>
                          <p className={isLight ? "text-sm text-[#302A36]" : "text-sm text-[#A5A5A5]"}>
                            {user.rank === 1 ? 'Top Contributor' : 
                             user.rank === 2 ? 'Active Contributor' : 
                             user.rank === 3 ? 'Rising Star' : 'Ambassador'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xl font-bold ${getRankColor(user.rank)}`}>
                        {user.totalPoints}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={isLight ? "text-[#00D4FF] font-medium" : "text-[#00D4FF] font-medium"}>
                        {user.totalContributions}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={isLight ? "text-[#302A36] text-sm" : "text-[#A5A5A5] text-sm"}>
                        {formatTimeAgo(user.lastActivity)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
