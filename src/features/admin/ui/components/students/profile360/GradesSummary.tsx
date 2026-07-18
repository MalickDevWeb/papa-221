import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { copyToClipboard, exportToCSV } from './utils/ExportUtils';

interface ChartProps {
  chartData: any[];
}

export function GradesChart({ chartData }: ChartProps) {
  return (
    <div className="border border-neutral-100 p-3 bg-neutral-50/50 rounded-2xl space-y-1.5" id="grades-chart">
      <h4 className="font-extrabold text-[#1E293B] text-[11px] uppercase tracking-wider text-[#B3181C] flex items-center gap-1.5">
        <span translate="no" className="material-symbols-outlined text-sm">bar_chart</span>
        Comparatif Notes VS Moyenne de la Classe
      </h4>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} />
            <YAxis domain={[0, 20]} tick={{ fontSize: 9, fontWeight: 'bold' }} />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
            <Bar dataKey="Note" fill="#B3181C" radius={[4, 4, 0, 0]} name="Note Élève" />
            <Bar dataKey="MoyenneClasse" fill="#E2DCDA" radius={[4, 4, 0, 0]} name="Moyenne Classe" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface ReportProps {
  gpa: string;
  filteredGrades: any[];
  studentName: string;
}

export function PerformanceReport({ gpa, filteredGrades, studentName }: ReportProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyGrades = () => {
    const text = filteredGrades.map(g => `${g.module}: ${g.grade}/20 (Coef. ${g.coefficient})`).join('\n');
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-neutral-100 p-4 bg-white rounded-2xl space-y-3 flex flex-col justify-between" id="performance-report">
      <div className="space-y-2">
        <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-[#B3181C] flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-sm">assessment</span>
          Rapport de Performance ERP
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            <span className="text-[9px] text-neutral-400 font-bold block uppercase">GPA global</span>
            <span className="text-[#1E293B] font-black text-xs">{gpa} / 4.0</span>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            <span className="text-[9px] text-neutral-400 font-bold block uppercase">Rang de classe</span>
            <span className="text-[#1E293B] font-black text-xs">2ème sur 38</span>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            <span className="text-[9px] text-neutral-400 font-bold block uppercase">Crédits ECTS</span>
            <span className="text-emerald-700 font-black text-xs">150 validés</span>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            <span className="text-[9px] text-neutral-400 font-bold block uppercase">Décision Jury</span>
            <span className="text-emerald-800 font-black text-[10px] uppercase">Félicitations Unanimes</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleCopyGrades} className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl font-bold text-[10px] uppercase cursor-pointer flex items-center gap-1">
          <span translate="no" className="material-symbols-outlined text-xs">content_copy</span>
          <span>{copied ? 'Copié !' : 'Copier notes'}</span>
        </button>
        <button onClick={() => exportToCSV(filteredGrades, `Notes_${studentName}`)} className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl font-bold text-[10px] uppercase cursor-pointer flex items-center gap-1">
          <span translate="no" className="material-symbols-outlined text-xs">download</span>
          <span>Exporter CSV</span>
        </button>
      </div>
    </div>
  );
}
