import React, { useMemo, useState } from 'react';
import { AlertCircle, CalendarDays } from 'lucide-react';
import { Button, Card, SectionHeading } from '../components/UI';
import { TIMELINE } from '../constants';
import { Contest } from '../types';

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contests: Contest[] = useMemo(
    () => [
      {
        id: 4,
        name: 'CodeX[4]',
        description: 'Програмчлалын олимпиад',
        start_time: '2026-02-28',
        end_time: '2026-03-17',
        status: 'registration',
      },
    ],
    []
  );

  const activeContest = useMemo(
    () => selectedContest || contests.find((c) => c.status === 'registration') || null,
    [selectedContest, contests]
  );

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
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSubmitted(true);
    } catch (err) {
      setError('Бүртгэл амжилтгүй боллоо.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && activeContest) {
    return (
      <section className="section">
        <div className="container">
          <Card className="max-w-2xl mx-auto text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#EDAF00]/15 text-[#866300]">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Бүртгэл амжилттай</h1>
            <p className="mt-3 text-[var(--text-muted)]">
              Таны мэдээлэл хүлээн авлаа. Бүртгэлийн дугаар болон нэмэлт мэдээллийг имэйлээр илгээнэ.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[#EDAF00]/30 bg-[#EDAF00]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#866300]">
                {activeContest.name}
              </span>
              <span className="text-sm text-[var(--text-muted)]">{activeContest.start_time} — {activeContest.end_time}</span>
            </div>
            <div className="mt-8">
              <Button as="a" href="/" variant="primary">Нүүр хуудас руу буцах</Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="section pt-10">
      <div className="container">
        <SectionHeading title="Явц ба Хуваарь" subtitle="2026 оны олимпиадын бүртгэл, шалгаруулалт, финалын гол огноонууд." centered />

        <div className="timeline-strip">
          <div className="timeline-line" />
          <div className="timeline-grid">
            {TIMELINE.map((item, index) => (
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
                  <strong>{activeContest.start_time}</strong>
                </div>
                <div className="info-pill">
                  <span>Дуусах огноо</span>
                  <strong>{activeContest.end_time}</strong>
                </div>
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
                    {loading ? 'Илгээж байна...' : 'Бүртгэл илгээх'}
                  </Button>
                  <span className="text-sm text-[var(--text-muted)]">Бүртгэлийн дугаар 24 цагийн дотор илгээгдэнэ.</span>
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
              </ul>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Registration;
