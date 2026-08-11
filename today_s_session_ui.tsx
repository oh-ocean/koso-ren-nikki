import React, { useState } from 'react';
import { 
  Waves, 
  Wind, 
  Target, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  ChevronRight,
  Droplets
} from 'lucide-react';

const SurfingSessionApp = () => {
  // State for conditions
  const [waveSize, setWaveSize] = useState('waist');
  const [windDirection, setWindDirection] = useState('offshore');
  const [boardType, setBoardType] = useState('shortboard');

  // State for tasks
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Mock data for condition options
  const waveOptions = [
    { id: 'knee', icon: <Droplets size={28} className="opacity-50" />, label: 'Knee' },
    { id: 'waist', icon: <Waves size={28} />, label: 'Waist' },
    { id: 'head', icon: <Waves size={32} className="stroke-[2.5]" />, label: 'Head' }
  ];

  const windOptions = [
    { id: 'onshore', icon: <Wind size={28} className="transform rotate-180" />, label: 'Onshore' },
    { id: 'glassy', icon: <Wind size={28} className="opacity-30" />, label: 'Glassy' },
    { id: 'offshore', icon: <Wind size={28} />, label: 'Offshore' }
  ];

  const boardOptions = [
    { id: 'shortboard', icon: <div className="w-4 h-12 border-2 border-current rounded-full" />, label: 'Short' },
    { id: 'funboard', icon: <div className="w-5 h-14 border-2 border-current rounded-full" />, label: 'Fun' },
    { id: 'longboard', icon: <div className="w-6 h-16 border-2 border-current rounded-full" />, label: 'Long' }
  ];

  // Mock data for tasks
  const taskOptions = [
    { id: 't1', title: 'テイクオフの速さ', description: '手をついたらすぐに立ち上がる' },
    { id: 't2', title: 'ボトムターン', description: '膝を深く曲げてタメを作る' },
    { id: 't3', title: 'バックサイド', description: '左腕のリードを意識する' },
    { id: 't4', title: 'パドリング', description: '胸を張って、遠くの水をかく' }
  ];

  const toggleTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    // Main Container - Off-white/Sand beige background, centered for presentation
    <div className="min-h-screen bg-[#F5F5F0] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex justify-center items-center p-4 sm:p-8">
      
      {/* Mobile App Frame */}
      <div className="w-full max-w-[430px] h-[932px] max-h-full bg-[#FAFAF8] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-8 border-slate-900">
        
        {/* Status Bar Mockup */}
        <div className="h-12 w-full flex justify-between items-center px-6 text-sm font-medium pt-2 pb-1 text-slate-900 z-50 bg-[#FAFAF8]">
          <span>9:41</span>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded-full border border-slate-900 flex justify-center items-center">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
          
          {/* Header Section */}
          <header className="px-6 pt-2 pb-6 bg-[#1C2C45] text-white rounded-b-[2.5rem] shadow-md relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Today's Session</h1>
                <div className="flex items-center text-[#E0E5EC] font-medium text-lg">
                  <MapPin size={18} className="mr-1.5" />
                  <span>Zushi, Kanagawa</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex justify-center items-center backdrop-blur-sm">
                <Calendar size={24} className="text-white" />
              </div>
            </div>

            {/* Goal Banner */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center shadow-inner">
              <div className="w-12 h-12 bg-white text-[#1C2C45] rounded-xl flex justify-center items-center mr-4 shadow-sm font-bold text-xl flex-shrink-0">
                45
              </div>
              <div>
                <p className="text-sm text-[#E0E5EC] font-medium mb-0.5">大目標</p>
                <p className="text-lg font-bold">2級検定まで あと45日！</p>
              </div>
            </div>
          </header>

          <main className="px-6 py-8 space-y-10">
            
            {/* Conditions Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-5 flex items-center">
                <span className="w-2 h-6 bg-[#1C2C45] rounded-full mr-3 inline-block"></span>
                Conditions
              </h2>
              
              <div className="space-y-6">
                {/* Wave Size */}
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-3 ml-1 uppercase tracking-wider">Wave Size</p>
                  <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
                    {waveOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setWaveSize(option.id)}
                        aria-label={option.label}
                        className={`flex-1 h-16 rounded-xl flex justify-center items-center transition-all duration-300 ${
                          waveSize === option.id 
                            ? 'bg-[#1C2C45] text-white shadow-md transform scale-[1.02]' 
                            : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wind */}
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-3 ml-1 uppercase tracking-wider">Wind</p>
                  <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
                    {windOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setWindDirection(option.id)}
                        aria-label={option.label}
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

                {/* Board */}
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-3 ml-1 uppercase tracking-wider">Board</p>
                  <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
                    {boardOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setBoardType(option.id)}
                        aria-label={option.label}
                        className={`flex-1 h-20 rounded-xl flex justify-center items-center transition-all duration-300 ${
                          boardType === option.id 
                            ? 'bg-[#1C2C45] text-white shadow-md transform scale-[1.02]' 
                            : 'text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Tasks Section */}
            <section>
              <div className="flex justify-between items-end mb-5">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <span className="w-2 h-6 bg-[#1C2C45] rounded-full mr-3 inline-block"></span>
                  Focus Tasks
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                  {selectedTasks.length} selected
                </span>
              </div>
              
              <div className="space-y-4">
                {taskOptions.map(task => {
                  const isSelected = selectedTasks.includes(task.id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-start border-2 ${
                        isSelected 
                          ? 'bg-[#1C2C45] border-[#1C2C45] text-white shadow-lg transform scale-[1.01]' 
                          : 'bg-white border-transparent text-slate-800 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className={`mt-1 mr-4 flex-shrink-0 w-6 h-6 rounded-full border-2 flex justify-center items-center ${
                        isSelected ? 'border-white bg-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 size={24} className="text-[#1C2C45]" />}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {task.title}
                        </h3>
                        <p className={`text-base leading-relaxed ${isSelected ? 'text-[#E0E5EC]' : 'text-slate-500'}`}>
                          {task.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Add Task Button (Ghost) */}
              <button className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-lg flex justify-center items-center hover:bg-slate-50 hover:border-slate-400 transition-colors">
                + 新しい課題を追加
              </button>
            </section>
            
          </main>
        </div>

        {/* Bottom Fixed Action Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent pt-12 pb-8 z-20">
          <button 
            className="w-full bg-[#1C2C45] text-white font-bold text-xl py-5 rounded-[1.5rem] shadow-[0_10px_30px_-10px_rgba(28,44,69,0.5)] flex justify-center items-center hover:bg-[#2A4062] transition-colors active:scale-95 transform"
          >
            GO SURF!
            <ChevronRight size={28} className="ml-2 opacity-80" />
          </button>
          
          {/* Home Indicator Mockup */}
          <div className="w-1/3 h-1.5 bg-slate-900 rounded-full mx-auto mt-6"></div>
        </div>

      </div>
      
      {/* Global styles for hiding scrollbar in presentation */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default SurfingSessionApp;