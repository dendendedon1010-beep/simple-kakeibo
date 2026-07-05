import { FormEvent, useState } from 'react';
import type { Transaction, TransactionInput } from '../types';

type Props = { categories: string[]; initial?: Transaction; onSubmit: (input: TransactionInput) => void; onCancel?: () => void };

export const TransactionForm = ({ categories, initial, onSubmit, onCancel }: Props) => {
  const [type, setType] = useState<TransactionInput['type']>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial?.amount.toString() ?? '');
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? 'その他');
  const [memo, setMemo] = useState(initial?.memo ?? '');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError('金額は1円以上で入力してください。');
    if (!date) return setError('日付を入力してください。');
    if (!category.trim()) return setError('カテゴリを選択してください。');
    onSubmit({ type, amount: Math.round(numericAmount), date, category, memo: memo.trim() });
    if (!initial) {
      setAmount('');
      setMemo('');
    }
    setError('');
  };

  return <form className="card form" onSubmit={submit}>
    <div className="segmented" role="group" aria-label="支出または収入">
      <button type="button" className={type === 'expense' ? 'active' : ''} onClick={() => setType('expense')}>支出</button>
      <button type="button" className={type === 'income' ? 'active' : ''} onClick={() => setType('income')}>収入</button>
    </div>
    <label>金額<input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="例: 1200" /></label>
    <label>日付<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
    <label>カテゴリ<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>メモ<input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="任意" /></label>
    {error && <p className="error">{error}</p>}
    <div className="actions"><button className="primary">{initial ? '更新' : '登録'}</button>{onCancel && <button type="button" onClick={onCancel}>キャンセル</button>}</div>
  </form>;
};
