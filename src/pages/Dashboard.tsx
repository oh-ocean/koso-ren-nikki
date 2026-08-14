import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  PieChart as PieChartIcon,
  Settings as SettingsIcon,
  Sun,
  TrendingUp,
  Waves,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { SessionRecord, TaskDraft } from '../types';
import { isoDate } from '../lib/date';
import { STOKE_SOLID } from '../lib/scoreColor';
import { buildTaskColorMap, resolveTaskColor } from '../lib/taskColors';
import { resolveTagStyle } from '../lib/tagColors';

const COLORS = ['#1C2C45', '#3A5075', '#5C749E', '#829BC8', '#A9BEDD'];

interface CalendarProps {
  sessions: SessionRecord[];
  onSelectDate: (date: string) => void;
}

const Calendar = ({ sessions, onSelectDate }: CalendarProps) => {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const surfedDays = useMemo(() => {
    const set = new Set<number>();
    sessions.forEach(s => {
      const [y, m, d] = s.date.split('-').map(Number);
      if (y === year && m === month + 1) set.add(d);
    });
    return set;
  }, [sessions, year, month]);

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  const dates: (number | null)[] = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstWeekday + 1;
    return dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null;
  });

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCursor(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          aria-label="Previous month"
          className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-slate-50 text-slate-700 active:scale-95 transition-transform"
        >
          <ChevronLeft size={28} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{monthLabel}</h2>
        <button
          onClick={() => setCursor(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          aria-label="Next month"
          className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-slate-50 text-slate-700 active:scale-95 transition-transform"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
        {days.map((day, i) => (
          <div key={i} className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {dates.map((date, i) => {
          if (date === null) return <div key={i} className="h-12" />;

          const isSurfed = surfedDays.has(date);
          const isToday = isCurrentMonth && date === now.getDate();
          const iso = isoDate(year, month + 1, date);

          return (
            <button
              key={i}
              onClick={() => onSelectDate(iso)}
              aria-label={`${date}日${isSurfed ? '（記録あり）' : ''}`}
              className={`
                h-12 flex flex-col justify-center items-center rounded-2xl relative
                active:scale-90 transition-transform hover:bg-slate-50
                ${isToday ? 'bg-slate-100 text-slate-900' : 'text-slate-700'}
              `}
            >
              <span className={`text-lg font-medium ${isToday ? 'font-black' : ''}`}>{date}</span>
              {isSurfed && (
                <div className="absolute bottom-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1C2C45]"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
        <div className="w-2 h-2 rounded-full bg-[#1C2C45]"></div>
        <span>Surfed {surfedDays.size} days this month</span>
      </div>
    </div>
  );
};

interface DashboardProps {
  sessions: SessionRecord[];
  taskCatalog: TaskDraft[];
  onNavigateToday: () => void;
  onSelectDate: (date: string) => void;
  onOpenSettings: () => void;
}

const DashboardApp = ({ sessions, taskCatalog, onNavigateToday, onSelectDate, onOpenSettings }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<'stoke' | 'focus' | 'trend'>('stoke');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[] | null>(null);

  const tabs = [
    { id: 'stoke' as const, label: 'Stoke', icon: <Sun size={24} /> },
    { id: 'focus' as const, label: 'Focus', icon: <PieChartIcon size={24} /> },
    { id: 'trend' as const, label: 'Trend', icon: <TrendingUp size={24} /> },
  ];

  const colorById = useMemo(() => buildTaskColorMap(taskCatalog), [taskCatalog]);

  // Task display names live in the catalog, keyed by id; a task's title can
  // change (typo fixes, rewording) without losing continuity with past
  // records, which only ever store the id. Deleted tasks fall back to the
  // name last recorded for them.
  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    sessions.forEach(s => s.tasks.forEach(t => {
      if (!map.has(t.id)) map.set(t.id, t.name);
    }));
    taskCatalog.forEach(t => map.set(t.id, t.title));
    return map;
  }, [sessions, taskCatalog]);

  const chronological = useMemo(
    () => [...sessions].sort((a, b) => a.date.localeCompare(b.date)),
    [sessions]
  );

  const barChartData = useMemo(
    () =>
      chronological.slice(-8).map(s => ({
        name: `${s.date.slice(5, 7)}/${s.date.slice(8, 10)}`,
        score: s.overallScore,
      })),
    [chronological]
  );

  const pieChartData = useMemo(() => {
    const counts = new Map<string, number>();
    sessions.forEach(s => {
      s.tasks.forEach(t => {
        counts.set(t.id, (counts.get(t.id) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries()).map(([id, value]) => ({
      id,
      name: nameById.get(id) ?? id,
      value,
    }));
  }, [sessions, nameById]);

  const taskIdsByFrequency = useMemo(() => {
    const counts = new Map<string, number>();
    chronological.forEach(s => {
      s.tasks.forEach(t => counts.set(t.id, (counts.get(t.id) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);
  }, [chronological]);

  const activeTaskIds = selectedTaskIds ?? taskIdsByFrequency.slice(0, 3);

  const toggleTaskId = (id: string) => {
    const base = selectedTaskIds ?? taskIdsByFrequency.slice(0, 3);
    setSelectedTaskIds(base.includes(id) ? base.filter(i => i !== id) : [...base, id]);
  };

  const tags = useMemo(
    () => Array.from(new Set(taskCatalog.map(t => t.tag).filter((t): t is string => !!t))),
    [taskCatalog]
  );

  const taskIdsForTag = (tag: string) =>
    taskCatalog
      .filter(t => t.tag === tag)
      .map(t => t.id)
      .filter(id => taskIdsByFrequency.includes(id));

  const applyTagFilter = (tag: string) => {
    setSelectedTaskIds(taskIdsForTag(tag));
  };

  const trendData = useMemo(() => {
    const relevant = chronological.filter(s => s.tasks.some(t => activeTaskIds.includes(t.id)));
    return relevant.slice(-10).map(s => {
      const point: Record<string, string | number> = {
        name: `${s.date.slice(5, 7)}/${s.date.slice(8, 10)}`,
      };
      activeTaskIds.forEach(id => {
        const match = s.tasks.find(t => t.id === id);
        if (match) point[id] = match.score;
      });
      return point;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chronological, activeTaskIds.join('|')]);

  const hasData = sessions.length > 0;

  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <header className="px-6 pt-4 pb-6 flex flex-col justify-center items-center bg-[#FAFAF8] z-40">
          <h1 className="text-3xl font-black tracking-tight text-[#1C2C45]">Dashboard</h1>
          <p className="text-base font-medium text-slate-500 mt-1">Track your progress</p>
        </header>

        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar px-6 space-y-8">
          <Calendar sessions={sessions} onSelectDate={onSelectDate} />

          <section className="space-y-6">
            <div className="flex justify-between bg-slate-200/50 p-1.5 rounded-full">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  className={`
                    flex-1 flex flex-col items-center justify-center py-3 rounded-full transition-all duration-300
                    ${
                      activeTab === tab.id
                        ? 'bg-white text-[#1C2C45] shadow-[0_2px_10px_rgba(0,0,0,0.05)] font-bold'
                        : 'text-slate-400 font-medium hover:text-slate-600'
                    }
                  `}
                >
                  <div className="mb-1">{tab.icon}</div>
                  <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mt-2">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {activeTab === 'stoke' && 'Session Stoke'}
                  {activeTab === 'focus' && 'Practice Distribution'}
                  {activeTab === 'trend' && 'Focus Task Trend'}
                </h3>
                <p className="text-sm font-medium text-slate-400">
                  {activeTab === 'stoke' && 'How much you enjoyed it, most recent sessions'}
                  {activeTab === 'focus' && 'Where you spent your time'}
                  {activeTab === 'trend' && 'Score history per task, your call which to compare'}
                </p>
              </div>

              {hasData && activeTab === 'trend' && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => {
                    const ids = taskIdsForTag(tag);
                    if (ids.length === 0) return null;
                    const style = resolveTagStyle(tag);
                    const isActive =
                      ids.length === activeTaskIds.length && ids.every(id => activeTaskIds.includes(id));
                    return (
                      <button
                        key={tag}
                        onClick={() => applyTagFilter(tag)}
                        aria-pressed={isActive}
                        className="px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                        style={
                          isActive
                            ? { backgroundColor: style.text, color: 'white' }
                            : { backgroundColor: style.bg, color: style.text }
                        }
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              )}

              {hasData && activeTab === 'trend' && taskIdsByFrequency.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {taskIdsByFrequency.map((id, index) => {
                    const isSelected = activeTaskIds.includes(id);
                    const color = resolveTaskColor(id, colorById, index);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleTaskId(id)}
                        aria-pressed={isSelected}
                        className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? 'text-white border-transparent'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                        style={isSelected ? { backgroundColor: color } : undefined}
                      >
                        {nameById.get(id) ?? id}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="w-full h-[250px] min-h-[250px]">
                {!hasData && (
                  <div className="w-full h-full flex justify-center items-center text-center text-slate-400 font-medium px-8">
                    まだ記録がありません。セッションを保存するとここに表示されます。
                  </div>
                )}

                {hasData && activeTab === 'stoke' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 14, fontWeight: 'bold' }}
                        dy={10}
                      />
                      <YAxis
                        domain={[0, 10]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 14, fontWeight: 'bold' }}
                      />
                      <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontWeight: 'bold',
                        }}
                      />
                      <Bar dataKey="score" fill={STOKE_SOLID} radius={[6, 6, 0, 0]} fillOpacity={0.9} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {hasData && activeTab === 'focus' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={entry.id} fill={resolveTaskColor(entry.id, colorById, index)} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontWeight: 'bold',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {hasData && activeTab === 'trend' && taskIdsByFrequency.length === 0 && (
                  <div className="w-full h-full flex justify-center items-center text-center text-slate-400 font-medium px-8">
                    まだ課題のスコアがありません。
                  </div>
                )}

                {hasData && activeTab === 'trend' && taskIdsByFrequency.length > 0 && activeTaskIds.length === 0 && (
                  <div className="w-full h-full flex justify-center items-center text-center text-slate-400 font-medium px-8">
                    上のチップから比較したい課題を選んでください。
                  </div>
                )}

                {hasData && activeTab === 'trend' && activeTaskIds.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 14, fontWeight: 'bold' }}
                        dy={10}
                      />
                      <YAxis
                        domain={[0, 10]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 14, fontWeight: 'bold' }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontWeight: 'bold',
                        }}
                      />
                      {activeTaskIds.map((id, index) => (
                        <Line
                          key={id}
                          type="monotone"
                          dataKey={id}
                          name={nameById.get(id) ?? id}
                          stroke={resolveTaskColor(id, colorById, taskIdsByFrequency.indexOf(id))}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          connectNulls
                          isAnimationActive={index === 0}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {hasData && activeTab === 'focus' && (
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                  {pieChartData.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: resolveTaskColor(entry.id, colorById, index) }}
                      ></div>
                      <span className="text-sm font-bold text-slate-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 bg-[#FAFAF8]/95 backdrop-blur-md border-t border-slate-200 px-6 pt-4 z-30"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex justify-around items-center">
            <button
              disabled
              aria-current="page"
              aria-label="Dashboard（現在の画面）"
              className="flex flex-col items-center gap-1 text-[#1C2C45] font-bold disabled:cursor-default"
            >
              <Activity size={28} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1C2C45] mt-1"></div>
            </button>
            <button
              onClick={onNavigateToday}
              aria-label="新しいセッションを記録"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Waves size={32} />
            </button>
            <button
              onClick={onOpenSettings}
              aria-label="設定"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <SettingsIcon size={28} />
            </button>
          </div>
        </div>
    </div>
  );
};

export default DashboardApp;
