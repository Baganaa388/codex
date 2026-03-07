import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Card, SectionHeading } from '../components/UI';
import { DEFAULT_TIMELINE } from '../constants';
import { Contest } from '../types';

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return d; }
};

const formatAmount = (n: number) =>
  new Intl.NumberFormat('mn-MN').format(n) + '₮';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  classLevel: string;
  level: string;
  category: string;
  languages: string[];
  agreement: boolean;
}

interface QPayInvoice {
  invoice_id: string;
  qr_image: string;
  qr_text: string;
  urls: { name: string; description: string; logo: string; link: string }[];
  amount: number;
}

interface RegisteredContestant {
  id: number;
  reg_number: string;
  payment_status: string;
}

type Step = 'form' | 'payment' | 'success';

export const Registration: React.FC = () => {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    school: '',
    classLevel: '',
    level: 'Эхлэгч',
    category: 'Бага',
    languages: [],
    agreement: false,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [contestant, setContestant] = useState<RegisteredContestant | null>(null);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [checking, setChecking] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setContests(data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const activeContest = useMemo(
    () => selectedContest || contests.find((c) => c.status === 'registration') || null,
    [selectedContest, contests]
  );

  const timeline = useMemo(() => {
    const t = (activeContest as any)?.timeline;
    return Array.isArray(t) && t.length > 0 ? t : DEFAULT_TIMELINE;
  }, [activeContest]);

  const registrationFee = activeContest?.registration_fee ?? 0;

  const handleChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang],
      };
    });
  };

  const startPaymentPolling = useCallback((contestantId: number) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        setChecking(true);
        const res = await fetch(`/api/payment/${contestantId}/check`);
        const data = await res.json();
        if (data.success && data.data?.paid) {
          if (pollRef.current) clearInterval(pollRef.current);
          setStep('success');
        }
      } catch {
        // keep polling
      } finally {
        setChecking(false);
      }
    }, 5000);
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!activeContest) {
      setError('Тэмцээн сонгоно уу.');
      return;
    }

    if (!formData.agreement) {
      setError('Дүрэм, нөхцөлийг зөвшөөрнө үү.');
      return;
    }

    try {
      setLoading(true);

      const regRes = await fetch('/api/contestants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contest_id: activeContest.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.school,
          category: formData.category,
        }),
      });
      const regData = await regRes.json();

      if (!regData.success) {
        setError(regData.error ?? 'Бүртгэл амжилтгүй боллоо.');
        return;
      }

      const registered = regData.data as RegisteredContestant;
      setContestant(registered);

      if (registrationFee > 0 && registered.payment_status !== 'free') {
        const invoiceRes = await fetch(`/api/payment/${registered.id}/invoice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const invoiceData = await invoiceRes.json();

        if (!invoiceData.success) {
          setError(invoiceData.error ?? 'QPay нэхэмжлэх үүсгэхэд алдаа гарлаа.');
          return;
        }

        setInvoice(invoiceData.data as QPayInvoice);
        setStep('payment');
        startPaymentPolling(registered.id);
      } else {
        setStep('success');
      }
    } catch {
      setError('Бүртгэл амжилтгүй боллоо.');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentManually = async () => {
    if (!contestant) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/payment/${contestant.id}/check`);
      const data = await res.json();
      if (data.success && data.data?.paid) {
        if (pollRef.current) clearInterval(pollRef.current);
        setStep('success');
      } else {
        setError('Төлбөр хараахан төлөгдөөгүй байна. Дахин оролдоно уу.');
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError('Шалгахад алдаа гарлаа.');
    } finally {
      setChecking(false);
    }
  };

  if (step === 'success' && activeContest) {
    return (
      <section className="section">
        <div className="container">
          <Card className="max-w-2xl mx-auto text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-green-500">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Бүртгэл амжилттай</h1>
            <p className="mt-3 text-[var(--text-muted)]">
              Таны мэдээлэл хүлээн авлаа.
              {registrationFee > 0 && ' Төлбөр амжилттай баталгаажлаа.'}
            </p>
            {contestant && (
              <div className="mt-4 inline-flex items-center rounded-xl border border-[#EDAF00]/30 bg-[#EDAF00]/10 px-5 py-3">
                <div className="text-left">
                  <div className="text-xs text-[var(--text-muted)]">Бүртгэлийн дугаар</div>
                  <div className="text-2xl font-black text-[#EDAF00]">{contestant.reg_number}</div>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[#EDAF00]/30 bg-[#EDAF00]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#866300]">
                {activeContest.name}
              </span>
              <span className="text-sm text-[var(--text-muted)]">{formatDate(activeContest.start_time)} — {formatDate(activeContest.end_time)}</span>
            </div>
            <div className="mt-8">
              <a href="/" className="inline-block px-7 py-3 rounded-2xl font-semibold bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] text-[#111827] shadow-lg hover:shadow-[0_12px_30px_rgba(237,175,0,0.28)] transition-all transform hover:-translate-y-0.5">Нүүр хуудас руу буцах</a>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (step === 'payment' && invoice && activeContest) {
    return (
      <section className="section">
        <div className="container">
          <Card className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Төлбөр төлөх</h1>
            <p className="mt-2 text-[var(--text-muted)]">
              {activeContest.name} бүртгэлийн төлбөр: <strong className="text-[#EDAF00]">{formatAmount(invoice.amount)}</strong>
            </p>

            {contestant && (
              <div className="mt-3 text-sm text-[var(--text-muted)]">
                Бүртгэлийн дугаар: <strong>{contestant.reg_number}</strong>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-white p-4 inline-block">
              <img
                src={`data:image/png;base64,${invoice.qr_image}`}
                alt="QPay QR Code"
                className="w-64 h-64 mx-auto"
              />
            </div>

            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Банкны аппаараа QR кодыг уншуулна уу
            </p>

            {invoice.urls.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {invoice.urls.map((u) => (
                  <a
                    key={u.name}
                    href={u.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs hover:border-[#EDAF00]/50 transition-colors"
                  >
                    {u.logo && <img src={u.logo} alt={u.name} className="w-5 h-5 rounded" />}
                    {u.description || u.name}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-3">
              <Button variant="primary" onClick={checkPaymentManually} disabled={checking}>
                {checking ? (
                  <><Loader2 className="h-4 w-4 animate-spin inline mr-2" />Шалгаж байна...</>
                ) : (
                  'Төлбөр шалгах'
                )}
              </Button>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Loader2 className="h-3 w-3 animate-spin" />
                Автоматаар шалгаж байна...
              </div>
            </div>

            {error && (
              <div className="alert mt-4">{error}</div>
            )}
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="section pt-10">
      <div className="container">
        <SectionHeading title="Явц ба Хуваарь" subtitle="2026 оны олимпиадын бүртгэл, финал, шагналын гол огноонууд." centered />

        <div className="timeline-strip">
          <div className="timeline-line" />
          <div className="timeline-grid">
            {timeline.map((item, index) => (
              <article key={item.title} className="timeline-card">
                <div className="timeline-card-top">
                  <span className="timeline-date">{item.date}</span>
                  <span className="timeline-step">{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="timeline-tag">STAGE</span>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading title="Бүртгэл" subtitle="Идэвхтэй олимпиад сонгоод бүртгэлээ хийж, мэдээллээ бүрдүүлээрэй." centered />
        </div>

        {!activeContest ? (
          <Card className="text-center">
            <p className="text-[var(--text-muted)]">Бүртгэл нээлттэй олимпиад байхгүй байна.</p>
          </Card>
        ) : (
          <div className="mt-10 grid gap-8">
            <Card className="flex flex-wrap items-center justify-between gap-6 max-w-5xl mx-auto w-full">
              <div>
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                  <CalendarDays className="h-4 w-4" />
                  Олимпиадын мэдээлэл
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{activeContest.name}</h2>
                <p className="text-[var(--text-muted)]">{activeContest.description}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="info-pill">
                  <span>Эхлэх огноо</span>
                  <strong>{formatDate(activeContest.start_time)}</strong>
                </div>
                <div className="info-pill">
                  <span>Дуусах огноо</span>
                  <strong>{formatDate(activeContest.end_time)}</strong>
                </div>
                {registrationFee > 0 && (
                  <div className="info-pill">
                    <span>Бүртгэлийн хураамж</span>
                    <strong className="text-[#EDAF00]">{formatAmount(registrationFee)}</strong>
                  </div>
                )}
              </div>
            </Card>

            <Card className="registration-form max-w-5xl mx-auto w-full">
              <form onSubmit={onSubmit} className="grid gap-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="field">
                    Овог
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder="Бат"
                      required
                    />
                  </label>
                  <label className="field">
                    Нэр
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="Тэмүүлэн"
                      required
                    />
                  </label>
                  <label className="field">
                    Имэйл хаяг
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="name@email.com"
                      required
                    />
                  </label>
                  <label className="field">
                    Утасны дугаар
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="9911 2233"
                      required
                    />
                  </label>
                  <label className="field">
                    ЕБС Сургууль
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => handleChange('school', e.target.value)}
                      placeholder="10-р сургууль"
                      required
                    />
                  </label>
                  <label className="field">
                    Насны ангилал
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      <option value="Бага">Бага анги</option>
                      <option value="Дунд">Дунд анги</option>
                      <option value="Ахлах">Ахлах анги</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="field">
                    Туршлагын түвшин
                    <div className="pill-group">
                      {['Эхлэгч', 'Дунд', 'Ахисан'].map((level) => (
                        <button
                          type="button"
                          key={level}
                          className={formData.level === level ? 'pill active' : 'pill'}
                          onClick={() => handleChange('level', level)}
                        >
                          {level} шат
                        </button>
                      ))}
                    </div>
                  </label>
                  <label className="field">
                    Анги
                    <input
                      type="text"
                      value={formData.classLevel}
                      onChange={(e) => handleChange('classLevel', e.target.value)}
                      placeholder="9-р анги"
                      required
                    />
                  </label>
                </div>

                <div className="field">
                  Програмчлалын хэл (олон сонголт боломжтой)
                  <div className="pill-group">
                    {['C++', 'Java', 'Python', 'JavaScript', 'Kotlin'].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        className={formData.languages.includes(lang) ? 'pill active' : 'pill'}
                        onClick={() => toggleLanguage(lang)}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.agreement}
                    onChange={(e) => handleChange('agreement', e.target.checked)}
                  />
                  <span>
                    Би олимпиадын <strong className="text-[var(--gold-deep)]">дүрэм, нөхцөлийг</strong> бүрэн уншиж танилцсан бөгөөд зөвшөөрч байна.
                    Бүртгэлээ баталгаажуулахын тулд имэйлээ шалгаарай.
                  </span>
                </label>

                {error && (
                  <div className="alert">{error}</div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Илгээж байна...' : registrationFee > 0 ? `Бүртгүүлэх (${formatAmount(registrationFee)})` : 'Бүртгэл илгээх'}
                  </Button>
                  {registrationFee > 0 && (
                    <span className="text-sm text-[var(--text-muted)]">Бүртгүүлсний дараа QPay-ээр төлбөр төлнө.</span>
                  )}
                </div>
              </form>
            </Card>

            <Card className="note-card max-w-5xl mx-auto w-full">
              <div className="flex items-center gap-2 font-semibold text-[var(--gold-deep)]">
                <AlertCircle className="h-5 w-5" /> Анхаарах зүйлс
              </div>
              <ul>
                <li>Нэг оролцогч зөвхөн нэг бүртгэл үүсгэнэ.</li>
                <li>Имэйл хаягаа зөв оруулсан эсэхээ шалгаарай.</li>
                <li>Бүртгэлийн дугаараа хадгалаарай.</li>
                {registrationFee > 0 && (
                  <li>Төлбөр төлөгдсөн тохиолдолд л бүртгэл баталгаажна.</li>
                )}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Registration;
