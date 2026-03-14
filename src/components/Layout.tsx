'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Github, Facebook, Instagram, Twitter } from 'lucide-react';
import { NAV_LINKS } from '@/constants';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpColor = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, t: number) =>
  `${Math.round(lerp(r1, r2, t))}, ${Math.round(lerp(g1, g2, t))}, ${Math.round(lerp(b1, b2, t))}`;

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      setScrollProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const t = isHome ? scrollProgress : 1;
  const bgAlpha = lerp(0.1, 0.85, t);
  const borderAlpha = lerp(0.15, 0.35, t);
  const blurVal = lerp(12, 20, t);
  const shadowAlpha = lerp(0, 0.08, t);
  const textRgb = lerpColor(255, 255, 255, 17, 24, 39, t);
  const mutedRgb = lerpColor(255, 255, 255, 107, 114, 128, t);
  const mutedAlpha = lerp(0.7, 1, t);
  const activeBgAlpha = lerp(0.15, 0.06, t);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div
          className="flex items-center justify-between rounded-2xl px-6 py-4"
          style={{
            background: `rgba(255, 255, 255, ${bgAlpha})`,
            border: `1px solid rgba(255, 255, 255, ${borderAlpha})`,
            backdropFilter: `blur(${blurVal}px)`,
            WebkitBackdropFilter: `blur(${blurVal}px)`,
            boxShadow: `0 10px 30px rgba(0, 0, 0, ${shadowAlpha})`,
          }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo/codex logo.png"
              alt="CodeX"
              className="w-10 h-10 object-contain rounded-lg transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-extrabold tracking-tight" style={{ color: `rgb(${textRgb})` }}>
              Code<span className="text-[#EDAF00]">X</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative px-4 py-2.5 rounded-xl text-[13px] font-semibold uppercase tracking-[0.12em]"
                  style={{
                    color: isActive ? `rgb(${textRgb})` : `rgba(${mutedRgb}, ${mutedAlpha})`,
                    background: isActive ? `rgba(${textRgb}, ${activeBgAlpha})` : 'transparent',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <button
            className="md:hidden p-1.5 rounded-xl"
            style={{ color: `rgb(${textRgb})` }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mx-4 mt-2">
          <div
            className="rounded-2xl border border-slate-900/[0.06] px-3 py-2 bg-white/90 shadow-lg shadow-black/[0.06]"
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#111827] bg-[#111827]/[0.06]'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#111827]/[0.04]'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => (
  <footer className="border-t border-slate-900/10 bg-[#F7F7F8] pt-14 pb-8">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-2 mb-6">
          <img
            src="/logo/codex logo.png"
            alt="CodeX logo"
            className="w-8 h-8 object-contain rounded-lg"
          />
          <span className="text-xl font-bold tracking-tighter">CodeX</span>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          Өрсөлдөөнт програмчлалын дараагийн үеийн олимпиад. Бид ирээдүйн шилдэг инженерүүдийг бэлтгэж байна.
        </p>
        <div className="flex gap-4">
          {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-[#EDAF00] transition-all">
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-bold mb-6">Хурдан холбоосууд</h4>
        <ul className="space-y-4 text-sm text-slate-600">
          {NAV_LINKS.map(link => (
            <li key={link.path}><Link href={link.path} className="hover:text-[#EDAF00] transition-colors">{link.name}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6">Олимпиад</h4>
        <ul className="space-y-4 text-sm text-slate-600">
          <li><a href="#" className="hover:text-[#EDAF00] transition-colors">Дүрэм, журам</a></li>
          <li><a href="#" className="hover:text-[#EDAF00] transition-colors">Бодлогын сан</a></li>
          <li><a href="#" className="hover:text-[#EDAF00] transition-colors">Ивээн тэтгэгч</a></li>
          <li><a href="#" className="hover:text-[#EDAF00] transition-colors">Түгээмэл асуулт</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6">Мэдээлэл хүлээн авах</h4>
        <p className="text-sm text-slate-600 mb-4">Шинэ мэдээлэл, зарлалыг цаг алдалгүй имэйлээр аваарай.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="Имэйл хаяг" className="bg-white border border-slate-900/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#EDAF00] w-full" />
          <button className="bg-[#EDAF00] text-[#111827] p-2 rounded-lg hover:bg-[#F5D372] transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 border-t border-slate-900/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
      <p>&copy; 2025 CodeX Competitive Programming Olympiad. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-[#EDAF00] transition-colors">Нууцлалын бодлого</a>
        <a href="#" className="hover:text-[#EDAF00] transition-colors">Үйлчилгээний нөхцөл</a>
      </div>
    </div>
  </footer>
);
