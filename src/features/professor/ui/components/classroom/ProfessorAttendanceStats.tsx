import React from 'react';
import { Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface StatsProps {
  readonly total: number;
  readonly present: number;
  readonly retard: number;
  readonly absent: number;
}

export function ProfessorAttendanceStats({ total, present, retard, absent }: StatsProps) {
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 select-none">
      <div 
        style={{
          height: '48px',
          width: '148.5px',
        }}
        className="bg-white border border-neutral-200/80 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm"
      >
        <div className="h-10 w-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-600">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <span className="block text-[9px] font-black uppercase tracking-wider text-neutral-400">Total</span>
          <span className="text-lg font-black text-neutral-800 font-mono">{total}</span>
        </div>
      </div>

      <div 
        style={{
          width: '148.5px',
          height: '48px',
        }}
        className="bg-[#E6F4EA]/40 border border-[#CEEAD6]/60 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm"
      >
        <div className="h-10 w-10 bg-[#E6F4EA] rounded-xl flex items-center justify-center text-[#137333]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <span className="block text-[9px] font-black uppercase tracking-wider text-[#137333]">Présents</span>
          <span className="text-lg font-black text-[#137333] font-mono">{present}</span>
        </div>
      </div>

      <div 
        style={{
          width: '148.5px',
          height: '48px',
        }}
        className="bg-[#FEF7E0]/40 border border-[#FEEFC3]/60 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm"
      >
        <div className="h-10 w-10 bg-[#FEF7E0] rounded-xl flex items-center justify-center text-[#B06000]">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <span className="block text-[9px] font-black uppercase tracking-wider text-[#B06000]">Retards</span>
          <span className="text-lg font-black text-[#B06000] font-mono">{retard}</span>
        </div>
      </div>

      <div 
        style={{
          width: '148.5px',
          height: '48px',
        }}
        className="bg-[#FCE8E6]/40 border border-[#FAD2CF]/60 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm"
      >
        <div className="h-10 w-10 bg-[#FCE8E6] rounded-xl flex items-center justify-center text-[#C5221F]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <span className="block text-[9px] font-black uppercase tracking-wider text-[#C5221F]">Absents</span>
          <span className="text-lg font-black text-[#C5221F] font-mono">{absent}</span>
        </div>
      </div>

      {/* Modern Circular / Progress card */}
      <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-[#B3181C] to-[#8e1215] text-white p-4 rounded-2xl flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-black uppercase tracking-widest text-red-100">Taux de Présence</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">{pct}%</span>
        </div>
        <div className="mt-3.5 h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
