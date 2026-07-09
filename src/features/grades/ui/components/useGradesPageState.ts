import { useState, useEffect } from 'react';
import { AcademicYear, PREVIOUS_YEARS } from './GradesData';
import { Grade } from '@/features/grades/domain/Grade';
import { downloadPreviousYearPDF } from './GradesPdfGenerator';
import { downloadCurrentYearPDF } from './CurrentGradesPdfGenerator';

export function useGradesPageState(grades: Grade[], simulateGradeChange: (m: string, f: 'cc' | 'examen', v: number) => void) {
  const [activeModule, setActiveModule] = useState<Grade | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [onlyOneYearMode, setOnlyOneYearMode] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    document.body.style.overflow = selectedYear || showYearSelector ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedYear, showYearSelector]);

  const handleDownloadPDF = (yearData: AcademicYear) => {
    setIsDownloading(true);
    downloadPreviousYearPDF(
      yearData,
      (p) => setDownloadProgress(p),
      () => {
        setIsDownloading(false);
        triggerToast(`Le bulletin de l'année ${yearData.year} au format PDF a été généré avec succès !`);
      }
    );
  };

  const handleDownloadCurrentPDF = (
    calculatedGrades: Array<{ module: string; prof: string; ects: number; note: number; moyPromo: number }>,
    averageMoyenne: number,
    currentGPA: number,
    validatedECTS: number
  ) => {
    setIsDownloading(true);
    triggerToast("Génération de votre relevé officiel S2 en cours...");
    downloadCurrentYearPDF(
      {
        average: averageMoyenne,
        gpa: currentGPA,
        ects: validatedECTS,
        totalEcts: 30,
        modules: calculatedGrades,
      },
      (p) => setDownloadProgress(p),
      () => {
        setIsDownloading(false);
        triggerToast("Le relevé de notes officiel provisoire S2 a été téléchargé !");
      }
    );
  };

  const handleShowPreviousYears = () => {
    const years = onlyOneYearMode ? [PREVIOUS_YEARS[0]] : PREVIOUS_YEARS;
    if (years.length === 1) {
      setSelectedYear(years[0]);
    } else {
      setShowYearSelector(true);
    }
  };

  const handleSimulate = (moduleName: string, type: 'cc' | 'examen', val: number) => {
    simulateGradeChange(moduleName, type, val);
    if (activeModule && activeModule.module === moduleName) {
      setActiveModule({ ...activeModule, [type]: val });
    }
  };

  return {
    activeModule,
    setActiveModule,
    showToast,
    triggerToast,
    onlyOneYearMode,
    setOnlyOneYearMode,
    showYearSelector,
    setShowYearSelector,
    selectedYear,
    setSelectedYear,
    isDownloading,
    downloadProgress,
    handleDownloadPDF,
    handleDownloadCurrentPDF,
    handleShowPreviousYears,
    handleSimulate,
    previousYears: PREVIOUS_YEARS
  };
}
