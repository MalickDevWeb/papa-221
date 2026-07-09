import React from 'react';
import { LiveSession } from '@/features/student/types';

interface RegisteredCoursesProps {
  liveSessions: LiveSession[];
  onSelectLive: (id: string) => void;
}

export function RegisteredCourses({ liveSessions, onSelectLive }: RegisteredCoursesProps) {
  const sessionsList = Array.isArray(liveSessions) ? [...liveSessions] : [];
  
  // Sort active sessions first
  sessionsList.sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return 0;
  });

  return (
    <section className="col-span-12 space-y-4">
      <h3 className="font-title-lg text-sm font-black flex items-center justify-between text-[#291715]">
        <div className="flex items-center gap-2">
          <span translate="no" className="material-symbols-outlined text-brand-red-deep">school</span>
          <span>Maquette de mes cours (Analyse de crédits)</span>
        </div>
        {sessionsList.some(s => s.status === 'active') && (
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-brand-red-deep px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-brand-red-deep/10 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-brand-red-deep animate-ping" />
            Cours en direct actuellement
          </span>
        )}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessionsList.map((c, index) => {
          const progressPercentage = c.id === 'live-1' ? 78 : 50;
          const isActive = c.status === 'active';
          
          return (
            <div 
              key={`${c.id || 'live'}-${index}`} 
              className={`bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group p-5 flex flex-col justify-between border ${
                isActive 
                  ? 'border-brand-red-deep/40 shadow-[0_4px_20px_rgba(179,24,28,0.12)] ring-1 ring-brand-red-deep/20' 
                  : 'border-neutral-gray-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black bg-brand-red-light text-brand-red-deep px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    {c.teacherName}
                  </span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-brand-red-deep uppercase bg-red-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-brand-red-deep rounded-full animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span translate="no" className="material-symbols-outlined text-xs text-[#E3A857]">star</span>
                  )}
                </div>
                <h4 className="font-extrabold text-[13px] text-[#291715] group-hover:text-brand-red-deep transition-colors line-clamp-1">
                  {c.courseName}
                </h4>
                <p className="text-[10.5px] font-semibold text-secondary line-clamp-2 mt-1 leading-relaxed">
                  {c.title}
                </p>
              </div>
              <div className="mt-5 space-y-3">
                <div className="w-full bg-neutral-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${isActive ? 'bg-brand-red-deep' : 'bg-neutral-gray-400'}`} 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10.5px] font-bold">
                  <span className="text-neutral-500">Progression : {progressPercentage}%</span>
                  <button 
                    onClick={() => onSelectLive(c.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-[10.5px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                      isActive 
                        ? 'bg-brand-red-deep text-white shadow-md shadow-brand-red-deep/25 hover:bg-brand-red-deep/90 hover:scale-105 active:scale-95' 
                        : 'text-brand-red-deep hover:bg-brand-red-light'
                    }`}
                  >
                    {isActive && <span translate="no" className="material-symbols-outlined text-xs animate-spin-slow">play_circle</span>}
                    <span>Suivre le direct</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

