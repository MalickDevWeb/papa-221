import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CalendarPlus, Download } from 'lucide-react';
import { Icon } from '@iconify/react';
import { exportToICS } from '@/features/schedule/utils/icalExport';
import { initiateGoogleOAuth, syncAllCoursesToGoogleCalendar } from '@/features/schedule/utils/googleCalendarSync';
import { mapProfessorScheduleToCourseSession } from '../../utils/professorScheduleMapper';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly schedule: readonly ProfessorSchedule[];
  readonly googleAccessToken: string | null;
  readonly setGoogleAccessToken: (token: string | null) => void;
  readonly triggerToast: (msg: string) => void;
}

export function ProfessorSyncModal({
  isOpen,
  onClose,
  schedule,
  googleAccessToken,
  setGoogleAccessToken,
  triggerToast,
}: Props) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  if (!isOpen) return null;
  const mapped = schedule.map(mapProfessorScheduleToCourseSession);

  const handleFullSync = async () => {
    if (!googleAccessToken) return;
    setIsSyncing(true);
    setProgress({ current: 0, total: mapped.length });
    try {
      const result = await syncAllCoursesToGoogleCalendar(googleAccessToken, mapped, (c, t) => setProgress({ current: c, total: t }));
      triggerToast(`${result.successCount} cours synchronisés sur Google Calendar !`);
      onClose();
    } catch {
      triggerToast("Erreur lors de la synchronisation.");
    } finally {
      setIsSyncing(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-neutral-200/60 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-[#B3181C] text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full border-0 bg-transparent cursor-pointer"><X className="h-5 w-5" /></button>
          <div className="text-[9px] font-black uppercase tracking-widest text-white/80 mb-1">Intégration Google & iCal</div>
          <h4 className="text-xl font-black tracking-tight">Synchronisation de mon agenda</h4>
        </div>
        <div className="p-6 space-y-6 bg-[#FAF8F6] overflow-y-auto">
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-3xs space-y-4">
            <div className="flex gap-3">
              <Download className="h-5 w-5 text-[#B3181C] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-extrabold text-sm text-[#291715]">Exporter mon planning en fichier .ics</h5>
                <p className="text-xs text-secondary mt-1">Téléchargez un fichier iCalendar compatible avec Google Calendar, Outlook et Apple Calendar.</p>
              </div>
            </div>
            <div className="pt-2 border-t border-neutral-100 flex justify-end">
              <button onClick={() => { exportToICS(mapped, 'Enseignant'); triggerToast("Fichier .ics téléchargé avec succès !"); onClose(); }} className="px-5 py-2.5 bg-[#B3181C] hover:bg-[#8c1215] text-white rounded-xl font-black text-xs uppercase cursor-pointer border-0 flex items-center gap-2 shadow-sm shadow-[#B3181C]/10">
                <Download className="h-4 w-4" /> Télécharger mon planning (.ics)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
