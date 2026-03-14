import { Suspense } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { Loader2 } from 'lucide-react';
import { SectionHeading } from '@/components/UI';
import { services } from '@/lib/services';
import { LeaderboardClient } from '@/components/LeaderboardClient';
import type { Contest, LeaderboardEntry, ProblemStatistic } from '@/lib/types';

async function getContests(): Promise<readonly Contest[]> {
  'use cache';
  cacheTag('contests');
  cacheLife('minutes');
  return services.contestService.listContests();
}

async function getLeaderboardData(contestId: number, category: string) {
  'use cache';
  cacheTag(`leaderboard-${contestId}`);
  cacheLife('seconds');
  const [lb, stats] = await Promise.all([
    services.leaderboardService.getLeaderboard(contestId, { category, limit: 100 }),
    services.leaderboardService.getProblemStatistics(contestId),
  ]);
  return { entries: lb.entries, total: lb.total, problemStats: stats };
}

export default function LeaderboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <SectionHeading
        title="Лидерүүдийн самбар"
        subtitle="Олимпиад сонгож, ангилал бүрийн шилдэг оролцогчдыг харна уу."
      />

      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent />
      </Suspense>
    </div>
  );
}

async function LeaderboardContent() {
  const contests = await getContests();

  let initialEntries: readonly LeaderboardEntry[] = [];
  let initialTotal = 0;
  let initialProblemStats: readonly ProblemStatistic[] = [];

  if (contests.length > 0) {
    const data = await getLeaderboardData(contests[0].id, 'Бага');
    initialEntries = data.entries;
    initialTotal = data.total;
    initialProblemStats = data.problemStats;
  }

  return (
    <LeaderboardClient
      contests={contests}
      initialEntries={initialEntries}
      initialTotal={initialTotal}
      initialProblemStats={initialProblemStats}
    />
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#EDAF00]" />
    </div>
  );
}
