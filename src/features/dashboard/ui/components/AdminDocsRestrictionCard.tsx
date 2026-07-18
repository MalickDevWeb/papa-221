import React, { useState } from 'react';
import { useDeviceStore } from '@/features/screenguard/hooks/useDeviceStore';
import { FileText, ShieldAlert, Monitor, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminDocsRestrictionCard() {
  const { isDesktop } = useDeviceStore();
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  const handleAction = () => {
    if (!isDesktop) {
      setShowBlockedModal(true);
    } else {
      alert("Accès autorisé sur Ordinateur ! Chargement du module administratif...");
    }
  };

  return (
    <div className="col-span-12 sm:col-span-6 bg-white border border-neutral-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px] font-sans">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#1E293B] font-extrabold text-sm">
          <FileText className="h-5 w-5 text-[#B3181C]" />
          <span>Documents & Bourses</span>
        </div>
        <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
          Gérez vos dossiers d'inscription, documents administratifs officiels et demandes de bourses d'excellence.
        </p>
      </div>

      <button
        onClick={handleAction}
        className="mt-4 w-full text-center bg-neutral-100 hover:bg-neutral-200/80 text-[#1E293B] text-[10px] font-black uppercase py-2.5 px-4 rounded-xl transition-all cursor-pointer"
      >
        Ouvrir le module
      </button>

      {/* Blocked Modal Dialog */}
      <AnimatePresence>
        {showBlockedModal && (
          <div className="fixed inset-0 z-[400] bg-slate-950/85 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-neutral-200 shadow-2xl rounded-3xl p-6 max-w-sm w-full text-center relative overflow-hidden"
            >
              <button
                onClick={() => setShowBlockedModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-50 text-[#B3181C] rounded-2xl">
                  <ShieldAlert className="h-8 w-8" />
                </div>
              </div>

              <h3 className="text-xl font-black text-[#1E293B] mb-2">
                🚫 Action requise sur ordinateur
              </h3>

              <p className="text-xs text-neutral-500 leading-relaxed font-semibold mb-5">
                La modification de documents administratifs officiels lourds et les dépôts de candidatures aux bourses complexes requièrent un écran d'ordinateur de bureau.
              </p>

              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 flex gap-3 items-center text-left mb-5">
                <Monitor className="h-5 w-5 text-neutral-400 shrink-0" />
                <p className="text-[10px] text-neutral-600 font-extrabold leading-tight uppercase">
                  Veuillez vous connecter sur un ordinateur pour accéder à ce service.
                </p>
              </div>

              <button
                onClick={() => setShowBlockedModal(false)}
                className="w-full bg-[#1E293B] hover:bg-black text-white text-xs font-extrabold uppercase py-3 rounded-xl transition-colors cursor-pointer"
              >
                Compris, fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
