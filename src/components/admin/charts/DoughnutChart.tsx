import React, { memo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
}

export const DoughnutChart = memo(({ 
  data, 
  title, 
  height = 300, 
  showLegend = true 
}: DoughnutChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 25,
          font: {
            size: 13,
            weight: 600,
            family: 'Inter, system-ui, sans-serif',
          },
          color: '#374151',
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor?.[i] || dataset.backgroundColor[i],
                  lineWidth: 2,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 18,
          weight: 700,
          family: 'Inter, system-ui, sans-serif',
        },
        color: '#111827',
        padding: {
          bottom: 25,
          top: 10,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: 'rgba(147, 51, 234, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 16,
        titleFont: {
          size: 14,
          weight: 600,
          family: 'Inter, system-ui, sans-serif',
        },
        bodyFont: {
          size: 13,
          weight: 500,
          family: 'Inter, system-ui, sans-serif',
        },
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return `🍩 ${context[0].label}`;
          },
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()} € (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
    elements: {
      arc: {
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff',
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            return;
          }
          
          // Create gradient for each segment
          const gradient = ctx.createRadialGradient(
            chartArea.left + chartArea.width / 2,
            chartArea.top + chartArea.height / 2,
            0,
            chartArea.left + chartArea.width / 2,
            chartArea.top + chartArea.height / 2,
            chartArea.width / 2
          );
          
          const colors = [
            'rgba(147, 51, 234, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ];
          
          const colorIndex = context.dataIndex % colors.length;
          gradient.addColorStop(0, colors[colorIndex]);
          gradient.addColorStop(1, colors[colorIndex].replace('0.8', '0.6'));
          
          return gradient;
        },
        hoverBackgroundColor: function(context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            return;
          }
          
          // Create hover gradient for each segment
          const gradient = ctx.createRadialGradient(
            chartArea.left + chartArea.width / 2,
            chartArea.top + chartArea.height / 2,
            0,
            chartArea.left + chartArea.width / 2,
            chartArea.top + chartArea.height / 2,
            chartArea.width / 2
          );
          
          const colors = [
            'rgba(124, 58, 237, 0.9)',
            'rgba(219, 39, 119, 0.9)',
            'rgba(37, 99, 235, 0.9)',
            'rgba(5, 150, 105, 0.9)',
            'rgba(217, 119, 6, 0.9)',
            'rgba(220, 38, 38, 0.9)',
          ];
          
          const colorIndex = context.dataIndex % colors.length;
          gradient.addColorStop(0, colors[colorIndex]);
          gradient.addColorStop(1, colors[colorIndex].replace('0.9', '0.7'));
          
          return gradient;
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  };

  return (
    <div className="relative">
      {/* Background gradient container */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 rounded-2xl"
        style={{ height: `${height}px` }}
      />
      
      {/* Chart container with glassmorphism effect */}
      <div 
        className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        style={{ height: `${height}px` }}
      >
        <Doughnut data={data} options={options} />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        
        {/* Center decorative circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-50 animate-pulse" />
        </div>
      </div>
    </div>
  );
});

DoughnutChart.displayName = 'DoughnutChart';