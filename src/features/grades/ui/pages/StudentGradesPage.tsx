import React from 'react';
import { GradesHeader } from '../components/GradesHeader';
import { GradesAnalytics } from '../components/GradesAnalytics';
import { GradesTable } from '../components/GradesTable';
import { useGrades } from '@/features/grades/hooks/useGrades';
import { useGradesPageState } from '../components/useGradesPageState';
import { YearSelectorModal } from '../components/YearSelectorModal';
import { PreviousYearModal } from '../components/PreviousYearModal';

export function StudentGradesPage() {
  const { grades, calculatedGrades, validatedECTS, averageMoyenne, currentGPA, isLoading, error } = useGrades();
  const { showToast, triggerToast, onlyOneYearMode, setOnlyOneYearMode, showYearSelector, setShowYearSelector, selectedYear, setSelectedYear, isDownloading, downloadProgress, handleDownloadPDF, handleDownloadCurrentPDF, handleShowPreviousYears, previousYears } = useGradesPageState(grades, () => {});

  if (isLoading || error) {
    return (
      <main className="flex-1 p-4 md:p-8 bg-surface-container-lowest animate-fade-in min-h-screen flex items-center justify-center font-sans">
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

  return (
    <main className="flex-1 p-4 md:p-8 bg-surface-container-lowest animate-fade-in relative min-h-screen pb-24 md:pb-8 font-sans">
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#291715] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-slide-up text-xs font-bold border-solid">
          <span translate="no" className="material-symbols-outlined text-success-green">check_circle</span><span>{showToast}</span>
        </div>
      )}

      <div className="mb-6 border-b border-neutral-gray-200/50 pb-4">
        <h2 className="text-xl md:text-2xl text-on-surface font-black tracking-tight leading-tight">Espace Bulletins & Notes</h2>
        <p className="text-neutral-gray-500 font-semibold text-[11px] md:text-xs mt-1">Consultez vos résultats scolaires officiels et vos mentions.</p>
      </div>

      <GradesHeader onDownload={() => handleDownloadCurrentPDF(calculatedGrades, averageMoyenne, currentGPA, validatedECTS)} averageMoyenne={averageMoyenne} />
      <GradesAnalytics averageMoyenne={averageMoyenne} validatedECTS={validatedECTS} currentGPA={currentGPA} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8">
          <GradesTable grades={calculatedGrades} onShowPreviousYearClick={handleShowPreviousYears} />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-[#291715] to-[#1a0e0c] text-white p-6 rounded-3xl border border-white/5 shadow-md h-full flex flex-col justify-between border-solid">
            <div>
              <div className="flex items-center gap-2 mb-3 bg-white/10 w-fit px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-extrabold text-[#E3A857]">
                <span className="material-symbols-outlined text-xs animate-pulse">auto_awesome</span> ANALYSE DES CRÉDITS ECTS
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-4">Consultez la répartition et la validation officielle de vos crédits ECTS par rapport au barème de réussite de votre promotion.</p>
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

      {showYearSelector && <YearSelectorModal previousYears={previousYears} onlyOneYearMode={onlyOneYearMode} setOnlyOneYearMode={setOnlyOneYearMode} onSelectYear={(y) => { setSelectedYear(y); setShowYearSelector(false); }} onClose={() => setShowYearSelector(false)} onToast={triggerToast} />}
      {selectedYear && <PreviousYearModal selectedYear={selectedYear} onClose={() => setSelectedYear(null)} onDownload={handleDownloadPDF} isDownloading={isDownloading} downloadProgress={downloadProgress} />}
    </main>
  );
}
