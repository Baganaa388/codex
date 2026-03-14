import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060610] flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-black text-white/10">404</h1>
        <div className="space-y-2">
          <p className="text-xl font-bold text-white">Хуудас олдсонгүй</p>
          <p className="text-sm text-slate-500">Хайж буй хуудас байхгүй эсвэл устгагдсан байна.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
}
