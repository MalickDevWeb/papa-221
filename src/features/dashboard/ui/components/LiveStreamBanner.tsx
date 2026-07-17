import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { LiveSession } from '@/features/student/types';

interface LiveStreamBannerProps {
  readonly liveSessions: LiveSession[];
  readonly onJoin: (id: string) => void;
}

export function LiveStreamBanner({ liveSessions, onJoin }: LiveStreamBannerProps) {
  const sessionsList = Array.isArray(liveSessions) ? liveSessions : [];
  const activeSession = sessionsList.find(s => s && s.status === 'active');

  if (!activeSession) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gradient-to-r from-neutral-900 via-[#1e0d0e] to-[#c41e22] p-6 rounded-3xl text-white mb-8 border border-white/10 shadow-[0_15px_30px_rgba(196,30,34,0.15)] flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden w-full max-w-[1200px] mx-auto"
    >
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none select-none" />

      <div className="relative z-10 flex items-center gap-5 text-left w-full md:w-auto">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-center font-black animate-pulse shadow-inner shrink-0">
          <Icon icon="lucide:video" className="h-7 w-7 text-[#FFB03A] animate-bounce" />
        </div>
        <div className="space-y-1 truncate flex-grow">
          <div className="flex gap-2.5 items-center flex-wrap">
            <span className="bg-emerald-500/25 text-emerald-300 text-[9px] px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 uppercase tracking-wider border border-emerald-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Direct
            </span>
            <span className="text-[11px] text-white/60 font-black uppercase tracking-wider truncate">{activeSession.courseName}</span>
          </div>
          <h4 className="font-sans text-[13px] font-black text-white leading-snug tracking-tight truncate">{activeSession.title}</h4>
          <p className="text-white/80 text-[11.5px] font-semibold flex items-center gap-1.5">
            <Icon icon="lucide:user" className="h-3.5 w-3.5 text-white/50" />
            <span>Par : {activeSession.teacherName}</span>
          </p>
        </div>
      </div>

      <button 
        onClick={() => onJoin(activeSession.id)}
        className="relative z-10 py-3.5 px-8 rounded-2xl bg-white text-[#c41e22] font-black text-xs uppercase tracking-wider hover:bg-neutral-50 shadow-xl shadow-black/15 transition-all hover:scale-104 cursor-pointer active:scale-96 flex items-center gap-2 border border-white/50 self-stretch md:self-auto justify-center"
      >
        <Icon icon="lucide:arrow-right-circle" className="h-4.5 w-4.5" />
        <span>Rejoindre</span>
      </button>
    </motion.div>
  );
}

export default LiveStreamBanner;
