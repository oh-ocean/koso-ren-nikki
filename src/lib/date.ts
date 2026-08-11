export function todayISODate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];

export function formatDateShort(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  const weekday = WEEKDAYS_JA[new Date(iso).getDay()];
  return `${m}月${d}日(${weekday})`;
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const weekday = WEEKDAYS_JA[new Date(iso).getDay()];
  return `${y}年${m}月${d}日(${weekday})`;
}
