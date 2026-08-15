import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, ChevronUp, Check, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import type { TaskDraft } from '../types';
import { TASK_COLOR_PALETTE } from '../lib/taskColors';
import { resolveTagStyle } from '../lib/tagColors';
import BottomNav from '../components/BottomNav';

interface TaskCatalogManagerProps {
  catalog: TaskDraft[];
  onBack: () => void;
  onAdd: (title: string, description: string, color: string, tag: string) => void;
  onEdit: (id: string, title: string, description: string, color: string, tag: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onViewHistory: (task: TaskDraft) => void;
  onOpenDashboard: () => void;
  onOpenToday: () => void;
  onOpenSettings: () => void;
}

const TagPill = ({ tag }: { tag: string }) => {
  const style = resolveTagStyle(tag);
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      #{tag}
    </span>
  );
};

const ColorSwatchPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => (
  <div className="flex flex-wrap gap-2" role="group" aria-label="課題の色を選択">
    {TASK_COLOR_PALETTE.map(color => (
      <button
        key={color}
        type="button"
        onClick={() => onChange(color)}
        aria-label={`色 ${color}${value === color ? '（選択中）' : ''}`}
        aria-pressed={value === color}
        className="w-9 h-9 rounded-full flex justify-center items-center transition-transform active:scale-90"
        style={{ backgroundColor: color, outline: value === color ? '2px solid #1C2C45' : 'none', outlineOffset: '2px' }}
      >
        {value === color && <Check size={16} className="text-white" />}
      </button>
    ))}
  </div>
);

interface TaskRowProps {
  task: TaskDraft;
  index: number;
  count: number;
  onEdit: (id: string, title: string, description: string, color: string, tag: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onViewHistory: (task: TaskDraft) => void;
}

const TaskRow = ({ task, index, count, onEdit, onDelete, onMove, onViewHistory }: TaskRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editColor, setEditColor] = useState(task.color ?? TASK_COLOR_PALETTE[0]);
  const [editTag, setEditTag] = useState(task.tag ?? '');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const startEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditColor(task.color ?? TASK_COLOR_PALETTE[0]);
    setEditTag(task.tag ?? '');
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onEdit(task.id, trimmed, editDescription.trim(), editColor, editTag.trim());
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
          placeholder="課題名"
          aria-label="課題名を編集"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
        />
        <input
          type="text"
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
          placeholder="メモ（任意）"
          aria-label="説明を編集"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
        />
        <input
          type="text"
          value={editTag}
          onChange={e => setEditTag(e.target.value)}
          placeholder="タグ（例：ターン系）任意"
          aria-label="タグを編集"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
        />
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">グラフでの色</p>
          <ColorSwatchPicker value={editColor} onChange={setEditColor} />
        </div>
        <div className="flex gap-3 pt-1">
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
        <span className="text-sm font-bold text-red-600">この課題を削除しますか？</span>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setIsConfirmingDelete(false)}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-white transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
          >
            削除する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3">
      <div className="flex flex-col gap-1 flex-shrink-0 pt-0.5">
        <button
          onClick={() => onMove(task.id, 'up')}
          disabled={index === 0}
          aria-label="上に移動"
          className="w-7 h-7 rounded-lg flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => onMove(task.id, 'down')}
          disabled={index === count - 1}
          aria-label="下に移動"
          className="w-7 h-7 rounded-lg flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <div
        className="w-3 h-3 rounded-full flex-shrink-0 mt-2"
        style={{ backgroundColor: task.color ?? TASK_COLOR_PALETTE[0] }}
        aria-hidden="true"
      />

      <button onClick={() => onViewHistory(task)} className="flex-1 min-w-0 text-left group">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-lg font-bold text-slate-900 group-hover:underline">{task.title}</h3>
          {task.tag && <TagPill tag={task.tag} />}
        </div>
        {task.description && <p className="text-base text-slate-500 leading-relaxed">{task.description}</p>}
      </button>

      <ChevronRight size={18} className="text-slate-300 flex-shrink-0 mt-3" aria-hidden="true" />

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={startEdit}
          aria-label={`${task.title}を編集`}
          className="w-9 h-9 rounded-full flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => setIsConfirmingDelete(true)}
          aria-label={`${task.title}を削除`}
          className="w-9 h-9 rounded-full flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

const TaskCatalogManager = ({
  catalog,
  onBack,
  onAdd,
  onEdit,
  onDelete,
  onMove,
  onViewHistory,
  onOpenDashboard,
  onOpenToday,
  onOpenSettings,
}: TaskCatalogManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newColor, setNewColor] = useState(TASK_COLOR_PALETTE[0]);
  const [newTag, setNewTag] = useState('');

  const confirmAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAdd(trimmed, newDescription.trim(), newColor, newTag.trim());
    setNewTitle('');
    setNewDescription('');
    setNewColor(TASK_COLOR_PALETTE[0]);
    setNewTag('');
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar relative">
          <header className="px-6 pt-4 pb-6 flex items-center justify-between sticky top-0 bg-[#FAFAF8]/90 backdrop-blur-md z-40">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              aria-label="戻る"
            >
              <ChevronLeft size={24} className="text-slate-900" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">Focus Tasks</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">課題を管理</p>
            </div>
            <div className="w-12 h-12" />
          </header>

          <main className="px-6 py-4 space-y-4">
            {catalog.length === 0 && !isAdding && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
                <p className="text-slate-500 font-medium">まだ課題がありません。追加してみましょう。</p>
              </div>
            )}

            {catalog.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                index={index}
                count={catalog.length}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                onViewHistory={onViewHistory}
              />
            ))}

            {isAdding ? (
              <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white shadow-sm space-y-3">
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="課題名（例：カットバック）"
                  aria-label="新しい課題名"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
                />
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="メモ（任意）"
                  aria-label="課題の説明"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
                />
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="タグ（例：ターン系）任意"
                  aria-label="新しい課題のタグ"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
                />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">グラフでの色</p>
                  <ColorSwatchPicker value={newColor} onChange={setNewColor} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewTitle('');
                      setNewDescription('');
                      setNewColor(TASK_COLOR_PALETTE[0]);
                      setNewTag('');
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
                新しい課題を追加
              </button>
            )}
          </main>
        </div>
        <BottomNav onDashboard={onOpenDashboard} onToday={onOpenToday} onSettings={onOpenSettings} />
    </div>
  );
};

export default TaskCatalogManager;
