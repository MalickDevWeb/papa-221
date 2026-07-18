import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AcademicYear } from './GradesData';
import { CustomPdfOptions, generateCustomGradePdf } from './generateCustomGradePdf';
import { BulletinCustomizerForm } from './BulletinCustomizerForm';
import { BulletinLivePreview } from './BulletinLivePreview';

interface Props {
  selectedYear: AcademicYear;
  onClose: () => void;
  onDownload: (year: AcademicYear) => void; // legacy or bypassed
  isDownloading: boolean;
  downloadProgress: number;
}

export function PreviousYearModal({ selectedYear, onClose }: Props) {
  const [options, setOptions] = useState<CustomPdfOptions>({
    studentName: 'Oumou Teuw',
    specialty: selectedYear.specialty || 'Génie Logiciel',
    level: selectedYear.level || 'Licence 3',
    academicYear: selectedYear.year || '2023-2024',
    signature: 'Le Conseil de Direction - École 221',
    themeColor: 'red',
  });

  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    setDownloading(true);
    setProgress(10);
    generateCustomGradePdf(
      selectedYear,
      options,
      (p) => setProgress(p),
      () => {
        setDownloading(false);
      }
    );
  };

  return createPortal(
    <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-md z-[500] flex items-center justify-center p-4 animate-fade-in font-sans" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh] animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#291715] to-[#452724] p-5 text-white flex justify-between items-center relative shrink-0">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">workspace_premium</span>
              Relevé & Bulletin de Notes Officiel
            </h3>
            <p className="text-[10px] sm:text-xs text-white/70 font-semibold mt-0.5">
              Personnalisez les détails de l'étudiant, l'autorité signataire et le thème de couleur avant de télécharger.
            </p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white cursor-pointer border-0 transition-colors">
            <span className="material-symbols-outlined text-sm font-black block">close</span>
          </button>
        </div>

        {/* Modal Content - Two Columns */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Left Column: Live Preview */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <h5 className="font-black text-[10px] text-neutral-400 uppercase tracking-widest mb-2 text-left">Aperçu en Direct</h5>
            <BulletinLivePreview year={selectedYear} options={options} />
          </div>

          {/* Right Column: Customizer Form */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <BulletinCustomizerForm options={options} onChange={setOptions} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-white border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[9px] font-black text-neutral-400 uppercase block tracking-wider">Homologation Numérique</span>
            <span className="text-[10px] font-bold text-neutral-600 block">
              Bulletin généré en haute résolution PDF avec signature sécurisée.
            </span>
          </div>
          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
            <button onClick={onClose} className="px-4 py-2.5 border border-neutral-300 bg-white rounded-xl text-xs font-black text-neutral-600 hover:bg-neutral-50 cursor-pointer transition-colors">
              Fermer
            </button>
            <button
              disabled={downloading}
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#B3181C] hover:bg-[#921316] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border-0 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>Génération ({progress}%)</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm font-black">cloud_download</span>
                  <span>Télécharger le PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
