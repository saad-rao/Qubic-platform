import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import Charts from "./Charts";

export default function Analytics() {
  const performanceMetrics = [
    { label: 'Weekly Average', value: '3.2 points', color: 'text-[#00D4FF]' },
    { label: 'Best Week', value: '8 points', color: 'text-green-400' },
    { label: 'Consistency Score', value: '85%', color: 'text-[#7B2CBF]' },
    { label: 'Total Streak', value: '12 days', color: 'text-yellow-400' },
  ];

  const monthlyProgress = {
    current: 34,
    target: 50,
    percentage: 68
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card className="bg-gray-900/50 backdrop-blur-md border-[#00D4FF]/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#00D4FF]">
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#A5A5A5]">{metric.label}</span>
                  <span className={`font-bold ${metric.color}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card className="bg-gray-900/50 backdrop-blur-md border-[#7B2CBF]/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#7B2CBF]">
              Monthly Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#A5A5A5]">Target: 50 points</span>
                <span className="font-bold text-[#7B2CBF]">
                  {monthlyProgress.current}/{monthlyProgress.target}
                </span>
              </div>
              
              <Progress 
                value={monthlyProgress.percentage} 
                className="w-full h-3 bg-gray-700"
              />
              
              <div className="text-sm text-[#A5A5A5]">
                {monthlyProgress.target - monthlyProgress.current} points to go • 8 days remaining
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Chart */}
      <Card className="bg-gray-900/50 backdrop-blur-md border-[#00D4FF]/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#00D4FF] flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Detailed Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Charts showDetailed />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
