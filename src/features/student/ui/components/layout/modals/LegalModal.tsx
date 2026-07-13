import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  showLegalModal: 'conditions' | 'privacy' | 'mentions' | null;
  setShowLegalModal: (v: 'conditions' | 'privacy' | 'mentions' | null) => void;
}

export function LegalModal({ showLegalModal, setShowLegalModal }: Props) {
  if (!showLegalModal) return null;
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[260] flex items-center justify-center p-4 animate-fade-in select-none"
      onClick={() => setShowLegalModal(null)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-sm border border-neutral-gray-200/50 shadow-2xl overflow-hidden flex flex-col max-h-[min(85vh,38rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#291715] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#E3A857] text-base">gavel</span><h4 className="font-extrabold text-xs">{showLegalModal === 'conditions' ? "Conditions d'Utilisation" : showLegalModal === 'privacy' ? "Politique de Confidentialité" : "Mentions Légales"}</h4></div>
          <button onClick={() => setShowLegalModal(null)} className="text-white/80 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"><span translate="no" className="material-symbols-outlined text-xs">close</span></button>
        </div>
        <div className="flex-grow p-5 font-medium text-[10.5px] text-[#291715] space-y-3.5 leading-relaxed">
          {showLegalModal === 'conditions' && (<><h5 className="font-bold text-xs text-[#B3181C]">Acceptation des Conditions</h5><p>L'accès au portail est réservé aux étudiants inscrits pour l'année universitaire active.</p><h5 className="font-bold text-xs text-[#B3181C]">Sécurité des Devoirs</h5><p>Tout plagiat fait l'objet d'un rapport transmis au conseil d'éthique.</p></>)}
          {showLegalModal === 'privacy' && (<><h5 className="font-bold text-xs text-[#B3181C]">Droit & Protection de vos données</h5><p>L'École 221 garantit que vos données académiques ne font l'objet d'aucune commercialisation.</p></>)}
          {showLegalModal === 'mentions' && (<><h5 className="font-bold text-xs text-[#B3181C]">Éditeur du Service</h5><p>Direction Centrale Pédagogique Numérique de l'Université de Dakar École 221.</p><h5 className="font-bold text-xs text-[#B3181C]">Hébergement Cloud</h5><p>Déployé sur l'infrastructure sécurisée de Cloud Run (Europe-West).</p></>)}
        </div>
        <div className="p-4 bg-neutral-gray-50 border-t border-neutral-gray-150 shrink-0 text-right">
          <button onClick={() => setShowLegalModal(null)} className="w-full py-2.5 bg-[#291715] hover:bg-[#402421] text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Fermer</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
