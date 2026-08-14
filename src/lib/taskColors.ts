import type { TaskDraft } from '../types';

export const TASK_COLOR_PALETTE = [
  '#1C2C45', // navy
  '#2563EB', // blue
  '#0F766E', // teal
  '#16A34A', // green
  '#CA8A04', // olive gold
  '#DB2777', // pink
  '#7C3AED', // purple
  '#DC2626', // red
  '#EA580C', // orange
  '#64748B', // slate
];

const FALLBACK_CYCLE = ['#1C2C45', '#3A5075', '#5C749E', '#829BC8', '#A9BEDD'];

export function buildTaskColorMap(catalog: TaskDraft[]): Map<string, string> {
  const map = new Map<string, string>();
  catalog.forEach(task => {
    if (task.color) map.set(task.id, task.color);
  });
  return map;
}

export function resolveTaskColor(
  id: string,
  colorById: Map<string, string>,
  fallbackIndex: number
): string {
  return colorById.get(id) ?? FALLBACK_CYCLE[fallbackIndex % FALLBACK_CYCLE.length];
}
