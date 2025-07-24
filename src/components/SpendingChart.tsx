
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryBreakdown, type Transaction } from "@/lib/storage";
import { PieChart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const categoryData = getCategoryBreakdown(transactions);
  
  if (categoryData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Spending by Category
          </CardTitle>
          <CardDescription>
            Breakdown of your expenses this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No expense data yet</p>
            <p className="text-sm">Add some expenses to see your spending breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Enhanced color palette for better visual distinction
  const colors = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Mint Green
    '#FFEAA7', // Sunny Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
    '#BB8FCE', // Lavender
    '#85C1E9', // Light Blue
  ];

  const doughnutData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        data: categoryData.map(item => item.amount),
        backgroundColor: colors.slice(0, categoryData.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 8,
        hoverBorderWidth: 4,
      },
    ],
  };

  const barData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        label: 'Amount Spent',
        data: categoryData.map(item => item.amount),
        backgroundColor: colors.slice(0, categoryData.length).map(color => color + '80'), // Add transparency
        borderColor: colors.slice(0, categoryData.length),
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: colors.slice(0, categoryData.length),
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 13,
            family: 'system-ui, -apple-system, sans-serif',
          },
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(context.raw);
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }).format(value);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-primary">
            <PieChart className="h-5 w-5" />
            Spending Distribution
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Visual breakdown of your monthly expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-success/5 to-success/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-success">
            <PieChart className="h-5 w-5" />
            Category Breakdown
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Amount spent per category this month
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
