interface RGB {
  r: number;
  g: number;
  b: number;
}

// Task performance: cool navy -> coral. Used for Focus Task scores (skill/practice layer).
const TASK_FROM: RGB = { r: 28, g: 44, b: 69 }; // #1C2C45
const TASK_TO: RGB = { r: 255, g: 126, b: 103 }; // #FF7E67
export const TASK_FROM_HEX = '#1C2C45';

// Stoke/enjoyment: warm amber -> gold. Deliberately distinct from the task gradient
// so "did you enjoy today?" reads as a different layer from task performance.
const STOKE_FROM: RGB = { r: 146, g: 64, b: 14 }; // #92400E
const STOKE_TO: RGB = { r: 250, g: 204, b: 21 }; // #FACC15
export const STOKE_FROM_HEX = '#92400E';
export const STOKE_SOLID = '#D97706';

function interpolate(from: RGB, to: RGB, value: number, min = 1, max = 10): string {
  const percentage = ((value - min) / (max - min)) * 100;
  const r = Math.round(from.r + (to.r - from.r) * (percentage / 100));
  const g = Math.round(from.g + (to.g - from.g) * (percentage / 100));
  const b = Math.round(from.b + (to.b - from.b) * (percentage / 100));
  return `rgb(${r}, ${g}, ${b})`;
}

export function taskScoreColor(value: number): string {
  return interpolate(TASK_FROM, TASK_TO, value);
}

export function stokeScoreColor(value: number): string {
  return interpolate(STOKE_FROM, STOKE_TO, value);
}
