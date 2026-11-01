import { taskScoreColor } from './scoreColor';

const W = 1080;
const PAD = 96;
const MARGIN = 48;
const CW_TRANSPARENT = W - PAD * 2 + MARGIN * 2;
const NAVY = '#1C2C45';
const FONT = '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", "Yu Gothic", sans-serif';

export const MAX_SHARE_TASKS = 6;
const MAX_MEMO_LINES = 4;

export interface ShareCardInput {
  date: string;
  location?: string;
  memo?: string;
  waveLabel: string;
  windLabel: string;
  boardLabel: string;
  overallScore: number;
  tasks: { title: string; score: number }[];
}

export interface ShareCardOptions {
  background: 'transparent' | 'cream';
  textColor: 'white' | 'navy';
}

type Ctx = CanvasRenderingContext2D;

const setFont = (ctx: Ctx, size: number, weight = 700) => {
  ctx.font = `${weight} ${size}px ${FONT}`;
};

const spacedWidth = (ctx: Ctx, text: string, spacing: number) => {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + spacing;
  return w - spacing;
};

const drawSpaced = (
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: 'left' | 'center' | 'right' = 'left'
) => {
  const total = spacedWidth(ctx, text, spacing);
  let cx = align === 'left' ? x : align === 'center' ? x - total / 2 : x - total;
  ctx.textAlign = 'left';
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
};

const fitText = (ctx: Ctx, text: string, maxWidth: number) => {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
  return `${t}…`;
};

