import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Activity,
  PieChart as PieChartIcon,
  Crosshair,
  Waves
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';

// --- Mock Data ---
const mockSurfedDates = [2, 5, 8, 12, 14, 19, 21, 26, 28]; // Days surfed in the current month

const barChartData = [
  { name: 'Week 1', score: 6.5 },
  { name: 'Week 2', score: 7.2 },
  { name: 'Week 3', score: 6.8 },
  { name: 'Week 4', score: 8.4 },
];

const pieChartData = [
  { name: 'Takeoff', value: 45 },
  { name: 'Bottom Turn', value: 30 },
  { name: 'Top Turn', value: 15 },
  { name: 'Cutback', value: 10 },
];
const COLORS = ['#1C2C45', '#3A5075', '#5C749E', '#829BC8']; // Navy palette

const radarData = [
  { subject: 'Paddle', A: 90, fullMark: 100 },
  { subject: 'Takeoff', A: 85, fullMark: 100 },
  { subject: 'Bottom Turn', A: 65, fullMark: 100 },
  { subject: 'Top Action', A: 50, fullMark: 100 },
  { subject: 'Stamina', A: 70, fullMark: 100 },
];

// --- Components ---
const Calendar = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentMonth = "August 2026";
  
  // Generating a simple static grid for mockup purposes
  const dates = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - 5; // offset to simulate start day
    return (dayNum > 0 && dayNum <= 31) ? dayNum : null;
  });

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-slate-50 text-slate-700 active:scale-95 transition-transform">
          <ChevronLeft size={28} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{currentMonth}</h2>
        <button className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-slate-50 text-slate-700 active:scale-95 transition-transform">
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
        {days.map((day, i) => (
          <div key={i} className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
        
        {/* Date cells */}
        {dates.map((date, i) => {
          const isSurfed = mockSurfedDates.includes(date);
          const isToday = date === 11;
          
          return (
            <div 
              key={i} 
              className={`
                h-12 flex flex-col justify-center items-center rounded-2xl relative
                ${date ? 'cursor-pointer active:scale-90 transition-transform' : ''}
                ${isToday ? 'bg-slate-100 text-slate-900' : 'text-slate-700'}
              `}
            >
              <span className={`text-lg font-medium ${isToday ? 'font-black' : ''}`}>
                {date || ''}
              </span>
              
              {/* Surfed Indicator (Navy Dot/Wave) */}
              {isSurfed && (
                <div className="absolute bottom-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#1C2C45]"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
        <div className="w-2 h-2 rounded-full bg-[#1C2C45]"></div>
        <span>Surfed 9 days this month</span>
      </div>
    </div>
  );
};

const DashboardApp = () => {
  const [activeTab, setActiveTab] = useState('growth');

  const tabs = [
    { id: 'growth', label: 'Growth', icon: <Activity size={24} /> },
    { id: 'focus', label: 'Focus', icon: <PieChartIcon size={24} /> },
    { id: 'skills', label: 'Skills', icon: <Crosshair size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-800 font-sans selection:bg-[#1C2C45] selection:text-white flex justify-center items-center p-4 sm:p-8">
      
      {/* Mobile App Frame */}
      <div className="w-full max-w-[430px] h-[932px] max-h-full bg-[#FAFAF8] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-8 border-slate-900">
        
        {/* Status Bar Mockup */}
        <div className="h-12 w-full flex justify-between items-center px-6 text-sm font-medium pt-2 pb-1 text-slate-900 z-50 bg-[#FAFAF8]">
          <span>1:36</span>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded-full border border-slate-900 flex justify-center items-center">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="px-6 pt-4 pb-6 flex flex-col justify-center items-center bg-[#FAFAF8] z-40">
          <h1 className="text-3xl font-black tracking-tight text-[#1C2C45]">Dashboard</h1>
          <p className="text-base font-medium text-slate-500 mt-1">Track your progress</p>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-32 no-scrollbar px-6 space-y-8">
          
          <Calendar />

          {/* Graph Section */}
          <section className="space-y-6">
            
            {/* Custom Large Tabs */}
            <div className="flex justify-between bg-slate-200/50 p-1.5 rounded-full">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex flex-col items-center justify-center py-3 rounded-full transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-white text-[#1C2C45] shadow-[0_2px_10px_rgba(0,0,0,0.05)] font-bold' 
                      : 'text-slate-400 font-medium hover:text-slate-600'}
                  `}
                >
                  <div className="mb-1">{tab.icon}</div>
                  <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Chart Display Area */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mt-2">
              
              {/* Dynamic Title based on tab */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {activeTab === 'growth' && 'Session Scores'}
                  {activeTab === 'focus' && 'Practice Distribution'}
                  {activeTab === 'skills' && 'Skill Balance'}
                </h3>
                <p className="text-sm font-medium text-slate-400">
                  {activeTab === 'growth' && 'Average stoke level per week'}
                  {activeTab === 'focus' && 'Where you spent your time'}
                  {activeTab === 'skills' && 'Areas to improve'}
                </p>
              </div>

              {/* Charts Rendered conditionally */}
              <div className="w-full h-[250px] min-h-[250px]">
                
                {/* GROWTH (Bar Chart) */}
                {activeTab === 'growth' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 14, fontWeight: 'bold' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 14, fontWeight: 'bold' }} 
                      />
                      <Tooltip 
                        cursor={{fill: '#F1F5F9'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                      <Bar 
                        dataKey="score" 
                        fill="#1C2C45" 
                        radius={[6, 6, 0, 0]} 
                        fillOpacity={0.8} // Using opacity for refined look
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* FOCUS (Pie Chart) */}
                {activeTab === 'focus' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {/* SKILLS (Radar Chart) */}
                {activeTab === 'skills' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#1C2C45', fontSize: 10, fontWeight: 'bold' }} 
                      />
                      <Radar 
                        name="Skill Level" 
                        dataKey="A" 
                        stroke="#1C2C45" 
                        strokeWidth={2}
                        fill="#1C2C45" 
                        fillOpacity={0.2} // High transparency for elegance
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}

              </div>
              
              {/* Legend for Pie Chart (Specific addition for clarity) */}
              {activeTab === 'focus' && (
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                  {pieChartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-sm font-bold text-slate-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Bottom Navigation (Mockup) */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#FAFAF8]/95 backdrop-blur-md border-t border-slate-200 px-6 pt-4 pb-8 z-30">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
              <Activity size={28} />
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1C2C45] font-bold">
              <Waves size={32} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1C2C45] mt-1"></div>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
              <div className="w-8 h-8 rounded-full border-2 border-slate-400 overflow-hidden bg-slate-200">
                {/* Avatar Placeholder */}
              </div>
            </button>
          </div>
          
          {/* Home Indicator */}
          <div className="w-1/3 h-1.5 bg-slate-900 rounded-full mx-auto mt-6"></div>
        </div>

      </div>
      
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

export default DashboardApp;