import { Suspense } from 'react';
import Link from 'next/link';
import { cacheTag, cacheLife } from 'next/cache';
import { ArrowLeft, Trophy, Loader2 } from 'lucide-react';
import { services } from '@/lib/services';
import { ContestNav } from '@/components/admin/ContestNav';
import type { Contest } from '@/lib/types';

async function getContest(id: number): Promise<Contest> {
  'use cache';
  cacheTag(`contest-${id}`);
  cacheLife('minutes');
  const contest = await services.contestService.getContest(id);
  return contest;
}

async function ContestHeader({ contestId }: { contestId: number }) {
  const contest = await getContest(contestId);
  return (
    <div>
      <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4">
        <ArrowLeft size={14} /> Буцах
      </Link>
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Trophy size={20} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">{contest.name}</h1>
          {contest.description && <p className="text-sm text-slate-500">{contest.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default async function ContestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contestId = Number(id);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-6">
      <Suspense fallback={<div className="h-20 animate-pulse bg-white/[0.03] rounded-xl" />}>
        <ContestHeader contestId={contestId} />
      </Suspense>
      <ContestNav contestId={contestId} />
      <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-cyan-400" /></div>}>
        {children}
      </Suspense>
    </div>
  );
}
