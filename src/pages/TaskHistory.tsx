import { useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SessionRecord, TaskDraft } from '../types';
import { formatDateLong } from '../lib/date';
import { taskScoreColor } from '../lib/scoreColor';
import { TASK_COLOR_PALETTE } from '../lib/taskColors';

interface TaskHistoryProps {
  task: TaskDraft;
  sessions: SessionRecord[];
  onBack: () => void;
}

const TaskHistory = ({ task, sessions, onBack }: TaskHistoryProps) => {
  const color = task.color ?? TASK_COLOR_PALETTE[0];

  const entries = useMemo(() => {
    return sessions
      .flatMap(s => {
        const match = s.tasks.find(t => t.id === task.id);
        return match ? [{ date: s.date, score: match.score, memo: match.memo }] : [];
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [sessions, task.id]);

  const chartData = useMemo(
    () =>
      [...entries]
        .reverse()
        .slice(-12)
        .map(e => ({ name: `${e.date.slice(5, 7)}/${e.date.slice(8, 10)}`, score: e.score })),
    [entries]
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-[430px] h-[932px] max-h-full bg-[#FAFAF8] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-8 border-slate-900">
        <div className="h-12 w-full flex justify-between items-center px-6 text-sm font-medium pt-2 pb-1 text-slate-900 z-50 bg-[#FAFAF8]">
          <span>9:41</span>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded-full border border-slate-900 flex justify-center items-center">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar relative">
          <header className="px-6 pt-4 pb-6 flex items-center justify-between sticky top-0 bg-[#FAFAF8]/90 backdrop-blur-md z-40">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              aria-label="Focus Tasksに戻る"
            >
              <ChevronLeft size={24} className="text-slate-900" />
            </button>
            <div className="text-center flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">{task.title}</h1>
            </div>
            <div className="w-12 h-12" />
          </header>

          <main className="px-6 py-4 space-y-6">
            {entries.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
                <p className="text-slate-500 font-medium">この課題の記録はまだありません。</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Score History</h3>
                <div className="w-full h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }}
                        dy={8}
                      />
                      <YAxis
                        domain={[0, 10]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          fontWeight: 'bold',
                        }}
                      />
                      <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {entries.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">History</h3>
                {entries.map((entry, index) => (
                  <div
                    key={`${entry.date}-${index}`}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-500">{formatDateLong(entry.date)}</span>
                      <span className="text-lg font-black" style={{ color: taskScoreColor(entry.score) }}>
                        {entry.score}
                        <span className="text-sm text-slate-400 font-medium ml-0.5">/10</span>
                      </span>
                    </div>
                    {entry.memo && (
                      <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{entry.memo}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
