import React from 'react';
import { createPortal } from 'react-dom';
import { X, CalendarPlus, Download, Info, Loader2 } from 'lucide-react';
import { Icon } from '@iconify/react';
import { exportToICS } from '@/features/schedule/utils/icalExport';
import { initiateGoogleOAuth } from '@/features/schedule/utils/googleCalendarSync';

export function SyncModal({ state }: { state: any }) {
  const { isSyncModalOpen, setIsSyncModalOpen, googleAccessToken, handleGoogleDisconnect, handleFullSync, isSyncingWithGoogle, syncProgress, schedule, triggerToast } = state;
  if (!isSyncModalOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsSyncModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-neutral-200/60 flex flex-col transform transition-all duration-300 scale-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-[#B3181C] text-white relative flex-shrink-0">
          <button onClick={() => setIsSyncModalOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center border-0">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5"><span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-widest text-white">Intégration Google & iCal</span></div>
          <h4 className="text-xl font-black leading-tight tracking-tight">Synchronisation de l'agenda</h4>
        </div>
        <div className="p-6 space-y-6 bg-[#FAF8F6] overflow-y-auto flex-1">
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-3xs space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-red-50 text-[#B3181C] flex-shrink-0"><Download className="h-5 w-5" /></div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-sm text-[#291715]">Exporter en fichier Universel (.ics)</h5>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Téléchargez un fichier iCalendar standard contenant l'intégralité de vos cours. Vous pourrez l'importer en une seconde dans Google Calendar, Outlook, Outlook 365 ou Apple Calendar.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button onClick={() => { exportToICS(schedule, 'L3-GL'); triggerToast("Fichier .ics téléchargé avec succès ! Importez-le dans votre calendrier préféré."); setIsSyncModalOpen(false); }} className="w-full sm:w-auto px-5 py-2.5 bg-[#B3181C] hover:bg-[#8c1215] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#B3181C]/10">
                <Download className="h-4 w-4" /> Télécharger le calendrier (.ics)
              </button>
            </div>
          </div>

          <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3">
            <Info className="h-4 w-4 text-[#B3181C] shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              <strong className="font-extrabold text-[#B3181C]">Astuce :</strong> Une fois le fichier .ics téléchargé, ouvrez Google Calendar ou Apple Calendar et importez-le depuis les paramètres pour afficher vos cours en temps réel, sans aucune connexion de compte requise !
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-neutral-150 flex justify-end gap-2.5 flex-shrink-0">
          <button onClick={() => setIsSyncModalOpen(false)} className="px-6 py-2 border border-neutral-200 text-neutral-600 hover:text-[#291715] hover:bg-neutral-50 rounded-xl font-bold text-xs transition-all cursor-pointer">Fermer</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
