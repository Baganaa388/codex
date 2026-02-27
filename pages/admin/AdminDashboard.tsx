import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Loader2, ChevronRight, LogOut } from 'lucide-react';
import { ApiResponse, Contest } from '../../types';

interface Props {
  authFetch: <T>(url: string, options?: RequestInit) => Promise<ApiResponse<T>>;
  onSelectContest: (id: number) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ authFetch, onSelectContest, onLogout }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
  });

  const loadContests = async () => {
    const data = await authFetch<Contest[]>('/api/contests');
    if (data.success && data.data) {
      setContests(data.data);
    }
    setLoading(false);
  };

  useEffect(() => { loadContests(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const data = await authFetch<Contest>('/api/contests', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
        status: 'registration',
      }),
    });
    if (data.success) {
      setShowCreate(false);
      setForm({ name: '', description: '', start_time: '', end_time: '' });
      await loadContests();
    }
    setCreating(false);
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-500/20 text-slate-400',
    registration: 'bg-green-500/20 text-green-400',
    active: 'bg-cyan-500/20 text-cyan-400',
    grading: 'bg-yellow-500/20 text-yellow-400',
    finished: 'bg-purple-500/20 text-purple-400',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Ноорог',
    registration: 'Бүртгэл нээлттэй',
    active: 'Явагдаж байна',
    grading: 'Дүн шалгаж байна',
    finished: 'Дууссан',
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">CodeX Admin</h1>
          <p className="text-xs text-slate-500">Удирдлагын самбар</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <LogOut size={16} /> Гарах
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Тэмцээнүүд</h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <Plus size={18} /> Шинэ тэмцээн
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="glass border border-cyan-500/30 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-cyan-400">Шинэ тэмцээн үүсгэх</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Нэр</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Тайлбар</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Эхлэх цаг</label>
                <input required type="datetime-local" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Дуусах цаг</label>
                <input required type="datetime-local" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={creating}
                className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2">
                {creating && <Loader2 size={16} className="animate-spin" />}
                Үүсгэх
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="border border-white/10 hover:border-white/30 text-slate-400 px-6 py-2 rounded-xl text-sm">
                Болих
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-cyan-400" /></div>
        ) : contests.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Тэмцээн байхгүй байна. Шинэ тэмцээн үүсгэнэ үү.</div>
        ) : (
          <div className="space-y-3">
            {contests.map(contest => (
              <button
                key={contest.id}
                onClick={() => onSelectContest(contest.id)}
                className="w-full glass border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 flex items-center justify-between transition-all text-left group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">{contest.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${statusColors[contest.status] ?? ''}`}>
                      {statusLabels[contest.status] ?? contest.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(contest.start_time).toLocaleDateString('mn-MN')}</span>
                    {contest.description && <span>{contest.description}</span>}
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
