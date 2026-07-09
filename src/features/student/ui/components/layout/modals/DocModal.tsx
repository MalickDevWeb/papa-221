import React from 'react';
import { createPortal } from 'react-dom';

const DOC_SECTIONS = [
  { title: "1. Charte du passage académique", content: "Le passage nécessite une moyenne minimale de 10/20. Toute note inférieure à 07/20 dans une UE majeure est éliminatoire." },
  { title: "2. Coefficients et barème", content: "CM représentent 40%, TP 30%, et les TD/Devoirs à la maison 30%." },
  { title: "3. Guide étudiant : Démarrage", content: "Le portail centralise vos emplois du temps, vos devoirs et la progression de vos notes." },
];

interface Props {
  showDocModal: boolean; setShowDocModal: (v: boolean) => void;
  openDocSection: number | null; setOpenDocSection: (v: number | null) => void;
}

export function DocModal({ showDocModal, setShowDocModal, openDocSection, setOpenDocSection }: Props) {
  if (!showDocModal) return null;
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[260] flex items-center justify-center p-4 animate-fade-in select-none"
      onClick={() => setShowDocModal(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-md border border-neutral-gray-200/50 shadow-2xl overflow-hidden flex flex-col max-h-[min(90vh,40rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-brand-red-deep to-[#8C1014] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-base">menu_book</span><h4 className="font-extrabold text-xs">Documentation & Règlements</h4></div>
          <button onClick={() => setShowDocModal(false)} className="text-white/85 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"><span translate="no" className="material-symbols-outlined text-xs">close</span></button>
        </div>
        <div className="flex-grow p-4 space-y-3">
          <p className="text-[10px] text-secondary leading-relaxed font-bold">Reglementation et barème d'évaluation de l'École 221.</p>
          <div className="space-y-2">
            {DOC_SECTIONS.map((sec, idx) => {
              const isOpen = openDocSection === idx;
              return (
                <div key={idx} className="border border-neutral-gray-250 rounded-xl overflow-hidden bg-neutral-gray-50/50">
                  <button type="button" onClick={() => setOpenDocSection(isOpen ? null : idx)} className="w-full text-left p-3 flex justify-between items-center bg-white hover:bg-neutral-gray-50 font-bold text-xs text-[#1E293B] select-none cursor-pointer">
                    {sec.title}
                    <span className="material-symbols-outlined text-xs text-neutral-gray-400">{isOpen ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {isOpen && <div className="p-3 border-t border-neutral-200 text-[10.5px] text-[#1E293B] leading-relaxed bg-white">{sec.content}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 bg-neutral-gray-50 border-t border-neutral-gray-150 shrink-0 text-right">
          <button onClick={() => setShowDocModal(false)} className="w-full py-2.5 bg-brand-red-deep text-white hover:bg-brand-red-deep/90 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer">Fermer</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
