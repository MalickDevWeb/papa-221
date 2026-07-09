import React from 'react';
import { Clock, ShieldCheck, FileSpreadsheet, TrendingUp } from 'lucide-react';

export function ScheduleMetrics() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div style={{ height: '94.095px', paddingLeft: '25px', marginLeft: '-3px', marginTop: '89px' }} className="bg-white border border-neutral-gray-200/90 rounded-3xl shadow-3xs flex items-center gap-5 hover:border-neutral-300 transition-all select-none">
        <div className="w-14 h-14 bg-[#FFF5F5] rounded-2xl flex items-center justify-center text-[#B3181C] shrink-0"><Clock className="h-6 w-6" /></div>
        <div>
          <h3 style={{ fontSize: '8px' }} className="font-black text-neutral-400 uppercase tracking-wider mb-0.5">Volume hebdomadaire</h3>
          <p style={{ height: '43.0035px', width: '122.684px', fontSize: '17px' }} className="font-black text-[#291715] leading-none flex items-center">24 Heures</p>
          <p style={{ fontSize: '10px', marginTop: '-17px' }} className="text-[#B3181C] font-extrabold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Conforme syllabus École 221</p>
        </div>
      </div>

      <div style={{ height: '94.095px', paddingLeft: '25px', marginLeft: '-3px', marginTop: '89px' }} className="bg-white border border-neutral-gray-200/90 rounded-3xl shadow-3xs flex items-center gap-5 hover:border-neutral-300 transition-all select-none">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#B3181C] shrink-0"><ShieldCheck className="h-6 w-6" /></div>
        <div>
          <h3 style={{ fontSize: '8px' }} className="font-black text-neutral-400 uppercase tracking-wider mb-0.5">Assiduité requise</h3>
          <p style={{ height: '43.0035px', width: '122.684px', fontSize: '17px' }} className="font-black text-on-surface leading-none flex items-center">100% Recommandé</p>
          <p style={{ fontSize: '10px', marginTop: '-17px' }} className="text-neutral-400 font-bold">Rapport d'absence sous 48h</p>
        </div>
      </div>

      <div style={{ height: '94.095px', paddingLeft: '25px', marginLeft: '-3px', marginTop: '89px' }} className="bg-white border border-neutral-gray-200/90 rounded-3xl shadow-3xs flex items-center gap-5 hover:border-neutral-300 transition-all select-none">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#10B981] shrink-0"><FileSpreadsheet className="h-6 w-6" /></div>
        <div>
          <h3 style={{ fontSize: '8px' }} className="font-black text-neutral-400 uppercase tracking-wider mb-0.5">Méthode pédagogique</h3>
          <p style={{ height: '43.0035px', width: '122.684px', fontSize: '17px' }} className="font-black text-on-surface leading-none flex items-center">Mode Hybride</p>
          <p style={{ fontSize: '10px', marginTop: '-17px' }} className="text-neutral-450 text-neutral-500 font-bold">Documents & Devoirs synchronisés</p>
        </div>
      </div>
    </div>
  );
}
