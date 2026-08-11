import { useState } from 'react';
import { X, MapPin, Calendar, CheckCircle2, Edit3, Sun } from 'lucide-react';
import type { SessionDraft, TaskResult } from '../types';
import { formatDateShort } from '../lib/date';
import { taskScoreColor, stokeScoreColor, TASK_FROM_HEX, STOKE_FROM_HEX } from '../lib/scoreColor';

interface ScoreSliderProps {
  title: string;
  taskName?: string;
  value: number;
  onChange: (value: number) => void;
  colorScheme?: 'task' | 'stoke';
}

const ScoreSlider = ({ title, taskName, value, onChange, colorScheme = 'task' }: ScoreSliderProps) => {
  const min = 1;
  const max = 10;
  const percentage = ((value - min) / (max - min)) * 100;

  const currentColor = colorScheme === 'stoke' ? stokeScoreColor(value) : taskScoreColor(value);
  const gradientFrom = colorScheme === 'stoke' ? STOKE_FROM_HEX : TASK_FROM_HEX;

  const thumbOffsetCalc = `calc(${percentage}% - (${percentage} * 56px / 100))`;

  return (
    <div className="mb-14">
      <div className="flex justify-between items-end mb-6">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
          {taskName && <p className="text-lg text-slate-500 font-medium leading-snug">{taskName}</p>}
        </div>
        <div
          className="text-4xl font-black tracking-tighter flex-shrink-0 transition-colors duration-200"
          style={{ color: currentColor }}
        >
          {value}
          <span className="text-lg text-slate-400 font-medium ml-0.5 tracking-normal">/10</span>
        </div>
      </div>

      <div className="relative h-16 w-full flex items-center group" style={{ touchAction: 'none' }}>
        <div className="absolute inset-x-0 h-12 bg-[#E2E8F0] rounded-full shadow-inner top-1/2 -translate-y-1/2" />

        <div
          className="absolute left-0 h-12 rounded-full transition-all duration-100 ease-out top-1/2 -translate-y-1/2 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]"
          style={{
            width: `calc(${percentage}% - (${percentage} * 56px / 100) + 28px)`,
            background: `linear-gradient(to right, ${gradientFrom}, ${currentColor})`,
          }}
        />

        <div
          className="absolute h-[56px] w-[56px] bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] border-[4px] flex justify-center items-center text-xl font-black z-10 transition-all duration-100 ease-out pointer-events-none group-active:scale-110"
          style={{
            left: thumbOffsetCalc,
            borderColor: currentColor,
            color: currentColor,
          }}
        >
          {value}
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 focus:outline-none"
          aria-label={`${title} score`}
        />
      </div>

      <div className="flex justify-between mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest px-2">
        <span>Needs Work</span>
        <span>Epic</span>
      </div>
    </div>
  );
};

interface SessionReviewProps {
  draft: SessionDraft;
  onSave: (result: { tasks: TaskResult[]; overallScore: number; memo: string }) => void;
  onBack: () => void;
  initialTaskScores?: Record<string, number>;
  initialTaskMemos?: Record<string, string>;
  initialOverallScore?: number;
  initialMemo?: string;
  isEditing?: boolean;
}

