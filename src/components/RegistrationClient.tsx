'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Card, SectionHeading } from '@/components/UI';
import { DEFAULT_TIMELINE } from '@/constants';
import type { Contest } from '@/lib/types';

const formatDate = (d: string | Date) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) {
    return String(d);
  }

  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');

  return `${year}/${month}/${day}`;
};

const formatAmount = (n: number) =>
  new Intl.NumberFormat('mn-MN').format(n) + '₮';

const getCategoryFromClassLevel = (value: string) => {
  const classNumber = Number.parseInt(value.trim(), 10);

  if (!Number.isInteger(classNumber)) return '';
  if (classNumber >= 4 && classNumber <= 6) return 'Бага';
  if (classNumber >= 7 && classNumber <= 9) return 'Дунд';
  if (classNumber >= 10 && classNumber <= 12) return 'Ахлах';
  return '';
};

const getBirthYearFromRegisterNumber = (value: string) => {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-ZА-ЯӨҮЁ]{2}\d{8}$/i.test(normalized)) return null;

  const yearPart = Number.parseInt(normalized.slice(2, 4), 10);
  const now = new Date();
  const currentTwoDigitYear = now.getFullYear() % 100;

  return yearPart <= currentTwoDigitYear
    ? 2000 + yearPart
    : 1900 + yearPart;
};

const getExpectedSchoolGrade = (birthYear: number) => {
  const now = new Date();
  const schoolYearEnd = now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear();
  return schoolYearEnd - birthYear - 6;
};

interface FormData {
  registerNumber: string;
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

type FormErrors = Partial<Record<keyof FormData, string>>;

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

interface RegistrationClientProps {
  readonly contests: readonly Contest[];
}

export function RegistrationClient({ contests }: RegistrationClientProps) {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [formData, setFormData] = useState<FormData>({
    registerNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    school: '',
    classLevel: '',
    level: 'Эхлэгч',
    category: '',
    languages: [],
    agreement: false,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [contestant, setContestant] = useState<RegisteredContestant | null>(null);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [checking, setChecking] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const activeContest = useMemo(
    () =>
      selectedContest ||
      contests.find(c => c.status === 'registration') ||
      null,
    [selectedContest, contests],
  );

  const timeline = useMemo(() => {
    const t = activeContest?.timeline;
    return Array.isArray(t) && t.length > 0 ? t : DEFAULT_TIMELINE;
  }, [activeContest]);

  const registrationFee = activeContest?.registration_fee ?? 0;

  const handleChange = (
    field: keyof FormData,
    value: string | boolean | string[],
  ) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      if (field === 'classLevel' || field === 'category') {
        delete next.classLevel;
        delete next.category;
      }
      if (field === 'agreement') {
        delete next.agreement;
      }
      return next;
    });
    setFormData(prev => {
      if (field === 'classLevel' && typeof value === 'string') {
        return {
          ...prev,
          classLevel: value,
          category: getCategoryFromClassLevel(value),
        };
      }

      return { ...prev, [field]: value };
    });
  };

