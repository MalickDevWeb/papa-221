import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { TrendingUp, Award, CheckCircle2 } from 'lucide-react';

// Enhanced mockup dataset tracking both grades (out of 20) and weekly attendance progress (%)
const PERFORMANCE_DATA = [
  { mois: 'Janvier', note: 14.2, presence: 92, promoMoy: 13.8 },
  { mois: 'Février', note: 15.5, presence: 95, promoMoy: 13.8 },
  { mois: 'Mars', note: 16.3, presence: 98, promoMoy: 13.8 },
  { mois: 'Avril', note: 15.8, presence: 94, promoMoy: 13.8 },
  { mois: 'Mai', note: 16.89, presence: 96, promoMoy: 13.8 }
];

interface TooltipPayloadItem {
  dataKey: string;
  color: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#291715] text-white p-3 md:p-4 rounded-2xl shadow-xl border border-white/10 text-xs font-semibold space-y-2 min-w-[130px] select-none">
        <p className="font-extrabold text-white/50 border-b border-white/10 pb-1.5 mb-1.5 uppercase tracking-widest text-[9px]">
          {label}
        </p>
        {payload.map((entry: TooltipPayloadItem, index: number) => {
          const isNote = entry.dataKey === 'note' || entry.dataKey === 'promoMoy';
          const suffix = isNote ? ' / 20' : ' %';
          const labelName = entry.dataKey === 'note' 
            ? 'Votre Moyenne' 
            : entry.dataKey === 'presence' 
              ? 'Taux Présence' 
              : 'Moyenne Promo';
          
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[10.5px]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {labelName}
              </span>
              <span className="font-black text-white text-right">
                {entry.value}{suffix}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export function PerformanceChart() {
  const [activeTab, setActiveTab] = useState<'combined' | 'notes' | 'presence'>('combined');

  return (
    <section className="col-span-12 md:col-span-4 bg-white/90 backdrop-blur-md border border-neutral-gray-200 rounded-3xl p-5 shadow-sm h-[380px] flex flex-col justify-between">
      
      {/* Chart Header & Toggles */}
      <div className="shrink-0 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-title-lg text-xs font-black flex items-center gap-1.5 text-[#291715]">
            <TrendingUp className="h-4 w-4 text-[#B3181C]" />
            Analytique Performance
          </h3>
          
          {/* Quick Stats Badge */}
          <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 className="h-2.5 w-2.5 animate-pulse" />
            GPA: 3.4
          </span>
        </div>

        {/* Responsive Mini Tabs */}
        <div className="flex bg-[#FAF8F6] p-1 rounded-xl border border-neutral-200/60 select-none">
          <button
            onClick={() => setActiveTab('combined')}
            className={`flex-1 py-1 text-center font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'combined'
                ? 'bg-white text-[#B3181C] shadow-sm border border-neutral-250/20'
                : 'text-neutral-400 hover:text-[#291715]'
            }`}
          >
            Globale
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-1 text-center font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-white text-[#B3181C] shadow-sm border border-neutral-250/20'
                : 'text-neutral-400 hover:text-[#291715]'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('presence')}
            className={`flex-1 py-1 text-center font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'presence'
                ? 'bg-white text-[#B3181C] shadow-sm border border-neutral-250/20'
                : 'text-neutral-400 hover:text-[#291715]'
            }`}
          >
            Assiduité
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-grow w-full relative h-[210px] mt-2 select-none">
        
        {/* Color Gradient definitions for Area Chart */}
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <ComposedChart
            data={PERFORMANCE_DATA}
            margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorNote" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B3181C" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#B3181C" stopOpacity={0.00}/>
              </linearGradient>
              <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.00}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
            
            <XAxis 
              dataKey="mois" 
              tick={{ fontSize: 9, fontWeight: 700, fill: '#888' }} 
              axisLine={false} 
              tickLine={false}
            />
            
            {/* Left Y-Axis for Grades out of 20 */}
            <YAxis 
              yAxisId="left"
              domain={[10, 20]} 
              tickCount={6}
              tick={{ fontSize: 9, fontWeight: 700, fill: '#888' }}
              axisLine={false}
              tickLine={false}
            />

            {/* Right Y-Axis for Attendance % */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[80, 100]} 
              tickCount={5}
              tick={{ fontSize: 9, fontWeight: 700, fill: '#888' }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference Line showing Class Average benchmark */}
            {activeTab !== 'presence' && (
              <ReferenceLine 
                yAxisId="left"
                y={13.84} 
                stroke="#291715" 
                strokeDasharray="4 4" 
                label={{ 
                  value: 'Promo (13.84)', 
                  position: 'insideBottomRight', 
                  fill: '#291715', 
                  fontSize: 8, 
                  fontWeight: 800 
                }} 
              />
            )}

            {/* Active view selectors */}
            {activeTab === 'combined' && (
              <>
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="note" 
                  name="note"
                  stroke="#B3181C" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorNote)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="presence" 
                  name="presence"
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10B981', strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 5 }}
                />
              </>
            )}

            {activeTab === 'notes' && (
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="note" 
                name="note"
                stroke="#B3181C" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorNote)" 
              />
            )}

            {activeTab === 'presence' && (
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="presence" 
                name="presence"
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPresence)" 
              />
            )}

          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer statistics benchmarks */}
      <div className="pt-3 border-t border-neutral-gray-150 flex justify-between items-center text-[10px] text-neutral-500 font-bold select-none">
        <div className="flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-[#B3181C]" />
          <span>Moyenne Promo : 13.84</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B3181C]" />
          <span>Note</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] ml-1.5" />
          <span>Présence</span>
        </div>
      </div>
    </section>
  );
}
