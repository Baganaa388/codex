'use client';

import { usePathname } from 'next/navigation';

export function PublicMain({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === '/';
  return (
    <main className={`grow pb-20 ${isHome ? 'pt-0' : 'pt-28'}`}>
      {children}
    </main>
  );
}
