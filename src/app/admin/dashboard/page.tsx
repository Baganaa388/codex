import { cacheTag, cacheLife } from 'next/cache';
import Link from 'next/link';
import {
  Calendar,
  ChevronRight,
  Users,
  Trophy,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { services } from '@/lib/services';
import type { Contest } from '@/lib/types';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  draft: { label: 'Ноорог', color: 'bg-slate-500/10 text-slate-400 ring-slate-500/20', dot: 'bg-slate-400' },
  registration: { label: 'Бүртгэл', color: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20', dot: 'bg-emerald-400' },
  active: { label: 'Явагдаж байна', color: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20', dot: 'bg-cyan-400 animate-pulse' },
  grading: { label: 'Дүгнэж байна', color: 'bg-amber-500/10 text-amber-400 ring-amber-500/20', dot: 'bg-amber-400' },
  finished: { label: 'Дууссан', color: 'bg-violet-500/10 text-violet-400 ring-violet-500/20', dot: 'bg-violet-400' },
};

async function getContests(): Promise<readonly Contest[]> {
  'use cache';
  cacheTag('contests');
  cacheLife('minutes');
  return services.contestService.listContests();
}

export default async function AdminDashboardPage() {
  const contests = await getContests();

  const activeCount = contests.filter(c => c.status === 'active' || c.status === 'registration').length;
  const finishedCount = contests.filter(c => c.status === 'finished').length;
  const draftCount = contests.filter(c => c.status === 'draft').length;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Хянах самбар</h1>
        <p className="text-sm text-slate-500 mt-1">Тэмцээнүүдээ удирдах, дүн оруулах</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Нийт тэмцээн" value={String(contests.length)} color="cyan" />
        <StatCard icon={TrendingUp} label="Идэвхтэй" value={String(activeCount)} color="emerald" />
        <StatCard icon={Clock} label="Дууссан" value={String(finishedCount)} color="violet" />
        <StatCard icon={Users} label="Ноорог" value={String(draftCount)} color="slate" />
      </div>

      {/* Contests */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Тэмцээнүүд</h2>

        {contests.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Trophy size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Тэмцээн байхгүй байна</p>
            <p className="text-slate-600 text-sm mt-1">Sidebar-аас шинэ тэмцээн үүсгээрэй</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.map(contest => {
              const status = STATUS_CONFIG[contest.status] ?? STATUS_CONFIG.draft;
              return (
                <Link
                  key={contest.id}
                  href={`/admin/contest/${contest.id}`}
                  className="group bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-5 transition-all hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg truncate group-hover:text-cyan-400 transition-colors">
                        {contest.name}
                      </h3>
                      {contest.description && (
                        <p className="text-slate-500 text-sm mt-0.5 truncate">{contest.description}</p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-slate-700 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ring-1 ring-inset ${status.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Calendar size={12} />
                      {new Date(contest.start_time).toLocaleDateString('mn-MN')}
                    </span>
                    {contest.registration_fee > 0 && (
                      <span className="text-[11px] text-slate-500">
                        ₮{contest.registration_fee.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  color: 'cyan' | 'emerald' | 'violet' | 'slate';
}) {
  const colors = {
    cyan: 'from-cyan-500/10 to-cyan-500/5 text-cyan-400 ring-cyan-500/10',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-400 ring-emerald-500/10',
    violet: 'from-violet-500/10 to-violet-500/5 text-violet-400 ring-violet-500/10',
    slate: 'from-slate-500/10 to-slate-500/5 text-slate-400 ring-slate-500/10',
  };
  const iconColors = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    violet: 'bg-violet-500/10 text-violet-400',
    slate: 'bg-slate-500/10 text-slate-400',
  };

  return (
    <div className={`bg-linear-to-br ${colors[color]} rounded-2xl p-5 ring-1 ring-inset`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`h-9 w-9 rounded-xl ${iconColors[color]} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
    </div>
  );
}
