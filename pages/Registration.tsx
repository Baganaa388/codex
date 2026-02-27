
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Calendar, CheckCircle, ArrowRight, Sparkles, Loader2, Trophy } from 'lucide-react';
import { Card, SectionHeading, Button } from '../components/UI';
import { RegistrationFormData, ApiResponse, Contest } from '../types';

export const Registration = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regNumber, setRegNumber] = useState<string | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [contestsLoading, setContestsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    languages: [],
    level: 'Эхлэгч',
    category: 'Бага'
  });

  const selectedContest = contests.find(c => c.id === selectedContestId) ?? null;

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then((data: ApiResponse<Contest[]>) => {
        if (data.success && data.data) {
          const open = data.data.filter(c => c.status === 'registration');
          setContests(open);
          if (open.length > 0) {
            setSelectedContestId(open[0].id);
          }
        }
      })
      .catch(() => { /* contests will remain empty */ })
      .finally(() => setContestsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedContestId) {
      setError('Тэмцээн сонгоно уу');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/contestants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contest_id: selectedContestId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          category: formData.category,
        }),
      });
      const data: ApiResponse<{ reg_number: string }> = await res.json();
      if (data.success && data.data) {
        setRegNumber(data.data.reg_number);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.error ?? 'Бүртгэл амжилтгүй боллоо');
      }
    } catch {
      setError('Сервертэй холбогдож чадсангүй');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = formData.languages || [];
    setFormData({
      ...formData,
      languages: current.includes(lang) 
        ? current.filter(l => l !== lang) 
        : [...current, lang]
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-cyan-400">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-4xl font-black mb-6 tracking-tighter">Бүртгэл амжилттай!</h2>
        {regNumber && (
          <div className="mb-6 inline-block bg-cyan-500/20 text-cyan-400 px-6 py-3 rounded-xl font-mono text-2xl font-black">
            {regNumber}
          </div>
        )}
        <p className="text-slate-400 text-lg mb-12">Таны хүсэлтийг хүлээж авлаа. Бүртгэлийн дугаараа хадгалаарай.</p>
        
        <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30 text-left">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-cyan-400" />
            Бүртгэлийн хураангуй
          </h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Олимпиад</span>
            <span className="text-white font-bold">{selectedContest?.name ?? '—'}</span>

            <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Овог нэр</span>
            <span className="text-white font-bold">{formData.lastName} {formData.firstName}</span>

            <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Ангилал</span>
            <span className="text-white font-bold">{formData.category}</span>

            <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Түвшин</span>
            <span className="text-white font-bold">{formData.level}</span>

            <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Хэлүүд</span>
            <span className="text-white font-bold">{formData.languages?.join(', ')}</span>
          </div>
          <div className="mt-8 p-4 glass rounded-xl border-cyan-400/20 flex gap-4 items-start">
            <Info className="text-cyan-400 flex-shrink-0" size={20} />
            <p className="text-xs text-slate-400">Олимпиадын удирдамж болон нэвтрэх кодыг 02.12-ны өдөр имэйлээр хүргэх болно.</p>
          </div>
        </Card>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.href = '/'}>Нүүр хуудас руу буцах</Button>
          <Button variant="outline">Дүрэм унших</Button>
        </div>
      </div>
    );
  }

  if (contestsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  if (contests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Trophy size={48} className="text-slate-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Бүртгэл нээлттэй олимпиад байхгүй байна</h2>
        <p className="text-slate-500">Шинэ олимпиад зарлагдахад бүртгэл нээгдэнэ.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12">
        <SectionHeading
          title="Олимпиадад бүртгүүлэх"
          subtitle="Олимпиад сонгоод бүртгэлээ илгээнэ үү."
        />

        {/* Олимпиад сонголт */}
        {contests.length > 1 && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 block">Олимпиад сонгох</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contests.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedContestId(c.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    selectedContestId === c.id
                      ? 'bg-cyan-500/10 border-cyan-500/50'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold">{c.name}</div>
                  {c.description && <p className="text-xs text-slate-500 mt-1">{c.description}</p>}
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(c.start_time).toLocaleDateString('mn-MN')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -z-10"></div>

          {selectedContest && (
            <div className="mb-8 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center gap-3">
              <Trophy size={20} className="text-cyan-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-cyan-400">{selectedContest.name}</p>
                <p className="text-xs text-slate-500">
                  {new Date(selectedContest.start_time).toLocaleDateString('mn-MN')} — {new Date(selectedContest.end_time).toLocaleDateString('mn-MN')}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Овог</label>
                <input required type="text" className="w-full glass border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Нэр</label>
                <input required type="text" className="w-full glass border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Имэйл хаяг</label>
                <input required type="email" className="w-full glass border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Утасны дугаар</label>
                <input required type="tel" className="w-full glass border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Насны ангилал</label>
                <select className="w-full glass border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer" onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  <option value="Бага">Бага анги</option>
                  <option value="Дунд">Дунд анги</option>
                  <option value="Ахлах">Ахлах анги</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">ЕБС Сургууль</label>
                <input required type="text" className="w-full glass border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" onChange={e => setFormData({...formData, organization: e.target.value})} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 block">Програмчлалын хэл (Олон сонголт боломжтой)</label>
              <div className="flex flex-wrap gap-3">
                {['C++', 'Java', 'Python'].map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-6 py-2 rounded-xl border font-bold transition-all ${formData.languages?.includes(lang) ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-white/10 hover:border-white/30 text-slate-400'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 block">Туршлагын түвшин</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Анхан шат', 'Дунд шат ', 'Ахисан шат'].map(lvl => (
                  <label key={lvl} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.level === lvl ? 'bg-purple-500/10 border-purple-500/50' : 'border-white/10 hover:border-white/20'}`}>
                    <input type="radio" name="level" className="w-4 h-4 accent-purple-500" checked={formData.level === lvl} onChange={() => setFormData({...formData, level: lvl as any})} />
                    <span className="font-bold">{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4">
              <input required type="checkbox" className="mt-1 w-5 h-5 accent-cyan-500 cursor-pointer" id="agree" onChange={e => setFormData({...formData, agreed: e.target.checked})} />
              <label htmlFor="agree" className="text-sm text-slate-400 leading-relaxed cursor-pointer">
                Би олимпиадын <a href="#" className="text-cyan-400 hover:underline">дүрэм, нөхцөлийг</a> бүрэн уншиж танилцсан бөгөөд зөвшөөрч байна. Шударга бус өрсөлдөөнөөс татгалзахыг амлаж байна.
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-5 text-xl" disabled={isLoading || !selectedContestId}>
              {isLoading ? (
                <><Loader2 size={24} className="animate-spin" /> Илгээж байна...</>
              ) : (
                <>Бүртгэл илгээх <ArrowRight size={24} /></>
              )}
            </Button>
          </form>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="space-y-8 bg-gradient-to-b from-white/5 to-transparent">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Info size={20} className="text-cyan-400" />
            Олимпиадын мэдээлэл
          </h3>
          {selectedContest ? (
            <div className="space-y-6">
              <div>
                <p className="text-lg font-bold text-white">{selectedContest.name}</p>
                {selectedContest.description && (
                  <p className="text-sm text-slate-400 mt-1">{selectedContest.description}</p>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-cyan-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Эхлэх огноо</p>
                  <p className="font-bold">{new Date(selectedContest.start_time).toLocaleDateString('mn-MN')}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-purple-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Дуусах огноо</p>
                  <p className="font-bold">{new Date(selectedContest.end_time).toLocaleDateString('mn-MN')}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Олимпиад сонгоно уу.</p>
          )}
        </Card>

        <Card className="bg-cyan-500/5 border-cyan-500/20">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-cyan-400">
            <ShieldCheck size={18} />
            Анхаарах зүйлс
          </h3>
          <ul className="space-y-3 text-xs text-slate-400 list-disc pl-4">
            <li>Нэг оролцогч зөвхөн нэг бүртгэл үүсгэнэ.</li>
            <li>Имэйл хаягаа зөв оруулсан эсэхээ шалгаарай.</li>
            <li>Бүртгэлийн дугаараа хадгалаарай.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
