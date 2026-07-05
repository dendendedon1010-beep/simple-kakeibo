import { DEFAULT_DATA } from '../constants';
import type { KakeiboData } from '../types';

const STORAGE_KEY = 'simple-kakeibo-data-v1';

const isData = (value: unknown): value is KakeiboData => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<KakeiboData>;
  return Array.isArray(data.transactions) && Array.isArray(data.categories) && typeof data.monthlyBudget === 'number';
};

export const loadKakeiboData = (): KakeiboData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as unknown;
    return isData(parsed) ? parsed : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
};

export const saveKakeiboData = (data: KakeiboData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearKakeiboData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
