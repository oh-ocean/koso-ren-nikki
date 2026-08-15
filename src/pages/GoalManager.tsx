import { useState } from 'react';
import { ChevronLeft, CheckCircle2, Pencil, Pin, PlusCircle, Target, Trash2 } from 'lucide-react';
import type { Goal } from '../types';
import BottomNav from '../components/BottomNav';

interface GoalManagerProps {
  goals: Goal[];
  onBack: () => void;
  onAdd: (title: string) => void;
  onEditTitle: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
  onToggleAchieved: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDashboard: () => void;
  onOpenToday: () => void;
  onOpenSettings: () => void;
}

interface GoalRowProps {
  goal: Goal;
  onEditTitle: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
  onToggleAchieved: (id: string) => void;
  onDelete: (id: string) => void;
}

const GoalRow = ({ goal, onEditTitle, onTogglePin, onToggleAchieved, onDelete }: GoalRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const startEdit = () => {
    setEditTitle(goal.title);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onEditTitle(goal.id, trimmed);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-5 rounded-2xl border-2 border-[#1C2C45] bg-white shadow-sm space-y-3">
        <input
          autoFocus
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          placeholder="目標"
          aria-label="目標を編集"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={saveEdit}
            disabled={!editTitle.trim()}
            className="flex-1 py-3 rounded-xl bg-[#1C2C45] text-white font-bold hover:bg-[#2A4062] transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            保存
          </button>
        </div>
      </div>
    );
  }

  if (isConfirmingDelete) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-red-600">この目標を削除しますか？</span>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setIsConfirmingDelete(false)}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-white transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
          >
            削除する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-5 rounded-2xl border-2 flex items-start gap-4 transition-colors ${
        goal.isPinned && !goal.isAchieved
          ? 'bg-[#1C2C45] border-[#1C2C45] text-white shadow-lg'
          : 'bg-white border-transparent text-slate-800 shadow-sm'
      }`}
    >
      <button
        onClick={() => onToggleAchieved(goal.id)}
        aria-label={goal.isAchieved ? '未達成に戻す' : '達成にする'}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex justify-center items-center ${
          goal.isAchieved
            ? 'border-emerald-400 bg-emerald-400'
            : goal.isPinned
              ? 'border-white/60'
              : 'border-slate-300'
        }`}
      >
        {goal.isAchieved && <CheckCircle2 size={20} className="text-white" />}
      </button>

      <p
        className={`flex-1 text-lg font-bold leading-snug break-words ${
          goal.isAchieved ? 'text-slate-400 line-through' : goal.isPinned ? 'text-white' : 'text-slate-900'
        }`}
      >
        {goal.title}
      </p>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {!goal.isAchieved && (
          <button
            onClick={() => onTogglePin(goal.id)}
            aria-label={goal.isPinned ? 'ピン留めを解除' : 'バナーにピン留め'}
            aria-pressed={goal.isPinned}
            className={`w-9 h-9 rounded-full flex justify-center items-center transition-colors ${
              goal.isPinned ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Pin size={15} fill={goal.isPinned ? 'currentColor' : 'none'} />
          </button>
        )}
        <button
          onClick={startEdit}
          aria-label="目標を編集"
          className={`w-9 h-9 rounded-full flex justify-center items-center transition-colors ${
            goal.isPinned && !goal.isAchieved
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => setIsConfirmingDelete(true)}
          aria-label="目標を削除"
          className={`w-9 h-9 rounded-full flex justify-center items-center transition-colors ${
            goal.isPinned && !goal.isAchieved
              ? 'bg-white/20 text-white hover:bg-red-400/40'
              : 'bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

const GoalManager = ({
  goals,
  onBack,
  onAdd,
  onEditTitle,
  onTogglePin,
  onToggleAchieved,
  onDelete,
  onOpenDashboard,
  onOpenToday,
  onOpenSettings,
}: GoalManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const activeGoals = goals.filter(g => !g.isAchieved);
  const achievedGoals = goals.filter(g => g.isAchieved);

  const confirmAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <div className="flex-1 min-h-0 overflow-y-auto pb-32 no-scrollbar relative">
          <header className="px-6 pt-4 pb-6 flex items-center justify-between sticky top-0 bg-[#FAFAF8]/90 backdrop-blur-md z-40">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              aria-label="Today's Sessionに戻る"
            >
              <ChevronLeft size={24} className="text-slate-900" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">Goals</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">大目標を管理</p>
            </div>
            <div className="w-12 h-12" />
          </header>

          <main className="px-6 py-4 space-y-8">
            <section className="space-y-4">
              {activeGoals.length === 0 && !isAdding && (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
                  <Target size={28} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 font-medium">
                    まだ目標がありません。
                    <br />
                    追加してピン留めするとバナーに表示されます。
                  </p>
                </div>
              )}

              {activeGoals.map(goal => (
                <GoalRow
                  key={goal.id}
                  goal={goal}
                  onEditTitle={onEditTitle}
                  onTogglePin={onTogglePin}
                  onToggleAchieved={onToggleAchieved}
                  onDelete={onDelete}
                />
              ))}

              {isAdding ? (
                <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white shadow-sm space-y-3">
                  <input
                    autoFocus
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="目標（例：バックサイドを安定させる）"
                    aria-label="新しい目標"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setNewTitle('');
                      }}
                      className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={confirmAdd}
                      disabled={!newTitle.trim()}
                      className="flex-1 py-3 rounded-xl bg-[#1C2C45] text-white font-bold hover:bg-[#2A4062] transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      追加する
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-lg flex justify-center items-center gap-2 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                >
                  <PlusCircle size={20} />
                  新しい目標を追加
                </button>
              )}
            </section>

            {achievedGoals.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">達成済み</h2>
                {achievedGoals.map(goal => (
                  <GoalRow
                    key={goal.id}
                    goal={goal}
                    onEditTitle={onEditTitle}
                    onTogglePin={onTogglePin}
                    onToggleAchieved={onToggleAchieved}
                    onDelete={onDelete}
                  />
                ))}
              </section>
            )}
          </main>
        </div>
        <BottomNav onDashboard={onOpenDashboard} onToday={onOpenToday} onSettings={onOpenSettings} />
    </div>
  );
};

export default GoalManager;
