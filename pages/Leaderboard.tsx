
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Trophy, Star, Medal, Zap, Loader2 } from 'lucide-react';
import { MOCK_LEADERBOARD, PROBLEM_STATS } from '../constants';
import { Card, SectionHeading, Badge } from '../components/UI';
import { ApiResponse, ApiLeaderboardEntry, ApiProblemStat, Contest, LeaderboardEntry, ProblemStat } from '../types';

function toDisplayEntry(entry: ApiLeaderboardEntry, index: number): LeaderboardEntry {
  return {
    rank: Number(entry.rank),
    name: `${entry.last_name?.charAt(0)}.${entry.first_name}`,
    organization: entry.organization,
    points: entry.total_points,
    penalty: String(entry.penalty_minutes),
    location: '',
    isTop3: Number(entry.rank) <= 3,
  };
}

function toDisplayProblemStat(stat: ApiProblemStat): ProblemStat {
  return { title: stat.title, solvedCount: stat.solved_count };
}

export const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Бага анги');
  const [year, setYear] = useState('2025');
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [apiEntries, setApiEntries] = useState<LeaderboardEntry[] | null>(null);
  const [apiProblemStats, setApiProblemStats] = useState<ProblemStat[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then((data: ApiResponse<Contest[]>) => {
        if (data.success && data.data && data.data.length > 0) {
          setContests(data.data);
          setSelectedContestId(data.data[0].id);
        }
      })
      .catch(() => { /* fallback to mock data */ });
  }, []);

  const categoryMap: Record<string, string> = {
    'Бага анги': 'Бага',
    'Дунд анги': 'Дунд',
    'Ахлах анги': 'Ахлах',
  };

  const fetchLeaderboard = useCallback(async () => {
    if (!selectedContestId) return;
    setIsLoading(true);
    try {
      const catParam = categoryMap[category] ? `&category=${encodeURIComponent(categoryMap[category])}` : '';
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const res = await fetch(`/api/leaderboard/${selectedContestId}?limit=50${catParam}${searchParam}`);
      const data: ApiResponse<ApiLeaderboardEntry[]> = await res.json();
      if (data.success && data.data) {
        setApiEntries(data.data.map(toDisplayEntry));
      }

      const statsRes = await fetch(`/api/leaderboard/${selectedContestId}/problems`);
      const statsData: ApiResponse<ApiProblemStat[]> = await statsRes.json();
      if (statsData.success && statsData.data) {
        setApiProblemStats(statsData.data.map(toDisplayProblemStat));
      }
    } catch {
      /* fallback to mock data */
    } finally {
      setIsLoading(false);
    }
  }, [selectedContestId, category, searchTerm]);

  useEffect(() => {
    if (selectedContestId) {
      fetchLeaderboard();
    }
  }, [selectedContestId, category, fetchLeaderboard]);

  const displayData = apiEntries ?? MOCK_LEADERBOARD;
  const displayProblemStats = apiProblemStats ?? PROBLEM_STATS;

  const filteredData = apiEntries
    ? displayData
    : MOCK_LEADERBOARD.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <SectionHeading 
        title="Лидерүүдийн самбар" 
        subtitle="Өмнөх олимпиадын шилдэг оролцогчид ба тэдний үзүүлсэн амжилт." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Хайлт</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Нэр эсвэл сургууль..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Он</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="2024">CodeX[0]</option>
                <option value="2025">CodeX[1]</option>
                <option value="2025">CodeX[2]</option>
                <option value="2025">CodeX[3]</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Ангилал</label>
              <div className="flex flex-col gap-2">
                {['Бага анги', 'Дунд анги', 'Ахлах анги'].map(cat => (
                  <button
                    key={cat}
                    className={`text-left px-4 py-3 rounded-xl transition-all ${category === cat ? 'bg-cyan-500 text-white font-bold' : 'hover:bg-white/5 text-slate-400'}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Trophy size={18} className="text-yellow-500" />
              Шилдэг бодлого
            </h4>
            <div className="space-y-4">
              {displayProblemStats.map((p, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">{p.title}</span>
                  <Badge color="yellow">{p.solvedCount} бодсон</Badge>
                </div>
              ))}
            </div>
          </Card>
        </aside>

        {/* Main Table */}
        <div className="lg:col-span-3">
          <div className="overflow-x-auto rounded-2xl glass border border-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Байр</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Оролцогч</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Байгууллага</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Оноо</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Торгууль</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Байршил</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((entry) => (
                  <tr 
                    key={entry.rank} 
                    className={`transition-colors hover:bg-white/5 ${entry.isTop3 ? 'bg-cyan-500/5' : ''}`}
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        {entry.rank === 1 && <Trophy size={20} className="text-yellow-500" />}
                        {entry.rank === 2 && <Medal size={20} className="text-slate-300" />}
                        {entry.rank === 3 && <Medal size={20} className="text-amber-600" />}
                        {entry.rank > 3 && <span className="w-5 text-center font-bold text-slate-500">{entry.rank}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-white">{entry.name}</td>
                    <td className="px-6 py-6 text-sm text-slate-400">{entry.organization}</td>
                    <td className="px-6 py-6">
                      <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg font-black">{entry.points}</span>
                    </td>
                    <td className="px-6 py-6 text-sm font-mono text-slate-500">{entry.penalty}м</td>
                    <td className="px-6 py-6 text-sm text-slate-400">{entry.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center text-slate-500 text-sm">
            Нийт {filteredData.length} оролцогч харагдаж байна.
          </div>
        </div>
      </div>
    </div>
  );
};
