
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialCard } from "@/components/FinancialCard";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { SpendingChart } from "@/components/SpendingChart";
import { SavingsSuggestions } from "@/components/SavingsSuggestions";
import { CurrencySettings } from "@/components/CurrencySettings";
import { FinancialHealthComparison } from "@/components/FinancialHealthComparison";
import { ExpenseLimits } from "@/components/ExpenseLimits";
import { SavingsGoals } from "@/components/SavingsGoals";
import { Contact } from "@/components/Contact";
import { LandingPage } from "@/components/LandingPage";
import { loadBudgetData, getFinancialSummary, type Transaction } from "@/lib/storage";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Target, Settings, BarChart3, Lightbulb } from "lucide-react";

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetData, setBudgetData] = useState(loadBudgetData());
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    transactions: 0
  });

  const loadData = () => {
    const data = loadBudgetData();
    setBudgetData(data);
    setTransactions(data.transactions);
    setSummary(getFinancialSummary(data.transactions));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransactionAdded = (transaction: Transaction) => {
    loadData(); // Refresh data after adding transaction
  };

  const handleTransactionDeleted = () => {
    loadData(); // Refresh data after deleting transaction
  };

  const handleDataChanged = () => {
    loadData(); // Refresh data after any change
  };

  const handleEnterApp = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smart Budget Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take control of your finances with our intelligent budget tracking system. 
            Monitor income, track expenses, and achieve your savings goals.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="goals">Goals & Limits</TabsTrigger>
            <TabsTrigger value="advice">Advice</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FinancialCard
                title="Total Income"
                amount={summary.totalIncome}
                icon={TrendingUp}
                variant="income"
                currency={budgetData.currency}
                className="animate-fade-in"
              />
              <FinancialCard
                title="Total Expenses"
                amount={summary.totalExpenses}
                icon={TrendingDown}
                variant="expense"
                currency={budgetData.currency}
                className="animate-fade-in [animation-delay:100ms]"
              />
              <FinancialCard
                title="Net Savings"
                amount={summary.savings}
                icon={PiggyBank}
                variant="savings"
                currency={budgetData.currency}
                className="animate-fade-in [animation-delay:200ms]"
              />
              <Card className="animate-fade-in [animation-delay:300ms] border-0 bg-gradient-primary text-primary-foreground">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Transactions
                  </CardTitle>
                  <Target className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.transactions}
                  </div>
                  <p className="text-xs opacity-90">
                    This month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="animate-slide-up">
              <SpendingChart transactions={transactions} />
            </div>

            {/* Transaction Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="animate-slide-up [animation-delay:200ms]">
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
              </div>
              <div className="animate-slide-up [animation-delay:300ms]">
                <TransactionHistory 
                  transactions={transactions} 
                  onTransactionDeleted={handleTransactionDeleted}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-8">
            <FinancialHealthComparison 
              transactions={transactions} 
              currency={budgetData.currency}
            />
          </TabsContent>

          <TabsContent value="goals" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <ExpenseLimits 
                limits={budgetData.expenseLimits}
                transactions={transactions}
                currency={budgetData.currency}
                onLimitAdded={handleDataChanged}
              />
              <SavingsGoals 
                goals={budgetData.savingsGoals}
                currency={budgetData.currency}
                onGoalAdded={handleDataChanged}
              />
            </div>
          </TabsContent>

          <TabsContent value="advice" className="space-y-8">
            <SavingsSuggestions />
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <CurrencySettings onCurrencyChanged={handleDataChanged} />
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <div className="animate-fade-in [animation-delay:400ms]">
          <Contact />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Built with React, Chart.js, and localStorage for data persistence</p>
          <p className="mt-2">© 2024 Smart Budget Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
