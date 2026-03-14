import { cacheTag, cacheLife } from 'next/cache';
import { services } from '@/lib/services';
import { ContestantsTab } from '@/components/admin/ContestantsTab';

async function getContestants(contestId: number) {
  'use cache';
  cacheTag('contestants');
  cacheLife('minutes');
  const { rows } = await services.contestantService.listByContest(contestId);
  return rows;
}

export default async function ContestantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contestId = Number(id);
  const contestants = await getContestants(contestId);

  return <ContestantsTab contestId={contestId} contestants={[...contestants]} />;
}
