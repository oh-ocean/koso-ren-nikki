import { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Target,
  Upload,
  Waves,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import type { BoardDraft, Goal, SessionRecord, TaskDraft } from '../types';

const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdDA1UAUgs4Q5ohRUZglWl12AdaCAV_bU41ebHVCj-X3yIzTQ/viewform?usp=dialog';

export interface ImportPayload {
  sessions?: SessionRecord[];
  taskCatalog?: TaskDraft[];
  boardCatalog?: BoardDraft[];
  goals?: Goal[];
}

interface SettingsProps {
  onBack: () => void;
  onOpenGoals: () => void;
  onOpenTaskManager: () => void;
  onOpenBoardManager: () => void;
  onExport: () => void;
  onImport: (payload: ImportPayload) => void;
  onOpenDashboard: () => void;
  onOpenToday: () => void;
}

const SettingsRow = ({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow text-left"
  >
    <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#1C2C45] flex justify-center items-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-bold text-slate-900">{label}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <ChevronRight size={20} className="text-slate-300 flex-shrink-0" />
  </button>
);

const Settings = ({
  onBack,
  onOpenGoals,
  onOpenTaskManager,
  onOpenBoardManager,
  onExport,
  onImport,
  onOpenDashboard,
  onOpenToday,
}: SettingsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<ImportPayload | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportError(null);
    setImportPreview(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const payload: ImportPayload = {};
        if (Array.isArray(parsed)) {
          payload.sessions = parsed;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.sessions)) payload.sessions = parsed.sessions;
          if (Array.isArray(parsed.taskCatalog)) payload.taskCatalog = parsed.taskCatalog;
          if (Array.isArray(parsed.boardCatalog)) payload.boardCatalog = parsed.boardCatalog;
          if (Array.isArray(parsed.goals)) payload.goals = parsed.goals;
        }
        if (Object.keys(payload).length === 0) {
          setImportError('バックアップファイルの形式が正しくないようです。');
          return;
        }
        setImportPreview(payload);
      } catch {
        setImportError('ファイルを読み込めませんでした。JSON形式のバックアップファイルを選択してください。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <div className="flex-1 min-h-0 overflow-y-auto pb-32 no-scrollbar relative">
          <header className="px-6 pt-4 pb-6 flex items-center justify-between sticky top-0 bg-[#FAFAF8]/90 backdrop-blur-md z-40">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              aria-label="Dashboardに戻る"
            >
              <ChevronLeft size={24} className="text-slate-900" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">Settings</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">管理・データ</p>
            </div>
            <div className="w-12 h-12" />
          </header>

          <main className="px-6 py-4 space-y-4">
            <SettingsRow
              icon={<Target size={22} />}
              label="大目標を管理"
              description="目標の追加・編集・ピン留め"
              onClick={onOpenGoals}
            />
            <SettingsRow
              icon={<ListChecks size={22} />}
              label="Focus Tasksを管理"
              description="課題の追加・削除・並び替え"
              onClick={onOpenTaskManager}
            />
            <SettingsRow
              icon={<Waves size={22} />}
              label="ボードを管理"
              description="マイボードの追加・編集・並び替え"
              onClick={onOpenBoardManager}
            />
            <SettingsRow
              icon={<Download size={22} />}
              label="データをエクスポート"
              description="記録・ボード・課題・目標をJSONファイルとして保存"
              onClick={onExport}
            />
            <SettingsRow
              icon={<Upload size={22} />}
              label="データをインポート"
              description="バックアップファイル(JSON)から復元・機種変更時に利用"
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleFileSelect}
            />

            {importError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-sm font-bold text-red-600">{importError}</p>
              </div>
            )}

            {importPreview && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
                <p className="text-sm font-bold text-amber-800">
                  以下の内容をインポートします。ファイルに含まれていない項目は変更されません。
                </p>
                <ul className="text-sm text-amber-700 space-y-1">
                  {importPreview.sessions && <li>・セッション記録: {importPreview.sessions.length}件</li>}
                  {importPreview.taskCatalog && <li>・Focus Tasks: {importPreview.taskCatalog.length}件</li>}
                  {importPreview.boardCatalog && <li>・ボード: {importPreview.boardCatalog.length}件</li>}
                  {importPreview.goals && <li>・大目標: {importPreview.goals.length}件</li>}
                </ul>
                <p className="text-xs text-amber-600">対象データは現在の内容を上書きします。この操作は元に戻せません。</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setImportPreview(null)}
                    className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-white transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {
                      onImport(importPreview);
                      setImportPreview(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors"
                  >
                    インポートする
                  </button>
                </div>
              </div>
            )}

            <SettingsRow
              icon={<MessageSquareText size={22} />}
              label="フィードバックを送る"
              description="ご意見・ご要望をお聞かせください（Googleフォーム）"
              onClick={() => window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer')}
            />
            <SettingsRow
              icon={<ShieldCheck size={22} />}
              label="プライバシーについて"
              description="データの取り扱いに関するご案内"
              onClick={() => {
                window.location.href = '/privacy.html';
              }}
            />
          </main>
        </div>
        <BottomNav current="settings" onDashboard={onOpenDashboard} onToday={onOpenToday} onSettings={() => {}} />
    </div>
  );
};

export default Settings;
