'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormInput } from '@/lib/schemas/contest.schema';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminLoginPage() {
  const { setToken } = useAdmin();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setToken(json.data.token);
        router.push('/admin/dashboard');
      } else {
        setServerError(json.error ?? 'Нэвтрэх боломжгүй');
      }
    } catch {
      setServerError('Сервертэй холбогдож чадсангүй');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Админ нэвтрэх</h1>
          <p className="text-slate-500 mt-2">CodeX Olympiad удирдлагын самбар</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 space-y-6">
          {serverError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} />
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">Имэйл</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                {...register('email')}
                className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 focus:outline-none text-white ${
                  errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'
                }`}
                placeholder="admin@codex.mn"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">Нууц үг</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                {...register('password')}
                className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 focus:outline-none text-white ${
                  errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
            {isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>
      </div>
    </div>
  );
}
