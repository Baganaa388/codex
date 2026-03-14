'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  timelineFormSchema, type TimelineFormInput,
  feeFormSchema, type FeeFormInput,
} from '@/lib/schemas/contest.schema';
import { useAdmin } from '@/hooks/useAdmin';
import type { Contest, ApiResponse } from '@/lib/types';

const INPUT_CLS = 'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-500 placeholder:text-slate-600';

const DEFAULT_TIMELINE_ITEMS = [
  { title: 'Бүртгэл', desc: 'Онлайнаар бүртгүүлэх', date: '' },
  { title: 'Финал', desc: 'Улаанбаатар хотод', date: '' },
  { title: 'Шагнал', desc: 'Ялагчдыг тодруулах', date: '' },
];

interface SettingsTabProps {
  readonly contestId: number;
  readonly initialContest: Contest;
}

export function SettingsTab({ contestId, initialContest }: SettingsTabProps) {
  const { authFetch } = useAdmin();
  const [contest, setContest] = useState<Contest>(initialContest);
  const [updating, setUpdating] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const timelineForm = useForm<TimelineFormInput>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: { items: DEFAULT_TIMELINE_ITEMS },
  });
  const { fields: timelineFields } = useFieldArray({ control: timelineForm.control, name: 'items' });

  const feeForm = useForm<FeeFormInput>({
    resolver: zodResolver(feeFormSchema),
    defaultValues: { registration_fee: contest.registration_fee ?? 0 },
  });

  useEffect(() => {
    const t = contest.timeline;
    const items = Array.isArray(t) && t.length > 0 ? t.map(item => ({ ...item })) : DEFAULT_TIMELINE_ITEMS;
    timelineForm.reset({ items });
    feeForm.reset({ registration_fee: contest.registration_fee ?? 0 });
  }, [contest]);

  const statuses = ['draft', 'registration', 'active', 'grading', 'finished'] as const;
  const statusLabels: Record<string, string> = {
    draft: 'Ноорог', registration: 'Бүртгэл', active: 'Явагдаж байна', grading: 'Дүгнэж байна', finished: 'Дууссан',
  };

  const changeStatus = async (status: string) => {
    setUpdating(true);
    const res = await authFetch<Contest>(`/api/contests/${contestId}`, { method: 'PUT', body: JSON.stringify({ status }) });
    if (res.success && res.data) setContest(res.data);
    setUpdating(false);
  };

  const recalculate = async () => {
    setRecalculating(true);
    setMsg(null);
    const res = await authFetch<{ message: string }>(`/api/leaderboard/${contestId}/recalculate`, { method: 'POST' });
    setMsg(res.success ? 'Leaderboard дахин тооцоологдлоо!' : (res.error ?? 'Алдаа'));
    setRecalculating(false);
  };

  const onSaveTimeline = async (data: TimelineFormInput) => {
    const res = await authFetch<Contest>(`/api/contests/${contestId}`, { method: 'PUT', body: JSON.stringify({ timeline: data.items }) });
    if (res.success && res.data) setContest(res.data);
    setMsg('Timeline хадгалагдлаа!');
  };

  const onSaveFee = async (data: FeeFormInput) => {
    const res = await authFetch<Contest>(`/api/contests/${contestId}`, { method: 'PUT', body: JSON.stringify({ registration_fee: data.registration_fee }) });
    if (res.success && res.data) setContest(res.data);
    setMsg('Хураамж хадгалагдлаа!');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="text-lg font-bold text-white">Тохиргоо</h2>

      {msg && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle size={16} /> {msg}
        </div>
      )}

      <SettingsCard title="Тэмцээний статус">
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => changeStatus(s)} disabled={updating}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                contest.status === s
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'border border-white/[0.08] text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400'
              }`}>
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Хуваарь / Timeline">
        <form onSubmit={timelineForm.handleSubmit(onSaveTimeline)} className="space-y-3">
          <div className="space-y-2.5">
            {timelineFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-3 gap-2">
                <input {...timelineForm.register(`items.${i}.title`)} placeholder="Гарчиг" className={INPUT_CLS} />
                <input {...timelineForm.register(`items.${i}.desc`)} placeholder="Тайлбар" className={INPUT_CLS} />
                <input {...timelineForm.register(`items.${i}.date`)} placeholder="04/15" className={INPUT_CLS} />
              </div>
            ))}
          </div>
          <button type="submit" disabled={timelineForm.formState.isSubmitting}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {timelineForm.formState.isSubmitting && <Loader2 size={16} className="animate-spin" />} Хадгалах
          </button>
        </form>
      </SettingsCard>

      <SettingsCard title="Бүртгэлийн хураамж (₮)">
        <form onSubmit={feeForm.handleSubmit(onSaveFee)} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {[0, 5000, 10000, 15000, 20000, 25000].map(amount => (
              <button key={amount} type="button"
                onClick={() => feeForm.setValue('registration_fee', amount, { shouldValidate: true })}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  feeForm.watch('registration_fee') === amount
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'border border-white/[0.08] text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400'
                }`}>
                {amount === 0 ? 'Үнэгүй' : `₮${amount.toLocaleString()}`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₮</span>
              <input type="number" min={0} step={1000}
                {...feeForm.register('registration_fee', { valueAsNumber: true })}
                className={`w-44 pl-8 pr-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 bg-white/[0.04] border rounded-xl ${
                  feeForm.formState.errors.registration_fee ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-cyan-500'
                }`}
                placeholder="Бусад дүн"
              />
            </div>
            <button type="submit" disabled={feeForm.formState.isSubmitting}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {feeForm.formState.isSubmitting && <Loader2 size={16} className="animate-spin" />} Хадгалах
            </button>
          </div>
          {feeForm.formState.errors.registration_fee && (
            <p className="text-xs text-red-400 font-medium">{feeForm.formState.errors.registration_fee.message}</p>
          )}
          <p className="text-xs text-slate-600">0 бол үнэгүй бүртгэл. Хураамжтай бол QPay-ээр төлбөр төлнө.</p>
        </form>
      </SettingsCard>

      <SettingsCard title="Leaderboard">
        <button onClick={recalculate} disabled={recalculating}
          className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors ring-1 ring-inset ring-violet-500/20 cursor-pointer">
          {recalculating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Дахин тооцоолох
        </button>
      </SettingsCard>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</label>
      {children}
    </div>
  );
}
