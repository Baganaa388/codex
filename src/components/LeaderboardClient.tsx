'use client';

import { useState, useCallback } from 'react';
import { Search, Trophy, Medal, Loader2 } from 'lucide-react';
import { Card } from '@/components/UI';
import type { Contest, LeaderboardEntry, ProblemStatistic, Category, ApiResponse, ApiLeaderboardEntry, ApiProblemStat } from '@/lib/types';

const STR = {
  olympiad: 'Олимпиад',
  category: 'Ангилал',
  search: 'Хайлт',
  searchPh: 'Нэр эсвэл сургууль...',
  emptyNone: 'Одоогоор олимпиад бүртгэгдээгүй байна.',
  emptyCat: 'Энэ ангилалд оролцогч байхгүй байна.',
  rank: 'Байр',
  contestant: 'Оролцогч',
  org: 'Сургууль',
  points: 'Оноо',
  total: 'Нийт',
} as const;

type CategoryKey = 'Бага' | 'Дунд' | 'Ахлах';

const CATEGORIES: readonly { readonly key: CategoryKey; readonly label: string }[] = [
  { key: 'Бага', label: 'Бага анги' },
  { key: 'Дунд', label: 'Дунд анги' },
  { key: 'Ахлах', label: 'Ахлах анги' },
];

interface DisplayEntry {
  readonly rank: number;
  readonly name: string;
  readonly organization: string;
  readonly points: number;
  readonly penalty: number;
  readonly isTop3: boolean;
  readonly problemScores: Readonly<Record<number, number>>;
}

function toDisplayEntry(entry: LeaderboardEntry | ApiLeaderboardEntry): DisplayEntry {
  const scores: Record<number, number> = {};
  for (const score of entry.problem_scores ?? []) {
    scores[score.problem_id] = score.points;
  }
  return {
    rank: Number(entry.rank),
    name: `${entry.last_name?.charAt(0)}.${entry.first_name}`,
    organization: entry.organization,
    points: entry.total_points,
    penalty: entry.penalty_minutes,
    isTop3: Number(entry.rank) <= 3,
    problemScores: scores,
  };
}

interface LeaderboardClientProps {
  readonly contests: readonly Contest[];
  readonly initialEntries: readonly LeaderboardEntry[];
  readonly initialTotal: number;
  readonly initialProblemStats: readonly ProblemStatistic[];
}

