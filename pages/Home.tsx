
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Zap, Award, Globe, Shield, Code2, PlayCircle } from 'lucide-react';
import { STATS, FAQ_DATA } from '../constants';
import { Card, SectionHeading, Button, Badge } from '../components/UI';

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

const HERO_SLIDES = [
  { src: '/logo/slides/hero-1.png', alt: 'Programming competition scene' },
  { src: '/logo/slides/hero-2.jpg', alt: 'Hands typing code' },
  { src: '/logo/slides/hero-3.jpg', alt: 'Coding olympiad auditorium' },
];

const HERO_COPY = {
  pill: '\u041f\u0420\u041e\u0413\u0420\u0410\u041c\u0427\u041b\u0410\u041b\u042b\u041d \u041e\u041b\u0418\u041c\u041f\u0418\u0410\u0414 2026',
  titleA: '\u041a\u043e\u0434 \u0431\u043e\u043b',
  titleB: '\u0438\u0440\u044d\u044d\u0434\u04af\u0439',
  sub: 'CodeX \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430\u0434 \u043e\u0440\u043e\u043b\u0446\u043e\u0436, \u04e9\u04e9\u0440\u0438\u0439\u043d \u0447\u0430\u0434\u0432\u0430\u0440\u0430\u0430 \u0441\u043e\u0440\u044c. \u041c\u043e\u043d\u0433\u043e\u043b\u044b\u043d \u0448\u0438\u043b\u0434\u044d\u0433 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0441\u0442\u0443\u0443\u0434\u0442\u0430\u0439 \u04e9\u0440\u0441\u04e9\u043b\u0434\u04e9\u0436, \u0434\u0430\u0440\u0430\u0430\u0433\u0438\u0439\u043d \u0442\u04af\u0432\u0448\u0438\u043d\u0434 \u0445\u04af\u0440.',
  cta1: '\u0411\u04af\u0440\u0442\u0433\u04af\u04af\u043b\u044d\u0445',
  cta2: '\u041b\u0438\u0434\u0435\u0440\u04af\u04af\u0434 \u04af\u0437\u044d\u0445',
  stat1: '\u043e\u0440\u043e\u043b\u0446\u043e\u0433\u0447',
  stat2: '\u0431\u043e\u0434\u043b\u043e\u0433\u043e',
  stat3: '\u0430\u0439\u043c\u0430\u0433',
};

const SPONSORS = [
  {
    logo: "/logo/teee.png",
    name: "TEEE",
    desc: "The Essential Engineering Education",
    detail: "TEEE нь инженерчлэлийн боловсролын чанарыг дээшлүүлэх зорилготой байгууллага юм. Програмчлал, робот техник, хиймэл оюун ухааны чиглэлээр сургалт зохион байгуулдаг. 2020 оноос хойш 5,000+ суралцагчдад үйлчилсэн.",
    website: "https://teee.mn",
    founded: "2020",
    focus: "Инженерчлэлийн боловсрол",
  },
  {
    logo: "/logo/teee.png",
    name: "Mobicom",
    desc: "Харилцаа холбоо",
    detail: "Мобиком корпораци нь Монгол Улсын тэргүүлэх харилцаа холбооны компани бөгөөд технологийн боловсролыг дэмжин ажилладаг. CodeX олимпиадын алтан ивээн тэтгэгч.",
    website: "https://mobicom.mn",
    founded: "1996",
    focus: "Харилцаа холбоо, технологи",
  },
];

type Sponsor = typeof SPONSORS[number];

