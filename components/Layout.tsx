import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Github, Facebook, Instagram, Twitter } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-95'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative flex items-center justify-center py-4">
          <div className="absolute left-0" />

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${location.pathname === link.path ? 'text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button className="md:hidden text-[#111827] absolute right-0" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass mx-6 mt-3 rounded-2xl border border-slate-900/10 px-4 py-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-base font-medium text-slate-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
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
            <li key={link.path}><Link to={link.path} className="hover:text-[#EDAF00] transition-colors">{link.name}</Link></li>
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
      <p>© 2025 CodeX Competitive Programming Olympiad. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-[#EDAF00] transition-colors">Нууцлалын бодлого</a>
        <a href="#" className="hover:text-[#EDAF00] transition-colors">Үйлчилгээний нөхцөл</a>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className={`flex-grow pb-20 ${isHome ? 'pt-0' : 'pt-28'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