export function LeaderboardClient({
  contests,
  initialEntries,
  initialTotal,
  initialProblemStats,
}: LeaderboardClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<CategoryKey>('Бага');
  const [selectedContestId, setSelectedContestId] = useState<number | null>(
    contests.length > 0 ? contests[0].id : null,
  );
  const [entries, setEntries] = useState<readonly DisplayEntry[]>(
    initialEntries.map(toDisplayEntry),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [problemStats, setProblemStats] = useState<readonly (ProblemStatistic | ApiProblemStat)[]>(
    initialProblemStats,
  );

  const fetchLeaderboard = useCallback(async (contestId: number, cat: CategoryKey, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', category: cat });
      if (search) params.set('search', search);

      const [lbRes, statsRes] = await Promise.all([
        fetch(`/api/leaderboard/${contestId}?${params}`),
        fetch(`/api/leaderboard/${contestId}/problems`),
      ]);

      const lbData: ApiResponse<ApiLeaderboardEntry[]> = await lbRes.json();
      if (lbData.success && lbData.data) {
        setEntries(lbData.data.map(toDisplayEntry));
        setTotalCount(lbData.meta?.total ?? lbData.data.length);
      } else {
        setEntries([]);
        setTotalCount(0);
      }

      const statsData: ApiResponse<ApiProblemStat[]> = await statsRes.json();
      if (statsData.success && statsData.data) {
        setProblemStats(statsData.data);
      }
    } catch {
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleContestChange = (contestId: number) => {
    setSelectedContestId(contestId);
    fetchLeaderboard(contestId, category, searchTerm);
  };

  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
    if (selectedContestId) fetchLeaderboard(selectedContestId, cat, searchTerm);
  };

  const handleSearch = () => {
    if (selectedContestId) fetchLeaderboard(selectedContestId, category, searchTerm);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-6">
        <Card className="space-y-6 bg-[#F7F7F8] border border-[#E5E7EB]">
          {contests.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">
                {STR.olympiad}
              </label>
              <div className="flex flex-col gap-2">
                {contests.map(c => (
                  <button
                    key={c.id}
                    className={`text-left px-4 py-3 rounded-xl transition-all text-sm ${
                      selectedContestId === c.id
                        ? 'bg-[#EDAF00] text-[#111827] font-bold'
                        : 'hover:bg-white text-slate-600 border border-transparent hover:border-[#E5E7EB]'
                    }`}
                    onClick={() => handleContestChange(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">
              {STR.category}
            </label>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  className={`text-left px-4 py-3 rounded-xl transition-all ${
                    category === cat.key
                      ? 'bg-[#EDAF00] text-[#111827] font-bold'
                      : 'hover:bg-white text-slate-600 border border-transparent hover:border-[#E5E7EB]'
                  }`}
                  onClick={() => handleCategoryChange(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">
              {STR.search}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input
                type="text"
                placeholder={STR.searchPh}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#EDAF00] transition-colors text-slate-900"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
        </Card>
      </aside>

      {/* Table */}
      <div className="lg:col-span-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#EDAF00]" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-600">
              {contests.length === 0 ? STR.emptyNone : STR.emptyCat}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl bg-white border border-[#E5E7EB]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600">{STR.rank}</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600">{STR.contestant}</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600">{STR.org}</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600">{STR.points}</th>
                    {problemStats.map(problem => (
                      <th
                        key={problem.problem_id}
                        className="px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-600"
                        title={problem.title}
                      >
                        {problem.title} ({problem.max_points})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {entries.map((entry, i) => {
                    const rankRowClass =
                      entry.rank === 1
                        ? 'bg-[#FFF6D9]'
                        : entry.rank === 2
                          ? 'bg-[#F2F4F8]'
                          : entry.rank === 3
                            ? 'bg-[#FFF1E6]'
                            : '';
                    const rankBadgeClass =
                      entry.rank === 1
                        ? 'bg-[#EDAF00] text-white'
                        : entry.rank === 2
                          ? 'bg-[#94A3B8] text-white'
                          : entry.rank === 3
                            ? 'bg-[#C87A2B] text-white'
                            : 'bg-slate-100 text-slate-700';
                    return (
                      <tr
                        key={i}
                        className={`transition-colors hover:bg-[#F7F7F8] ${rankRowClass}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {entry.rank === 1 && <Trophy size={20} className="text-[#EDAF00]" />}
                            {entry.rank === 2 && <Medal size={20} className="text-slate-400" />}
                            {entry.rank === 3 && <Medal size={20} className="text-[#C87A2B]" />}
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${rankBadgeClass}`}>
                              {entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-900">{entry.name}</td>
                        <td className="px-6 py-5 text-sm text-slate-600">{entry.organization}</td>
                        <td className="px-6 py-5">
                          <span className="bg-[#EDAF00]/20 text-[#866300] px-3 py-1 rounded-lg font-black">{entry.points}</span>
                        </td>
                        {problemStats.map(problem => (
                          <td key={problem.problem_id} className="px-4 py-5 text-sm text-slate-700">
                            <span className="inline-flex min-w-[44px] justify-center rounded-lg bg-[#F7F7F8] px-2 py-1 font-semibold text-slate-800">
                              {entry.problemScores[problem.problem_id] ?? 0}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center text-slate-600 text-sm">
              {STR.total} {totalCount} {STR.contestant} &middot; {CATEGORIES.find(c => c.key === category)?.label}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