const wrapText = (ctx: Ctx, text: string, maxWidth: number, maxLines: number) => {
  const lines: string[] = [];
  for (const para of text.split('\n')) {
    let cur = '';
    for (const ch of para) {
      if (ctx.measureText(cur + ch).width > maxWidth) {
        lines.push(cur);
        cur = ch;
      } else {
        cur += ch;
      }
    }
    lines.push(cur);
  }
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let last = lines[maxLines - 1];
    while (last.length > 0 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
};

const roundRect = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const layout = (ctx: Ctx, input: ShareCardInput, opts: ShareCardOptions, oy: number, draw: boolean) => {
  const cream = opts.background === 'cream';
  const ink = cream ? NAVY : opts.textColor === 'white' ? '#FFFFFF' : NAVY;
  const L = PAD;
  const R = W - PAD;
  const CW = R - L;
  let y = oy;

  const text = (color: string, alpha = 1) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.textBaseline = 'alphabetic';
  };

  y += 48;
  setFont(ctx, 48, 900);
  text(ink);
  if (draw) drawSpaced(ctx, 'SURFOCUS', L, y, 14);

  y += 64;
  setFont(ctx, 42, 600);
  text(ink, cream ? 0.75 : 0.95);
  if (draw) drawSpaced(ctx, input.date.replace(/-/g, '.'), L, y, 4);

  if (input.location) {
    y += 58;
    setFont(ctx, 40, 600);
    text(ink, cream ? 0.75 : 0.95);
    if (draw) {
      ctx.textAlign = 'left';
      ctx.fillText(fitText(ctx, input.location, CW), L, y);
    }
  }

  y += 90;
  const panelH = 500;
  if (draw && cream) {
    const grad = ctx.createLinearGradient(L, y, R, y + panelH);
    grad.addColorStop(0, '#FFF8EB');
    grad.addColorStop(1, '#FDECC8');
    roundRect(ctx, L, y, CW, panelH, 64);
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F5D896';
    ctx.stroke();
  }
  setFont(ctx, 40, 800);
  text(cream ? '#92400E' : ink);
  if (draw) drawSpaced(ctx, 'OVERALL STOKE', W / 2, y + 110, 8, 'center');

  const scoreText = String(input.overallScore);
  setFont(ctx, 340, 900);
  const wn = ctx.measureText(scoreText).width;
  setFont(ctx, 110, 600);
  const ws = ctx.measureText('/10').width;
  const startX = W / 2 - (wn + 12 + ws) / 2;
  if (draw) {
    setFont(ctx, 340, 900);
    text(cream ? '#D97706' : ink);
    ctx.textAlign = 'left';
    ctx.fillText(scoreText, startX, y + 410);
    setFont(ctx, 110, 600);
    text(cream ? '#94A3B8' : ink, cream ? 1 : 0.85);
    ctx.fillText('/10', startX + wn + 12, y + 410);
  }
  y += panelH + 70;

  const gap = 28;
  const pillW = (CW - gap * 2) / 3;
  const pillH = 120;
  [input.waveLabel, input.windLabel, input.boardLabel].forEach((label, i) => {
    const px = L + i * (pillW + gap);
    const upper = label.toUpperCase();
    let size = 38;
    setFont(ctx, size, 800);
    while (size > 24 && ctx.measureText(upper).width > pillW - 36) {
      size -= 2;
      setFont(ctx, size, 800);
    }
    if (!draw) return;
    roundRect(ctx, px, y, pillW, pillH, 44);
    ctx.globalAlpha = 1;
    if (cream) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#E5E8EC';
      ctx.stroke();
    } else {
      ctx.fillStyle = ink === '#FFFFFF' ? 'rgba(11,34,48,0.35)' : 'rgba(255,255,255,0.4)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = ink === '#FFFFFF' ? 'rgba(255,255,255,0.45)' : 'rgba(28,44,69,0.4)';
      ctx.stroke();
    }
    text(cream ? '#64748B' : ink);
    ctx.textAlign = 'center';
    ctx.fillText(fitText(ctx, upper, pillW - 24), px + pillW / 2, y + pillH / 2 + size * 0.35);
  });
  y += pillH + 80;

  const tasks = input.tasks.slice(0, MAX_SHARE_TASKS);
  if (tasks.length > 0) {
    y += 38;
    setFont(ctx, 38, 800);
    text(ink, cream ? 0.6 : 0.95);
    if (draw) drawSpaced(ctx, 'FOCUS TASKS', L, y, 8);
    y += 30;

    const barW = 240;
    const scoreW = 72;
    const barGap = 26;
    const titleMax = CW - barW - scoreW - barGap - 36;
    tasks.forEach(task => {
      y += 78;
      if (draw) {
        let titleSize = 58;
        setFont(ctx, titleSize, 900);
        while (titleSize > 40 && ctx.measureText(task.title).width > titleMax) {
          titleSize -= 2;
          setFont(ctx, titleSize, 900);
        }
        text(ink);
        ctx.textAlign = 'left';
        ctx.fillText(fitText(ctx, task.title, titleMax), L, y);

        const barX = R - scoreW - barGap - barW;
        const color = cream ? taskScoreColor(task.score) : ink;
        roundRect(ctx, barX, y - 30, barW, 24, 12);
        ctx.globalAlpha = cream ? 1 : 0.4;
        ctx.fillStyle = cream ? '#E8EBEF' : ink;
        ctx.fill();
        roundRect(ctx, barX, y - 30, Math.max(24, (barW * task.score) / 10), 24, 12);
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.fill();

        setFont(ctx, 58, 900);
        text(color);
        ctx.textAlign = 'right';
        ctx.fillText(String(task.score), R, y);
      }
      y += 28;
    });
  }

  if (input.memo) {
    y += 64;
    setFont(ctx, 38, 800);
    text(ink, cream ? 0.6 : 0.95);
    if (draw) drawSpaced(ctx, 'NOTES', L, y + 38, 8);
    y += 38 + 24;
    setFont(ctx, 46, 600);
    const lines = wrapText(ctx, input.memo, CW, MAX_MEMO_LINES);
    lines.forEach(line => {
      y += 70;
      if (draw) {
        text(cream ? '#334155' : ink);
        ctx.textAlign = 'left';
        ctx.fillText(line, L, y);
      }
    });
  }

  y += 80;
  setFont(ctx, 40, 700);
  text(ink, cream ? 0.55 : 0.85);
  if (draw) drawSpaced(ctx, 'surfocus.app', W / 2, y + 40, 8, 'center');
  y += 40;

  ctx.globalAlpha = 1;
  return y - oy;
};

export function renderShareCard(input: ShareCardInput, opts: ShareCardOptions): HTMLCanvasElement {
  const probe = document.createElement('canvas').getContext('2d')!;
  const contentH = layout(probe, input, opts, 0, false);
  const cream = opts.background === 'cream';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  if (cream) {
    canvas.width = W;
    canvas.height = Math.max(1920, contentH + PAD * 2);
    ctx.fillStyle = '#FAFAF8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    layout(ctx, input, opts, (canvas.height - contentH) / 2, true);
  } else {
    canvas.width = CW_TRANSPARENT;
    canvas.height = contentH + MARGIN * 2;
    ctx.translate(-(PAD - MARGIN), 0);
    ctx.shadowColor = opts.textColor === 'white' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.85)';
    ctx.shadowBlur = 28;
    layout(ctx, input, opts, MARGIN, true);
  }
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

export function canShareImageFile(): boolean {
  try {
    const probe = new File([''], 'probe.png', { type: 'image/png' });
    return typeof navigator.canShare === 'function' && navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

export function canCopyImage(): boolean {
  return typeof ClipboardItem !== 'undefined' && !!navigator.clipboard?.write;
}

export async function shareImage(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: 'image/png' });
  await navigator.share({ files: [file] });
}

export async function copyImage(blob: Blob): Promise<void> {
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
