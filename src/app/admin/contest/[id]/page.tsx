'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Loader2,
  Users,
  Trophy,
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import type { Contest, ApiResponse } from '@/lib/types';

interface SubtaskItem {
  readonly id: number;
  readonly label: string;
  readonly points: number;
  readonly test_count: number;
}

interface ProblemItem {
  readonly id: number;
  readonly title: string;
  readonly max_points: number;
  readonly subtasks: readonly SubtaskItem[];
}

interface ContestantItem {
  readonly id: number;
  readonly reg_number: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly phone: string;
  readonly organization: string;
  readonly category: string;
  readonly payment_status?: string;
}

type Tab = 'problems' | 'contestants' | 'scoring' | 'settings';

export default function AdminContestPage() {
  const params = useParams();
  const router = useRouter();
  const { authFetch } = useAdmin();
  const contestId = Number(params.id);

  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [contestants, setContestants] = useState<ContestantItem[]>([]);
  const [tab, setTab] = useState<Tab>('problems');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [contestRes, problemsRes, contestantsRes] = await Promise.all([
      authFetch<Contest>(`/api/contests/${contestId}`),
      authFetch<ProblemItem[]>(`/api/contests/${contestId}/problems`),
      authFetch<{ rows: ContestantItem[]; total: number } | ContestantItem[]>(
        `/api/contestants?contest_id=${contestId}`,
      ),
    ]);
    if (contestRes.success && contestRes.data) setContest(contestRes.data);
    if (problemsRes.success && problemsRes.data) setProblems(problemsRes.data);
    if (contestantsRes.success && contestantsRes.data) {
      const d = contestantsRes.data;
      setContestants(Array.isArray(d) ? d : ((d as Record<string, unknown>).rows as ContestantItem[] ?? []));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [contestId]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'problems', label: 'Бодлого', icon: <Trophy size={16} /> },
    { key: 'contestants', label: 'Оролцогчид', icon: <Users size={16} /> },
    { key: 'scoring', label: 'Дүн оруулах', icon: <Send size={16} /> },
    { key: 'settings', label: 'Тохиргоо', icon: <RefreshCw size={16} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-2"
        >
          <ArrowLeft size={16} /> Буцах
        </Link>
        <h1 className="text-xl font-black">{contest?.name}</h1>
        <div className="flex gap-2 mt-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === 'problems' && (
          <ProblemsTab
            problems={problems}
            contestId={contestId}
            authFetch={authFetch}
            onReload={loadData}
          />
        )}
        {tab === 'contestants' && (
          <ContestantsTab
            contestants={contestants}
            contestId={contestId}
            authFetch={authFetch}
          />
        )}
        {tab === 'scoring' && (
          <ScoringTab problems={problems} authFetch={authFetch} />
        )}
        {tab === 'settings' && (
          <SettingsTab
            contest={contest}
            contestId={contestId}
            authFetch={authFetch}
            onReload={loadData}
          />
        )}
      </main>
    </div>
  );
}

/* ─── Problems Tab ──────────────────────────────────────────────────── */

