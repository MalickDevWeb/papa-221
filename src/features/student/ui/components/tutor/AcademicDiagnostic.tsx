import React from 'react';
import { Award, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';

interface Grade {
  id: string;
  module: string;
  prof: string;
  cc: number;
  examen: number;
  moyPromo: number;
}

interface Homework {
  id: string;
  statut: string;
}

interface AcademicDiagnosticProps {
  grades: Grade[];
  homeworks: Homework[];
}

export function AcademicDiagnostic({ grades, homeworks }: AcademicDiagnosticProps) {
  const getAvg = (g: Grade) => Number(((g.cc + g.examen) / 2).toFixed(2));

  // Compute stats
  const overallAvg = grades.length > 0
    ? Number((grades.reduce((acc, g) => acc + getAvg(g), 0) / grades.length).toFixed(2))
    : 0;

  const sortedGrades = [...grades].sort((a, b) => getAvg(a) - getAvg(b));
  const weakest = sortedGrades[0];
  const strongest = sortedGrades[sortedGrades.length - 1];

  const totalHW = homeworks.length;
  const submittedHW = homeworks.filter((h) => h.statut === 'soumis').length;
  const hwPercent = totalHW > 0 ? Math.round((submittedHW / totalHW) * 100) : 0;

  return (
    <div className="bg-[#FAF9F7] rounded-2xl border border-neutral-gray-200 p-3.5 space-y-3 shadow-3xs" id="academic-diagnostic-panel">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-[#3f1e1e]" />
          Diagnostic Académique
        </h3>
        <span className="text-[9px] font-black uppercase bg-[#3f1e1e]/10 text-[#3f1e1e] px-2 py-0.5 rounded-full">
          Moyenne: {overallAvg}/20
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Strongest Subject */}
        {strongest && (
          <div className="bg-white rounded-xl border border-neutral-gray-150 p-2.5 space-y-0.5 hover:shadow-3xs transition-shadow">
            <span className="text-[8.5px] font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <Award className="h-2.5 w-2.5" /> Point Fort 🌟
            </span>
            <h4 className="font-black text-[10px] text-neutral-800 line-clamp-1">{strongest.module}</h4>
            <p className="text-[9.5px] text-secondary font-bold">Moyenne: {getAvg(strongest)}/20</p>
          </div>
        )}

        {/* Weakest Subject */}
        {weakest && (
          <div className="bg-white rounded-xl border border-neutral-gray-150 p-2.5 space-y-0.5 hover:shadow-3xs transition-shadow">
            <span className="text-[8.5px] font-extrabold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="h-2.5 w-2.5" /> Axe de Progrès ⚠️
            </span>
            <h4 className="font-black text-[10px] text-neutral-800 line-clamp-1">{weakest.module}</h4>
            <p className="text-[9.5px] text-secondary font-bold">Moyenne: {getAvg(weakest)}/20</p>
          </div>
        )}
      </div>

      {/* Homework Completion Gauge */}
      <div className="bg-white rounded-xl border border-neutral-gray-150 p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-[#3f1e1e]" /> Devoirs Complétés
          </span>
          <span className="text-[10px] font-black text-neutral-700">{submittedHW} / {totalHW} ({hwPercent}%)</span>
        </div>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#3f1e1e] h-full rounded-full transition-all duration-500" 
            style={{ width: `${hwPercent}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
