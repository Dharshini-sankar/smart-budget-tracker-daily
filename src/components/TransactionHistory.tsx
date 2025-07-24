
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteTransaction, formatCurrency, loadBudgetData, type Transaction } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { History, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

export function TransactionHistory({ transactions, onTransactionDeleted }: TransactionHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const currency = loadBudgetData().currency;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    
    try {
      deleteTransaction(id);
      onTransactionDeleted();
      
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed from your records.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Transaction History
          </CardTitle>
          <CardDescription>
            Your recent income and expense transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Add your first transaction to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          Your recent income and expense transactions ({transactions.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  transaction.type === 'income' 
                    ? "bg-success text-success-foreground" 
                    : "bg-destructive text-destructive-foreground"
                )}>
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-card-foreground">
                      {transaction.description}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        transaction.type === 'income' 
                          ? "border-success text-success" 
                          : "border-destructive text-destructive"
                      )}
                    >
                      {transaction.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <p className={cn(
                  "text-lg font-semibold",
                  transaction.type === 'income' ? "text-success" : "text-destructive"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </p>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deletingId === transaction.id}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {transactions.length > 10 && (
            <div className="text-center pt-4 text-sm text-muted-foreground">
              Showing recent 10 transactions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
