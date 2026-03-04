import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trophy, Medal, Loader2 } from 'lucide-react';
import { Card, SectionHeading } from '../components/UI';
import { ApiResponse, ApiLeaderboardEntry, ApiProblemStat, Contest } from '../types';

const STR = {
  title: '\u041b\u0438\u0434\u0435\u0440\u04af\u04af\u0434\u0438\u0439\u043d \u0441\u0430\u043c\u0431\u0430\u0440',
  subtitle: '\u041e\u043b\u0438\u043c\u043f\u0438\u0430\u0434 \u0441\u043e\u043d\u0433\u043e\u0436, \u0430\u043d\u0433\u0438\u043b\u0430\u043b \u0431\u04af\u0440\u0438\u0439\u043d \u0448\u0438\u043b\u0434\u044d\u0433 \u043e\u0440\u043e\u043b\u0446\u043e\u0433\u0447\u0434\u044b\u0433 \u0445\u0430\u0440\u043d\u0430 \u0443\u0443.',
  olympiad: '\u041e\u043b\u0438\u043c\u043f\u0438\u0430\u0434',
  category: '\u0410\u043d\u0433\u0438\u043b\u0430\u043b',
  search: '\u0425\u0430\u0439\u043b\u0442',
  searchPh: '\u041d\u044d\u0440 \u044d\u0441\u0432\u044d\u043b \u0441\u0443\u0440\u0433\u0443\u0443\u043b\u044c...',
  emptyNone: '\u041e\u0434\u043e\u043e\u0433\u043e\u043e\u0440 \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434 \u0431\u04af\u0440\u0442\u0433\u044d\u0433\u0434\u044d\u044d\u0433\u04af\u0439 \u0431\u0430\u0439\u043d\u0430.',
  emptyCat: '\u042d\u043d\u044d \u0430\u043d\u0433\u0438\u043b\u0430\u043b\u0434 \u043e\u0440\u043e\u043b\u0446\u043e\u0433\u0447 \u0431\u0430\u0439\u0445\u0433\u04af\u0439 \u0431\u0430\u0439\u043d\u0430.',
  rank: '\u0411\u0430\u0439\u0440',
  contestant: '\u041e\u0440\u043e\u043b\u0446\u043e\u0433\u0447',
  org: '\u0421\u0443\u0440\u0433\u0443\u0443\u043b\u044c',
  points: '\u041e\u043d\u043e\u043e',
  total: '\u041d\u0438\u0439\u0442',
  catB: '\u0411\u0430\u0433\u0430',
  catD: '\u0414\u0443\u043d\u0434',
  catA: '\u0410\u0445\u043b\u0430\u0445',
  labelB: '\u0411\u0430\u0433\u0430 \u0430\u043d\u0433\u0438',
  labelD: '\u0414\u0443\u043d\u0434 \u0430\u043d\u0433\u0438',
  labelA: '\u0410\u0445\u043b\u0430\u0445 \u0430\u043d\u0433\u0438',
};

type CategoryKey = typeof STR.catB | typeof STR.catD | typeof STR.catA;

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: STR.catB, label: STR.labelB },
  { key: STR.catD, label: STR.labelD },
  { key: STR.catA, label: STR.labelA },
];

interface DisplayEntry {
  readonly rank: number;
  readonly name: string;
  readonly organization: string;
  readonly points: number;
  readonly penalty: number;
  readonly isTop3: boolean;
  readonly problemScores: Record<number, number>;
}

function toDisplayEntry(entry: ApiLeaderboardEntry): DisplayEntry {
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

export const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<CategoryKey>(STR.catB);
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [entries, setEntries] = useState<DisplayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [problemStats, setProblemStats] = useState<ApiProblemStat[]>([]);

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then((data: ApiResponse<Contest[]>) => {
        if (data.success && data.data && data.data.length > 0) {
          setContests(data.data);
          setSelectedContestId(data.data[0].id);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    if (!selectedContestId) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', category });
      if (searchTerm) params.set('search', searchTerm);

      const lbRes = await fetch(`/api/leaderboard/${selectedContestId}?${params}`);
      const lbData: ApiResponse<ApiLeaderboardEntry[]> = await lbRes.json();
      if (lbData.success && lbData.data) {
        setEntries(lbData.data.map(toDisplayEntry));
        setTotalCount(lbData.meta?.total ?? lbData.data.length);
      } else {
        setEntries([]);
        setTotalCount(0);
      }
    } catch {
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedContestId, category, searchTerm]);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedContestId, category, fetchLeaderboard]);

  useEffect(() => {
    if (!selectedContestId) return;
    fetch(`/api/leaderboard/${selectedContestId}/problems`)
      .then(res => res.json())
      .then((data: ApiResponse<ApiProblemStat[]>) => {
        if (data.success && data.data) {
          setProblemStats(data.data);
        } else {
          setProblemStats([]);
        }
      })
      .catch(() => setProblemStats([]));
  }, [selectedContestId]);

  const handleSearch = () => {
    fetchLeaderboard();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <SectionHeading
        title={STR.title}
        subtitle={STR.subtitle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="space-y-6 bg-[#F7F7F8] border border-[#E5E7EB]">
            {/* Olympiad selection */}
            {contests.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">
                  {STR.olympiad}
                </label>
                <div className="flex flex-col gap-2">
                  {contests.map(c => (
                    <button
                      key={c.id}
                      className={`text-left px-4 py-3 rounded-xl transition-all text-sm ${selectedContestId === c.id ? 'bg-[#EDAF00] text-[#111827] font-bold' : 'hover:bg-white text-slate-600 border border-transparent hover:border-[#E5E7EB]'}`}
                      onClick={() => setSelectedContestId(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">
                {STR.category}
              </label>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    className={`text-left px-4 py-3 rounded-xl transition-all ${category === cat.key ? 'bg-[#EDAF00] text-[#111827] font-bold' : 'hover:bg-white text-slate-600 border border-transparent hover:border-[#E5E7EB]'}`}
                    onClick={() => setCategory(cat.key)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
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
    </div>
  );
};
