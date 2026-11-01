import { useMemo, useState } from 'react';
import { Copy, Download, Share2, X } from 'lucide-react';
import type { BoardDraft, SessionRecord, TaskDraft } from '../types';
import { waveOptions, windOptions, findOption } from '../lib/conditionOptions';
import {
  canCopyImage,
  canShareImageFile,
  canvasToBlob,
  copyImage,
  downloadImage,
  renderShareCard,
  shareImage,
} from '../lib/shareCard';
import type { ShareCardOptions } from '../lib/shareCard';

interface ShareCardSheetProps {
  session: SessionRecord;
  boardCatalog: BoardDraft[];
  taskCatalog: TaskDraft[];
  onClose: () => void;
}

const PLACEHOLDER_LOCATION = 'Enter surf point';

interface SegmentedProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

const Segmented = <T extends string>({ value, options, onChange, ariaLabel }: SegmentedProps<T>) => (
  <div role="group" aria-label={ariaLabel} className="flex bg-slate-100 rounded-xl p-1 gap-1">
    {options.map(option => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
          value === option.value ? 'bg-white text-[#1C2C45] shadow-sm' : 'text-slate-500'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const ShareCardSheet = ({ session, boardCatalog, taskCatalog, onClose }: ShareCardSheetProps) => {
  const [background, setBackground] = useState<ShareCardOptions['background']>('transparent');
  const [textColor, setTextColor] = useState<ShareCardOptions['textColor']>('white');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [includeMemo, setIncludeMemo] = useState(false);
  const [status, setStatus] = useState('');

  const hasLocation = !!session.location && session.location !== PLACEHOLDER_LOCATION;
  const hasMemo = !!session.memo.trim();
  const canShareFile = canShareImageFile();
  const canCopy = canCopyImage();
  const filename = `surfocus-${session.date}.png`;

  const canvas = useMemo(
    () =>
      renderShareCard(
        {
          date: session.date,
          location: includeLocation && hasLocation ? session.location : undefined,
          memo: includeMemo && hasMemo ? session.memo.trim() : undefined,
          waveLabel: findOption(waveOptions, session.condition.wave)?.label ?? session.condition.wave,
          windLabel: findOption(windOptions, session.condition.wind)?.label ?? session.condition.wind,
          boardLabel: boardCatalog.find(b => b.id === session.condition.board)?.name ?? session.condition.board,
          overallScore: session.overallScore,
          tasks: session.tasks.map(task => ({
            title: taskCatalog.find(t => t.id === task.id)?.title ?? task.name,
            score: task.score,
          })),
        },
        { background, textColor }
      ),
    [session, boardCatalog, taskCatalog, background, textColor, includeLocation, includeMemo, hasLocation, hasMemo]
  );
  const previewUrl = useMemo(() => canvas.toDataURL('image/png'), [canvas]);

  const handleShare = async () => {
    try {
      await shareImage(await canvasToBlob(canvas), filename);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setStatus('うまく書き出せませんでした');
    }
  };

  const handleSave = async () => {
    try {
      downloadImage(await canvasToBlob(canvas), filename);
      setStatus('画像を保存しました');
    } catch {
      setStatus('うまく書き出せませんでした');
    }
  };

  const handleCopy = async () => {
    try {
      await copyImage(await canvasToBlob(canvas));
      setStatus('コピーしました');
    } catch {
      setStatus('コピーできませんでした。保存してお使いください');
    }
  };

  const previewBackdrop =
    background === 'cream'
      ? 'bg-slate-200'
      : textColor === 'white'
        ? 'bg-gradient-to-b from-[#2b6b7a] to-[#0b2230]'
        : 'bg-gradient-to-b from-[#FDE7B0] to-[#F2A65A]';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="シェア用の画像"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] max-h-[92vh] overflow-y-auto bg-[#FAFAF8] rounded-t-[2rem] p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1C2C45]">シェア用の画像</h2>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="w-10 h-10 rounded-full flex justify-center items-center bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className={`rounded-2xl p-4 flex justify-center ${previewBackdrop}`}>
          <img
            src={previewUrl}
            alt="シェア用の画像プレビュー"
            className="max-h-[42vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="space-y-3">
          <Segmented
            ariaLabel="背景"
            value={background}
            onChange={setBackground}
            options={[
              { value: 'transparent', label: '透明（重ねる用）' },
              { value: 'cream', label: '背景つき' },
            ]}
          />
          {background === 'transparent' && (
            <Segmented
              ariaLabel="文字色"
              value={textColor}
              onChange={setTextColor}
              options={[
                { value: 'white', label: '白文字' },
                { value: 'navy', label: 'ネイビー文字' },
              ]}
            />
          )}
          <label
            className={`flex items-center gap-3 text-base font-bold ${hasLocation ? 'text-slate-700' : 'text-slate-300'}`}
          >
            <input
              type="checkbox"
              checked={includeLocation}
              disabled={!hasLocation}
              onChange={e => setIncludeLocation(e.target.checked)}
              className="w-5 h-5 accent-[#1C2C45]"
            />
            ロケーションを含める
          </label>
          <label className={`flex items-center gap-3 text-base font-bold ${hasMemo ? 'text-slate-700' : 'text-slate-300'}`}>
            <input
              type="checkbox"
              checked={includeMemo}
              disabled={!hasMemo}
              onChange={e => setIncludeMemo(e.target.checked)}
              className="w-5 h-5 accent-[#1C2C45]"
            />
            メモを含める
          </label>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full bg-[#1C2C45] text-white font-bold text-lg py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-[#2A4062] transition-colors"
          >
            <Download size={20} />
            画像を保存
          </button>
          <div className="flex gap-3">
            {canShareFile && (
              <button
                onClick={handleShare}
                className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold flex justify-center items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Share2 size={18} />
                共有
              </button>
            )}
            {canCopy && (
              <button
                onClick={handleCopy}
                className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold flex justify-center items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Copy size={18} />
                コピー
              </button>
            )}
          </div>
          <p role="status" className="text-sm font-bold text-[#1C2C45] min-h-[1.25rem] text-center">
            {status}
          </p>
        </div>

        <div className="text-xs text-slate-400 leading-relaxed space-y-1.5">
          <p>
            動画や写真に重ねるには、「画像を保存」したあと、Instagramのストーリーズで動画・写真を選び、ステッカーのトレイから写真アイコンを選んで、保存した画像を貼り付けます。サイズと位置は貼ったあとに調整できます。
          </p>
          <p>画像はこの端末の中で作られ、サーバーには送信されません。</p>
        </div>
      </div>
    </div>
  );
};

export default ShareCardSheet;
