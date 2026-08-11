import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Edit3
} from 'lucide-react';

// Custom highly-accessible slider component that perfectly syncs a visual thumb with a native hidden range input.
const ScoreSlider = ({ title, taskName, value, onChange }) => {
  const min = 1;
  const max = 10;
  // Calculate percentage (0 to 100)
  const percentage = ((value - min) / (max - min)) * 100;

  // Dynamically calculate the color based on the value (Navy -> Sunset Orange)
  // Navy: rgb(28, 44, 69) / #1C2C45
  // Orange: rgb(255, 126, 103) / #FF7E67
  const r = Math.round(28 + (255 - 28) * (percentage / 100));
  const g = Math.round(44 + (126 - 44) * (percentage / 100));
  const b = Math.round(69 + (103 - 69) * (percentage / 100));
  const currentColor = `rgb(${r}, ${g}, ${b})`;

  // Calculate exact position to match native range input thumb behavior.
  // Thumb width is 56px (3.5rem)
  const thumbOffsetCalc = `calc(${percentage}% - (${percentage} * 56px / 100))`;

  return (
    <div className="mb-14">
      <div className="flex justify-between items-end mb-6">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
          {taskName && <p className="text-lg text-slate-500 font-medium leading-snug">{taskName}</p>}
        </div>
        {/* Large Score Display for quick visual confirmation */}
        <div className="text-4xl font-black tracking-tighter flex-shrink-0 transition-colors duration-200" style={{ color: currentColor }}>
          {value}
          <span className="text-lg text-slate-400 font-medium ml-0.5 tracking-normal">/10</span>
        </div>
      </div>

      {/* Slider Core Container */}
      <div 
        className="relative h-16 w-full flex items-center group" 
        style={{ touchAction: 'none' }} // Prevents page scroll while sliding
      >
        {/* Base Track (Gray) */}
        <div className="absolute inset-x-0 h-12 bg-[#E2E8F0] rounded-full shadow-inner top-1/2 -translate-y-1/2" />
        
        {/* Active Track (Gradient) */}
        <div 
          className="absolute left-0 h-12 rounded-full transition-all duration-100 ease-out top-1/2 -translate-y-1/2 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]"
          style={{ 
            width: `calc(${percentage}% - (${percentage} * 56px / 100) + 28px)`, // Maps exactly to the center of the thumb
            background: `linear-gradient(to right, #1C2C45, ${currentColor})` 
          }}
        />
        
        {/* Visual Thumb */}
        <div 
          className="absolute h-[56px] w-[56px] bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] border-[4px] flex justify-center items-center text-xl font-black z-10 transition-all duration-100 ease-out pointer-events-none group-active:scale-110"
          style={{ 
            left: thumbOffsetCalc,
            borderColor: currentColor,
            color: currentColor
          }}
        >
          {value}
        </div>

        {/* Hidden Native Input for Accessibility and Native Touch Handling */}
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 focus:outline-none"
          aria-label={`${title} score`}
        />
      </div>
      
      {/* Helper Labels */}
      <div className="flex justify-between mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest px-2">
        <span>Needs Work</span>
        <span>Epic</span>
      </div>
    </div>
  );
};

const SessionReviewApp = () => {
  // State for evaluation scores
  const [taskScore, setTaskScore] = useState(5);
  const [overallScore, setOverallScore] = useState(7);
  
  // State for optional notes
  const [memo, setMemo] = useState('');

  // Mock data carried over from "Today's Session"
  const activeTask = '手をついたらすぐに立ち上がる';
  const location = 'Zushi, Kanagawa';

  return (
    // Main Container - Off-white/Sand beige background
    <div className="min-h-screen bg-[#F5F5F0] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex justify-center items-center p-4 sm:p-8">
      
      {/* Mobile App Frame */}
      <div className="w-full max-w-[430px] h-[932px] max-h-full bg-[#FAFAF8] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-8 border-slate-900">
        
        {/* Status Bar Mockup */}
        <div className="h-12 w-full flex justify-between items-center px-6 text-sm font-medium pt-2 pb-1 text-slate-900 z-50 bg-[#FAFAF8]">
          <span>11:45</span>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded-full border border-slate-900 flex justify-center items-center">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-36 no-scrollbar relative">
          
          {/* Header Section (Lighter variant for review screen) */}
          <header className="px-6 pt-4 pb-8 flex items-center justify-between sticky top-0 bg-[#FAFAF8]/90 backdrop-blur-md z-40">
            <button 
              className="w-12 h-12 bg-white rounded-full flex justify-center items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
              aria-label="Close review"
            >
              <X size={24} className="text-slate-900" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#1C2C45]">Session Review</h1>
              <p className="text-sm font-medium text-slate-500 flex items-center justify-center mt-1">
                <MapPin size={14} className="mr-1" />
                {location}
              </p>
            </div>
            <div className="w-12 h-12 flex justify-center items-center text-[#1C2C45]">
              <Calendar size={24} />
            </div>
          </header>

          <main className="px-6 py-4 space-y-2">
            
            {/* Title & Celebration */}
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-[#1C2C45] text-white rounded-full flex justify-center items-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Great Session!</h2>
              <p className="text-lg text-slate-500 font-medium">How did you do today?</p>
            </div>

            {/* Sliders Section */}
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
              <ScoreSlider 
                title="Focus Task"
                taskName={activeTask}
                value={taskScore}
                onChange={setTaskScore}
              />
              
              <div className="w-full h-px bg-slate-100 mb-10"></div>

              <ScoreSlider 
                title="Overall Stoke"
                taskName="セッション全体の充実度"
                value={overallScore}
                onChange={setOverallScore}
              />
            </section>

            {/* Notes Section */}
            <section className="mb-8">
              <div className="flex items-center mb-4 px-2">
                <Edit3 size={20} className="text-[#1C2C45] mr-2" />
                <h3 className="text-xl font-bold text-slate-900">Notes</h3>
              </div>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="波のコンディション、気づき、次回の課題など..."
                className="w-full min-h-[160px] bg-white border border-slate-200 rounded-[2rem] p-6 text-lg text-slate-800 font-medium leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1C2C45]/10 focus:border-[#1C2C45]/30 transition-all shadow-sm resize-none"
              />
            </section>
            
          </main>
        </div>

        {/* Bottom Fixed Action Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent pt-12 pb-8 z-30">
          <button 
            className="w-full bg-[#1C2C45] text-white font-bold text-xl h-[72px] rounded-[2rem] shadow-[0_12px_30px_-10px_rgba(28,44,69,0.5)] flex justify-center items-center hover:bg-[#2A4062] transition-colors active:scale-[0.98] transform"
          >
            SAVE SESSION
          </button>
          
          {/* Home Indicator Mockup */}
          <div className="w-1/3 h-1.5 bg-slate-900 rounded-full mx-auto mt-6"></div>
        </div>

      </div>
      
      {/* Global styles for hiding scrollbar */}
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

export default SessionReviewApp;