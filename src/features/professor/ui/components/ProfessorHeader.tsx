import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarWidget } from '@/features/auth/ui/components/CalendarWidget';
import { ProfileDropdown } from '@/shared/components';

interface Props {
  readonly title: string;
  readonly profName: string;
  readonly activeTab: string;
  readonly onSelectTab: (tab: string) => void;
  readonly onOpenSettings?: () => void;
  readonly triggerToast?: (msg: string) => void;
}

export function ProfessorHeader({ title, profName, activeTab, onSelectTab, triggerToast }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const calendarPopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: PointerEvent) => {
      if (calendarPopRef.current && !calendarPopRef.current.contains(e.target as Node)) setShowCalendar(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('pointerdown', onClick);
    return () => document.removeEventListener('pointerdown', onClick);
  }, []);

  return (
    <header className="w-full top-0 sticky z-[100] bg-white/90 backdrop-blur-md border-b border-neutral-gray-200/80 shadow-sm select-none">
      {(showProfile || showCalendar) && (
        <div onClick={() => { setShowProfile(false); setShowCalendar(false); }} className="fixed inset-0 bg-[#1E293B]/15 backdrop-blur-xs z-[180] cursor-pointer" />
      )}
      <div className="flex items-center justify-between px-6 md:px-8 w-full h-16 gap-4 relative z-[190]">
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-headline-md text-headline-md font-black text-brand-red-deep md:hidden tracking-tight">École 221</span>
          <div className="hidden md:flex items-center text-neutral-gray-400">
            <span translate="no" className="material-symbols-outlined text-brand-red-deep text-[22px] mr-2">school</span>
            <span className="text-xs font-black uppercase text-secondary tracking-widest">Espace Enseignant</span>
          </div>
        </div>
        <div className="flex-grow" />
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-black text-[#1E293B]">Bienvenue, {profName}</span>
            <span className="text-[10px] text-secondary font-bold">Portail connecté</span>
          </div>

          <div className="relative" ref={calendarPopRef}>
            <button 
              onClick={() => { setShowCalendar(!showCalendar); setShowProfile(false); }} 
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-gray-50 hover:bg-brand-red-light text-secondary hover:text-brand-red-deep transition-all cursor-pointer group ${showCalendar ? 'bg-brand-red-light text-brand-red-deep border border-brand-red-deep/10' : ''}`}
              title="Calendrier Académique"
            >
              <span translate="no" className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">calendar_month</span>
            </button>
            {showCalendar && createPortal(
              <div className="fixed inset-0 z-[250] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs" onClick={() => setShowCalendar(false)}>
                <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh] animate-scale-up" onClick={e => e.stopPropagation()}>
                  <div className="bg-gradient-to-br from-[#B3181C] to-[#291715] p-5 text-white flex items-center justify-between shrink-0 relative">
                    <div className="flex items-center gap-2.5 relative z-10">
                      <span translate="no" className="material-symbols-outlined text-white text-lg">calendar_today</span>
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wide">Calendrier Académique</h4>
                        <p className="text-[9px] text-white/80 font-bold mt-0.5 leading-none">Emploi du temps & Sessions</p>
                      </div>
                    </div>
                    <button onClick={() => setShowCalendar(false)} className="text-white hover:text-white/80 bg-white/10 p-1.5 rounded-full border-0 cursor-pointer relative z-10"><span translate="no" className="material-symbols-outlined text-xs">close</span></button>
                  </div>
                  <div className="p-5 overflow-y-auto bg-[#FAF8F6]">
                    <div className="rounded-2xl overflow-hidden border border-neutral-100 bg-white p-2">
                      <CalendarWidget />
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>

          <ProfileDropdown
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            setShowCalendar={setShowCalendar}
            triggerToast={triggerToast ?? (() => {})}
            profileRef={profileRef}
          />
        </div>
      </div>
    </header>
  );
}
