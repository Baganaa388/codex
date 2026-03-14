'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  Home,
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Хянах самбар', icon: LayoutDashboard },
  { href: '/admin/homepage', label: 'Нүүр хуудас', icon: Home },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight">CodeX</h1>
              <p className="text-[10px] text-slate-500 font-medium">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-9 w-9 rounded-xl bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Trophy size={18} className="text-white" />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="px-5 mb-4">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Nav Label */}
      {!collapsed && (
        <div className="px-5 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Цэс</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
              {!collapsed && item.label}
            </Link>
          );
        })}

        <div className="pt-3">
          <Link
            href="/admin/contest/new"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              pathname === '/admin/contest/new'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-lg hover:shadow-cyan-500/20'
            }`}
          >
            <Plus size={18} />
            {!collapsed && 'Шинэ тэмцээн'}
          </Link>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-1">
        <div className="h-px bg-white/[0.06] mx-2 mb-3" />
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink size={18} />
          {!collapsed && 'Сайт үзэх'}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
        >
          <LogOut size={18} />
          {!collapsed && 'Гарах'}
        </button>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-white/[0.04] transition-all mt-2"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Хураах</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#0c0c14] border border-white/10 text-slate-400"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-[#0c0c14] border-r border-white/[0.06] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-[#0c0c14] border-r border-white/[0.06] transition-all duration-300 z-40 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for main content */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`} />
    </>
  );
}
