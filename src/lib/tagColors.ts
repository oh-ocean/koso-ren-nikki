const TAG_STYLE_PALETTE = [
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#DCFCE7', text: '#166534' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#EDE9FE', text: '#5B21B6' },
  { bg: '#FFEDD5', text: '#9A3412' },
  { bg: '#E0E7FF', text: '#3730A3' },
  { bg: '#FEE2E2', text: '#991B1B' },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function resolveTagStyle(tag: string): { bg: string; text: string } {
  return TAG_STYLE_PALETTE[hashString(tag) % TAG_STYLE_PALETTE.length];
}
