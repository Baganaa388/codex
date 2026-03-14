import { cacheTag, cacheLife } from 'next/cache';
import { services } from '@/lib/services';
import { ProblemsTab } from '@/components/admin/ProblemsTab';

async function getProblems(contestId: number) {
  'use cache';
  cacheTag('problems');
  cacheLife('minutes');
  return services.problemService.listByContest(contestId);
}

export default async function ProblemsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contestId = Number(id);
  const problems = await getProblems(contestId);

  return <ProblemsTab contestId={contestId} initialProblems={[...problems]} />;
}
