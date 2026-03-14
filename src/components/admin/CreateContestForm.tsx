'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContestFormSchema, type CreateContestFormInput } from '@/lib/schemas/contest.schema';
import { useAdmin } from '@/hooks/useAdmin';
import type { Contest } from '@/lib/types';

function defaultTimes() {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  const end = new Date();
  end.setDate(end.getDate() + 30);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function CreateContestForm() {
  const router = useRouter();
  const { authFetch } = useAdmin();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateContestFormInput>({
    resolver: zodResolver(createContestFormSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (data: CreateContestFormInput) => {
    setServerError(null);
    const times = defaultTimes();
    const res = await authFetch<Contest>('/api/contests', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        start_time: times.start,
        end_time: times.end,
        status: 'draft',
      }),
    });
    if (res.success && res.data) {
      router.push(`/admin/contest/${res.data.id}`);
    } else {
      setServerError(res.error ?? 'Тэмцээн үүсгэхэд алдаа гарлаа');
      if (res.error?.includes('Authentication') || res.error?.includes('token')) {
        router.push('/admin/login');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4 max-w-lg"
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Plus size={16} className="text-cyan-400" />
        </div>
        <h3 className="font-bold text-white">Шинэ тэмцээн үүсгэх</h3>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Нэр</label>
          <input
            {...register('name')}
            className={`w-full bg-white/[0.04] border rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 ${
              errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/[0.08] focus:border-cyan-500'
            }`}
            placeholder="CodeX [5]"
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Тайлбар</label>
          <input
            {...register('description')}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-500 placeholder:text-slate-600"
            placeholder="Програмчлалын олимпиад"
          />
        </div>
      </div>

      <p className="text-xs text-slate-600">
        Цаг, хураамж зэрэг тохиргоог тэмцээн үүссэний дараа засах боломжтой.
      </p>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          Үүсгэх
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard')}
          className="inline-flex items-center gap-2 border border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-slate-200 font-semibold px-5 py-2.5 rounded-xl text-sm bg-transparent cursor-pointer transition-colors"
        >
          Болих
        </button>
      </div>
    </form>
  );
}
