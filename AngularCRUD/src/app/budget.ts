export interface Budget {
    id: string;
    date: Date;
    monthlyBudget: number;
    categoryExpenses: CategoryExpense[];
    totalExpenses: number;
    remainingBudget: number;
}

export interface CategoryExpense {
    category: string;
    totalSpent: number;
    expenses: Expense[];
}

export interface Expense {
    description: string;
    amount: number;
}
