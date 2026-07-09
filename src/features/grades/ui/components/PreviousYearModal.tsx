import React from 'react';
import { createPortal } from 'react-dom';
import { AcademicYear } from './GradesData';

interface PreviousYearModalProps {
  selectedYear: AcademicYear; onClose: () => void;
  onDownload: (year: AcademicYear) => void; isDownloading: boolean; downloadProgress: number;
}

export function PreviousYearModal({ selectedYear, onClose, onDownload, isDownloading, downloadProgress }: PreviousYearModalProps) {
  const stats = [
    { label: "Moyenne Générale", value: `${selectedYear.average.toFixed(2)} / 20`, note: `Mention ${selectedYear.mention}`, color: "text-emerald-600" },
    { label: "GPA Estimé", value: `${selectedYear.gpa.toFixed(1)} / 4.0`, note: "Niveau Excellent", color: "text-neutral-400" },
    { label: "Crédits ECTS", value: `${selectedYear.ects} / ${selectedYear.totalEcts}`, note: "100% validés", color: "text-emerald-600" },
    { label: "Rang Promotion", value: selectedYear.ranking, note: selectedYear.top, color: "text-[#E3A857]" }
  ];

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-gray-200/45 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#291715] p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 p-1.5 rounded-xl text-white cursor-pointer border-0">
            <span className="material-symbols-outlined text-sm font-bold block">close</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-[#E3A857] text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">Année {selectedYear.year}</span>
            <span className="bg-emerald-500/30 text-emerald-300 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">{selectedYear.level} Validée</span>
          </div>
          <h3 className="font-headline-md text-xl font-black">{selectedYear.specialty}</h3>
        </div>

        <div className="bg-[#FAF9F7] p-5 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-neutral-gray-150 border-solid shrink-0">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl border border-neutral-gray-200 border-solid">
              <span className="text-[8.5px] font-black text-neutral-400 uppercase tracking-wider block">{stat.label}</span>
              <span className="text-sm font-black text-[#291715] mt-1 block">{stat.value}</span>
              <span className={`text-[8.5px] font-semibold mt-0.5 block ${stat.color}`}>{stat.note}</span>
            </div>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto p-5">
          <div className="border border-neutral-gray-200 rounded-2xl overflow-hidden bg-white border-solid">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#FAF9F7] border-b border-neutral-gray-200 text-[9px] uppercase text-neutral-500 font-bold border-solid">
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Crédits</th>
                  <th className="px-4 py-3">Note Finale</th>
                  <th className="px-4 py-3">Moy. Promo</th>
                  <th className="px-4 py-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-gray-150 text-xs divide-solid">
                {selectedYear.modules.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F7]/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#291715]">{m.module}</div>
                      <div className="text-[9px] text-neutral-400 font-semibold">{m.prof}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-neutral-600">{m.ects} ECTS</td>
                    <td className="px-4 py-3 font-extrabold text-[#B3181C]">{m.note.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-400">{m.moyPromo.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border-solid">Validé</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-5 bg-surface-container-low border-t border-neutral-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-4 border-solid shrink-0">
          <div className="text-left">
            <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Signature Officielle</span>
            <span className="text-[10px] font-black text-[#291715] block">Le Conseil de Direction - École 221</span>
            <span className="text-[9px] text-neutral-500 font-bold block font-sans">Document signé numériquement et certifié</span>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2.5 text-center border border-neutral-gray-300 bg-white rounded-xl text-xs font-black hover:bg-neutral-50 cursor-pointer border-solid">Fermer</button>
            <button disabled={isDownloading} onClick={() => onDownload(selectedYear)} className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-[#B3181C] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border-0">
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>Génération ({downloadProgress}%)</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm font-black">cloud_download</span>
                  <span>Télécharger</span>
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
