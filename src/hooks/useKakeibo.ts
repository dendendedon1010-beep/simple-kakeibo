import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_DATA } from '../constants';
import type { KakeiboData, Transaction, TransactionInput } from '../types';
import { clearKakeiboData, loadKakeiboData, saveKakeiboData } from '../utils/storage';

const createId = () => `${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;

export const useKakeibo = () => {
  const [data, setData] = useState<KakeiboData>(() => loadKakeiboData());

  useEffect(() => saveKakeiboData(data), [data]);

  const addTransaction = (input: TransactionInput) => {
    const transaction: Transaction = { ...input, id: createId() };
    setData((current) => ({ ...current, transactions: [transaction, ...current.transactions] }));
  };

  const updateTransaction = (id: string, input: TransactionInput) => {
    setData((current) => ({
      ...current,
      transactions: current.transactions.map((item) => (item.id === id ? { ...input, id } : item)),
    }));
  };

  const deleteTransaction = (id: string) => {
    setData((current) => ({ ...current, transactions: current.transactions.filter((item) => item.id !== id) }));
  };

  const setMonthlyBudget = (monthlyBudget: number) => setData((current) => ({ ...current, monthlyBudget }));

  const addCategory = (category: string) => {
    setData((current) => current.categories.includes(category) ? current : { ...current, categories: [...current.categories, category] });
  };

  const renameCategory = (oldName: string, newName: string) => {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category) => (category === oldName ? newName : category)),
      transactions: current.transactions.map((item) => item.category === oldName ? { ...item, category: newName } : item),
    }));
  };

  const deleteCategory = (category: string) => {
    setData((current) => ({ ...current, categories: current.categories.filter((item) => item !== category) }));
  };

  const importData = (incoming: KakeiboData) => setData(incoming);

  const resetData = () => {
    clearKakeiboData();
    setData(DEFAULT_DATA);
  };

  return useMemo(() => ({ data, addTransaction, updateTransaction, deleteTransaction, setMonthlyBudget, addCategory, renameCategory, deleteCategory, importData, resetData }), [data]);
};
