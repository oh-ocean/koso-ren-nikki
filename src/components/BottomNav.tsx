import type { ReactNode } from 'react';
import { Activity, Settings as SettingsIcon, Waves } from 'lucide-react';

export type BottomNavScreen = 'dashboard' | 'today' | 'settings';

interface BottomNavProps {
  current?: BottomNavScreen;
  onDashboard: () => void;
  onToday: () => void;
  onSettings: () => void;
}

const NavButton = ({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={active}
    aria-current={active ? 'page' : undefined}
    aria-label={active ? `${label}（現在の画面）` : label}
    className={`flex flex-col items-center gap-1 transition-colors disabled:cursor-default ${
      active ? 'text-[#1C2C45] font-bold' : 'text-slate-400 hover:text-slate-900'
    }`}
  >
    {icon}
    {active && <div className="w-1.5 h-1.5 rounded-full bg-[#1C2C45] mt-1"></div>}
  </button>
);

const BottomNav = ({ current, onDashboard, onToday, onSettings }: BottomNavProps) => (
  <div
    className="absolute bottom-0 left-0 right-0 bg-[#FAFAF8]/95 backdrop-blur-md border-t border-slate-200 px-6 pt-4 z-30"
    style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
  >
    <div className="flex justify-around items-center">
      <NavButton active={current === 'dashboard'} icon={<Activity size={28} />} label="Dashboard" onClick={onDashboard} />
      <NavButton active={current === 'today'} icon={<Waves size={32} />} label="Today's Session" onClick={onToday} />
      <NavButton active={current === 'settings'} icon={<SettingsIcon size={28} />} label="設定" onClick={onSettings} />
    </div>
  </div>
);

export default BottomNav;
