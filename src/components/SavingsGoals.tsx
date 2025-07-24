
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { addSavingsGoal, formatCurrency, type SavingsGoal } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Target, Trophy, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  currency: string;
  onGoalAdded: () => void;
}

export function SavingsGoals({ goals, currency, onGoalAdded }: SavingsGoalsProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const { toast } = useToast();

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetAmount || !targetDate) return;
    
    try {
      addSavingsGoal({
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        targetDate,
        currency
      });
      
      setTitle('');
      setTargetAmount('');
      setTargetDate('');
      onGoalAdded();
      
      toast({
        title: "Savings goal added",
        description: `Created goal: ${title}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add savings goal",
        variant: "destructive",
      });
    }
  };

  const getGoalStatus = (goal: SavingsGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    return { progress, daysRemaining };
  };

  const getSuggestions = (goal: SavingsGoal) => {
    const { daysRemaining } = getGoalStatus(goal);
    const remaining = goal.targetAmount - goal.currentAmount;
    const dailySavings = daysRemaining > 0 ? remaining / daysRemaining : 0;
    const monthlySavings = dailySavings * 30;
    
    return {
      dailySavings: Math.max(0, dailySavings),
      monthlySavings: Math.max(0, monthlySavings),
      remaining
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Savings Goals
        </CardTitle>
        <CardDescription>
          Set and track your savings targets with personalized advice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Goal Form */}
        <form onSubmit={handleAddGoal} className="space-y-4 p-4 rounded-lg border bg-card">
          <h4 className="font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Savings Goal
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Goal Title</Label>
              <Input
                placeholder="e.g., Emergency Fund"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Target Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Target Date</Label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={!title || !targetAmount || !targetDate}>
            Add Savings Goal
          </Button>
        </form>

        {/* Current Goals */}
        {goals.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Your Savings Goals</h4>
            <div className="grid grid-cols-1 gap-6">
              {goals.map((goal) => {
                const { progress, daysRemaining } = getGoalStatus(goal);
                const suggestions = getSuggestions(goal);
                const isCompleted = progress >= 100;
                const isOverdue = daysRemaining < 0;
                
                return (
                  <div key={goal.id} className="p-6 rounded-lg border bg-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-lg">{goal.title}</h5>
                      <div className="flex items-center gap-2">
                        {isCompleted && <Trophy className="h-5 w-5 text-warning" />}
                        <Badge 
                          variant={isCompleted ? "secondary" : isOverdue ? "destructive" : "outline"}
                          className="flex items-center gap-1"
                        >
                          <Calendar className="h-3 w-3" />
                          {isOverdue ? 'Overdue' : `${daysRemaining} days left`}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span className="font-medium">
                          {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div 
                          className={cn(
                            "h-3 rounded-full transition-all",
                            isCompleted ? "bg-success" : "bg-primary"
                          )}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      
                      <div className="text-center">
                        <span className="text-lg font-bold text-primary">
                          {progress.toFixed(1)}% Complete
                        </span>
                      </div>
                    </div>
                    
                    {!isCompleted && (
                      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <h6 className="font-medium text-primary mb-2">💡 Savings Advice</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">To reach your goal:</p>
                            <p className="font-medium">
                              Save {formatCurrency(suggestions.dailySavings, currency)} daily
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Or save monthly:</p>
                            <p className="font-medium">
                              {formatCurrency(suggestions.monthlySavings, currency)} per month
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                          Remaining: {formatCurrency(suggestions.remaining, currency)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No savings goals set</p>
            <p className="text-sm">Add your first goal to start saving</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
