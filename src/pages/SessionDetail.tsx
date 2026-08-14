import { useState } from 'react';
import { ChevronLeft, Edit3, Link2, MapPin, Pencil, PlusCircle, Sun, Trash2 } from 'lucide-react';
import type { BoardDraft, SessionRecord, TaskDraft } from '../types';
import { waveOptions, windOptions, findOption } from '../lib/conditionOptions';
import { formatDateLong } from '../lib/date';
import { taskScoreColor, stokeScoreColor } from '../lib/scoreColor';

interface SessionDetailProps {
  date: string;
  sessions: SessionRecord[];
  boardCatalog: BoardDraft[];
  taskCatalog: TaskDraft[];
  onBack: () => void;
  onLogAnother: () => void;
  onEdit: (session: SessionRecord) => void;
  onDelete: (sessionId: string) => void;
}

const ConditionPill = ({ icon, label }: { icon?: React.ReactNode; label: string }) => (
  <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-100 min-h-[84px]">
    {icon && <div className="text-[#1C2C45]">{icon}</div>}
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center break-words">{label}</span>
  </div>
);

interface SessionCardProps {
  session: SessionRecord;
  boardCatalog: BoardDraft[];
  taskCatalog: TaskDraft[];
  onEdit: (session: SessionRecord) => void;
  onDelete: (sessionId: string) => void;
}

const SessionCard = ({ session, boardCatalog, taskCatalog, onEdit, onDelete }: SessionCardProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const wave = findOption(waveOptions, session.condition.wave);
  const wind = findOption(windOptions, session.condition.wind);
  const board = boardCatalog.find(b => b.id === session.condition.board);

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-start justify-between gap-3">
        {session.location ? (
          <div className="flex items-center gap-1.5 text-slate-500 min-w-0">
            <MapPin size={16} className="flex-shrink-0" />
            <span className="text-sm font-bold truncate">{session.location}</span>
          </div>
        ) : (
          <div />
        )}

        {!isConfirmingDelete && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(session)}
              aria-label="このセッションを編集"
              className="w-9 h-9 rounded-full flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setIsConfirmingDelete(true)}
              aria-label="このセッションを削除"
              className="w-9 h-9 rounded-full flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {isConfirmingDelete && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-red-600">この記録を削除しますか？元に戻せません。</span>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setIsConfirmingDelete(false)}
              className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-white transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={() => onDelete(session.id)}
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
            >
              削除する
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <ConditionPill icon={wave?.icon} label={wave?.label ?? session.condition.wave} />
        <ConditionPill icon={wind?.icon} label={wind?.label ?? session.condition.wind} />
        <ConditionPill label={board?.name ?? session.condition.board} />
      </div>

      <div className="flex items-center justify-center gap-3 py-4 px-4 rounded-2xl bg-gradient-to-br from-[#FFF8EB] to-[#FDECC8] border border-[#F5D896]">
        <Sun size={16} className="text-[#92400E]" />
        <span className="text-sm font-bold text-[#92400E] uppercase tracking-wider">Overall Stoke</span>
        <span
          className="text-4xl font-black tracking-tighter"
          style={{ color: stokeScoreColor(session.overallScore) }}
        >
          {session.overallScore}
          <span className="text-base text-slate-400 font-medium ml-0.5 tracking-normal">/10</span>
        </span>
      </div>

      {session.tasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Focus Tasks</h3>
          {session.tasks.map(task => (
            <div key={task.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-bold text-slate-900">
                  {taskCatalog.find(t => t.id === task.id)?.title ?? task.name}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(task.score / 10) * 100}%`, backgroundColor: taskScoreColor(task.score) }}
                    />
                  </div>
                  <span className="text-sm font-bold w-8 text-right" style={{ color: taskScoreColor(task.score) }}>
                    {task.score}
                  </span>
                </div>
              </div>
              {task.memo && <p className="text-sm text-slate-500 leading-relaxed">{task.memo}</p>}
              {task.videoUrl && (
                <a
                  href={task.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1C2C45] hover:underline"
                >
                  <Link2 size={14} />
                  動画・写真を見る
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {session.memo && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-[#1C2C45]" />
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Notes</h3>
          </div>
          <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{session.memo}</p>
        </div>
      )}
    </div>
  );
};

const SessionDetail = ({
  date,
  sessions,
  boardCatalog,
  taskCatalog,
  onBack,
  onLogAnother,
  onEdit,
  onDelete,
}: SessionDetailProps) => {
  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar relative">
          <header className="px-6 pt-4 pb-6 flex items-center justify-between sticky top-0 bg-[#FAFAF8]/90 backdrop-blur-md z-40">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              aria-label="Back to dashboard"
            >
              <ChevronLeft size={24} className="text-slate-900" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">Session Detail</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">{formatDateLong(date)}</p>
            </div>
            <div className="w-12 h-12" />
          </header>

          <main className="px-6 py-4 space-y-6">
            {sessions.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center space-y-4">
                <p className="text-slate-500 font-medium">この日の記録はまだありません。</p>
                <button
                  onClick={onLogAnother}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1C2C45] text-white font-bold hover:bg-[#2A4062] transition-colors"
                >
                  <PlusCircle size={18} />
                  記録を追加する
                </button>
              </div>
            ) : (
              sessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  boardCatalog={boardCatalog}
                  taskCatalog={taskCatalog}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}

            {sessions.length > 0 && (
              <button
                onClick={onLogAnother}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-base flex justify-center items-center gap-2 hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <PlusCircle size={18} />
                この日にもう1本記録する
              </button>
            )}
          </main>
        </div>
    </div>
  );
};

export default SessionDetail;
