import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';
import { formatTimeRange, formatRoomName } from '../../utils/scheduleFormatter';

interface Props {
  readonly matched: ProfessorSchedule | undefined;
  readonly match: boolean;
  readonly rowSpan: number;
  readonly onSelectSession: (s: ProfessorSchedule) => void;
  readonly liveSessions?: readonly any[];
}

export function ProfessorGridCell({ matched, match, rowSpan, onSelectSession, liveSessions = [] }: Props) {
  if (!matched) return null;

  const { start, end, display } = formatTimeRange(matched.time);
  const formattedRoom = formatRoomName(matched.room);

  const activeSession = Array.isArray(liveSessions) && matched ? liveSessions.find((s: any) => s && s.status === 'active' && s.courseName && matched.courseTitle && s.courseName.toLowerCase() === matched.courseTitle.toLowerCase()) : null;

  return (
    <div 
      onClick={() => match && onSelectSession(matched)} 
      style={{ height: `${rowSpan * 105}px` }} 
      className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden border ${
        !match ? 'opacity-10 grayscale scale-[0.98] pointer-events-none' : 
        matched.status === 'annule' ? 'bg-neutral-100 text-neutral-400 border-neutral-250 cursor-pointer' :
        activeSession ? 'bg-[#FFF5F5] border-[#B3181C]/30 shadow-md ring-4 ring-[#B3181C]/5 cursor-pointer hover:shadow-lg' :
        matched.type === 'CM' ? 'bg-[#FFF5F5] border-[#B3181C]/15 hover:bg-[#ffebeb] text-[#291715] cursor-pointer' : 
        matched.type === 'TP' ? 'bg-[#E1F7EC] border-[#10B981]/20 hover:bg-[#d0f2df] text-neutral-850 cursor-pointer' : 
        'bg-blue-50/70 border-blue-200/50 hover:bg-blue-100 text-neutral-850 cursor-pointer'
      }`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-[9.5px] font-extrabold text-neutral-500 bg-white/65 px-1.5 py-0.5 rounded-md border border-neutral-200/40">
            <Clock className="h-2.5 w-2.5 text-[#B3181C]" />
            <span>{start} ➔ {end}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {activeSession && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest bg-white text-[#B3181C] border border-[#B3181C]/10">{matched.type}</span>
          </div>
        </div>
        <div>
          <h4 className="font-black text-xs leading-snug text-[#291715] line-clamp-1 group-hover:text-[#B3181C] transition-colors">
            {matched.classe || 'L3-GL'}
          </h4>
          <p className="text-[10px] text-neutral-400 font-bold leading-tight truncate mt-0.5">
            {matched.courseTitle}
          </p>
        </div>
        {matched.status === 'annule' && (
          <p className="text-[8.5px] text-brand-red-deep font-black uppercase tracking-wider bg-red-50/50 inline-block px-1.5 py-0.5 rounded border border-red-250/20">
            Annulé
          </p>
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-neutral-200/20 flex items-center justify-between gap-1">
        <span className="text-[9px] flex items-center gap-1 font-black text-[#B3181C]">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{formattedRoom}</span>
        </span>
        {activeSession ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (activeSession.hlsUrl) {
                window.open(activeSession.hlsUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="py-1 px-2 rounded-lg bg-[#B3181C] hover:bg-[#8c1215] text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs shrink-0 cursor-pointer border-0 animate-pulse"
          >
            <span className="w-1 h-1 rounded-full bg-white animate-ping shrink-0" />
            Rejoindre
          </button>
        ) : (
          <span className="text-[8.5px] font-black uppercase group-hover:inline-block hidden text-[#B3181C] shrink-0">
            Gérer &rarr;
          </span>
        )}
      </div>
    </div>
  );
}

