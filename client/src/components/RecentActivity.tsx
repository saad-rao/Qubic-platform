import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import type { ContributionActivity } from "@shared/schema";
import { useTheme } from "@/hooks/useTheme";

export default function RecentActivity() {
  const { user } = useWallet();
  const { theme } = useTheme();

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
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <Card className={theme === "light" ? "bg-[#FEF8E8] border-[#302A36]/20 animate-pulse" : "bg-gray-900/50 border-[#00D4FF]/20 animate-pulse"}>
        <CardContent className="p-6">
          <div className={theme === "light" ? "h-64 bg-[#FEF8E8] rounded" : "h-64 bg-gray-800/50 rounded"}></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={theme === "light" ? "bg-[#FEF8E8] border-[#302A36]/20" : "bg-[#302A36] border-[#00D4FF]/20"}>
      <CardHeader>
        <CardTitle className={theme === "light" ? "text-xl font-semibold text-[#302A36] font-heading" : "text-xl font-semibold text-[#D0FF5F] font-heading"}>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className={theme === "light" ? "text-center py-8 text-[#302A36]" : "text-center py-8 text-[#FEF8E8]"}>
              <p>No recent activity found.</p>
              <p className="text-sm mt-2">Start contributing to see your activity here!</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className={theme === "light"
                  ? "flex items-center space-x-4 p-4 bg-[#FEF8E8] rounded-lg border border-[#302A36]/20"
                  : "flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.description}</p>
                  <p className={theme === "light" ? "text-sm text-[#302A36]" : "text-sm text-[#A5A5A5]"}>
                    {formatTimeAgo(activity.createdAt)} • +{activity.points} point{activity.points !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-green-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
