'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Save, Users, Hash } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import type { Problem, Contestant } from '@/lib/types';

interface ScoringTabProps {
  readonly problems: readonly Problem[];
  readonly contestants: readonly Contestant[];
  readonly initialScores: Record<number, Record<number, number>>;
}

export function ScoringTab({ problems, contestants, initialScores }: ScoringTabProps) {
  const { authFetch } = useAdmin();
  const [search, setSearch] = useState('');
  const [scores, setScores] = useState<Record<number, Record<number, number>>>(initialScores);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getScore = (contestantId: number, problemId: number) =>
    scores[contestantId]?.[problemId] ?? 0;

  const updateScore = (contestantId: number, problemId: number, value: number) => {
    const clamped = Math.min(Math.max(0, value || 0), 100);
    setScores(prev => ({
      ...prev,
      [contestantId]: { ...prev[contestantId], [problemId]: clamped },
    }));
    setSavedIds(prev => { const next = new Set(prev); next.delete(contestantId); return next; });
  };

  const rowTotal = (contestantId: number) =>
    problems.reduce((sum, p) => sum + getScore(contestantId, p.id), 0);

  const onSaveRow = async (contestant: Contestant) => {
    setSavingId(contestant.id);
    setErrorMsg(null);

    for (const problem of problems) {
      const score = getScore(contestant.id, problem.id);
      const res = await authFetch<{ total_points: number }>('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          reg_number: contestant.reg_number,
          problem_id: problem.id,
          score,
        }),
      });
      if (!res.success) {
        setErrorMsg(`${contestant.reg_number}: ${res.error ?? 'Алдаа гарлаа'}`);
        setSavingId(null);
        return;
      }
    }

    setSavedIds(prev => new Set(prev).add(contestant.id));
    setSavingId(null);
  };

  const filtered = contestants.filter(c =>
    c.first_name.toLowerCase().includes(search.toLowerCase()) ||
    c.last_name.toLowerCase().includes(search.toLowerCase()) ||
    c.reg_number.toLowerCase().includes(search.toLowerCase()),
  );

  if (problems.length === 0) {
    return (
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-white">Дүн оруулах</h2>
        <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
          <Hash size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Бодлого нэмээгүй байна</p>
        </div>
      </div>
    );
  }

  if (contestants.length === 0) {
    return (
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-white">Дүн оруулах</h2>
        <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
          <Users size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Оролцогч байхгүй байна</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Дүн оруулах</h2>
          <span className="text-xs font-bold text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-lg">{contestants.length} оролцогч</span>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Хайх..."
          className="w-56 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-500 placeholder:text-slate-600"
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400">
          <XCircle size={16} /> {errorMsg}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white/[0.02] border border-white/[0.08]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600 whitespace-nowrap">Дугаар</th>
              <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600 whitespace-nowrap">Нэр</th>
              {problems.map((p, i) => (
                <th key={p.id} className="px-2 py-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600 text-center whitespace-nowrap">
                  {i + 1}. {p.title}
                </th>
              ))}
              <th className="px-3 py-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600 text-center whitespace-nowrap">Нийт</th>
              <th className="px-3 py-3.5 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map(c => {
              const isSaving = savingId === c.id;
              const isSaved = savedIds.has(c.id);
              return (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-2.5 font-mono text-cyan-400 font-bold text-xs whitespace-nowrap">{c.reg_number}</td>
                  <td className="px-4 py-2.5 font-semibold text-white whitespace-nowrap">{c.last_name?.charAt(0)}. {c.first_name}</td>
                  {problems.map(p => (
                    <td key={p.id} className="px-2 py-2.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={getScore(c.id, p.id)}
                        onChange={e => updateScore(c.id, p.id, Number(e.target.value))}
                        className="w-16 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none transition-colors focus:border-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center">
                    <span className="bg-cyan-500/10 text-cyan-400 text-xs font-black px-2.5 py-1 rounded-lg ring-1 ring-inset ring-cyan-500/20">
                      {rowTotal(c.id)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={() => onSaveRow(c)}
                      disabled={isSaving}
                      className={`inline-flex items-center justify-center gap-1.5 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer disabled:cursor-not-allowed ${
                        isSaved
                          ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-white disabled:opacity-50'
                      }`}
                    >
                      {isSaving ? <Loader2 size={13} className="animate-spin" /> : isSaved ? <CheckCircle size={13} /> : <Save size={13} />}
                      {isSaved ? '' : 'Хадгалах'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
