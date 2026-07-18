import React from 'react';
import { AcademicYear } from './GradesData';
import { CustomPdfOptions } from './generateCustomGradePdf';

interface Props {
  year: AcademicYear;
  options: CustomPdfOptions;
}

const THEME_STYLES = {
  red: { primaryBg: 'bg-[#B3181C]', text: 'text-[#B3181C]', border: 'border-rose-100', lightBg: 'bg-rose-50' },
  blue: { primaryBg: 'bg-[#1E293B]', text: 'text-[#1E293B]', border: 'border-slate-100', lightBg: 'bg-slate-50' },
  green: { primaryBg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-100', lightBg: 'bg-emerald-50' },
  gold: { primaryBg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-100', lightBg: 'bg-amber-50' },
};

export function BulletinLivePreview({ year, options }: Props) {
  const styles = THEME_STYLES[options.themeColor] || THEME_STYLES.red;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-md font-sans text-left flex flex-col h-full">
      {/* Header Banner */}
      <div className={`${styles.primaryBg} p-4 text-white flex justify-between items-center transition-colors duration-300`}>
        <div>
          <span className="text-[8px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full tracking-wider">
            Année {options.academicYear}
          </span>
          <h4 className="text-sm font-black mt-1 tracking-tight truncate max-w-[280px]">
            {options.specialty}
          </h4>
          <p className="text-[10px] text-white/80 font-bold">{options.level}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-black text-xs text-[#E3A857]">
          221
        </div>
      </div>

      {/* Student identity bar */}
      <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
        <div>
          <span className="text-[8px] font-black uppercase text-neutral-400 block tracking-wider">Titulaire</span>
          <span className="text-[11px] font-extrabold text-neutral-700">{options.studentName}</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-black uppercase text-neutral-400 block tracking-wider">Statut Annuel</span>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            {year.status}
          </span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="p-3 grid grid-cols-4 gap-2 border-b border-neutral-100 bg-white">
        {[
          { label: 'Moyenne S2', val: `${year.average.toFixed(2)}`, tag: `Mention ${year.mention}` },
          { label: 'GPA Estimé', val: `${year.gpa.toFixed(1)}`, tag: 'Excellent' },
          { label: 'ECTS', val: `${year.ects}/${year.totalEcts}`, tag: '100% validés' },
          { label: 'Rang', val: year.ranking, tag: year.top },
        ].map((item, idx) => (
          <div key={idx} className="bg-neutral-50/60 p-2 rounded-xl border border-neutral-150 text-center">
            <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-tight block truncate">{item.label}</span>
            <span className="text-xs font-black text-neutral-800 mt-0.5 block">{item.val}</span>
            <span className="text-[7px] font-bold text-[#E3A857] block truncate">{item.tag}</span>
          </div>
        ))}
      </div>

      {/* Scrollable list of modules */}
      <div className="p-3 overflow-y-auto max-h-[160px] bg-white divide-y divide-neutral-100">
        {year.modules.map((m, idx) => (
          <div key={idx} className="py-2 flex justify-between items-center text-xs">
            <div className="truncate max-w-[170px]">
              <span className="font-bold text-neutral-700 block truncate">{m.module}</span>
              <span className="text-[8px] font-bold text-neutral-400">{m.prof}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[9px] font-bold text-neutral-500">{m.ects} ECTS</span>
              <span className={`font-black ${styles.text}`}>{m.note.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Signature Bar */}
      <div className="p-3 bg-neutral-50 border-t border-neutral-100 mt-auto text-[9px] font-bold text-neutral-500 flex justify-between items-center">
        <div>
          <span className="text-[7px] font-black text-neutral-400 uppercase block">Autorité</span>
          <span className="text-[9px] font-black text-neutral-700 block truncate max-w-[190px]">{options.signature}</span>
        </div>
        <div className="text-right flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
          <span className="material-symbols-outlined text-[10px] font-black">verified</span>
          <span className="text-[8px] font-black uppercase tracking-wider">Signé Num.</span>
        </div>
      </div>
    </div>
  );
}
