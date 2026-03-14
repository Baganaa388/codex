'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const interval = window.setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        window.clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => window.clearInterval(interval);
  }, [started, end, duration]);

  return { count, ref };
};

const DEFAULT_SLIDES = [
  { src: '/logo/slides/hero-1.png', alt: 'Programming competition scene' },
  { src: '/logo/slides/hero-2.jpg', alt: 'Hands typing code' },
  { src: '/logo/slides/hero-3.jpg', alt: 'Coding olympiad auditorium' },
];

const HERO_COPY = {
  pill: 'ПРОГРАМЧЛАЛЫН ОЛИМПИАД 2026',
  titleA: 'Код бол',
  titleB: 'ирээдүй',
  sub: 'CodeX олимпиадад оролцож, өөрийн чадвараа сорь. Монголын шилдэг программистуудтай өрсөлдөж, дараагийн түвшинд хүр.',
  cta1: 'Бүртгүүлэх',
  cta2: 'Лидерүүд үзэх',
  stat1: 'оролцогч',
  stat2: 'бодлого',
  stat3: 'аймаг',
};

const HERO_STATS_DATA = [
  { end: 500, suffix: '+', label: HERO_COPY.stat1 },
  { end: 50, suffix: '+', label: HERO_COPY.stat2 },
  { end: 12, suffix: '', label: HERO_COPY.stat3 },
];

function CountUpNumber({ end, suffix }: { end: number; suffix: string }) {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className="text-3xl font-bold text-white md:text-4xl tabular-nums">
      {count}{suffix}
    </div>
  );
}

function HeroStats() {
  return (
    <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16">
      {HERO_STATS_DATA.map((stat) => (
        <div key={stat.label} className="text-center">
          <CountUpNumber end={stat.end} suffix={stat.suffix} />
          <div className="mt-1 text-xs tracking-wider text-slate-400 uppercase">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

interface HeroSlide {
  readonly src: string;
  readonly alt: string;
}

export function HeroSection({ slides }: { slides?: readonly HeroSlide[] }) {
  const heroSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      window.setTimeout(() => setIsTransitioning(false), 1200);
    },
    [isTransitioning],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [currentSlide, goToSlide, heroSlides.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: index === currentSlide ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(${slide.src})`,
              filter: 'brightness(0.45) saturate(1.2)',
            }}
            aria-hidden
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-[#0f172a]/30 to-[#0f172a]/60" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(120deg, #EDAF00, #2F55BE, #0f172a, #EDAF00)',
          backgroundSize: '300% 300%',
          animation: 'heroGradient 12s ease infinite',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#EDAF00]/50 bg-[#EDAF00]/20 px-5 py-2 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#EDAF00] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-[#F5D372] uppercase">
            {HERO_COPY.pill}
          </span>
        </div>

        <h1 className="max-w-5xl text-balance text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
          {HERO_COPY.titleA} <span className="text-[#EDAF00]">{HERO_COPY.titleB}</span>
        </h1>

        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-slate-300 md:text-xl">
          {HERO_COPY.sub}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/registration"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] px-8 py-3.5 text-sm font-semibold text-[#111827] shadow-lg shadow-[#EDAF00]/25 transition-all hover:brightness-110 hover:shadow-[#EDAF00]/40"
          >
            {HERO_COPY.cta1}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/20"
          >
            {HERO_COPY.cta2}
          </Link>
        </div>

        <HeroStats />
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? 'w-8 bg-[#EDAF00]'
                : 'w-4 bg-slate-400/40 hover:bg-slate-500/60'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-10 hidden md:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest text-white/50 uppercase [writing-mode:vertical-lr]">
            Scroll
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