function ProblemsTab({
  problems,
  contestId,
  authFetch,
  onReload,
}: {
  problems: ProblemItem[];
  contestId: number;
  authFetch: <T>(url: string, options?: RequestInit) => Promise<ApiResponse<T>>;
  onReload: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [subtasks, setSubtasks] = useState([
    { label: 'Sub1', points: 100, test_count: 1 },
  ]);

  const maxPoints = subtasks.reduce((s, st) => s + (st.points || 0), 0);

  const addSubtask = () =>
    setSubtasks([
      ...subtasks,
      { label: `Sub${subtasks.length + 1}`, points: 0, test_count: 1 },
    ]);

  const updateSubtask = (i: number, field: string, value: string | number) => {
    setSubtasks(
      subtasks.map((st, idx) => (idx === i ? { ...st, [field]: value } : st)),
    );
  };

  const removeSubtask = (i: number) => {
    if (subtasks.length > 1)
      setSubtasks(subtasks.filter((_, idx) => idx !== i));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await authFetch('/api/contests/' + contestId + '/problems', {
      method: 'POST',
      body: JSON.stringify({
        title,
        max_points: maxPoints,
        sort_order: problems.length,
        subtasks: subtasks.map((st) => ({
          ...st,
          points: Number(st.points),
          test_count: Number(st.test_count),
        })),
      }),
    });
    setCreating(false);
    setShowForm(false);
    setTitle('');
    setSubtasks([{ label: 'Sub1', points: 100, test_count: 1 }]);
    onReload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Бодлогууд ({problems.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Бодлого нэмэх
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white/[0.04] border border-cyan-500/30 rounded-2xl p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Бодлогын нэр
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500">
                Subtask-ууд (нийт: {maxPoints} оноо)
              </label>
              <button
                type="button"
                onClick={addSubtask}
                className="text-cyan-400 text-xs font-bold hover:text-cyan-300"
              >
                + Нэмэх
              </button>
            </div>
            {subtasks.map((st, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={st.label}
                  onChange={(e) => updateSubtask(i, 'label', e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Label"
                />
                <input
                  type="number"
                  value={st.points}
                  onChange={(e) =>
                    updateSubtask(i, 'points', Number(e.target.value))
                  }
                  className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Оноо"
                />
                <input
                  type="number"
                  value={st.test_count}
                  onChange={(e) =>
                    updateSubtask(i, 'test_count', Number(e.target.value))
                  }
                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Test"
                />
                {subtasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubtask(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {creating && <Loader2 size={16} className="animate-spin" />} Нэмэх
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-white/10 text-slate-400 px-6 py-2 rounded-xl text-sm"
            >
              Болих
            </button>
          </div>
        </form>
      )}

      {problems.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          Бодлого нэмээгүй байна.
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((p, i) => (
            <div
              key={p.id}
              className="bg-white/[0.04] border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">
                  #{i + 1} {p.title}
                </h3>
                <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-1 rounded-lg">
                  {p.max_points} оноо
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.subtasks.map((st) => (
                  <span
                    key={st.id}
                    className="bg-white/5 border border-white/10 text-xs px-3 py-1 rounded-lg text-slate-400"
                  >
                    {st.label}: {st.points} оноо ({st.test_count} test)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Contestants Tab ───────────────────────────────────────────────── */

function ContestantsTab({
  contestants,
  contestId,
  authFetch,
}: {
  contestants: ContestantItem[];
  contestId: number;
  authFetch: <T>(url: string, options?: RequestInit) => Promise<ApiResponse<T>>;
}) {
  const [search, setSearch] = useState('');

  const filtered = contestants.filter(
    (c) =>
      c.first_name.toLowerCase().includes(search.toLowerCase()) ||
      c.last_name.toLowerCase().includes(search.toLowerCase()) ||
      c.reg_number.toLowerCase().includes(search.toLowerCase()) ||
      c.organization.toLowerCase().includes(search.toLowerCase()),
  );

  const downloadCsv = () => {
    const token = localStorage.getItem('codex_admin_token');
    const url = `/api/contestants/export?contest_id=${contestId}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `contestants-${contestId}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Оролцогчид ({contestants.length})</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadCsv}
            className="flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Download size={16} /> Excel татах
          </button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хайх..."
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          Оролцогч байхгүй.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white/[0.04] border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Дугаар
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Нэр
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Сургууль
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Ангилал
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Төлбөр
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Утас
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-cyan-400 font-bold">
                    {c.reg_number}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {c.last_name} {c.first_name}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{c.organization}</td>
                  <td className="px-4 py-3">
                    <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-1 rounded-lg">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        c.payment_status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : c.payment_status === 'free'
                            ? 'bg-slate-500/20 text-slate-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {c.payment_status === 'paid'
                        ? 'Төлсөн'
                        : c.payment_status === 'free'
                          ? 'Үнэгүй'
                          : 'Хүлээгдэж буй'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Scoring Tab ───────────────────────────────────────────────────── */

function ScoringTab({
  problems,
  authFetch,
}: {
  problems: ProblemItem[];
  authFetch: <T>(url: string, options?: RequestInit) => Promise<ApiResponse<T>>;
}) {
  const [regNumber, setRegNumber] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem | null>(null);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSelectProblem = (problemId: number) => {
    const p = problems.find((pr) => pr.id === problemId);
    if (p) {
      setSelectedProblem(p);
      const initial: Record<number, boolean> = {};
      p.subtasks.forEach((st) => {
        initial[st.id] = false;
      });
      setResults(initial);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem) return;
    setSubmitting(true);
    setMessage(null);

    const data = await authFetch<{ total_points: number }>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify({
        reg_number: regNumber,
        problem_id: selectedProblem.id,
        subtask_results: Object.entries(results).map(([subtaskId, passed]) => ({
          subtask_id: Number(subtaskId),
          passed,
        })),
      }),
    });

    if (data.success && data.data) {
      setMessage({
        type: 'success',
        text: `Амжилттай! Нийт оноо: ${data.data.total_points}`,
      });
    } else {
      setMessage({ type: 'error', text: data.error ?? 'Алдаа гарлаа' });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold">Дүн оруулах</h2>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <XCircle size={16} />
          )}
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Бүртгэлийн дугаар
            </label>
            <input
              required
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="CX4-0001"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Бодлого</label>
            <select
              required
              onChange={(e) => handleSelectProblem(Number(e.target.value))}
              defaultValue=""
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Сонгох...
              </option>
              {problems.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.title} ({p.max_points} оноо)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProblem && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500">
              Subtask дүн
            </label>
            {selectedProblem.subtasks.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5"
              >
                <div>
                  <span className="font-bold text-sm">{st.label}</span>
                  <span className="text-slate-500 text-xs ml-2">
                    ({st.points} оноо)
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResults({ ...results, [st.id]: true })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${results[st.id] ? 'bg-green-500 text-white' : 'border border-white/10 text-slate-400 hover:border-green-500/50'}`}
                  >
                    <CheckCircle size={14} className="inline mr-1" /> Тэнцсэн
                  </button>
                  <button
                    type="button"
                    onClick={() => setResults({ ...results, [st.id]: false })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!results[st.id] ? 'bg-red-500/80 text-white' : 'border border-white/10 text-slate-400 hover:border-red-500/50'}`}
                  >
                    <XCircle size={14} className="inline mr-1" /> Тэнцээгүй
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !selectedProblem}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Дүн илгээх
        </button>
      </form>
    </div>
  );
}

/* ─── Settings Tab ──────────────────────────────────────────────────── */

const DEFAULT_TIMELINE_ITEMS = [
  { title: 'Бүртгэл', desc: 'Онлайнаар бүртгүүлэх', date: '' },
  { title: 'Финал', desc: 'Улаанбаатар хотод', date: '' },
  { title: 'Шагнал', desc: 'Ялагчдыг тодруулах', date: '' },
];

function SettingsTab({
  contest,
  contestId,
  authFetch,
  onReload,
}: {
  contest: Contest | null;
  contestId: number;
  authFetch: <T>(url: string, options?: RequestInit) => Promise<ApiResponse<T>>;
  onReload: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<
    { title: string; desc: string; date: string }[]
  >([]);
  const [savingTimeline, setSavingTimeline] = useState(false);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [savingFee, setSavingFee] = useState(false);

  useEffect(() => {
    const t = contest?.timeline;
    setTimeline(Array.isArray(t) && t.length > 0 ? [...t.map(item => ({ ...item }))] : DEFAULT_TIMELINE_ITEMS);
    setRegistrationFee(contest?.registration_fee ?? 0);
  }, [contest]);

  const statuses = [
    'draft',
    'registration',
    'active',
    'grading',
    'finished',
  ] as const;
  const statusLabels: Record<string, string> = {
    draft: 'Ноорог',
    registration: 'Бүртгэл нээлттэй',
    active: 'Явагдаж байна',
    grading: 'Дүн шалгаж байна',
    finished: 'Дууссан',
  };

  const changeStatus = async (status: string) => {
    setUpdating(true);
    await authFetch(`/api/contests/${contestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    onReload();
  };

  const recalculate = async () => {
    setRecalculating(true);
    setMsg(null);
    const res = await authFetch<{ message: string }>(
      `/api/leaderboard/${contestId}/recalculate`,
      { method: 'POST' },
    );
    setMsg(
      res.success ? 'Leaderboard дахин тооцоологдлоо!' : (res.error ?? 'Алдаа'),
    );
    setRecalculating(false);
  };

  const updateTimelineItem = (index: number, field: string, value: string) => {
    setTimeline(
      timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const saveTimeline = async () => {
    setSavingTimeline(true);
    await authFetch(`/api/contests/${contestId}`, {
      method: 'PUT',
      body: JSON.stringify({ timeline }),
    });
    setSavingTimeline(false);
    setMsg('Timeline хадгалагдлаа!');
    onReload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold">Тохиргоо</h2>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
        <label className="text-xs font-bold text-slate-500">
          Тэмцээний статус
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              disabled={updating}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${contest?.status === s ? 'bg-cyan-500 text-white' : 'border border-white/10 text-slate-400 hover:border-cyan-500/50'}`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
        <label className="text-xs font-bold text-slate-500">
          Хуваарь / Timeline (3 үе шат)
        </label>
        <div className="space-y-3">
          {timeline.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input
                value={item.title}
                onChange={(e) => updateTimelineItem(i, 'title', e.target.value)}
                placeholder="Гарчиг"
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
              />
              <input
                value={item.desc}
                onChange={(e) => updateTimelineItem(i, 'desc', e.target.value)}
                placeholder="Тайлбар"
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
              />
              <input
                value={item.date}
                onChange={(e) => updateTimelineItem(i, 'date', e.target.value)}
                placeholder="Огноо (жнь: 04/15)"
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveTimeline}
          disabled={savingTimeline}
          className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"
        >
          {savingTimeline && <Loader2 size={16} className="animate-spin" />}
          Timeline хадгалах
        </button>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
        <label className="text-xs font-bold text-slate-500">
          Бүртгэлийн хураамж (₮)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            step={1000}
            value={registrationFee}
            onChange={(e) => setRegistrationFee(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 w-40"
            placeholder="0"
          />
          <button
            onClick={async () => {
              setSavingFee(true);
              await authFetch(`/api/contests/${contestId}`, {
                method: 'PUT',
                body: JSON.stringify({ registration_fee: registrationFee }),
              });
              setSavingFee(false);
              setMsg('Хураамж хадгалагдлаа!');
              onReload();
            }}
            disabled={savingFee}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {savingFee && <Loader2 size={16} className="animate-spin" />}
            Хадгалах
          </button>
        </div>
        <p className="text-xs text-slate-500">
          0 бол үнэгүй бүртгэл. Хураамжтай бол QPay-ээр төлбөр төлнө.
        </p>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
        <label className="text-xs font-bold text-slate-500">Leaderboard</label>
        <button
          onClick={recalculate}
          disabled={recalculating}
          className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"
        >
          {recalculating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Дахин тооцоолох
        </button>
        {msg && <p className="text-sm text-green-400">{msg}</p>}
      </div>
    </div>
  );
}
