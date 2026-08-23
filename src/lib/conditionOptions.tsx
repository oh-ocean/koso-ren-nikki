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

const WAVE_BASE_Y = 108;
const WAVE_SCALE_X = [0.38, 0.48, 0.6, 0.75, 0.92, 1.1];
const WAVE_SCALE_Y = [0.19, 0.36, 0.58, 1.06, 1.48, 1.9];

export const SURF_WAVE_PATH =
  'M0,0 C4,-25 14,-46 32,-55 C46,-62 62,-58 66,-46 C69,-37 63,-28 53,-30 C48,-31 47,-37 51,-40 C53,-42 55,-45 52,-47 C46,-51 36,-44 33,-32 C30,-20 34,-10 24,-4 C16,0 6,0 0,0 Z';

export const WaveBodyGauge = ({ level }: { level: number }) => {
  const clamped = Math.max(0, Math.min(WAVE_LEVEL_COUNT - 1, level));
  const scaleX = WAVE_SCALE_X[clamped];
  const scaleY = WAVE_SCALE_Y[clamped];
  const peakOffset = 62 * scaleY;

  return (
    <svg viewBox="0 -30 200 160" width="100%" height="130">
      <circle cx="150" cy="22" r="10" fill="#E2E8F0" />
      <rect x="139" y="34" width="22" height="48" rx="8" fill="#E2E8F0" />
      <line x1="140" y1="38" x2="130" y2="68" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
      <line x1="160" y1="38" x2="170" y2="68" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
      <rect x="141" y="82" width="7" height="34" rx="3.5" fill="#E2E8F0" />
      <rect x="152" y="82" width="7" height="34" rx="3.5" fill="#E2E8F0" />
      <line x1="110" y1="118" x2="190" y2="118" stroke="#BFDBFE" strokeWidth="2" />

      <g style={{ transform: `translateY(${WAVE_BASE_Y}px)`, transition: 'transform 300ms ease-out' }}>
        <line
          x1="46"
          y1={-peakOffset}
          x2="80"
          y2={-peakOffset}
          stroke="#BFDBFE"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <g
          style={{
            transform: `translate(20px, 0) scale(${scaleX}, ${scaleY})`,
            transition: 'transform 300ms ease-out',
          }}
        >
          <path d={SURF_WAVE_PATH} fill="#1C2C45" />
        </g>
      </g>
    </svg>
  );
};

export const waveOptions: ConditionOption[] = [
  { id: 'flat', icon: <WaveSizeIcon level={0} />, label: 'Flat–Shin' },
  { id: 'knee', icon: <WaveSizeIcon level={1} />, label: 'Knee–Thigh' },
  { id: 'waist', icon: <WaveSizeIcon level={2} />, label: 'Waist–Belly' },
  { id: 'chest', icon: <WaveSizeIcon level={3} />, label: 'Chest–Shoulder' },
  { id: 'head', icon: <WaveSizeIcon level={4} />, label: 'Head–Head+' },
  { id: 'double', icon: <WaveSizeIcon level={5} />, label: 'Double+' },
];

export const windOptions: ConditionOption[] = [
  { id: 'sideshore-left', icon: <Wind size={24} />, label: 'Side Shore Left' },
  { id: 'offshore', icon: <Wind size={24} className="-rotate-90" />, label: 'Off Shore' },
  { id: 'onshore', icon: <Wind size={24} className="rotate-90" />, label: 'On Shore' },
  { id: 'sideshore-right', icon: <Wind size={24} className="rotate-180" />, label: 'Side Shore Right' },
];

export function findOption(options: ConditionOption[], id: string): ConditionOption | undefined {
  return options.find(option => option.id === id);
}
