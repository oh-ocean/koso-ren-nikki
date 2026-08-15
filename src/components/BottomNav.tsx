import type { ReactNode } from 'react';
import { Activity, Settings as SettingsIcon, Waves } from 'lucide-react';

export type BottomNavScreen = 'dashboard' | 'today' | 'settings';

interface BottomNavProps {
  current?: BottomNavScreen;
  onDashboard: () => void;
  onToday: () => void;
  onSettings: () => void;
  /** When false, renders without its own fixed positioning so a parent can stack it with other bottom content. */
  standalone?: boolean;
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

const BottomNav = ({ current, onDashboard, onToday, onSettings, standalone = true }: BottomNavProps) => {
  const content = (
    <div
      className="bg-[#FAFAF8]/95 backdrop-blur-md border-t border-slate-200 px-6 pt-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-around items-center">
        <NavButton active={current === 'dashboard'} icon={<Activity size={28} />} label="Dashboard" onClick={onDashboard} />
        <NavButton active={current === 'today'} icon={<Waves size={32} />} label="Today's Session" onClick={onToday} />
        <NavButton active={current === 'settings'} icon={<SettingsIcon size={28} />} label="設定" onClick={onSettings} />
      </div>
    </div>
  );

  if (!standalone) return content;

  return <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-30">{content}</div>;
};

export default BottomNav;
