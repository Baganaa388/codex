import Link from "next/link";
import {
  ChevronRight,
  Zap,
  Globe,
  Shield,
  Users,
  Code2,
  Clock,
  Trophy,
} from "lucide-react";
import { STATS, FAQ_DATA } from "@/constants";
import { Card, SectionHeading } from "@/components/UI";
import { HeroSection } from "@/components/HeroSection";
import { SponsorCard } from "@/components/SponsorCard";
import type { Sponsor } from "@/components/SponsorCard";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Users,
  Code2,
  Clock,
  Trophy,
};

const SPONSORS: readonly Sponsor[] = [
  {
    logo: "/logo/teee.png",
    name: "TEEE",
    desc: "The Essential Engineering Education",
    detail:
      "TEEE нь инженерчлэлийн боловсролын чанарыг дээшлүүлэх зорилготой байгууллага юм. Програмчлал, робот техник, хиймэл оюун ухааны чиглэлээр сургалт зохион байгуулдаг. 2020 оноос хойш 5,000+ суралцагчдад үйлчилсэн.",
    website: "https://teee.mn",
    founded: "2020",
    focus: "Инженерчлэлийн боловсрол",
  },
  {
    logo: "/logo/teee.png",
    name: "Mobicom",
    desc: "Харилцаа холбоо",
    detail:
      "Мобиком корпораци нь Монгол Улсын тэргүүлэх харилцаа холбооны компани бөгөөд технологийн боловсролыг дэмжин ажилладаг. CodeX олимпиадын алтан ивээн тэтгэгч.",
    website: "https://mobicom.mn",
    founded: "1996",
    focus: "Харилцаа холбоо, технологи",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24">
      <HeroSection />

      {/* Stats Strip */}
      <section className="bg-white/70 border-y border-slate-900/5 py-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => {
            const Icon = ICON_MAP[stat.iconName];
            return (
              <div key={i} className="text-center group">
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {Icon ? <Icon size={32} className="text-[#EDAF00]" /> : null}
                </div>
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-slate-600 text-sm font-bold uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            );
          })}
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
              Богино хугацаанд хамгийн зөв алгоритмыг бодож олох нь ялагчийн гол
              шалгуур юм.
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
            <div className="w-16 h-16 bg-sReact,late-900/5 rounded-2xl flex items-center justify-center mb-6 text-slate-700">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Шударга өрсөлдөөн</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Олон улсын жишигт нийцсэн хуулбар шалгах автомат системээр
              дүгнэнэ.
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
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#866300] shadow-[0_12px_30px_rgba(15,23,42,0.12)] hover:-translate-y-px transition"
            >
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
            <details
              key={i}
              className="group glass rounded-2xl p-6 cursor-pointer border border-transparent hover:border-slate-900/10"
            >
              <summary className="flex justify-between items-center list-none font-bold text-lg">
                {faq.q}
                <ChevronRight
                  className="group-open:rotate-90 transition-transform"
                  size={20}
                />
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
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#111827]">
              Амжилтаа ахиулахад бэлэн үү?
            </h2>
            <p className="text-xl text-slate-800 max-w-2xl mx-auto">
              Өнөөдөр бүртгүүлж, Монголын шилдэг кодлогчидтой өрсөлдөөрэй.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/registration"
                className="bg-white text-[#866300] px-10 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                Яг одоо бүртгүүлэх
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
