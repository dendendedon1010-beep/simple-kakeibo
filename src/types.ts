export type TransactionType = 'expense' | 'income';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  memo: string;
};

export type KakeiboData = {
  transactions: Transaction[];
  categories: string[];
  monthlyBudget: number;
};

export type TransactionInput = Omit<Transaction, 'id'>;
