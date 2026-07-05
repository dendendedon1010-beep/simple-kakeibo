import { yen } from '../utils/format';

type Props = { title: string; data: Record<string, number> };

export const BarChart = ({ title, data }: Props) => {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, value]) => value), 1);
  return <section className="card"><h2>{title}</h2>{entries.length === 0 ? <p className="empty">表示できるデータがありません。</p> : <div className="bars">{entries.map(([label, value]) => <div className="bar-row" key={label}><span>{label}</span><div className="bar"><i style={{ width: `${(value / max) * 100}%` }} /></div><strong>{yen(value)}</strong></div>)}</div>}</section>;
};
