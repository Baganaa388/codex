
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Zap, Award, Globe, Shield, Code2, PlayCircle } from 'lucide-react';
import { STATS, TIMELINE, FAQ_DATA } from '../constants';
import { Card, SectionHeading, Button, Badge } from '../components/UI';

export const Home = () => {
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <Badge color="purple">CodeX[4] явагдаж байна</Badge>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            Code<span className="text-cyan-400">X</span> — <span className="text-gradient">Өрсөлдөөнт</span> програмчлалын олимпиад
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Энэхүү тэмцээн нь TEEE (The Essential Engineering Education)  сургуулиас зохиож буй цуврал олимпиад бөгөөд сурагчдын оюуны чадамжийг хөгжүүлэхээс гадна олон улсын түвшинд өрсөлдөх чадвартай болох боломжийг бүрдүүлнэ. 
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/registration">
              <Button className="w-full sm:w-auto">
                Одоо бүртгүүлэх <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="outline" className="w-full sm:w-auto">
                Leaderboard харах
              </Button>
            </Link>
          </div>
        </div>

        {/* 3D Illustration Mockup */}
        <div className="relative group animate-in fade-in slide-in-from-right-8 duration-700 hidden lg:block">
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Background glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full group-hover:bg-cyan-500/30 transition-colors"></div>
            
            {/* Floating SVG Elements */}
            <div className="animate-float">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="100" y="50" width="200" height="300" rx="20" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.1" />
                <rect x="50" y="100" width="300" height="200" rx="20" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.1" />
                <path d="M150 180L180 210L250 140" stroke="#22d3ee" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="200" cy="200" r="100" stroke="url(#paint0_linear)" strokeWidth="2" strokeDasharray="10 10" />
                <defs>
                  <linearGradient id="paint0_linear" x1="100" y1="100" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Code Snippets */}
            <div className="absolute top-10 right-0 glass p-4 rounded-xl rotate-12 animate-float" style={{ animationDelay: '1s' }}>
              <code className="text-xs text-cyan-400">while(queue.length) {'{ ... }'}</code>
            </div>
            <div className="absolute bottom-20 left-0 glass p-4 rounded-xl -rotate-6 animate-float" style={{ animationDelay: '2s' }}>
              <code className="text-xs text-purple-400">dp[i][j] = Math.max(dp[i-1][j], ...)</code>
            </div>
            <div className="absolute top-28 left-6 glass p-4 rounded-xl rotate-6 animate-float" style={{ animationDelay: '2.5s' }}>
              <code className="text-xs text-cyan-300">const ans = graph.bfs(start).length;</code>
            </div>
            <div className="absolute top-4 left-24 glass p-4 rounded-xl -rotate-3 animate-float" style={{ animationDelay: '3s' }}>
              <code className="text-xs text-yellow-300">dist[v] = min(dist[v], dist[u] + w)</code>
            </div>
            <div className="absolute bottom-6 right-10 glass p-4 rounded-xl rotate-6 animate-float" style={{ animationDelay: '3.5s' }}>
              <code className="text-xs text-purple-300">parent[v] = u; // path restore</code>
            </div>
            <div className="absolute top-40 right-6 glass p-4 rounded-xl -rotate-6 animate-float" style={{ animationDelay: '4s' }}>
              <code className="text-xs text-cyan-200">if (s[i] === t[j]) dp[i][j]++;</code>
            </div>
            <div className="absolute bottom-32 left-10 glass p-4 rounded-xl rotate-3 animate-float" style={{ animationDelay: '4.5s' }}>
              <code className="text-xs text-pink-300">ans ^= (1 &lt;&lt; bit);</code>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white/5 border-y border-white/5 py-12 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-400">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Хурд ба Нарийвчлал</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Богино хугацаанд хамгийн зөв алгоритмыг бодож олох нь ялагчийн гол шалгуур юм.</p>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Бүх хэл дээр</h3>
            <p className="text-slate-400 text-sm leading-relaxed">C++, Java, Python хэлүүдийн аль нэгийг сонгон оролцох боломжтой.</p>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-500">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Шударга өрсөлдөөн</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Олон улсын жишигт нийцсэн хуулбар шалгах автомат системээр дүгнэнэ.</p>
          </Card>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Явц ба Хуваарь" centered />
        <div className="relative mt-20">
          {/* Timeline bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-white/10 hidden md:block"></div>
          
          <div className="space-y-16">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full">
                  <Card className={`${item.active ? 'border-cyan-500/50 bg-cyan-500/5' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <span className="text-sm font-mono text-cyan-400">{item.date}</span>
                    </div>
                    <p className="text-slate-400">{item.desc}</p>
                  </Card>
                </div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-[#030712] border-4 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Sponsors Strip */}
      <section className="py-20 bg-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <h3 className="text-2xl font-bold uppercase tracking-widest text-slate-500">Ивээн тэтгэгч</h3>
          <Link to="/contact" className="text-cyan-400 font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Хамтран ажиллах <ChevronRight size={20} />
          </Link>
        </div>
        <div className="flex justify-center animate-in fade-in duration-1000">
          <div className="w-72 h-28 glass rounded-xl flex flex-col items-center justify-center gap-2">
            <img
              src="/logo/teee.png"
              alt="TEEE logo"
              className="h-12 w-auto object-contain"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
              TEEE
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 mb-32">
        <SectionHeading title="Түгээмэл асуултууд" centered />
        <div className="space-y-4">
          {FAQ_DATA.map((faq, i) => (
            <details key={i} className="group glass rounded-2xl p-6 cursor-pointer border border-transparent hover:border-white/10">
              <summary className="flex justify-between items-center list-none font-bold text-lg">
                {faq.q}
                <ChevronRight className="group-open:rotate-90 transition-transform" size={20} />
              </summary>
              <p className="mt-4 text-slate-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-cyan-600 to-purple-700 p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Амжилтаа ахиулахад бэлэн үү?</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">Өнөөдөр бүртгүүлж, Монголын шилдэг кодлогчидтой өрсөлдөөрэй.</p>
            <div className="flex justify-center gap-4">
              <Link to="/registration">
                <button className="bg-white text-cyan-600 px-10 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-2xl">
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
