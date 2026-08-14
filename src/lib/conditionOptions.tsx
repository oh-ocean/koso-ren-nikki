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

export function findOption(options: ConditionOption[], id: string): ConditionOption | undefined {
  return options.find(option => option.id === id);
}
