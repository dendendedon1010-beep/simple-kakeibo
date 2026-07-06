import type { Transaction } from '../types';

export const yen = (value: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
export const currentMonth = () => new Date().toISOString().slice(0, 7);
export const monthOf = (date: string) => date.slice(0, 7);
export const inMonth = (transaction: Transaction, month: string) => monthOf(transaction.date) === month;

export const sumByType = (transactions: Transaction[], type: Transaction['type']) =>
  transactions.filter((item) => item.type === type).reduce((sum, item) => sum + item.amount, 0);

export const expenseByCategory = (transactions: Transaction[]) =>
  transactions.filter((item) => item.type === 'expense').reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});

export const expenseByDay = (transactions: Transaction[]) =>
  transactions.filter((item) => item.type === 'expense').reduce<Record<string, number>>((acc, item) => {
    acc[item.date] = (acc[item.date] ?? 0) + item.amount;
    return acc;
  }, {});
