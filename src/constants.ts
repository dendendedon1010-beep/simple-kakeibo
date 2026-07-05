import type { KakeiboData } from './types';

export const INITIAL_CATEGORIES = [
  '食費', '外食', '交通費', '家賃', '通信費', 'サブスク', '趣味', '日用品', '美容・服', '医療', 'その他', '収入',
];

export const DEFAULT_DATA: KakeiboData = {
  transactions: [],
  categories: INITIAL_CATEGORIES,
  monthlyBudget: 0,
};
