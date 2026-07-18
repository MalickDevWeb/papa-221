import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { LiveSession } from '@/features/student/types';

interface RealTimeMeetRoomProps {
  readonly selectedLive: LiveSession;
  readonly onLeave: () => void;
  readonly triggerToast: (msg: string) => void;
  readonly userName?: string;
}

export function RealTimeMeetRoom({ selectedLive, onLeave, triggerToast }: RealTimeMeetRoomProps) {
  const meetUrl = selectedLive.hlsUrl || "https://meet.google.com";

  const handleOpenMeet = () => {
    window.open(meetUrl, '_blank', 'noopener,noreferrer');
    triggerToast("Ouverture de Google Meet...");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="w-full bg-neutral-950 rounded-3xl overflow-hidden relative border-4 border-blue-600 shadow-[0_0_50px_rgba(26,115,232,0.3)] flex flex-col min-h-[500px] h-full justify-between"
    >
      <div className="p-4 bg-neutral-900 border-b border-white/5 flex items-center justify-between z-10 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping shrink-0" />
          <span className="font-mono text-[9px] font-black text-blue-500 uppercase tracking-widest shrink-0">
            Amphi Google Meet
          </span>
          <span className="text-white/20 text-xs">|</span>
          <h4 className="text-xs font-bold text-white truncate">{selectedLive.courseName}</h4>
        </div>
        <button 
          onClick={onLeave} 
          className="bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white px-3.5 py-1.5 rounded-xl font-extrabold transition-all text-xs flex items-center gap-1 cursor-pointer hover:scale-102 active:scale-98"
        >
          <Icon icon="lucide:arrow-left" className="h-3.5 w-3.5" /> Retour
        </button>
      </div>

      <div className="flex-grow flex flex-col relative bg-gradient-to-b from-neutral-900 to-[#0e1624]">
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6 max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl scale-125 animate-pulse" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border border-white/10 flex items-center justify-center shadow-2xl relative">
              <Icon icon="logos:google-meet" className="h-10 w-10 filter drop-shadow-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#E3A857] font-black">
              Cours Google Meet Prêt
            </span>
            <h3 className="text-base font-black text-white tracking-tight sm:text-lg">Rejoindre la classe virtuelle</h3>
            <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
              Votre professeur, <span className="text-[#E3A857] font-extrabold">{selectedLive.teacherName}</span>, anime la session : <br />
              <span className="text-white font-black">"{selectedLive.title}"</span>.
            </p>
          </div>

          <button 
            onClick={handleOpenMeet} 
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-[#1557b0] hover:from-blue-500 hover:to-[#1a73e8] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-3 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
          >
            <Icon icon="lucide:external-link" className="h-4 w-4" />
            Rejoindre sur Google Meet
          </button>

          <p className="text-[10px] text-neutral-500 font-medium max-w-sm mt-2 leading-relaxed bg-white/5 border border-white/5 rounded-2xl p-3">
            ⚠️ <span className="font-bold text-neutral-300">Note de sécurité :</span> Google Meet interdit strictement son affichage dans un iframe externe. Pour des performances et des fonctionnalités optimales (partage d'écran, caméra, audio HD), la réunion s'ouvre de manière sécurisée dans un nouvel onglet !
          </p>
        </div>
      </div>

      <div className="p-3 bg-neutral-950 border-t border-white/5 text-center shrink-0">
        <p className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
          <Icon icon="lucide:shield-check" className="h-3.5 w-3.5 text-blue-500/50" />
          École 221 • Espace Amphi Virtuel Sécurisé
        </p>
      </div>
    </motion.div>
  );
}

export default RealTimeMeetRoom;
