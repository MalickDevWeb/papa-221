import React from 'react';
import { GradesHeader } from '../components/GradesHeader';
import { GradesAnalytics } from '../components/GradesAnalytics';
import { GradesPerformanceChart } from '../components/GradesPerformanceChart';
import { GradesTable } from '../components/GradesTable';
import { useGrades } from '@/features/grades/hooks/useGrades';
import { calculateFinalNote } from '@/features/grades/domain/Grade';
import { useGradesPageState } from '../components/useGradesPageState';
import { GradeSimulationModal } from '../components/GradeSimulationModal';
import { YearSelectorModal } from '../components/YearSelectorModal';
import { PreviousYearModal } from '../components/PreviousYearModal';

export function StudentGradesPage() {
  const { grades, calculatedGrades, validatedECTS, averageMoyenne, currentGPA, isLoading, error, simulateGradeChange, resetSimulation } = useGrades();
  const { activeModule, setActiveModule, showToast, triggerToast, onlyOneYearMode, setOnlyOneYearMode, showYearSelector, setShowYearSelector, selectedYear, setSelectedYear, isDownloading, downloadProgress, handleDownloadPDF, handleDownloadCurrentPDF, handleShowPreviousYears, handleSimulate, previousYears } = useGradesPageState(grades, simulateGradeChange);

  if (isLoading || error) {
    return (
      <main className="flex-1 p-4 md:p-8 bg-surface-container-lowest animate-fade-in min-h-screen flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-brand-red-deep/20 border-t-brand-red-deep rounded-full animate-spin" />
            <p className="text-xs font-bold text-secondary">Chargement de votre relevé de notes...</p>
          </div>
        ) : (
          <div className="bg-red-50 text-brand-red-deep p-6 rounded-2xl border border-red-100 text-center border-solid">
            <span className="material-symbols-outlined text-[32px] mb-2">error</span>
            <h3 className="font-bold">Erreur</h3><p className="text-sm">{error}</p>
          </div>
        )}
      </main>
    );
  }

  const getUEVal = (idx: number) => calculateFinalNote(grades[idx].cc, grades[idx].examen);
  const ues = grades.length >= 4 ? [
    { label: 'UE1: Algorithmique & Data Science', note: Number(getUEVal(0).toFixed(1)), myWidth: `${Math.min(100, (getUEVal(0) * 5)).toFixed(1)}%`, promoWidth: `${Math.min(100, (grades[0].moyPromo * 5)).toFixed(1)}%` },
    { label: 'UE2: Architecture Cloud & DevOps', note: Number(((getUEVal(1) + getUEVal(2)) / 2).toFixed(1)), myWidth: `${Math.min(100, ((getUEVal(1) + getUEVal(2)) * 2.5)).toFixed(1)}%`, promoWidth: `${Math.min(100, ((grades[1].moyPromo + grades[2].moyPromo) * 2.5)).toFixed(1)}%` },
    { label: 'UE3: Management de Projet', note: Number(getUEVal(3).toFixed(1)), myWidth: `${Math.min(100, (getUEVal(3) * 5)).toFixed(1)}%`, promoWidth: `${Math.min(100, (grades[3].moyPromo * 5)).toFixed(1)}%` },
  ] : [];

  return (
    <main className="flex-1 p-4 md:p-8 bg-surface-container-lowest animate-fade-in relative min-h-screen pb-24 md:pb-8 font-sans">
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#291715] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-slide-up text-xs font-bold border-solid">
          <span translate="no" className="material-symbols-outlined text-success-green">check_circle</span><span>{showToast}</span>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-gray-200/50 pb-6 border-solid">
        <div className="w-full">
          <h2 className="font-headline-lg text-[22px] sm:text-3xl font-black text-on-surface">Espace Bulletins & Notes</h2>
          <p className="text-xs sm:text-sm sm:text-body-md text-secondary mt-1 font-medium">Simulez vos résultats scolaires en direct et anticipez vos mentions.</p>
        </div>
      </div>

      <GradesHeader onDownload={() => handleDownloadCurrentPDF(calculatedGrades, averageMoyenne, currentGPA, validatedECTS)} averageMoyenne={averageMoyenne} />
      <GradesAnalytics averageMoyenne={averageMoyenne} validatedECTS={validatedECTS} currentGPA={currentGPA} />
      {ues.length > 0 && <div className="mb-8"><GradesPerformanceChart ues={ues} /></div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8">
          <GradesTable grades={calculatedGrades} onRowClick={(name) => setActiveModule(grades.find(g => g.module === name) || null)} onShowPreviousYearClick={handleShowPreviousYears} />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-[#291715] to-[#1a0e0c] text-white p-6 rounded-3xl border border-white/5 shadow-md h-full flex flex-col justify-between border-solid">
            <div>
              <div className="flex items-center gap-2 mb-3 bg-white/10 w-fit px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-extrabold text-[#E3A857]">
                <span className="material-symbols-outlined text-xs animate-pulse">auto_awesome</span> PROJECTION DE MENTION
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-4">Cliquez sur un des modules du tableau pour ouvrir sa structure, modifier sa note de contrôle continu ou d'examen et voir l'impact en temps réel sur vos crédits validés !</p>
            </div>
            <div className="bg-white/5 py-4 px-4 rounded-xl text-xs font-bold text-white/70 space-y-3 mt-4 md:mt-0">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-wider text-white/60">Total ECTS cumulés</span><span className="text-white font-extrabold">{validatedECTS} / 30 ECTS</span></div>
              <div className="flex justify-between items-center text-xs font-bold text-white/70">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/60">Statut d'année</span>
                {validatedECTS >= 30 ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border-solid">Admis d'office (S2)</span>
                ) : validatedECTS >= 20 ? (
                  <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/35 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border-solid">Admis sous réserve</span>
                ) : (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/35 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border-solid">Sessions rattrapages</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModule && <GradeSimulationModal activeModule={activeModule} onClose={() => setActiveModule(null)} onSimulate={handleSimulate} onReset={resetSimulation} onToast={triggerToast} />}
      {showYearSelector && <YearSelectorModal previousYears={previousYears} onlyOneYearMode={onlyOneYearMode} setOnlyOneYearMode={setOnlyOneYearMode} onSelectYear={(y) => { setSelectedYear(y); setShowYearSelector(false); }} onClose={() => setShowYearSelector(false)} onToast={triggerToast} />}
      {selectedYear && <PreviousYearModal selectedYear={selectedYear} onClose={() => setSelectedYear(null)} onDownload={handleDownloadPDF} isDownloading={isDownloading} downloadProgress={downloadProgress} />}
    </main>
  );
}
