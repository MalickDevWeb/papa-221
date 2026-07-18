import React from 'react';
import { LoginForm } from './LoginForm';
import { EcoleBadge } from './EcoleBadge';
import { EcoleLogo } from './EcoleLogo';

interface LoginMobileViewProps {
  bgImageUrl: string;
  setShowMobileCalendarModal: (show: boolean) => void;
}

export function LoginMobileView({ bgImageUrl, setShowMobileCalendarModal }: LoginMobileViewProps) {
  return (
    <div className="block md:hidden w-full h-full bg-white overflow-hidden">
      <div className="flex flex-col h-full w-full">
        <div className="relative h-[25%] min-h-[140px] w-full shrink-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom" 
            style={{ backgroundImage: bgImageUrl }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent"></div>
          <div className="absolute top-[18px] left-[18px] z-20"><EcoleBadge /></div>
          <button type="button" onClick={() => setShowMobileCalendarModal(true)} className="absolute top-[18px] right-[18px] z-20 h-11 w-11 rounded-2xl bg-[#B3181C] hover:bg-[#8F1316] text-white border border-white/20 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200">
            <span translate="no" className="material-symbols-outlined text-[19px] font-bold">calendar_month</span>
          </button>
        </div>
        <div className="relative -mt-8 flex-grow bg-[#FAF8F6] rounded-t-[32px] shadow-[-8px_-8px_32px_rgba(41,23,21,0.06)] flex flex-col justify-start px-6 pt-5 pb-4 z-10 overflow-y-auto no-scrollbar">
          <div className="relative text-center flex flex-col items-center shrink-0 mb-3">
            <EcoleLogo size="sm" />
            <p className="text-[#8E7977] text-[10px] font-bold tracking-widest mt-1 select-none uppercase">Sénégal · Plateforme Éducative</p>
          </div>
          <div className="text-left mb-3 shrink-0 px-0.5">
            <h2 className="text-[20px] font-black text-[#291715] tracking-tight leading-tight">Connexion</h2>
            <p className="text-[#8E7977] text-[11px] font-medium leading-normal mt-0.5">Connectez-vous à votre espace École 221.</p>
          </div>
          <div className="flex-grow flex flex-col justify-start">
            <LoginForm isMobile={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
