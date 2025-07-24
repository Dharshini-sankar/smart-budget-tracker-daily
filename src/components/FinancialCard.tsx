
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/storage";
import { LucideIcon } from "lucide-react";

interface FinancialCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: 'income' | 'expense' | 'savings';
  currency: string;
  className?: string;
}

const variantStyles = {
  income: {
    bg: "bg-success-light",
    text: "text-success",
    iconBg: "bg-success",
    iconText: "text-success-foreground"
  },
  expense: {
    bg: "bg-destructive-light",
    text: "text-destructive",
    iconBg: "bg-destructive",
    iconText: "text-destructive-foreground"
  },
  savings: {
    bg: "bg-warning-light",
    text: "text-warning",
    iconBg: "bg-warning",
    iconText: "text-warning-foreground"
  }
};

export function FinancialCard({ title, amount, icon: Icon, variant, currency, className }: FinancialCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-card hover:scale-105 border-0",
      styles.bg,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", styles.text)}>
          {title}
        </CardTitle>
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center",
          styles.iconBg
        )}>
          <Icon className={cn("h-5 w-5", styles.iconText)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", styles.text)}>
          {variant === 'expense' && amount > 0 ? '-' : ''}{formatCurrency(amount, currency)}
        </div>
        <p className={cn("text-xs opacity-70", styles.text)}>
          {variant === 'savings' && amount >= 0 ? 'On track this month' : 
           variant === 'savings' ? 'Over budget' : 
           'This month'}
        </p>
      </CardContent>
    </Card>
  );
}