const SponsorCard: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-8 shadow-[0_18px_40px_rgba(15,23,42,0.12)] cursor-pointer transition-all duration-300 hover:shadow-[0_24px_50px_rgba(15,23,42,0.16)] hover:border-[#EDAF00]/30"
    >
      <div className="flex items-center justify-between">
        <div className="h-16 w-16 rounded-2xl bg-[#EDAF00] flex items-center justify-center">
          <img src={sponsor.logo} alt={`${sponsor.name} logo`} className="h-8 w-8 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-4 py-1 text-xs font-bold text-[#866300]">
            АЛТ
          </span>
          <ChevronRight
            size={18}
            className={`text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </div>
      <h4 className="mt-6 text-2xl font-bold text-slate-900">{sponsor.name}</h4>
      <p className="mt-2 text-slate-600">{sponsor.desc}</p>

      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: expanded ? '300px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">{sponsor.detail}</p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-[#E5E7EB]">
              Үүсгэсэн: {sponsor.founded}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-[#E5E7EB]">
              {sponsor.focus}
            </span>
          </div>
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#866300] hover:text-[#EDAF00] transition-colors"
          >
            Вэбсайт үзэх <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {!expanded && <div className="mt-6 h-px w-full bg-[#E5E7EB]" />}
    </div>
  );
};

const HERO_STATS_DATA = [
  { end: 500, suffix: '+', label: HERO_COPY.stat1 },
  { end: 50, suffix: '+', label: HERO_COPY.stat2 },
  { end: 12, suffix: '', label: HERO_COPY.stat3 },
];

const CountUpNumber: React.FC<{ end: number; suffix: string }> = ({ end, suffix }) => {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className="text-3xl font-bold text-white md:text-4xl tabular-nums">
      {count}{suffix}
    </div>
  );
};

const HeroStats = () => (
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

export const Home = () => {
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
      goToSlide((currentSlide + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [currentSlide, goToSlide]);

  return (
    <div className="space-y-24">
      
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
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
              to="/registration"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] px-8 py-3.5 text-sm font-semibold text-[#111827] shadow-lg shadow-[#EDAF00]/25 transition-all hover:brightness-110 hover:shadow-[#EDAF00]/40"
            >
              {HERO_COPY.cta1}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/20"
            >
              {HERO_COPY.cta2}
            </Link>
          </div>

          <HeroStats />
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((_, index) => (
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
              {"Scroll"}
            </span>
            <div className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats Strip */}

      <section className="bg-white/70 border-y border-slate-900/5 py-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-slate-600 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6">
        <SectionHeading
          title="Олимпиадын тухай"
          subtitle="Бид алгоритмын сэтгэлгээг дэмжиж, шинэ үеийн технологийн салбарын манлайлагчдыг тодруулах зорилготой."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#EDAF00]/10 rounded-2xl flex items-center justify-center mb-6 text-[#866300]">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Хурд ба Нарийвчлал</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Богино хугацаанд хамгийн зөв алгоритмыг бодож олох нь ялагчийн гол шалгуур юм.
            </p>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#EDAF00]/10 rounded-2xl flex items-center justify-center mb-6 text-[#866300]">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Бүх хэл дээр</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              C++, Java, Python хэлүүдийн аль нэгийг сонгон оролцох боломжтой.
            </p>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-900/5 rounded-2xl flex items-center justify-center mb-6 text-slate-700">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Шударга өрсөлдөөн</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Олон улсын жишигт нийцсэн хуулбар шалгах автомат системээр дүгнэнэ.
            </p>
          </Card>
        </div>
      </section>

      {/* Sponsors Strip */}
      <section className="py-20 bg-[linear-gradient(180deg,rgba(237,175,0,.08),rgba(47,85,190,.06))] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#EDAF00]/30 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#866300]">
                ХАМТРАГЧИД
              </div>
              <h3 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Ивээн <span className="text-[#EDAF00]">тэтгэгчид</span>
              </h3>
              <p className="mt-3 text-slate-600 max-w-xl">
                Манай олимпиадын хамтрагч байгууллагуудад баярлалаа.
              </p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#866300] shadow-[0_12px_30px_rgba(15,23,42,0.12)] hover:translate-y-[-1px] transition">
              Хамтрагч болох <ChevronRight size={18} />
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#866300]">
            <span className="h-px w-12 bg-[#EDAF00]/70" />
            Алтан ивээн тэтгэгч
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {SPONSORS.map((s) => (
              <SponsorCard key={s.name} sponsor={s} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <SectionHeading title="Түгээмэл асуултууд" centered />
        <div className="space-y-4">
          {FAQ_DATA.map((faq, i) => (
            <details key={i} className="group glass rounded-2xl p-6 cursor-pointer border border-transparent hover:border-slate-900/10">
              <summary className="flex justify-between items-center list-none font-bold text-lg">
                {faq.q}
                <ChevronRight className="group-open:rotate-90 transition-transform" size={20} />
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#111827]">Амжилтаа ахиулахад бэлэн үү?</h2>
            <p className="text-xl text-slate-800 max-w-2xl mx-auto">
              Өнөөдөр бүртгүүлж, Монголын шилдэг кодлогчидтой өрсөлдөөрэй.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/registration">
                <button className="bg-white text-[#866300] px-10 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-2xl">
                  Яг одоо бүртгүүлэх
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
