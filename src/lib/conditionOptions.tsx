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

const WAVE_MARKER_Y = [175, 140, 103, 60, 24, -16];
const WAVE_SCALE = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2];

const SURF_WAVE_PATH =
  'M0,0 C4,-25 14,-46 32,-55 C46,-62 62,-58 66,-46 C69,-37 63,-28 53,-30 C48,-31 47,-37 51,-40 C53,-42 55,-45 52,-47 C46,-51 36,-44 33,-32 C30,-20 34,-10 24,-4 C16,0 6,0 0,0 Z';

export const WaveBodyGauge = ({ level }: { level: number }) => {
  const clamped = Math.max(0, Math.min(WAVE_LEVEL_COUNT - 1, level));
  const markerY = WAVE_MARKER_Y[clamped];
  const scale = WAVE_SCALE[clamped];

  return (
    <svg viewBox="0 -100 150 300" width="100%" height="270">
      <circle cx="90" cy="28" r="16" fill="#E2E8F0" />
      <rect x="68" y="44" width="44" height="78" rx="20" fill="#E2E8F0" />
      <line x1="70" y1="52" x2="56" y2="112" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
      <line x1="110" y1="52" x2="124" y2="112" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
      <rect x="72" y="118" width="16" height="70" rx="8" fill="#E2E8F0" />
      <rect x="92" y="118" width="16" height="70" rx="8" fill="#E2E8F0" />
      <line x1="38" y1="190" x2="142" y2="190" stroke="#CBD5E1" strokeWidth="2" />
      <g style={{ transform: `translateY(${markerY}px)`, transition: 'transform 300ms ease-out' }}>
        <line x1="34" y1="0" x2="66" y2="0" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
        <g transform={`translate(20, 0) scale(${scale}, ${scale * 0.55})`}>
          <path d={SURF_WAVE_PATH} fill="#1C2C45" />
        </g>
      </g>
    </svg>
  );
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
