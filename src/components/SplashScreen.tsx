import { SURF_WAVE_PATH } from '../lib/conditionOptions';

const SplashScreen = ({ fading }: { fading: boolean }) => (
  <div
    className={`min-h-screen w-full max-w-[480px] mx-auto flex flex-col items-center justify-center bg-[#1C2C45] text-white transition-opacity duration-400 ${
      fading ? 'opacity-0' : 'opacity-100'
    }`}
  >
    <svg width="100" height="90" viewBox="-8 -70 85 80">
      <path d={SURF_WAVE_PATH} fill="white" />
    </svg>
    <h1 className="mt-6 text-3xl font-black tracking-tight">SURFOCUS</h1>
    <p className="mt-2 text-sm text-white/60 font-medium">コソ練日記</p>
  </div>
);

export default SplashScreen;
