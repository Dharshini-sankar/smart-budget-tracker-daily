
// LocalStorage utilities for budget tracker data persistence

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: number;
}

export interface ExpenseLimit {
  id: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly';
  currency: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  currency: string;
}

export interface BudgetData {
  transactions: Transaction[];
  monthlyBudget: number;
  currency: string;
  expenseLimits: ExpenseLimit[];
  savingsGoals: SavingsGoal[];
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Conversion rate to USD
}

export const supportedCurrencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.75 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.0 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150.0 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.50 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.90 },
];

const STORAGE_KEY = 'smart-budget-tracker';

export const defaultCategories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other']
};

export const loadBudgetData = (): BudgetData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure new properties exist for backward compatibility
      return {
        transactions: parsed.transactions || [],
        monthlyBudget: parsed.monthlyBudget || 0,
        currency: parsed.currency || 'USD',
        expenseLimits: parsed.expenseLimits || [],
        savingsGoals: parsed.savingsGoals || [],
      };
    }
  } catch (error) {
    console.error('Error loading budget data:', error);
  }
  
  return {
    transactions: [],
    monthlyBudget: 0,
    currency: 'USD',
    expenseLimits: [],
    savingsGoals: [],
  };
};

export const saveBudgetData = (data: BudgetData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving budget data:', error);
  }
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  
  const data = loadBudgetData();
  data.transactions.unshift(newTransaction);
  saveBudgetData(data);
  
  return newTransaction;
};

export const deleteTransaction = (id: string): void => {
  const data = loadBudgetData();
  data.transactions = data.transactions.filter(t => t.id !== id);
  saveBudgetData(data);
};

export const updateCurrency = (currency: string): void => {
  const data = loadBudgetData();
  data.currency = currency;
  saveBudgetData(data);
};

export const addExpenseLimit = (limit: Omit<ExpenseLimit, 'id'>): ExpenseLimit => {
  const newLimit: ExpenseLimit = {
    ...limit,
    id: crypto.randomUUID(),
  };
  
  const data = loadBudgetData();
  data.expenseLimits.push(newLimit);
  saveBudgetData(data);
  
  return newLimit;
};

export const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>): SavingsGoal => {
  const newGoal: SavingsGoal = {
    ...goal,
    id: crypto.randomUUID(),
  };
  
  const data = loadBudgetData();
  data.savingsGoals.push(newGoal);
  saveBudgetData(data);
  
  return newGoal;
};

export const updateMonthlyBudget = (amount: number): void => {
  const data = loadBudgetData();
  data.monthlyBudget = amount;
  saveBudgetData(data);
};

// Calculate financial metrics with time periods
export const getFinancialSummary = (transactions: Transaction[], period: 'daily' | 'monthly' | '6months' | 'yearly' = 'monthly') => {
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '6months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default: // monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const periodTransactions = transactions.filter(t => 
    new Date(t.date) >= startDate
  );

  const totalIncome = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    savings,
    savingsRate,
    transactions: periodTransactions.length,
    period
  };
};

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = transactions.filter(t => 
    t.type === 'expense' && t.date.startsWith(currentMonth)
  );

  const breakdown: Record<string, number> = {};
  
  currentMonthExpenses.forEach(transaction => {
    breakdown[transaction.category] = (breakdown[transaction.category] || 0) + transaction.amount;
  });

  return Object.entries(breakdown)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = supportedCurrencies.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || '$';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount)).replace(/[A-Z]{3}/, symbol);
};