  const toggleLanguage = (lang: string) => {
    setFieldErrors(prev => {
      if (!prev.languages) return prev;
      const next = { ...prev };
      delete next.languages;
      return next;
    });
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const startPaymentPolling = useCallback((contestantId: number) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        setChecking(true);
        const res = await fetch(`/api/payment/check/${contestantId}`);
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

  const validateForm = () => {
    const errors: FormErrors = {};
    const digitsOnlyPhone = formData.phone.replace(/\D/g, '');
    const classNumber = Number.parseInt(formData.classLevel.trim(), 10);
    const nameRegex = /^[^\d]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.lastName.trim()) {
      errors.lastName = 'Овог оруулна уу.';
    } else if (!nameRegex.test(formData.lastName.trim())) {
      errors.lastName = 'Овогт тоо оруулж болохгүй.';
    }

    if (!formData.registerNumber.trim()) {
      errors.registerNumber = 'Регистрийн дугаар оруулна уу.';
    } else if (!/^[A-Za-zА-Яа-яӨөҮүЁё]{2}\d{8}$/.test(formData.registerNumber.trim())) {
      errors.registerNumber = 'Регистрийн дугаар 2 үсэг, 8 тооноос бүрдсэн байна.';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'Нэр оруулна уу.';
    } else if (!nameRegex.test(formData.firstName.trim())) {
      errors.firstName = 'Нэрэнд тоо оруулж болохгүй.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Имэйл хаяг заавал оруулна уу.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Зөв имэйл хаяг оруулна уу.';
    }

    if (!digitsOnlyPhone) {
      errors.phone = 'Утасны дугаар оруулна уу.';
    } else if (digitsOnlyPhone.length < 8) {
      errors.phone = 'Утасны дугаар хамгийн багадаа 8 оронтой байна.';
    }

    if (!formData.school.trim()) {
      errors.school = 'ЕБС сургуулиа оруулна уу.';
    }

    if (!formData.classLevel.trim()) {
      errors.classLevel = 'ЕБС ангиа оруулна уу.';
    } else if (!Number.isInteger(classNumber) || classNumber < 4 || classNumber > 12) {
      errors.classLevel = 'ЕБС анги 4-12 хооронд байх ёстой.';
    } else {
      const birthYear = getBirthYearFromRegisterNumber(formData.registerNumber);
      if (birthYear) {
        const expectedGrade = getExpectedSchoolGrade(birthYear);
        if (expectedGrade > 12) {
          errors.classLevel = 'Уучлаарай, та энэхүү олимпиадад оролцох боломжгүй байна.';
        } else if (expectedGrade !== classNumber) {
          errors.classLevel = `Регистрийн дугаараас тооцоход ЕБС анги ${expectedGrade} байх ёстой.`;
        }
      }

      const derivedCategory = getCategoryFromClassLevel(formData.classLevel);

      if (!derivedCategory) {
        errors.classLevel = 'ЕБС анги 4-12 хооронд байх ёстой.';
      } else if (formData.category !== derivedCategory) {
        errors.classLevel = 'ЕБС ангиас насны ангиллыг автоматаар тодорхойлж чадсангүй.';
      }
    }

    if (!formData.languages.length) {
      errors.languages = 'Хамгийн багадаа нэг програмчлалын хэл сонгоно уу.';
    }

    if (!formData.agreement) {
      errors.agreement = 'Дүрэм, нөхцөлийг зөвшөөрнө үү.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!activeContest) {
      setError('Тэмцээн сонгоно уу.');
      return;
    }

    if (!validateForm()) {
      setError('Мэдээллээ зөв бөглөөд дахин оролдоно уу.');
      return;
    }

    try {
      setLoading(true);

      const regRes = await fetch('/api/contestants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contest_id: activeContest.id,
          register_number: formData.registerNumber.trim().toUpperCase(),
          class_level: formData.classLevel.trim(),
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          organization: formData.school.trim(),
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
        const invoiceRes = await fetch(
          `/api/payment/invoice/${registered.id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          },
        );
        const invoiceData = await invoiceRes.json();

        if (!invoiceData.success) {
          setError(
            invoiceData.error ?? 'QPay нэхэмжлэх үүсгэхэд алдаа гарлаа.',
          );
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
      const res = await fetch(`/api/payment/check/${contestant.id}`);
      const data = await res.json();
      if (data.success && data.data?.paid) {
        if (pollRef.current) clearInterval(pollRef.current);
        setStep('success');
      } else {
        setError('Төлбөр хараахан төлөгдөөгүй байна. Дахин оролдоно уу.');
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError('Төлбөр шалгах үед алдаа гарлаа.');
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
            <h1 className="text-3xl font-semibold text-(--text-primary)">
              Бүртгэл амжилттай
            </h1>
            <p className="mt-3 text-(--text-muted)">
              Таны мэдээлэл хүлээн авлаа.
              {registrationFee > 0 && ' Төлбөр амжилттай баталгаажлаа.'}
            </p>
            {contestant && (
              <div className="mt-4 inline-flex items-center rounded-xl border border-[#EDAF00]/30 bg-[#EDAF00]/10 px-5 py-3">
                <div className="text-left">
                  <div className="text-xs text-(--text-muted)">
                    Бүртгэлийн дугаар
                  </div>
                  <div className="text-2xl font-black text-[#EDAF00]">
                    {contestant.reg_number}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[#EDAF00]/30 bg-[#EDAF00]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#866300]">
                {activeContest.name}
              </span>
              <span className="text-sm text-(--text-muted)">
                {formatDate(activeContest.start_time)} —{' '}
                {formatDate(activeContest.end_time)}
              </span>
            </div>
            <div className="mt-8">
              <a
                href="/"
                className="inline-block px-7 py-3 rounded-2xl font-semibold bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] text-[#111827] shadow-lg hover:shadow-[0_12px_30px_rgba(237,175,0,0.28)] transition-all transform hover:-translate-y-0.5"
              >
                Нүүр хуудас руу буцах
              </a>
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
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Төлбөр төлөх
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">
              {activeContest.name} бүртгэлийн төлбөр:{' '}
              <strong className="text-[#EDAF00]">
                {formatAmount(invoice.amount)}
              </strong>
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

            <p className="mt-4 text-sm text-(--text-muted)">
              Банкны аппаараа QR кодыг уншуулна уу
            </p>

            {invoice.urls.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {invoice.urls.map(u => (
                  <a
                    key={u.name}
                    href={u.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs hover:border-[#EDAF00]/50 transition-colors"
                  >
                    {u.logo && (
                      <img
                        src={u.logo}
                        alt={u.name}
                        className="w-5 h-5 rounded"
                      />
                    )}
                    {u.description || u.name}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-3">
              <Button
                variant="primary"
                onClick={checkPaymentManually}
                disabled={checking}
              >
                {checking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Шалгаж байна...
                  </>
                ) : (
                  'Төлбөр шалгах'
                )}
              </Button>
              <div className="flex items-center gap-2 text-xs text-(--text-muted)">
                <Loader2 className="h-3 w-3 animate-spin" />
                Автоматаар шалгаж байна...
              </div>
            </div>

            {error && <div className="alert mt-4">{error}</div>}
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="section pt-10">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Явц ба{' '}
            <span className="text-[#B98000]">
              Хуваарь
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            2026 оны олимпиадын бүртгэл, финал, шагналын гол огноонууд.
          </p>
          <div className="mx-auto mt-6 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000]" />
        </div>

        <div className="timeline-strip">
          <div className="timeline-line" />
          <div className="timeline-grid">
            {timeline.map((item: { title: string; desc: string; date: string }, index: number) => (
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
          <SectionHeading
            title="Бүртгэл"
            subtitle="Идэвхтэй олимпиад сонгоод бүртгэлээ хийж, мэдээллээ бүрдүүлээрэй."
            centered
          />
        </div>

        {!activeContest ? (
          <Card className="text-center">
            <p className="text-[var(--text-muted)]">
              Бүртгэл нээлттэй олимпиад байхгүй байна.
            </p>
          </Card>
        ) : (
          <div className="mt-10 grid gap-8">
            <Card className="flex flex-wrap items-center justify-between gap-6 max-w-5xl mx-auto w-full">
              <div>
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                  <CalendarDays className="h-4 w-4" />
                  Олимпиадын мэдээлэл
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-(--text-primary)">
                  {activeContest.name}
                </h2>
                <p className="text-(--text-muted)">
                  {activeContest.description}
                </p>
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
                    <strong className="text-[#EDAF00]">
                      {formatAmount(registrationFee)}
                    </strong>
                  </div>
                )}
              </div>
            </Card>

            <Card className="registration-form max-w-5xl mx-auto w-full">
              <form onSubmit={onSubmit} className="grid gap-8" noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="field">
                    Овог
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => handleChange('lastName', e.target.value)}
                      placeholder="Бат"
                    />
                    {fieldErrors.lastName && <span className="text-sm text-red-500">{fieldErrors.lastName}</span>}
                  </label>
                  <label className="field">
                    Нэр
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => handleChange('firstName', e.target.value)}
                      placeholder="Тэмүүлэн"
                    />
                    {fieldErrors.firstName && <span className="text-sm text-red-500">{fieldErrors.firstName}</span>}
                  </label>
                  <label className="field">
                    Имэйл хаяг
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="name@email.com"
                    />
                    {fieldErrors.email && <span className="text-sm text-red-500">{fieldErrors.email}</span>}
                  </label>
                  <label className="field">
                    Регистрийн дугаар
                    <input
                      type="text"
                      value={formData.registerNumber}
                      onChange={e => handleChange('registerNumber', e.target.value)}
                      placeholder="АБ12345678"
                    />
                    {fieldErrors.registerNumber && <span className="text-sm text-red-500">{fieldErrors.registerNumber}</span>}
                  </label>
                  <label className="field">
                    Утасны дугаар
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="9911 2233"
                    />
                    {fieldErrors.phone && <span className="text-sm text-red-500">{fieldErrors.phone}</span>}
                  </label>
                  <label className="field">
                    ЕБС Сургууль
                    <input
                      type="text"
                      value={formData.school}
                      onChange={e => handleChange('school', e.target.value)}
                      placeholder="10-р сургууль"
                    />
                    {fieldErrors.school && <span className="text-sm text-red-500">{fieldErrors.school}</span>}
                  </label>
                  <label className="field">
                    Насны ангилал
                    <input
                      type="text"
                      value={formData.category}
                      readOnly
                      disabled
                      placeholder="ЕБС анги оруулахад автоматаар сонгогдоно"
                    />
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="field">
                    Туршлагын түвшин
                    <div className="pill-group">
                      {['Эхлэгч', 'Дунд', 'Ахисан'].map(level => (
                        <button
                          type="button"
                          key={level}
                          className={
                            formData.level === level ? 'pill active' : 'pill'
                          }
                          onClick={() => handleChange('level', level)}
                        >
                          {level} шат
                        </button>
                      ))}
                    </div>
                  </label>
                  <label className="field">
                    ЕБС анги
                    <input
                      type="text"
                      value={formData.classLevel}
                      onChange={e => handleChange('classLevel', e.target.value)}
                      placeholder="9-р анги"
                    />
                    {fieldErrors.classLevel && <span className="text-sm text-red-500">{fieldErrors.classLevel}</span>}
                  </label>
                </div>

                <div className="field">
                  Програмчлалын хэл (олон сонголт боломжтой)
                  <div className="pill-group">
                    {['C','C++', 'Java', 'Python'].map(
                      lang => (
                        <button
                          key={lang}
                          type="button"
                          className={
                            formData.languages.includes(lang)
                              ? 'pill active'
                              : 'pill'
                          }
                          onClick={() => toggleLanguage(lang)}
                        >
                          {lang}
                        </button>
                      ),
                    )}
                  </div>
                  {fieldErrors.languages && <span className="text-sm text-red-500">{fieldErrors.languages}</span>}
                </div>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={formData.agreement}
                    onChange={e => handleChange('agreement', e.target.checked)}
                  />
                  <span>
                    Би олимпиадын{' '}
                    <strong className="text-[var(--gold-deep)]">
                      дүрэм, нөхцөлийг
                    </strong>{' '}
                    бүрэн уншиж танилцсан бөгөөд зөвшөөрч байна. Бүртгэлээ
                    баталгаажуулахын тулд имэйлээ шалгаарай.
                  </span>
                </label>
                {fieldErrors.agreement && <div className="text-sm text-red-500">{fieldErrors.agreement}</div>}

                {error && <div className="alert">{error}</div>}

                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading
                      ? 'Илгээж байна...'
                      : registrationFee > 0
                        ? `Бүртгүүлэх (${formatAmount(registrationFee)})`
                        : 'Бүртгэл илгээх'}
                  </Button>
                  {registrationFee > 0 && (
                    <span className="text-sm text-[var(--text-muted)]">
                      Бүртгүүлсний дараа QPay-ээр төлбөр төлнө.
                    </span>
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
                <li>Таны бүртгэл дээр алдаа гарсан бол зохион байгуулагчтай холбогдоно уу.</li>
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
}
