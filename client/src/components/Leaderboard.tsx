import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/types/dashboard";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const { data: leaderboardData, isLoading } = useQuery<{ leaderboard: LeaderboardEntry[] }>({
    queryKey: ['/api/leaderboard'],
  });
  const { theme } = useTheme();
  const { t } = useLanguage();
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
    if (diffInHours < 1) return t('leaderboard.just.now');
    if (diffInHours < 24) return `${diffInHours} ${t('leaderboard.hours.ago')}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t('leaderboard.days.ago')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card className={cn(
          "backdrop-blur-md transition-all duration-200 animate-pulse",
          isLight ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] border-[#00D4FF]/20"
        )}>
          <CardContent className="p-4 md:p-6">
            <div className={cn(
              "h-64 md:h-96 rounded",
              isLight ? "bg-[#FEF8E8]" : "bg-gray-800/50"
            )}></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className={cn(
        "backdrop-blur-md transition-all duration-200",
        isLight ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] border-[#00D4FF]/20"
      )}>
        <CardHeader className="pb-3 md:pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <CardTitle className={cn(
              "text-xl md:text-2xl font-bold flex items-center font-heading transition-colors duration-200",
              isLight ? "text-[#302A36]" : "text-[#D0FF5F]"
            )}>
              <Trophy className="h-5 w-5 md:h-6 md:w-6 mr-2" />
              {t('leaderboard.title')}
            </CardTitle>
            <div className="flex space-x-2">
              <Button className={cn(
                "px-3 md:px-4 py-2 text-sm md:text-base font-medium",
                isLight 
                  ? "bg-[#302A36]/10 text-[#302A36] border border-[#302A36]/30 hover:bg-[#302A36]/20" 
                  : "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 hover:bg-[#00D4FF]/30"
              )}>
                {t('leaderboard.this.week')}
              </Button>
              <Button variant="outline" className={cn(
                "px-3 md:px-4 py-2 text-sm md:text-base",
                isLight 
                  ? "bg-[#FEF8E8] text-[#302A36] border-[#302A36]/30 hover:bg-[#e6e0d0]" 
                  : "bg-gray-800 text-[#A5A5A5] border-gray-600 hover:bg-gray-700"
              )}>
                {t('leaderboard.all.time')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn(
                  "border-b transition-colors duration-200",
                  isLight ? "border-[#302A36]/20 hover:bg-transparent" : "border-gray-700 hover:bg-transparent"
                )}>
                  <TableHead className={cn(
                    "text-sm md:text-base font-medium px-3 md:px-6",
                    isLight ? "text-[#302A36]" : "text-[#FEFBEB]"
                  )}>{t('rank.position')}</TableHead>
                  <TableHead className={cn(
                    "text-sm md:text-base font-medium px-3 md:px-6",
                    isLight ? "text-[#302A36]" : "text-[#FEFBEB]"
                  )}>{t('user')}</TableHead>
                  <TableHead className={cn(
                    "text-sm md:text-base font-medium px-3 md:px-6",
                    isLight ? "text-[#302A36]" : "text-[#FEFBEB]"
                  )}>{t('points')}</TableHead>
                  <TableHead className={cn(
                    "text-sm md:text-base font-medium px-3 md:px-6",
                    isLight ? "text-[#302A36]" : "text-[#FEFBEB]"
                  )}>{t('contributions')}</TableHead>
                  <TableHead className={cn(
                    "text-sm md:text-base font-medium px-3 md:px-6",
                    isLight ? "text-[#302A36]" : "text-[#FEFBEB]"
                  )}>{t('leaderboard.last.activity')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user) => (
                  <TableRow key={user.walletAddress} className={cn(
                    "border-b transition-colors duration-200",
                    isLight 
                      ? "border-[#302A36]/10 hover:bg-[#e6e0d0]" 
                      : "border-gray-800/50 hover:bg-gray-800/30"
                  )}>
                    <TableCell className="px-3 md:px-6">
                      <div className="flex items-center">
                        <span className="text-lg md:text-2xl mr-2 md:mr-3">{getRankIcon(user.rank)}</span>
                        <span className={cn(
                          "font-bold text-sm md:text-base",
                          getRankColor(user.rank)
                        )}>
                          #{user.rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 md:px-6">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className={cn(
                          "w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full flex items-center justify-center"
                        )}>
                          <span className={cn(
                            "font-bold text-xs md:text-sm",
                            isLight ? "text-[#302A36]" : "text-white"
                          )}>
                            {getInitials(user.walletAddress)}
                          </span>
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium text-sm md:text-base",
                            isLight ? "text-[#302A36]" : "text-white"
                          )}>
                            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                          </p>
                          <p className={cn(
                            "text-xs md:text-sm",
                            isLight ? "text-[#302A36]" : "text-[#A5A5A5]"
                          )}>
                            {user.rank === 1 ? t('leaderboard.top.contributor') : 
                             user.rank === 2 ? t('leaderboard.active.contributor') : 
                             user.rank === 3 ? t('leaderboard.rising.star') : t('leaderboard.ambassador')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 md:px-6">
                      <span className={cn(
                        "text-lg md:text-xl font-bold",
                        getRankColor(user.rank)
                      )}>
                        {user.totalPoints}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 md:px-6">
                      <span className={cn(
                        "text-sm md:text-base font-medium",
                        isLight ? "text-[#00D4FF]" : "text-[#00D4FF]"
                      )}>
                        {user.totalContributions}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 md:px-6">
                      <span className={cn(
                        "text-xs md:text-sm",
                        isLight ? "text-[#302A36]" : "text-[#A5A5A5]"
                      )}>
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
