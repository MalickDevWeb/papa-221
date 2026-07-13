import React from 'react';
import { LoginForm } from './LoginForm';
import { EcoleBadge } from './EcoleBadge';
import { EcoleLogo } from './EcoleLogo';
import { CalendarWidget } from './CalendarWidget';

interface LoginTabletViewProps {
  bgImageUrl: string;
  tabletActiveTab: 'login' | 'calendar';
  setTabletActiveTab: (tab: 'login' | 'calendar') => void;
}

export function LoginTabletView({ bgImageUrl, tabletActiveTab, setTabletActiveTab }: LoginTabletViewProps) {
  return (
    <div className="hidden md:flex lg:hidden w-full h-full bg-cover bg-center p-6 relative overflow-y-auto" style={{ backgroundImage: bgImageUrl }}>
      <div className="absolute inset-0 bg-black/45 z-0"></div>
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center gap-4">
        <EcoleBadge />
        <div className="flex bg-black/40 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-lg scale-90 sm:scale-100 select-none">
          <button onClick={() => setTabletActiveTab('login')} className={`py-1.5 px-4 rounded-full text-[10.5px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${tabletActiveTab === 'login' ? 'bg-[#B3181C] text-white shadow-md shadow-[#B3181C]/20' : 'text-white/75 hover:text-white hover:bg-white/5'}`}>Connexion</button>
          <button onClick={() => setTabletActiveTab('calendar')} className={`py-1.5 px-4 rounded-full text-[10.5px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${tabletActiveTab === 'calendar' ? 'bg-[#B3181C] text-white shadow-md shadow-[#B3181C]/20' : 'text-white/75 hover:text-white hover:bg-white/5'}`}>Calendrier</button>
        </div>
      </div>
      <div className="m-auto w-full h-full min-h-[500px] z-10 flex justify-center items-center">
        {tabletActiveTab === 'login' ? (
          <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.3)] w-[50%] h-[50%] min-w-[340px] min-h-[420px] p-6 flex flex-col justify-between animate-scale-up my-4 overflow-y-auto no-scrollbar">
            <div>
              <div className="text-center flex flex-col items-center mb-5">
                <EcoleLogo size="md" />
                <p className="text-[#8E7977] text-[10px] font-bold tracking-widest mt-1.5 select-none uppercase">Sénégal · Plateforme Éducative</p>
              </div>
              <div className="text-center mb-4">
                <h2 className="text-[21px] font-black text-[#291715] tracking-tight">Connexion</h2>
                <p className="text-[#8E7977] text-[12px] font-medium mt-0.5">Connectez-vous à votre espace École 221.</p>
              </div>
              <LoginForm />
            </div>
            <div className="mt-5.5 text-center text-[#8E7977] text-[10px] space-y-2 select-none">
              <p className="leading-relaxed">En vous connectant, vous acceptez les <a href="#" className="font-bold text-[#B3181C] hover:underline">Mentions légales</a> et la <br /> <a href="#" className="font-bold text-[#B3181C] hover:underline">Politique de confidentialité</a>.</p>
              <div className="flex justify-center items-center gap-4 pt-0.5 text-[#B3181C] font-bold">
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><span translate="no" className="material-symbols-outlined text-[13px]">language</span>Français</span><span>·</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><span translate="no" className="material-symbols-outlined text-[13px]">help_outline</span>Besoin d'aide ?</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAF8F6] rounded-[32px] shadow-[0_24px_64px_rgba(41,23,21,0.25)] border border-[#E2DCDA] w-full max-w-[850px] p-5 md:p-6 animate-scale-up my-4" style={{ margin: '6px 13px' }}>
            <div className="flex justify-between items-center mb-4 pb-3.5 border-b border-[#E2DCDA]/80 shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 bg-[#B3181C] text-white rounded-xl shadow-md shadow-[#B3181C]/15 flex items-center justify-center"><span translate="no" className="material-symbols-outlined text-[20px] font-bold">calendar_month</span></div>
                <div><h3 className="font-heading font-black text-xs uppercase text-[#291715] tracking-widest">Calendrier Académique</h3><p className="text-[9px] text-[#8E7977] font-black uppercase leading-none mt-1">ÉCOLE 221 · ESPACE INTERACTIF</p></div>
              </div>
            </div>
            <CalendarWidget variant="transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
