import type { ReactNode } from 'react';
import { Wind } from 'lucide-react';

export interface ConditionOption {
  id: string;
  icon: ReactNode;
  label: string;
}

export const FlatWaveIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12c1.8.5 3.7.5 5.5 0s3.7-.5 5.5 0 3.7.5 5.5 0 3.7-.5 5.5 0" />
  </svg>
);

export const BigWaveIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 19c1.7-8 3.8-12 6-12s2.7 9.5 5 9.5 2.7-11 5-11 2.7 8.5 5.5 8.5" />
  </svg>
);

export const WAVE_LEVEL_COUNT = 6;

export const WaveSizeIcon = ({ level, size }: { level: number; size?: number }) => {
  const clamped = Math.max(0, Math.min(WAVE_LEVEL_COUNT - 1, level));
  const resolvedSize = size ?? 24 + clamped * 9;
  return clamped === 0 ? <FlatWaveIcon size={resolvedSize} /> : <BigWaveIcon size={resolvedSize} />;
};

export const waveOptions: ConditionOption[] = [
  { id: 'flat', icon: <WaveSizeIcon level={0} />, label: 'フラット〜すね' },
  { id: 'knee', icon: <WaveSizeIcon level={1} />, label: 'ヒザ〜もも' },
  { id: 'waist', icon: <WaveSizeIcon level={2} />, label: '腰〜はら' },
  { id: 'chest', icon: <WaveSizeIcon level={3} />, label: 'むね〜かた' },
  { id: 'head', icon: <WaveSizeIcon level={4} />, label: 'アタマ〜アタマ半' },
  { id: 'double', icon: <WaveSizeIcon level={5} />, label: 'ダブル以上' },
];

export const windOptions: ConditionOption[] = [
  { id: 'onshore', icon: <Wind size={24} />, label: 'Onshore' },
  { id: 'sideshore-left', icon: <Wind size={24} className="rotate-90" />, label: 'Sideshore Left' },
  { id: 'sideshore-right', icon: <Wind size={24} className="-rotate-90" />, label: 'Sideshore Right' },
  { id: 'offshore', icon: <Wind size={24} className="rotate-180" />, label: 'Offshore' },
];

export function findOption(options: ConditionOption[], id: string): ConditionOption | undefined {
  return options.find(option => option.id === id);
}
