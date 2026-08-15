import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Pencil, PlusCircle, Star, Trash2 } from 'lucide-react';
import type { BoardDraft } from '../types';
import BottomNav from '../components/BottomNav';

interface BoardManagerProps {
  catalog: BoardDraft[];
  maxFavorites: number;
  onBack: () => void;
  onAdd: (name: string, description: string) => void;
  onEdit: (id: string, name: string, description: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onToggleFavorite: (id: string) => void;
  onOpenDashboard: () => void;
  onOpenToday: () => void;
  onOpenSettings: () => void;
}

interface BoardRowProps {
  board: BoardDraft;
  index: number;
  count: number;
  favoriteCount: number;
  maxFavorites: number;
  onEdit: (id: string, name: string, description: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onToggleFavorite: (id: string) => void;
}

const BoardRow = ({
  board,
  index,
  count,
  favoriteCount,
  maxFavorites,
  onEdit,
  onDelete,
  onMove,
  onToggleFavorite,
}: BoardRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(board.name);
  const [editDescription, setEditDescription] = useState(board.description);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const startEdit = () => {
    setEditName(board.name);
    setEditDescription(board.description);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    onEdit(board.id, trimmed, editDescription.trim());
    setIsEditing(false);
  };

  const favoriteDisabled = !board.isFavorite && favoriteCount >= maxFavorites;

  if (isEditing) {
    return (
      <div className="p-5 rounded-2xl border-2 border-[#1C2C45] bg-white shadow-sm space-y-3">
        <input
          autoFocus
          type="text"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="ボード名"
          aria-label="ボード名を編集"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
        />
        <input
          type="text"
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
          placeholder="サイズ・形状など（任意）"
          aria-label="説明を編集"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
        />
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={saveEdit}
            disabled={!editName.trim()}
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
        <span className="text-sm font-bold text-red-600">このボードを削除しますか？</span>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setIsConfirmingDelete(false)}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-white transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => onDelete(board.id)}
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
          onClick={() => onMove(board.id, 'up')}
          disabled={index === 0}
          aria-label="上に移動"
          className="w-7 h-7 rounded-lg flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => onMove(board.id, 'down')}
          disabled={index === count - 1}
          aria-label="下に移動"
          className="w-7 h-7 rounded-lg flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{board.name}</h3>
        {board.description && <p className="text-base text-slate-500 leading-relaxed">{board.description}</p>}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onToggleFavorite(board.id)}
          disabled={favoriteDisabled}
          aria-label={board.isFavorite ? 'ホーム画面の候補から外す' : 'ホーム画面の候補にする'}
          aria-pressed={board.isFavorite}
          className={`w-9 h-9 rounded-full flex justify-center items-center transition-colors disabled:opacity-30 disabled:pointer-events-none ${
            board.isFavorite ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Star size={15} fill={board.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={startEdit}
          aria-label={`${board.name}を編集`}
          className="w-9 h-9 rounded-full flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => setIsConfirmingDelete(true)}
          aria-label={`${board.name}を削除`}
          className="w-9 h-9 rounded-full flex justify-center items-center bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

const BoardManager = ({
  catalog,
  maxFavorites,
  onBack,
  onAdd,
  onEdit,
  onDelete,
  onMove,
  onToggleFavorite,
  onOpenDashboard,
  onOpenToday,
  onOpenSettings,
}: BoardManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const favoriteCount = catalog.filter(b => b.isFavorite).length;

  const confirmAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed, newDescription.trim());
    setNewName('');
    setNewDescription('');
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
            <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">Boards</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">マイボードを管理</p>
          </div>
          <div className="w-12 h-12" />
        </header>

        <main className="px-6 py-4 space-y-4">
          <div className="flex items-start gap-2 px-1 text-sm text-slate-500">
            <Star size={16} className="flex-shrink-0 mt-0.5 text-amber-400" fill="currentColor" />
            <p>
              星をつけたボード(最大{maxFavorites}枚)がToday's Sessionの選択肢に表示されます。今
              {favoriteCount}/{maxFavorites}枚選択中です。
            </p>
          </div>

          {catalog.length === 0 && !isAdding && (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
              <p className="text-slate-500 font-medium">まだボードがありません。追加してみましょう。</p>
            </div>
          )}

          {catalog.map((board, index) => (
            <BoardRow
              key={board.id}
              board={board}
              index={index}
              count={catalog.length}
              favoriteCount={favoriteCount}
              maxFavorites={maxFavorites}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onToggleFavorite={onToggleFavorite}
            />
          ))}

          {isAdding ? (
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white shadow-sm space-y-3">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="ボード名（例：6'2 Fish）"
                aria-label="新しいボード名"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
              />
              <input
                type="text"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="サイズ・形状など（任意）"
                aria-label="ボードの説明"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30"
              />
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewName('');
                    setNewDescription('');
                  }}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmAdd}
                  disabled={!newName.trim()}
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
              新しいボードを追加
            </button>
          )}
        </main>
      </div>
      <BottomNav onDashboard={onOpenDashboard} onToday={onOpenToday} onSettings={onOpenSettings} />
    </div>
  );
};

export default BoardManager;
