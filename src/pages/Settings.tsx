import { ChevronLeft, ChevronRight, Download, ListChecks, Target, Waves } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface SettingsProps {
  onBack: () => void;
  onOpenGoals: () => void;
  onOpenTaskManager: () => void;
  onOpenBoardManager: () => void;
  onExport: () => void;
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
  onOpenDashboard,
  onOpenToday,
}: SettingsProps) => {
  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar relative">
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
          </main>
        </div>
        <BottomNav current="settings" onDashboard={onOpenDashboard} onToday={onOpenToday} onSettings={() => {}} />
    </div>
  );
};

export default Settings;
