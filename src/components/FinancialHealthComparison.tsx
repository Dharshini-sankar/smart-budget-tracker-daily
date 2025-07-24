
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFinancialSummary, formatCurrency, type Transaction } from "@/lib/storage";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialHealthComparisonProps {
  transactions: Transaction[];
  currency: string;
}

export function FinancialHealthComparison({ transactions, currency }: FinancialHealthComparisonProps) {
  const periods = [
    { key: 'daily' as const, label: 'Today', icon: Calendar },
    { key: 'monthly' as const, label: 'This Month', icon: BarChart3 },
    { key: '6months' as const, label: '6 Months', icon: TrendingUp },
    { key: 'yearly' as const, label: 'This Year', icon: TrendingDown },
  ];

  const summaries = periods.map(period => ({
    ...period,
    data: getFinancialSummary(transactions, period.key)
  }));

  const getHealthStatus = (savingsRate: number) => {
    if (savingsRate >= 20) return { status: 'Excellent', color: 'bg-success text-success-foreground' };
    if (savingsRate >= 10) return { status: 'Good', color: 'bg-warning text-warning-foreground' };
    if (savingsRate >= 0) return { status: 'Fair', color: 'bg-destructive/20 text-destructive' };
    return { status: 'Poor', color: 'bg-destructive text-destructive-foreground' };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Financial Health Comparison
        </CardTitle>
        <CardDescription>
          Compare your financial performance across different time periods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaries.map(({ key, label, icon: Icon, data }) => {
            const health = getHealthStatus(data.savingsRate);
            
            return (
              <div key={key} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">{label}</h4>
                  </div>
                  <Badge className={cn("text-xs", health.color)}>
                    {health.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Income:</span>
                    <span className="font-medium text-success">
                      {formatCurrency(data.totalIncome, currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expenses:</span>
                    <span className="font-medium text-destructive">
                      {formatCurrency(data.totalExpenses, currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Savings:</span>
                    <span className={cn(
                      "font-medium",
                      data.savings >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {formatCurrency(data.savings, currency)}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Savings Rate:</span>
                      <span className="font-bold text-primary">
                        {data.savingsRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-semibold text-primary mb-2">Financial Health Guide</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="text-center">
              <Badge className="bg-success text-success-foreground mb-1">Excellent</Badge>
              <p className="text-muted-foreground">20%+ savings rate</p>
            </div>
            <div className="text-center">
              <Badge className="bg-warning text-warning-foreground mb-1">Good</Badge>
              <p className="text-muted-foreground">10-19% savings rate</p>
            </div>
            <div className="text-center">
              <Badge className="bg-destructive/20 text-destructive mb-1">Fair</Badge>
              <p className="text-muted-foreground">0-9% savings rate</p>
            </div>
            <div className="text-center">
              <Badge className="bg-destructive text-destructive-foreground mb-1">Poor</Badge>
              <p className="text-muted-foreground">Negative savings</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
