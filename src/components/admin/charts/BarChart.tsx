import React, { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
  horizontal?: boolean;
}

export const BarChart = memo(({ data, title, height = 300, horizontal = false }: BarChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
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
            const datasets = chart.data.datasets;
            return datasets.map((dataset: any, index: number) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor || dataset.backgroundColor,
              lineWidth: 2,
              pointStyle: 'rect',
              hidden: !chart.isDatasetVisible(index),
              index: index,
            }));
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
            return `📊 ${context[0].label}`;
          },
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed.x;
            return `${label}: ${value.toLocaleString()} €`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: !horizontal,
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false,
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500,
            family: 'Inter, system-ui, sans-serif',
          },
          color: '#6B7280',
          padding: 8,
          maxRotation: 0,
          callback: function(value: any) {
            if (typeof value === 'number') {
              return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
            }
            return value;
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: horizontal,
          color: 'rgba(156, 163, 175, 0.15)',
          drawBorder: false,
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500,
            family: 'Inter, system-ui, sans-serif',
          },
          color: '#6B7280',
          padding: 8,
          callback: function(value: any) {
            if (typeof value === 'number') {
              return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
            }
            return value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: horizontal ? 'y' as const : 'x' as const,
      intersect: false,
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            return;
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)');
          gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.6)');
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0.9)');
          
          return gradient;
        },
        borderColor: 'rgba(147, 51, 234, 0.3)',
        borderWidth: 1,
        hoverBackgroundColor: function(context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            return;
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.9)');
          gradient.addColorStop(0.5, 'rgba(219, 39, 119, 0.7)');
          gradient.addColorStop(1, 'rgba(124, 58, 237, 1)');
          
          return gradient;
        },
        hoverBorderColor: 'rgba(124, 58, 237, 0.5)',
        hoverBorderWidth: 2,
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
        <Bar data={data} options={options} />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
});

BarChart.displayName = 'BarChart';