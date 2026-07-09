import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Award, TrendingUp, Sparkles, Calendar, ArrowUpRight } from 'lucide-react';

interface SemesterData {
  semester: string;
  moyenne: number;
  color: string;
  mention: string;
}

const SEMESTER_TRENDS: SemesterData[] = [
  { semester: 'Semestre 1 (L2)', moyenne: 14.25, color: '#B3181C', mention: 'Bien' },
  { semester: 'Semestre 2 (L2)', moyenne: 15.10, color: '#E3A857', mention: 'Très Bien' },
  { semester: 'Semestre 1 (L3)', moyenne: 16.20, color: '#10B981', mention: 'Excellent' }
];

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  payload: SemesterData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#291715] text-white p-3 md:p-4 rounded-2xl shadow-xl border border-white/10 text-xs font-semibold space-y-1.5 min-w-[150px] select-none">
        <p className="font-extrabold text-white/50 border-b border-white/10 pb-1 mb-1 uppercase tracking-widest text-[9px]">
          {data.semester}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10.5px] text-neutral-300">Moyenne :</span>
          <span className="font-black text-white text-right text-sm">
            {data.moyenne.toFixed(2)} / 20
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10.5px] text-neutral-300 font-bold">Mention :</span>
          <span className="font-black text-[#E3A857] text-right uppercase text-[9px] tracking-widest">
            {data.mention}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function RecentAcademicPerformance() {
  const currentGPA = 3.6; // calculated equivalent
  const improvementRate = "+13.7%";

  return (
    <section className="col-span-12 lg:col-span-8 bg-white/90 backdrop-blur-md border border-neutral-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
      
      {/* Card Header information */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1 print:hidden">
            <span className="bg-[#B3181C]/5 text-[#B3181C] border border-[#B3181C]/15 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 animate-pulse" />
              Performances Historiques
            </span>
            <span className="text-neutral-300 text-xs select-none">•</span>
            <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">Moyenne Générale</span>
          </div>
          <h3 className="font-title-lg text-lg font-black text-[#291715] flex items-center gap-2 tracking-tight">
            <Award className="h-5 w-5 text-[#B3181C]" />
            Moyennes des 3 Derniers Semestres
          </h3>
        </div>

        {/* Dynamic Badges container */}
        <div className="flex items-center gap-2">
          <div className="bg-[#FFF5F5] border border-[#B3181C]/10 text-[#B3181C] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 select-none">
            <TrendingUp className="h-3 w-3" />
            {improvementRate} Progression
          </div>
          <div className="bg-[#FAF8F6] border border-neutral-200 text-neutral-800 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 select-none">
            <Calendar className="h-3 w-3 text-[#E3A857]" />
            L2 ➔ L3
          </div>
        </div>
      </div>

      {/* Grid containing Chart and right Summary column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-grow min-h-[220px]">
        
        {/* Left Side: Recharts Bar visualizer (span-8) */}
        <div className="lg:col-span-8 relative flex-grow w-full select-none min-h-[200px] lg:min-h-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart
              data={SEMESTER_TRENDS}
              margin={{ top: 15, right: 5, left: -25, bottom: 5 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
              <XAxis 
                dataKey="semester" 
                tick={{ fontSize: 9, fontWeight: 700, fill: '#666' }} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                domain={[10, 20]} 
                tickCount={6}
                tick={{ fontSize: 9, fontWeight: 700, fill: '#666' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="moyenne" 
                radius={[12, 12, 0, 0]}
                barSize={48}
              >
                {SEMESTER_TRENDS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Side: Analytical summary statistics column (span-4) */}
        <div className="lg:col-span-4 bg-[#FAF8F6] rounded-2xl border border-neutral-200/50 p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <p className="font-black text-[9px] text-neutral-400 uppercase tracking-widest">Évolution scolaire</p>
              <h4 className="text-xl font-black text-[#291715] tracking-tight mt-0.5">Note Max: 16.20</h4>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  GPA Équivalent
                </span>
                <span className="font-extrabold">{currentGPA.toFixed(1)} / 4.0</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E3A857]" />
                  Statut global
                </span>
                <span className="font-black text-[#B3181C] uppercase text-[10px] tracking-wider bg-[#FFF5F5] px-2 py-0.5 rounded-lg border border-[#B3181C]/5">
                  FÉLICITATIONS
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white border border-neutral-200/60 rounded-xl space-y-1">
            <span className="text-[9px] font-black text-[#B3181C] uppercase tracking-widest flex items-center gap-1 leading-none">
              Prochain objectif
              <ArrowUpRight className="h-3 w-3" />
            </span>
            <p className="text-[10px] text-neutral-500 font-bold leading-normal">
              Maintenir la dynamique pour décrocher la mention "Très Bien" sur l'année de Licence entière.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
