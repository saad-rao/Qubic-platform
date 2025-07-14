import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

declare global {
  interface Window {
    Chart: any;
  }
}

interface ChartsProps {
  showDetailed?: boolean;
}

export default function Charts({ showDetailed = false }: ChartsProps) {
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
  }, []);

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
                color: '#FFFFFF'
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: '#A5A5A5'
              },
              grid: {
                color: 'rgba(165, 165, 165, 0.1)'
              }
            },
            x: {
              ticks: {
                color: '#A5A5A5'
              },
              grid: {
                color: 'rgba(165, 165, 165, 0.1)'
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
                color: '#FFFFFF',
                padding: 20
              }
            }
          }
        }
      });
    }

    // Detailed analytics chart
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
                color: '#FFFFFF'
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: '#A5A5A5'
              },
              grid: {
                color: 'rgba(165, 165, 165, 0.1)'
              }
            },
            x: {
              ticks: {
                color: '#A5A5A5'
              },
              grid: {
                color: 'rgba(165, 165, 165, 0.1)'
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contribution Trend Chart */}
      <Card className="bg-[#302A36] backdrop-blur-md border-[#00D4FF]/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#D0FF5F]">
            Your Contribution Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={trendChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Types Chart */}
      <Card className="bg-[#] backdrop-blur-md border-[#7B2CBF]/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#D0FF5F]">
            Contribution Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={typesChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
