import { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  ChevronRight,
  ListChecks,
  Pencil,
  Target,
} from 'lucide-react';
import type { BoardDraft, Condition, Goal, TaskDraft, SessionDraft } from '../types';
import { waveOptions, windOptions, WaveBodyGauge } from '../lib/conditionOptions';
import { todayISODate, formatDateLong } from '../lib/date';
import { resolveTagStyle } from '../lib/tagColors';
import BottomNav from '../components/BottomNav';

interface TodaySessionProps {
  onStart: (draft: SessionDraft) => void;
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
  onOpenGoals: () => void;
  onOpenTaskManager: () => void;
  onOpenBoardManager: () => void;
  pinnedGoal: Goal | null;
  taskCatalog: TaskDraft[];
  boardCatalog: BoardDraft[];
  initialDate?: string;
}

const TodaySession = ({
  onStart,
  onOpenDashboard,
  onOpenSettings,
  onOpenGoals,
  onOpenTaskManager,
  onOpenBoardManager,
  pinnedGoal,
  taskCatalog,
  boardCatalog,
  initialDate,
}: TodaySessionProps) => {
  const sessionDate = initialDate ?? todayISODate();
  const isBackfilling = sessionDate !== todayISODate();

  const [location, setLocation] = useState('Zushi, Kanagawa');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationDraft, setLocationDraft] = useState(location);

  const [waveSize, setWaveSize] = useState('waist');
  const waveLevel = Math.max(0, waveOptions.findIndex(option => option.id === waveSize));
  const [windDirection, setWindDirection] = useState('offshore');
  const boardOptions = boardCatalog.filter(b => b.isFavorite);
  const [boardType, setBoardType] = useState(boardOptions[0]?.id ?? '');
  const taskOptions = taskCatalog;
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const startEditLocation = () => {
    setLocationDraft(location);
    setIsEditingLocation(true);
  };

  const saveLocation = () => {
    const trimmed = locationDraft.trim();
    setLocation(trimmed || location);
    setIsEditingLocation(false);
  };

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleGoSurf = () => {
    const condition: Condition = { wave: waveSize, wind: windDirection, board: boardType };
    const tasks = taskOptions.filter(task => selectedTasks.includes(task.id));
    onStart({ date: sessionDate, location, condition, tasks });
  };

  return (
    <div className="min-h-screen w-full max-w-[480px] mx-auto bg-[#FAFAF8] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex flex-col relative">

        <div className="flex-1 min-h-0 overflow-y-auto pb-64 no-scrollbar">
          <header className="px-6 pt-2 pb-6 bg-[#1C2C45] text-white rounded-b-[2.5rem] shadow-md relative z-10">
            <button
              onClick={onOpenGoals}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center shadow-inner hover:bg-white/15 transition-colors text-left mb-6"
            >
              <div className="w-12 h-12 bg-white text-[#1C2C45] rounded-xl flex justify-center items-center mr-4 shadow-sm flex-shrink-0">
                <Target size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#E0E5EC] font-medium mb-0.5">大目標</p>
                {pinnedGoal ? (
                  <p className="text-lg font-bold truncate">{pinnedGoal.title}</p>
                ) : (
                  <p className="text-lg font-bold text-white/70">目標を設定する</p>
                )}
              </div>
              <ChevronRight size={20} className="text-white/50 flex-shrink-0 ml-2" />
            </button>

            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight mb-1">Today's Session</h1>
              {isBackfilling && (
                <span className="inline-block mb-2 px-3 py-1 rounded-full bg-white/15 text-sm font-bold text-white">
                  {formatDateLong(sessionDate)}の記録
                </span>
              )}
              {isEditingLocation ? (
                <div className="flex items-center bg-white/15 border border-white/30 rounded-full pl-3 pr-2.5 py-1.5">
                  <MapPin size={16} className="mr-1.5 flex-shrink-0 text-white" />
                  <input
                    autoFocus
                    type="text"
                    value={locationDraft}
                    onChange={e => setLocationDraft(e.target.value)}
                    onBlur={saveLocation}
                    onKeyDown={e => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                      if (e.key === 'Escape') {
                        setLocationDraft(location);
                        setIsEditingLocation(false);
                      }
                    }}
                    placeholder="ロケーションを入力"
                    aria-label="ロケーションを入力"
                    className="min-w-0 flex-1 bg-transparent text-white placeholder:text-white/50 text-base font-bold focus:outline-none"
                  />
                </div>
              ) : (
                <button
                  onClick={startEditLocation}
                  aria-label="ロケーションを編集"
                  className="inline-flex items-center bg-white/15 border border-white/25 rounded-full pl-3 pr-2.5 py-1.5 text-white font-bold text-base hover:bg-white/25 transition-colors max-w-full"
                >
                  <MapPin size={16} className="mr-1.5 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                  <Pencil size={13} className="ml-1.5 opacity-70 flex-shrink-0" />
                </button>
              )}
            </div>
          </header>

          <main className="px-6 py-8 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center">
                <span className="w-2 h-6 bg-[#1C2C45] rounded-full mr-3 inline-block"></span>
                Conditions
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-3 ml-1 uppercase tracking-wider">Wave Size</p>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <div className="rounded-xl bg-gradient-to-b from-[#EFF8FF] to-[#F8FBFF] border border-[#DCEEFC] overflow-hidden">
                      <WaveBodyGauge level={waveLevel} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 ml-0.5">
                      {waveOptions[waveLevel]?.label}
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={waveOptions.length - 1}
                      step={1}
                      value={waveLevel}
                      onChange={e => setWaveSize(waveOptions[Number(e.target.value)].id)}
                      aria-label="Wave Size"
                      className="w-full h-2 rounded-full accent-[#1C2C45] cursor-pointer mt-2"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Flat</span>
                      <span>Double+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-500 mb-3 ml-1 uppercase tracking-wider">Wind</p>
                  <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
                    {windOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setWindDirection(option.id)}
                        aria-label={option.label}
                        aria-pressed={windDirection === option.id}
                        className={`flex-1 h-16 rounded-xl flex justify-center items-center transition-all duration-300 ${
                          windDirection === option.id
                            ? 'bg-[#1C2C45] text-white shadow-md transform scale-[1.02]'
                            : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3 ml-1">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Board</p>
                    <button
                      onClick={onOpenBoardManager}
                      aria-label="ボードを管理"
                      className="w-7 h-7 rounded-full flex justify-center items-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                      <ListChecks size={13} />
                    </button>
                  </div>
                  {boardOptions.length === 0 ? (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center">
                      <p className="text-slate-500 font-medium mb-3">ボードが登録されていません。</p>
                      <button
                        onClick={onOpenBoardManager}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C2C45] text-white font-bold text-sm hover:bg-[#2A4062] transition-colors"
                      >
                        <ListChecks size={16} />
                        ボードを追加する
                      </button>
                    </div>
                  ) : (
                    <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 gap-1">
                      {boardOptions.map(board => (
                        <button
                          key={board.id}
                          onClick={() => setBoardType(board.id)}
                          aria-pressed={boardType === board.id}
                          className={`flex-1 h-16 rounded-xl flex justify-center items-center px-2 text-sm font-bold text-center transition-all duration-300 ${
                            boardType === board.id
                              ? 'bg-[#1C2C45] text-white shadow-md transform scale-[1.02]'
                              : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate">{board.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-end mb-5">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <span className="w-2 h-6 bg-[#1C2C45] rounded-full mr-3 inline-block"></span>
                  Focus Tasks
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                    {selectedTasks.length} selected
                  </span>
                  <button
                    onClick={onOpenTaskManager}
                    aria-label="Focus Tasksを管理"
                    className="w-8 h-8 rounded-full flex justify-center items-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <ListChecks size={15} />
                  </button>
                </div>
              </div>

              {taskOptions.length === 0 ? (
                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center">
                  <p className="text-slate-500 font-medium mb-3">まだ課題がありません。</p>
                  <button
                    onClick={onOpenTaskManager}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C2C45] text-white font-bold text-sm hover:bg-[#2A4062] transition-colors"
                  >
                    <ListChecks size={16} />
                    課題を追加する
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {taskOptions.map(task => {
                    const isSelected = selectedTasks.includes(task.id);
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        aria-pressed={isSelected}
                        className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-start border-2 ${
                          isSelected
                            ? 'bg-[#1C2C45] border-[#1C2C45] text-white shadow-lg transform scale-[1.01]'
                            : 'bg-white border-transparent text-slate-800 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div
                          className={`mt-1 mr-4 flex-shrink-0 w-6 h-6 rounded-full border-2 flex justify-center items-center ${
                            isSelected ? 'border-white bg-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <CheckCircle2 size={24} className="text-[#1C2C45]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {task.title}
                            </h3>
                            {task.tag && (
                              <span
                                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                                style={
                                  isSelected
                                    ? { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }
                                    : { backgroundColor: resolveTagStyle(task.tag).bg, color: resolveTagStyle(task.tag).text }
                                }
                              >
                                #{task.tag}
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className={`text-base leading-relaxed ${isSelected ? 'text-[#E0E5EC]' : 'text-slate-500'}`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </main>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-20">
          <div className="px-6 pt-12 pb-4 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
            <button
              onClick={handleGoSurf}
              className="w-full bg-[#D97706] text-white font-bold text-xl py-5 rounded-[1.5rem] shadow-[0_10px_30px_-10px_rgba(217,119,6,0.5)] flex justify-center items-center hover:bg-[#C2660A] transition-colors active:scale-95 transform"
            >
              GO SURF!
              <ChevronRight size={28} className="ml-2 opacity-80" />
            </button>
          </div>
          <BottomNav
            current="today"
            standalone={false}
            onDashboard={onOpenDashboard}
            onToday={() => {}}
            onSettings={onOpenSettings}
          />
        </div>
    </div>
  );
};

export default TodaySession;
