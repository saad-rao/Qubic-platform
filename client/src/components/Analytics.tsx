import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import Charts from "./Charts";

export default function Analytics() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const performanceMetrics = [
    { label: t('weekly.average'), value: `3.2 ${t('points.unit')}`, color: 'text-[#00D4FF]' },
    { label: t('best.week'), value: `8 ${t('points.unit')}`, color: 'text-green-400' },
    { label: t('consistency.score'), value: '85%', color: 'text-[#7B2CBF]' },
    { label: t('total.streak'), value: `12 ${t('days.unit')}`, color: 'text-yellow-400' },
  ];

  const monthlyProgress = {
    current: 34,
    target: 50,
    percentage: 68
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Section Heading */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className={cn(
          "text-2xl md:text-3xl font-bold font-heading transition-colors duration-200",
          theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
        )}>
          {t('analytics.title')}
        </h2>
        <p className={cn(
          "text-base md:text-lg mt-2 transition-colors duration-200",
          theme === "light" ? "text-[#302A36]/80" : "text-[#FEF8E8]/80"
        )}>
          {t('analytics.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Performance Metrics */}
        <Card className={cn(
          "backdrop-blur-md transition-all duration-200",
          theme === "light" 
            ? "bg-[#FEF8E8] border-[#302A36]/20" 
            : "bg-[#302A36] border-[#00D4FF]/20"
        )}>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className={cn(
              "text-lg md:text-xl font-semibold font-heading transition-colors duration-200",
              theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
            )}>
              {t('your.performance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={cn(
                    "text-sm md:text-base transition-colors duration-200",
                    theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
                  )}>
                    {metric.label}
                  </span>
                  <span className={`font-bold text-sm md:text-base ${metric.color}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card className={cn(
          "backdrop-blur-md transition-all duration-200",
          theme === "light" 
            ? "bg-[#FEF8E8] border-[#302A36]/20" 
            : "bg-[#302A36] border-[#7B2CBF]/20"
        )}>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className={cn(
              "text-lg md:text-xl font-semibold font-heading transition-colors duration-200",
              theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
            )}>
              {t('monthly.goal')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className={cn(
                  "text-sm md:text-base transition-colors duration-200",
                  theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
                )}>
                  {t('target')}: 50 {t('points.unit')}
                </span>
                <span className="font-bold text-sm md:text-base text-[#7B2CBF]">
                  {monthlyProgress.current}/{monthlyProgress.target}
                </span>
              </div>
              
              <Progress 
                value={monthlyProgress.percentage} 
                className={cn(
                  "w-full h-2 md:h-3 transition-colors duration-200",
                  theme === "light" ? "bg-[#302A36]/20" : "bg-gray-700"
                )}
              />
              
              <div className={cn(
                "text-xs md:text-sm transition-colors duration-200",
                theme === "light" ? "text-[#302A36]" : "text-[#FEF8E8]"
              )}>
                {monthlyProgress.target - monthlyProgress.current} {t('points.to.go')} • 8 {t('days.remaining')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Chart */}
      <Card className={cn(
        "backdrop-blur-md transition-all duration-200",
        theme === "light" 
          ? "bg-[#FEF8E8] border-[#302A36]/20" 
          : "bg-[#302A36] border-[#00D4FF]/20"
      )}>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className={cn(
            "text-lg md:text-xl font-semibold flex items-center font-heading transition-colors duration-200",
            theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
          )}>
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            {t('detailed.analytics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <Charts showDetailed />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
