import { Suspense } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { Loader2 } from 'lucide-react';
import { services } from '@/lib/services';
import { RegistrationClient } from '@/components/RegistrationClient';
import type { Contest } from '@/lib/types';

async function getContests(): Promise<readonly Contest[]> {
  'use cache';
  cacheTag('contests');
  cacheLife('minutes');
  return services.contestService.listContests();
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={<RegistrationSkeleton />}>
      <RegistrationContent />
    </Suspense>
  );
}

async function RegistrationContent() {
  const contests = await getContests();
  return <RegistrationClient contests={contests} />;
}

function RegistrationSkeleton() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#EDAF00]" />
    </div>
  );
}
