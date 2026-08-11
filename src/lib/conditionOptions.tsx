import type { ReactNode } from 'react';
import { Waves, Wind } from 'lucide-react';

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

export const TyphoonIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12c0-3.5 2.2-5.5 5-5.5s4.2 1.8 4.2 3.8-2 3.2-4.2 3.2" />
    <path d="M12 12c0 3.5-2.2 5.5-5 5.5s-4.2-1.8-4.2-3.8 2-3.2 4.2-3.2" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const waveOptions: ConditionOption[] = [
  { id: 'knee', icon: <FlatWaveIcon size={26} />, label: 'Knee' },
  { id: 'waist', icon: <Waves size={28} />, label: 'Waist' },
  { id: 'head', icon: <BigWaveIcon size={30} />, label: 'Head' },
  { id: 'typhoon', icon: <TyphoonIcon size={28} />, label: 'Typhoon' },
];

export const windOptions: ConditionOption[] = [
  { id: 'onshore', icon: <Wind size={24} />, label: 'Onshore' },
  { id: 'sideshore-left', icon: <Wind size={24} className="rotate-90" />, label: 'Sideshore Left' },
  { id: 'sideshore-right', icon: <Wind size={24} className="-rotate-90" />, label: 'Sideshore Right' },
  { id: 'offshore', icon: <Wind size={24} className="rotate-180" />, label: 'Offshore' },
];

const BoardShape = ({ d, rect, width = 16 }: { d?: string; rect?: boolean; width?: number }) => (
  <svg
    width={width}
    height={width * 2}
    viewBox="0 0 24 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {rect ? <rect x="3" y="15" width="18" height="18" rx="4" /> : <path d={d} />}
  </svg>
);

export const boardOptions: ConditionOption[] = [
  { id: 'bodyboard', icon: <BoardShape rect width={15} />, label: 'Body' },
  {
    id: 'shortboard',
    icon: (
      <BoardShape
        width={13}
        d="M12 7 C14.5 7 16 11 16 15 L16 35 C16 38.5 14.5 40.5 12 41 C9.5 40.5 8 38.5 8 35 L8 15 C8 11 9.5 7 12 7 Z"
      />
    ),
    label: 'Short',
  },
  {
    id: 'midlength',
    icon: (
      <BoardShape
        width={15}
        d="M12 4 C15 4 17.5 8 17.5 12 L17.5 37 C17.5 41 15 43.5 12 44 C9 43.5 6.5 41 6.5 37 L6.5 12 C6.5 8 9 4 12 4 Z"
      />
    ),
    label: 'Mid',
  },
  {
    id: 'longboard',
    icon: (
      <BoardShape
        width={16}
        d="M12 1 C16 1 19 5 19 10 L19 39 C19 43.5 16 46.5 12 47 C8 46.5 5 43.5 5 39 L5 10 C5 5 8 1 12 1 Z"
      />
    ),
    label: 'Long',
  },
];

export function findOption(options: ConditionOption[], id: string): ConditionOption | undefined {
  return options.find(option => option.id === id);
}
