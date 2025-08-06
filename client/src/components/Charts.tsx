import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Chart: any;
  }
}

interface ChartsProps {
  showDetailed?: boolean;
}

export default function Charts({ showDetailed = false }: ChartsProps) {
  const { theme } = useTheme();
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const typesChartRef = useRef<HTMLCanvasElement>(null);
  const detailedChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      initCharts();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [theme]);

  const initCharts = () => {
    if (!window.Chart) return;

    // Contribution trend chart
    if (trendChartRef.current && !showDetailed) {
      new window.Chart(trendChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Your Points',
            data: [5, 8, 12, 15, 23, 28],
            borderColor: '#00D4FF',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: theme === "light" ? '#302A36' : '#FFFFFF',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: theme === "light" ? '#302A36' : '#A5A5A5',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              },
              grid: {
                color: theme === "light" ? 'rgba(48, 42, 54, 0.1)' : 'rgba(165, 165, 165, 0.1)'
              }
            },
            x: {
              ticks: {
                color: theme === "light" ? '#302A36' : '#A5A5A5',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              },
              grid: {
                color: theme === "light" ? 'rgba(48, 42, 54, 0.1)' : 'rgba(165, 165, 165, 0.1)'
              }
            }
          }
        }
      });
    }

    // Contribution types chart
    if (typesChartRef.current && !showDetailed) {
      new window.Chart(typesChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Twitter', 'GitHub', 'Discord', 'Medium'],
          datasets: [{
            data: [15, 10, 8, 5],
            backgroundColor: [
              '#00D4FF',
              '#7B2CBF',
              '#10B981',
              '#F59E0B'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: theme === "light" ? '#302A36' : '#FFFFFF',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                },
                padding: window.innerWidth < 768 ? 10 : 15
              }
            }
          }
        }
      });
    }

    // Detailed comparison chart
    if (detailedChartRef.current && showDetailed) {
      new window.Chart(detailedChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [{
            label: 'Your Points',
            data: [5, 8, 12, 15, 10, 18],
            backgroundColor: 'rgba(0, 212, 255, 0.8)',
            borderColor: '#00D4FF',
            borderWidth: 1
          }, {
            label: 'Community Average',
            data: [6, 7, 9, 11, 13, 14],
            backgroundColor: 'rgba(123, 44, 191, 0.8)',
            borderColor: '#7B2CBF',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: theme === "light" ? '#302A36' : '#FFFFFF',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: theme === "light" ? '#302A36' : '#A5A5A5',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              },
              grid: {
                color: theme === "light" ? 'rgba(48, 42, 54, 0.1)' : 'rgba(165, 165, 165, 0.1)'
              }
            },
            x: {
              ticks: {
                color: theme === "light" ? '#302A36' : '#A5A5A5',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              },
              grid: {
                color: theme === "light" ? 'rgba(48, 42, 54, 0.1)' : 'rgba(165, 165, 165, 0.1)'
              }
            }
          }
        }
      });
    }
  };

  if (showDetailed) {
    return <canvas ref={detailedChartRef}></canvas>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Contribution Trend Chart */}
      <Card className={cn(
        "backdrop-blur-md transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg",
        theme === "light" 
          ? "bg-[#FEF8E8] border-[#00D4FF]/20" 
          : "bg-[#302A36] border-[#00D4FF]/20"
      )}>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className={cn(
            "text-lg md:text-xl  font-heading transition-colors duration-200",
            theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
          )}>
            Your Contribution Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <canvas ref={trendChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Types Chart */}
      <Card className={cn(
        "backdrop-blur-md transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg",
        theme === "light" 
          ? "bg-[#FEF8E8] border-[#7B2CBF]/20" 
          : "bg-[#302A36] border-[#7B2CBF]/20"
      )}>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className={cn(
            "text-lg md:text-xl  font-heading transition-colors duration-200",
            theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
          )}>
            Contribution Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <canvas ref={typesChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