const SessionReview = ({
  draft,
  onSave,
  onBack,
  initialTaskScores,
  initialTaskMemos,
  initialOverallScore,
  initialMemo,
  isEditing = false,
}: SessionReviewProps) => {
  const [taskScores, setTaskScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(draft.tasks.map(task => [task.id, initialTaskScores?.[task.id] ?? 5]))
  );
  const [taskMemos, setTaskMemos] = useState<Record<string, string>>(() =>
    Object.fromEntries(draft.tasks.map(task => [task.id, initialTaskMemos?.[task.id] ?? '']))
  );
  const [overallScore, setOverallScore] = useState(initialOverallScore ?? 7);
  const [memo, setMemo] = useState(initialMemo ?? '');

  const location = draft.location;

  const setTaskScore = (taskId: string, value: number) => {
    setTaskScores(prev => ({ ...prev, [taskId]: value }));
  };

  const setTaskMemo = (taskId: string, value: string) => {
    setTaskMemos(prev => ({ ...prev, [taskId]: value }));
  };

  const handleSave = () => {
    const tasks: TaskResult[] = draft.tasks.map(task => ({
      id: task.id,
      name: task.title,
      score: taskScores[task.id] ?? 5,
      memo: taskMemos[task.id]?.trim() || undefined,
    }));
    onSave({ tasks, overallScore, memo });
  };

  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <div className="flex-1 overflow-y-auto pb-36 no-scrollbar relative">
          <header className="px-6 pt-4 pb-8 flex items-center justify-between sticky top-0 bg-[#FAFAF8]/90 backdrop-blur-md z-40">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              aria-label="Close review"
            >
              <X size={24} className="text-slate-900" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">Session Review</h1>
              <p className="text-sm font-medium text-slate-500 flex items-center justify-center mt-1">
                <MapPin size={14} className="mr-1" />
                {location}
                <span className="mx-1.5 text-slate-300">•</span>
                {formatDateShort(draft.date)}
              </p>
            </div>
            <div className="w-12 h-12 flex justify-center items-center text-[#1C2C45]">
              <Calendar size={24} />
            </div>
          </header>

          <main className="px-6 py-4 space-y-2">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-[#1C2C45] text-white rounded-full flex justify-center items-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Great Session!</h2>
              <p className="text-lg text-slate-500 font-medium">How did you do today?</p>
            </div>

            {draft.tasks.length > 0 && (
              <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6">
                {draft.tasks.map((task, index) => (
                  <div key={task.id}>
                    <ScoreSlider
                      title={`Focus Task ${draft.tasks.length > 1 ? index + 1 : ''}`.trim()}
                      taskName={task.title}
                      value={taskScores[task.id] ?? 5}
                      onChange={value => setTaskScore(task.id, value)}
                      colorScheme="task"
                    />
                    <textarea
                      value={taskMemos[task.id] ?? ''}
                      onChange={e => setTaskMemo(task.id, e.target.value)}
                      placeholder={`${task.title}のメモ（任意）・次回に向けて`}
                      rows={2}
                      className="w-full mb-4 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30 transition-all resize-none"
                    />
                    {index < draft.tasks.length - 1 && <div className="w-full h-px bg-slate-100 mb-10"></div>}
                  </div>
                ))}
              </section>
            )}

            <section className="bg-gradient-to-br from-[#FFF8EB] to-[#FDECC8] p-6 rounded-[2rem] shadow-sm border border-[#F5D896] mb-8">
              <div className="flex items-center gap-2 mb-1">
                <Sun size={18} className="text-[#92400E]" />
                <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">Today's Stoke</span>
              </div>
              <ScoreSlider
                title="Overall Stoke"
                taskName="今日は楽しめた？"
                value={overallScore}
                onChange={setOverallScore}
                colorScheme="stoke"
              />
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4 px-2">
                <Edit3 size={20} className="text-[#1C2C45] mr-2" />
                <h3 className="text-xl font-bold text-slate-900">Notes</h3>
              </div>
              <textarea
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder="波のコンディション、気づき、次回の課題など..."
                className="w-full min-h-[160px] bg-white border border-slate-200 rounded-[2rem] p-6 text-lg text-slate-800 font-medium leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30 transition-all shadow-sm resize-none"
              />
            </section>
          </main>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent pt-12 pb-8 z-30">
          <button
            onClick={handleSave}
            className="w-full bg-[#1C2C45] text-white font-bold text-xl h-[72px] rounded-[2rem] shadow-[0_12px_30px_-10px_rgba(28,44,69,0.5)] flex justify-center items-center hover:bg-[#2A4062] transition-colors active:scale-[0.98] transform"
          >
            {isEditing ? 'UPDATE SESSION' : 'SAVE SESSION'}
          </button>
        </div>
    </div>
  );
};

export default SessionReview;
