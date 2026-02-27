import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trophy, Medal, Loader2 } from 'lucide-react';
import { Card, SectionHeading, Badge } from '../components/UI';
import { ApiResponse, ApiLeaderboardEntry, ApiProblemStat, Contest } from '../types';

type CategoryKey = 'Бага' | 'Дунд' | 'Ахлах';

const CATEGORIES: { key: CategoryKey; label: string }[] = [
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
}

interface DisplayProblemStat {
  readonly title: string;
  readonly solvedCount: number;
  readonly maxPoints: number;
}

function toDisplayEntry(entry: ApiLeaderboardEntry): DisplayEntry {
  return {
    rank: Number(entry.rank),
    name: `${entry.last_name?.charAt(0)}.${entry.first_name}`,
    organization: entry.organization,
    points: entry.total_points,
    penalty: entry.penalty_minutes,
    isTop3: Number(entry.rank) <= 3,
  };
}

function toDisplayProblemStat(stat: ApiProblemStat): DisplayProblemStat {
  return { title: stat.title, solvedCount: stat.solved_count, maxPoints: stat.max_points };
}

export const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<CategoryKey>('Бага');
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [entries, setEntries] = useState<DisplayEntry[]>([]);
  const [problemStats, setProblemStats] = useState<DisplayProblemStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

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

      const [lbRes, statsRes] = await Promise.all([
        fetch(`/api/leaderboard/${selectedContestId}?${params}`),
        fetch(`/api/leaderboard/${selectedContestId}/problems`),
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
        setProblemStats(statsData.data.map(toDisplayProblemStat));
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

  const handleSearch = () => {
    fetchLeaderboard();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <SectionHeading
        title="Лидерүүдийн самбар"
        subtitle="Олимпиад сонгож, ангилал бүрийн шилдэг оролцогчдыг харна уу."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="space-y-6">
            {/* Олимпиад сонголт */}
            {contests.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Олимпиад</label>
                <div className="flex flex-col gap-2">
                  {contests.map(c => (
                    <button
                      key={c.id}
                      className={`text-left px-4 py-3 rounded-xl transition-all text-sm ${selectedContestId === c.id ? 'bg-purple-500 text-white font-bold' : 'hover:bg-white/5 text-slate-400'}`}
                      onClick={() => setSelectedContestId(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ангилал */}
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Ангилал</label>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    className={`text-left px-4 py-3 rounded-xl transition-all ${category === cat.key ? 'bg-cyan-500 text-white font-bold' : 'hover:bg-white/5 text-slate-400'}`}
                    onClick={() => setCategory(cat.key)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Хайлт */}
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Хайлт</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Нэр эсвэл сургууль..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
          </Card>

          {/* Бодлогын статистик */}
          {problemStats.length > 0 && (
            <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <Trophy size={18} className="text-yellow-500" />
                Бодлогын статистик
              </h4>
              <div className="space-y-4">
                {problemStats.map((p, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">{p.title}</span>
                    <Badge color="yellow">{p.solvedCount} бодсон</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </aside>

        {/* Хүснэгт */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin text-cyan-400" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20">
              <Trophy size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">
                {contests.length === 0
                  ? 'Одоогоор олимпиад бүртгэгдээгүй байна.'
                  : 'Энэ ангилалд оролцогч байхгүй байна.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl glass border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Байр</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Оролцогч</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Сургууль</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Оноо</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Хугацаа</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {entries.map((entry, i) => (
                      <tr
                        key={i}
                        className={`transition-colors hover:bg-white/5 ${entry.isTop3 ? 'bg-cyan-500/5' : ''}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {entry.rank === 1 && <Trophy size={20} className="text-yellow-500" />}
                            {entry.rank === 2 && <Medal size={20} className="text-slate-300" />}
                            {entry.rank === 3 && <Medal size={20} className="text-amber-600" />}
                            {entry.rank > 3 && <span className="w-5 text-center font-bold text-slate-500">{entry.rank}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-white">{entry.name}</td>
                        <td className="px-6 py-5 text-sm text-slate-400">{entry.organization}</td>
                        <td className="px-6 py-5">
                          <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg font-black">{entry.points}</span>
                        </td>
                        <td className="px-6 py-5 text-sm font-mono text-slate-500">{entry.penalty}м</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 text-center text-slate-500 text-sm">
                Нийт {totalCount} оролцогч &middot; {CATEGORIES.find(c => c.key === category)?.label}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
