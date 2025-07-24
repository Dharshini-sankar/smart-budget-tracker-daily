
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { addExpenseLimit, defaultCategories, formatCurrency, type ExpenseLimit, type Transaction } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Plus, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseLimitsProps {
  limits: ExpenseLimit[];
  transactions: Transaction[];
  currency: string;
  onLimitAdded: () => void;
}

export function ExpenseLimits({ limits, transactions, currency, onLimitAdded }: ExpenseLimitsProps) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const { toast } = useToast();

  const handleAddLimit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount) return;
    
    try {
      addExpenseLimit({
        category,
        amount: parseFloat(amount),
        period,
        currency
      });
      
      setCategory('');
      setAmount('');
      onLimitAdded();
      
      toast({
        title: "Expense limit set",
        description: `Added ${period} limit for ${category}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense limit",
        variant: "destructive",
      });
    }
  };

  const getLimitStatus = (limit: ExpenseLimit) => {
    const now = new Date();
    let startDate: Date;
    
    switch (limit.period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        break;
      default: // monthly
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === limit.category && 
        new Date(t.date) >= startDate
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (spent / limit.amount) * 100;
    
    return { spent, percentage };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Expense Limits
        </CardTitle>
        <CardDescription>
          Set spending limits to stay within budget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Limit Form */}
        <form onSubmit={handleAddLimit} className="space-y-4 p-4 rounded-lg border bg-card">
          <h4 className="font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Expense Limit
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {defaultCategories.expense.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Limit Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" disabled={!category || !amount}>
            Add Limit
          </Button>
        </form>

        {/* Current Limits */}
        {limits.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Current Limits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {limits.map((limit) => {
                const { spent, percentage } = getLimitStatus(limit);
                const isOverLimit = percentage > 100;
                const isNearLimit = percentage > 80;
                
                return (
                  <div key={limit.id} className="p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{limit.category}</h5>
                      <Badge variant="outline" className="capitalize">
                        {limit.period}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent:</span>
                        <span className={cn(
                          "font-medium",
                          isOverLimit ? "text-destructive" : "text-foreground"
                        )}>
                          {formatCurrency(spent, currency)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Limit:</span>
                        <span className="font-medium">
                          {formatCurrency(limit.amount, currency)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all",
                            isOverLimit ? "bg-destructive" : 
                            isNearLimit ? "bg-warning" : "bg-success"
                          )}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-xs font-medium",
                          isOverLimit ? "text-destructive" : 
                          isNearLimit ? "text-warning" : "text-success"
                        )}>
                          {percentage.toFixed(1)}% used
                        </span>
                        
                        {isOverLimit && (
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            Over limit
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No expense limits set</p>
            <p className="text-sm">Add your first limit to track spending</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
