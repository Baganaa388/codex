import { cacheTag, cacheLife } from 'next/cache';
import { services } from '@/lib/services';
import { ScoringTab } from '@/components/admin/ScoringTab';

async function getProblems(contestId: number) {
  'use cache';
  cacheTag('problems');
  cacheLife('minutes');
  return services.problemService.listByContest(contestId);
}

async function getContestants(contestId: number) {
  'use cache';
  cacheTag('contestants');
  cacheLife('minutes');
  const { rows } = await services.contestantService.listByContest(contestId);
  return rows;
}

async function getScores(contestId: number) {
  'use cache';
  cacheTag('leaderboard');
  cacheLife('seconds');
  return services.scoringService.getScoresForContest(contestId);
}

export default async function ScoringPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contestId = Number(id);
  const [problems, contestants, scores] = await Promise.all([
    getProblems(contestId),
    getContestants(contestId),
    getScores(contestId),
  ]);

  return (
    <ScoringTab
      problems={[...problems]}
      contestants={[...contestants]}
      initialScores={scores}
    />
  );
}
