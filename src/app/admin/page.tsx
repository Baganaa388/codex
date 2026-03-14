'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminPage() {
  const { isLoggedIn } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    router.replace(isLoggedIn ? '/admin/dashboard' : '/admin/login');
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  );
}
