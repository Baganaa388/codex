'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const TOKEN_KEY = 'codex_admin_token';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#060610] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060610] flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}
