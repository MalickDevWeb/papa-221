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
    <div className="hidden md:flex lg:hidden w-full h-full flex-col relative overflow-hidden bg-[#FAF8F6]">
      <div 
        className="absolute inset-0 bg-cover bg-center animate-slow-zoom" 
        style={{ backgroundImage: bgImageUrl }}
      />
      <div className="absolute inset-0 bg-black/45 z-0"></div>
      
      {/* Top Header Bar */}
      <div className="relative z-20 flex justify-between items-center gap-4 w-full px-6 pt-6 pb-2 shrink-0 select-none">
        <EcoleBadge />
        <div className="flex bg-black/40 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-lg scale-90 sm:scale-100 select-none">
          <button onClick={() => setTabletActiveTab('login')} className={`py-1.5 px-4 rounded-full text-[10.5px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${tabletActiveTab === 'login' ? 'bg-[#B3181C] text-white shadow-md shadow-[#B3181C]/20' : 'text-white/75 hover:text-white hover:bg-white/5'}`}>Connexion</button>
          <button onClick={() => setTabletActiveTab('calendar')} className={`py-1.5 px-4 rounded-full text-[10.5px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${tabletActiveTab === 'calendar' ? 'bg-[#B3181C] text-white shadow-md shadow-[#B3181C]/20' : 'text-white/75 hover:text-white hover:bg-white/5'}`}>Calendrier</button>
        </div>
      </div>

      {/* Main content centered, preventing overflow and scroll */}
      <div className="flex-1 w-full z-10 flex justify-center items-center overflow-hidden min-h-0 px-6 pb-6">
        {tabletActiveTab === 'login' ? (
          <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.3)] w-full max-w-[440px] p-6 flex flex-col justify-between animate-scale-up max-h-full overflow-y-auto no-scrollbar">
            <div>
              <div className="text-center flex flex-col items-center mb-4">
                <EcoleLogo size="md" />
                <p className="text-[#8E7977] text-[10px] font-bold tracking-widest mt-1.5 select-none uppercase">Sénégal · Plateforme Éducative</p>
              </div>
              <div className="text-center mb-4">
                <h2 className="text-[20px] font-black text-[#291715] tracking-tight">Connexion</h2>
                <p className="text-[#8E7977] text-[11px] font-medium mt-0.5">Connectez-vous à votre espace École 221.</p>
              </div>
              <LoginForm />
            </div>
            <div className="mt-5 text-center text-[#8E7977] text-[10px] space-y-1.5 select-none">
              <p className="leading-relaxed">En vous connectant, vous acceptez les <a href="#" className="font-bold text-[#B3181C] hover:underline">Mentions légales</a> et la <a href="#" className="font-bold text-[#B3181C] hover:underline">Politique de confidentialité</a>.</p>
              <div className="flex justify-center items-center gap-4 pt-0.5 text-[#B3181C] font-bold">
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><span translate="no" className="material-symbols-outlined text-[13px]">language</span>Français</span><span>·</span>
                <span className="flex items-center gap-1 cursor-pointer hover:underline"><span translate="no" className="material-symbols-outlined text-[13px]">help_outline</span>Besoin d'aide ?</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAF8F6] rounded-[32px] shadow-[0_24px_64px_rgba(41,23,21,0.25)] border border-[#E2DCDA] w-full max-w-[800px] p-5 md:p-6 animate-scale-up max-h-full overflow-y-auto no-scrollbar">
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
