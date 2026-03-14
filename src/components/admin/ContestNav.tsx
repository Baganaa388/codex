'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Users, Send, Settings } from 'lucide-react';

const TABS = [
  { key: 'problems', label: 'Бодлого', icon: Trophy },
  { key: 'contestants', label: 'Оролцогчид', icon: Users },
  { key: 'scoring', label: 'Дүн оруулах', icon: Send },
  { key: 'settings', label: 'Тохиргоо', icon: Settings },
] as const;

export function ContestNav({ contestId }: { readonly contestId: number }) {
  const pathname = usePathname();
  const activeTab = pathname.split('/').pop() ?? 'problems';

  return (
    <div className="flex gap-1 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.06] w-fit">
      {TABS.map(t => (
        <Link
          key={t.key}
          href={`/admin/contest/${contestId}/${t.key}`}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === t.key
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <t.icon size={15} />
          {t.label}
        </Link>
      ))}
    </div>
  );
}
