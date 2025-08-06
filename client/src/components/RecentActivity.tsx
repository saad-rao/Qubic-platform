import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import type { ContributionActivity } from "@/types/dashboard";

export default function RecentActivity() {
  const { user } = useWallet();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const { data: activityData, isLoading } = useQuery<{ activities: ContributionActivity[] }>({
    queryKey: [user ? `/api/activity/${user.walletAddress}` : '/api/activity'],
  });

  const activities = activityData?.activities || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'twitter': return '🐦';
      case 'github': return '💻';
      case 'discord': return '💬';
      case 'medium': return '📝';
      default: return '📄';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'twitter': return 'bg-[#00D4FF]/20 text-[#00D4FF]';
      case 'github': return 'bg-[#7B2CBF]/20 text-[#7B2CBF]';
      case 'discord': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
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
      <Card className={cn(
        "animate-pulse transition-all duration-200",
        theme === "light" 
          ? "bg-[#FEF8E8] border-[#302A36]/20" 
          : "bg-gray-900/50 border-[#00D4FF]/20"
      )}>
        <CardContent className="p-4 md:p-6">
          <div className={cn(
            "h-48 md:h-64 rounded",
            theme === "light" ? "bg-[#302A36]/10" : "bg-gray-800/50"
          )}></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg",
      theme === "light" 
        ? "bg-[#FEF8E8] border-[#302A36]/20" 
        : "bg-[#302A36] border-[#00D4FF]/20"
    )}>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className={cn(
          "text-lg md:text-xl font-semibold font-heading transition-colors duration-200",
          theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
        )}>
          {t('recent.activity.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {activities.length === 0 ? (
            <div className={cn(
              "text-center py-6 md:py-8 transition-colors duration-200",
              theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
            )}>
              <p className="text-base md:text-lg font-medium mb-2">{t('recent.activity.no.activity')}</p>
              <p className="text-xs md:text-sm opacity-75">{t('recent.activity.start.contributing')}</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={activity.id}
                className={cn(
                  "flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-lg border transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md",
                  theme === "light"
                    ? "bg-[#FEF8E8] border-[#302A36]/20 hover:bg-[#302A36]/5 hover:border-[#302A36]/30"
                    : "bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50"
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110",
                  getActivityColor(activity.type)
                )}>
                  <span className="text-lg md:text-xl">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm md:text-base transition-colors duration-200 truncate",
                    theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
                  )}>
                    {activity.description}
                  </p>
                  <p className={cn(
                    "text-xs md:text-sm transition-colors duration-200",
                    theme === "light" ? "text-[#302A36]/70" : "text-[#A5A5A5]"
                  )}>
                    {formatTimeAgo(activity.createdAt)} • +{activity.points} {activity.points !== 1 ? t('recent.activity.points.plural') : t('recent.activity.points')}
                  </p>
                </div>
                <div className="text-green-400 transition-all duration-200 transform hover:scale-110 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
