import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/core/store/authStore';
import { Settings, LifeBuoy, LogOut, Edit3 } from 'lucide-react';
import { ProfileDetails } from './ProfileDetails';

interface Props {
  readonly showProfile: boolean;
  readonly setShowProfile: (v: boolean) => void;
  readonly setShowNotifications?: (v: boolean) => void;
  readonly setShowCalendar?: (v: boolean) => void;
  readonly mood?: string; readonly tempMood?: string; readonly setTempMood?: (v: string) => void;
  readonly isEditingMood?: boolean; readonly setIsEditingMood?: (v: boolean) => void;
  readonly onOpenSettings?: () => void; readonly onOpenSupport?: () => void;
  readonly triggerToast: (msg: string) => void; readonly onMoodSave?: () => void;
  readonly profileRef: React.RefObject<HTMLDivElement | null>;
}

export function ProfileDropdown({
  showProfile, setShowProfile, setShowNotifications, setShowCalendar, mood, tempMood, setTempMood, isEditingMood, setIsEditingMood, onOpenSettings, onOpenSupport, triggerToast, onMoodSave, profileRef
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { utilisateur, deconnexion } = useAuthStore();
  
  const isProf = utilisateur?.role === 'PROFESSOR';
  const name = utilisateur?.nom ?? (isProf ? 'Professeur' : 'Étudiant');
  const initials = name.replace(/^(Dr\.|Mme\.|M\.)\s*/, '').trim().split(/\s+/).map(p => p[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = () => {
    setShowProfile(false); deconnexion(); localStorage.removeItem('access_token');
    triggerToast('Déconnexion réussie'); setTimeout(() => navigate(ROUTES.login), 800);
  };

  return (
    <div className="relative" ref={profileRef}>
      <button type="button" onClick={() => { setShowProfile(!showProfile); setShowCalendar?.(false); setShowNotifications?.(false); }} className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red-deep hover:bg-[#8C1014] text-white font-black text-sm tracking-wider transition-all cursor-pointer shadow-md border-2 border-white ring-2 ring-brand-red-light/70 overflow-hidden select-none hover:scale-105 active:scale-95">
        {initials}
      </button>
      {showProfile && (
        <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-2 w-[min(92vw,24rem)] sm:w-84 bg-white border border-neutral-gray-200 rounded-3xl shadow-2xl z-[200] overflow-hidden animate-slide-up max-h-[min(86vh,38rem)]">
          <div className="p-5 text-center bg-gradient-to-br from-brand-red-deep to-[#8C1014] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
            <button aria-label="Fermer" onClick={() => setShowProfile(false)} className="absolute top-3 right-3 text-white/85 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer z-20 hover:scale-105 active:scale-95 flex items-center justify-center">
              <span translate="no" className="material-symbols-outlined text-xs">close</span>
            </button>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto shadow-md border-2 border-white/20 mb-3 flex items-center justify-center bg-white/10 backdrop-blur-md">
                <span className="text-white font-black text-base select-none">{initials}</span>
              </div>
              <h4 className="font-headline-md text-sm font-black tracking-tight">{name}</h4>
              <p className="text-[10px] text-white/80 font-semibold mt-0.5">
                {isProf ? `ID Enseignant : #221-P${utilisateur?.id?.slice(-3) || '99'}` : 'Matricule : #221-M382 • ' + (location.pathname.includes('cours') || location.pathname.includes('devoirs') ? 'Master 1 GL' : 'Licence 3 GL')}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-[8.5px] font-black uppercase tracking-wider text-white">
                {isProf ? 'Espace Enseignant' : 'Promotion 221-GL'}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {!isProf && mood && setTempMood && setIsEditingMood && onMoodSave && (
              <div className="space-y-1.5">
                <span className="text-[9px] font-label-md uppercase tracking-[0.2em] text-neutral-gray-400">Statut / Humeur</span>
                {isEditingMood ? (
                  <div className="flex gap-1.5 items-center">
                    <input type="text" value={tempMood} onChange={(e) => setTempMood(e.target.value)} className="flex-grow text-xs font-semibold border border-neutral-gray-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-brand-red-deep bg-neutral-gray-50" />
                    <button onClick={onMoodSave} className="bg-brand-red-deep text-white px-2.5 py-2 rounded-lg text-xs font-black hover:bg-brand-red-deep/90 cursor-pointer">OK</button>
                  </div>
                ) : (
                  <div onClick={() => setIsEditingMood(true)} className="bg-neutral-gray-50 hover:bg-brand-red-light/30 border border-neutral-gray-150 p-2.5 rounded-xl cursor-pointer text-sm text-secondary font-body-md leading-relaxed flex items-center justify-between gap-2">
                    <span className="pr-2">{mood}</span>
                    <Edit3 className="h-3.5 w-3.5 text-neutral-450 shrink-0" />
                  </div>
                )}
              </div>
            )}
            {(onOpenSettings || onOpenSupport) && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {onOpenSettings && (
                  <button onClick={() => { setShowProfile(false); onOpenSettings(); }} className="p-2.5 border border-neutral-gray-200 hover:border-brand-red-deep/30 rounded-xl font-black text-xs text-[#1E293B] hover:bg-brand-red-light/20 flex flex-col items-center gap-1.5 cursor-pointer transition-all">
                    <Settings className="w-4 h-4 text-brand-red-deep" />
                    <span className="font-label-md text-label-md">Paramètres</span>
                  </button>
                )}
                {onOpenSupport && (
                  <button onClick={() => { setShowProfile(false); onOpenSupport(); }} className="p-2.5 border border-neutral-gray-200 hover:border-brand-red-deep/30 rounded-xl font-black text-xs text-[#1E293B] hover:bg-brand-red-light/20 flex flex-col items-center gap-1.5 cursor-pointer transition-all">
                    <LifeBuoy className="w-4 h-4 text-brand-red-deep" />
                    <span className="font-label-md text-label-md">Soutien</span>
                  </button>
                )}
              </div>
            )}
            <ProfileDetails isProf={isProf} />
            <button onClick={handleLogout} className="w-full py-2.5 bg-neutral-100 hover:bg-brand-red-light hover:text-brand-red-deep font-black text-xs text-secondary rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-200/50 hover:border-brand-red-deep/10">
              <LogOut className="h-3.5 w-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
