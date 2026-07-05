import { useMemo, useState } from 'react';
import { BarChart } from './components/BarChart';
import { TransactionForm } from './components/TransactionForm';
import type { KakeiboData, Transaction, TransactionInput } from './types';
import { currentMonth, expenseByCategory, expenseByDay, inMonth, sumByType, yen } from './utils/format';
import { useKakeibo } from './hooks/useKakeibo';
import './styles.css';

type Page = 'home' | 'input' | 'history' | 'analysis' | 'settings';
const pages: { id: Page; label: string }[] = [{ id: 'home', label: 'ホーム' }, { id: 'input', label: '入力' }, { id: 'history', label: '履歴' }, { id: 'analysis', label: '分析' }, { id: 'settings', label: '設定' }];

const validateImport = (value: unknown): value is KakeiboData => !!value && typeof value === 'object' && Array.isArray((value as KakeiboData).transactions) && Array.isArray((value as KakeiboData).categories) && typeof (value as KakeiboData).monthlyBudget === 'number';

export default function App() {
  const kakeibo = useKakeibo();
  const { data } = kakeibo;
  const [page, setPage] = useState<Page>('home');
  const [month, setMonth] = useState(currentMonth());
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [importMessage, setImportMessage] = useState('');

  const monthTransactions = useMemo(() => data.transactions.filter((item) => inMonth(item, month)), [data.transactions, month]);
  const filteredTransactions = filter === 'all' ? monthTransactions : monthTransactions.filter((item) => item.category === filter);
  const income = sumByType(monthTransactions, 'income');
  const expense = sumByType(monthTransactions, 'expense');
  const categoryExpenses = expenseByCategory(monthTransactions);

  const saveTransaction = (input: TransactionInput) => {
    if (editing) {
      kakeibo.updateTransaction(editing.id, input);
      setEditing(null);
    } else {
      kakeibo.addTransaction(input);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simple-kakeibo-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      if (!validateImport(parsed)) throw new Error('invalid');
      kakeibo.importData(parsed);
      setImportMessage('インポートしました。');
    } catch {
      setImportMessage('JSON形式が正しくありません。');
    }
  };

  return <div className="app"><header><div><p className="eyebrow">Local only</p><h1>Simple Kakeibo</h1></div><nav>{pages.map((item) => <button className={page === item.id ? 'active' : ''} key={item.id} onClick={() => setPage(item.id)}>{item.label}</button>)}</nav></header>
    <main>
      {page === 'home' && <><section className="grid stats"><div className="card"><span>今月の収入合計</span><strong>{yen(income)}</strong></div><div className="card"><span>今月の支出合計</span><strong>{yen(expense)}</strong></div><div className="card"><span>今月の残額</span><strong>{yen(income - expense)}</strong></div><div className="card"><span>月予算の残り</span><strong>{yen(data.monthlyBudget - expense)}</strong></div></section><BarChart title="カテゴリ別支出" data={categoryExpenses} /></>}
      {page === 'input' && <section><h2>取引を入力</h2><TransactionForm categories={data.categories} onSubmit={saveTransaction} /></section>}
      {page === 'history' && <section className="card"><h2>履歴</h2><div className="toolbar"><input type="month" value={month} onChange={(e) => setMonth(e.target.value)} /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">すべてのカテゴリ</option>{data.categories.map((item) => <option key={item}>{item}</option>)}</select></div>{editing && <TransactionForm categories={data.categories} initial={editing} onSubmit={saveTransaction} onCancel={() => setEditing(null)} />}{filteredTransactions.length === 0 ? <p className="empty">この条件の取引はまだありません。</p> : <div className="list">{filteredTransactions.map((item) => <article key={item.id} className="transaction"><div><b>{item.category}</b><span>{item.date} {item.memo}</span></div><strong className={item.type}>{item.type === 'income' ? '+' : '-'}{yen(item.amount)}</strong><button onClick={() => setEditing(item)}>編集</button><button className="danger" onClick={() => kakeibo.deleteTransaction(item.id)}>削除</button></article>)}</div>}</section>}
      {page === 'analysis' && <div className="analysis"><BarChart title="カテゴリ別支出グラフ" data={categoryExpenses} /><BarChart title="日別支出グラフ" data={expenseByDay(monthTransactions)} /></div>}
      {page === 'settings' && <section className="card settings"><h2>設定</h2><label>月予算<input type="number" min="0" value={data.monthlyBudget} onChange={(e) => kakeibo.setMonthlyBudget(Math.max(0, Number(e.target.value)))} /></label><div className="category-editor"><input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="新しいカテゴリ" /><button onClick={() => { if (categoryName.trim()) { kakeibo.addCategory(categoryName.trim()); setCategoryName(''); } }}>追加</button></div><div className="chips">{data.categories.map((item) => <span key={item}><input defaultValue={item} onBlur={(e) => e.target.value.trim() && kakeibo.renameCategory(item, e.target.value.trim())} /><button onClick={() => kakeibo.deleteCategory(item)}>×</button></span>)}</div><div className="actions"><button onClick={exportJson}>JSONエクスポート</button><label className="file">JSONインポート<input type="file" accept="application/json" onChange={(e) => importJson(e.target.files?.[0])} /></label><button className="danger" onClick={() => confirm('全データを削除しますか？') && kakeibo.resetData()}>全データ削除</button></div>{importMessage && <p>{importMessage}</p>}</section>}
    </main>
  </div>;
}
