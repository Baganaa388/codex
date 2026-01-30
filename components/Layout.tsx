
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Github, Facebook, Instagram, Twitter } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo/codex logo.png"
            alt="CodeX logo"
            className="w-10 h-10 object-contain rounded-xl shadow-lg group-hover:scale-110 transition-transform"
          />
          <span className="text-2xl font-bold tracking-tighter">Code<span className="text-cyan-400">X</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-300'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/registration" className="bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95">
            Одоо бүртгүүлэх
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-100" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 py-6 px-6 flex flex-col gap-4 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-lg font-medium py-2 border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/registration"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-4 rounded-xl text-center font-bold text-lg"
            onClick={() => setIsOpen(false)}
          >
            Одоо бүртгүүлэх
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#030712] pt-16 pb-8">
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
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Өрсөлдөөнт програмчлалын дараагийн үеийн олимп. Бид ирээдүйн шилдэг инженерүүдийг бэлтгэж байна.
        </p>
        <div className="flex gap-4">
          {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-bold mb-6">Хурдан холбоосууд</h4>
        <ul className="space-y-4 text-sm text-slate-400">
          {NAV_LINKS.map(link => (
            <li key={link.path}><Link to={link.path} className="hover:text-cyan-400 transition-colors">{link.name}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6">Олимпиад</h4>
        <ul className="space-y-4 text-sm text-slate-400">
          <li><a href="#" className="hover:text-cyan-400 transition-colors">Дүрэм, журам</a></li>
          <li><a href="#" className="hover:text-cyan-400 transition-colors">Бодлогын сан</a></li>
          <li><a href="#" className="hover:text-cyan-400 transition-colors">Ивээн тэтгэгч</a></li>
          <li><a href="#" className="hover:text-cyan-400 transition-colors">Түгээмэл асуулт</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6">Мэдээлэл хүлээн авах</h4>
        <p className="text-sm text-slate-400 mb-4">Шинэ мэдээ, зарлалыг цаг алдалгүй имэйлээр аваарай.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="Имэйл хаяг" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 w-full" />
          <button className="bg-cyan-500 p-2 rounded-lg hover:bg-cyan-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
      <p>© 2025 CodeX Competitive Programming Olympiad. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white transition-colors">Нууцлалын бодлого</a>
        <a href="#" className="hover:text-white transition-colors">Үйлчилгээний нөхцөл</a>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[20%] w-[20%] h-[20%] bg-blue-500/10 rounded-full blur-[80px]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
