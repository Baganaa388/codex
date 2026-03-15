'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Globe, Instagram, Menu, X } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto px-4 pt-3">
        <div
          className="flex items-center justify-end rounded-xl px-5 py-2.5 md:justify-center"
          style={{
            background: `rgba(255, 255, 255, ${bgAlpha})`,
            border: `1px solid rgba(255, 255, 255, ${borderAlpha})`,
            backdropFilter: `blur(${blurVal}px)`,
            WebkitBackdropFilter: `blur(${blurVal}px)`,
            boxShadow: `0 10px 30px rgba(0, 0, 0, ${shadowAlpha})`,
          }}
        >
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative px-4 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-[0.12em]"
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
  <footer className="border-t border-slate-900/10 bg-[linear-gradient(180deg,#f7f7f8_0%,#eef2ff_100%)] py-10">
    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-6 text-center">
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-[#EDAF00] to-transparent" />
      <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        Built for speed, logic, and growth
      </p>
      <p className="mt-3 text-sm text-slate-500">
        Улаанбаатар хот, Монгол улс 
      </p>
      <div className="mt-6 flex items-center justify-center gap-4">
        {[
          { Icon: Facebook, href: 'https://www.facebook.com/TEEEducation/', label: 'Facebook' },
          { Icon: Instagram, href: 'https://www.instagram.com/tee.education/', label: 'Instagram' },
          { Icon: Globe, href: 'https://tee.education', label: 'Website' },
        ].map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/80 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#EDAF00]/40 hover:text-[#866300] hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
          >
            <Icon size={20} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);
