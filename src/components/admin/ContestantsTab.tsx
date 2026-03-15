'use client';

import { useState } from 'react';
import { Users, Download } from 'lucide-react';
import type { Contestant } from '@/lib/types';

interface ContestantsTabProps {
  readonly contestId: number;
  readonly contestants: readonly Contestant[];
}

export function ContestantsTab({ contestId, contestants }: ContestantsTabProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Бага' | 'Дунд' | 'Ахлах'>('all');

  const filtered = contestants.filter(c => {
    const matchesSearch =
      c.first_name.toLowerCase().includes(search.toLowerCase()) ||
      c.last_name.toLowerCase().includes(search.toLowerCase()) ||
      c.reg_number.toLowerCase().includes(search.toLowerCase()) ||
      c.register_number.toLowerCase().includes(search.toLowerCase()) ||
      c.organization.toLowerCase().includes(search.toLowerCase()) ||
      c.class_level.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || c.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const downloadCsv = () => {
    const token = localStorage.getItem('codex_admin_token');
    fetch(`/api/contestants/export?contest_id=${contestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `contestants-${contestId}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
  };

  const paymentBadge = (status?: string) => {
    if (status === 'paid') return { label: 'Төлсөн', cls: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' };
    if (status === 'free') return { label: 'Үнэгүй', cls: 'bg-slate-500/10 text-slate-400 ring-slate-500/20' };
    return { label: 'Хүлээгдэж буй', cls: 'bg-amber-500/10 text-amber-400 ring-amber-500/20' };
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Оролцогчид</h2>
          <span className="text-xs font-bold text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-lg">{contestants.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={downloadCsv} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors ring-1 ring-inset ring-emerald-500/20 cursor-pointer">
            <Download size={15} /> Excel
          </button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Хайх..."
            className="w-56 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-500 placeholder:text-slate-600" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Бүгд' },
          { key: 'Бага', label: 'Бага' },
          { key: 'Дунд', label: 'Дунд' },
          { key: 'Ахлах', label: 'Ахлах' },
        ].map(item => (
          <button
            key={item.key}
            type="button"
            onClick={() => setCategoryFilter(item.key as 'all' | 'Бага' | 'Дунд' | 'Ахлах')}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              categoryFilter === item.key
                ? 'bg-cyan-500 text-white'
                : 'border border-white/[0.08] text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
          <Users size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Оролцогч {contestants.length === 0 ? 'байхгүй' : 'олдсонгүй'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white/[0.02] border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Дугаар', 'Регистр', 'Нэр', 'Сургууль', 'ЕБС', 'Ангилал', 'Төлбөр', 'Утас'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map(c => {
                const payment = paymentBadge(c.payment_status);
                return (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 font-mono text-cyan-400 font-bold text-xs">{c.reg_number}</td>
                    <td className="px-4 py-3 font-mono text-slate-300 font-bold text-xs">{c.register_number}</td>
                    <td className="px-4 py-3 font-semibold text-white">{c.last_name} {c.first_name}</td>
                    <td className="px-4 py-3 text-slate-400">{c.organization}</td>
                    <td className="px-4 py-3 text-slate-400">{c.class_level}</td>
                    <td className="px-4 py-3">
                      <span className="bg-violet-500/10 text-violet-400 text-[10px] font-bold px-2.5 py-1 rounded-lg ring-1 ring-inset ring-violet-500/20">{c.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ring-1 ring-inset ${payment.cls}`}>{payment.label}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.phone}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
