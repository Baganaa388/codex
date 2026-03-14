import { cacheTag, cacheLife } from 'next/cache';
import { services } from '@/lib/services';
import { SettingsTab } from '@/components/admin/SettingsTab';

async function getContest(id: number) {
  'use cache';
  cacheTag(`contest-${id}`);
  cacheLife('minutes');
  return services.contestService.getContest(id);
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contestId = Number(id);
  const contest = await getContest(contestId);

  return <SettingsTab contestId={contestId} initialContest={contest} />;
}
