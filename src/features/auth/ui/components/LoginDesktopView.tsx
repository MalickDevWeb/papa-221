import React from 'react';
import { LoginForm } from './LoginForm';
import { EcoleBadge } from './EcoleBadge';
import { EcoleLogo } from './EcoleLogo';
import { CalendarWidget } from './CalendarWidget';

interface LoginDesktopViewProps {
  bgImageUrl: string;
  desktopShowCalendar: boolean;
  setDesktopShowCalendar: (show: boolean) => void;
}

export function LoginDesktopView({ bgImageUrl, desktopShowCalendar, setDesktopShowCalendar }: LoginDesktopViewProps) {
  return (
    <div className="hidden lg:flex w-full h-full items-stretch">
      <div className="hidden lg:flex lg:w-[58%] xl:w-[62%] h-full relative overflow-hidden bg-[#FAF8F6] shrink-0 border-r border-[#E2DCDA]/60">
        {!desktopShowCalendar ? (
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center animate-slow-zoom" 
              style={{ backgroundImage: bgImageUrl }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent"></div>
            <div className="absolute top-8 left-8 z-20 shadow-xl"><EcoleBadge /></div>
            <div className="absolute bottom-8 left-8 text-white select-none z-10 animate-fade-in">
              <h3 className="font-heading font-black text-lg tracking-wide uppercase">Campus Numérique</h3>
              <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold">École 221 · ISM Dakar</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-6 xl:p-8 overflow-y-auto bg-[#FAF8F6] no-scrollbar animate-fade-in flex flex-col justify-center">
            <div className="bg-[#FAF8F6] rounded-[32px] border border-[#E2DCDA] shadow-[0_24px_64px_rgba(41,23,21,0.2)] p-6 xl:p-8 overflow-y-auto max-h-[94vh] no-scrollbar" style={{ margin: '6px 13px' }}>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E2DCDA]/80 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 bg-[#B3181C] text-white rounded-xl shadow-md shadow-[#B3181C]/15 flex items-center justify-center"><span translate="no" className="material-symbols-outlined text-[20px] font-bold">calendar_month</span></div>
                  <div><h3 className="font-sans font-black text-xs uppercase text-[#291715] tracking-widest">Calendrier Interactif</h3><p className="text-[10px] text-[#8E7977] font-black tracking-wide uppercase leading-none mt-1">ÉCOLE 221 · ESPACE INTERACTIF</p></div>
                </div>
                <button onClick={() => setDesktopShowCalendar(false)} className="px-4 py-1.5 rounded-xl bg-[#B3181C]/10 text-[#B3181C] hover:bg-[#B3181C]/20 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer border border-[#B3181C]/5">Masquer</button>
              </div>
              <CalendarWidget variant="transparent" />
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow bg-white rounded-l-[40px] shadow-[-16px_0_48px_rgba(41,23,21,0.04)] overflow-y-auto relative min-w-[390px] h-full no-scrollbar">
        <div className="min-h-full flex flex-col justify-between p-10 xl:p-14">
          <div className="my-auto max-w-[370px] w-full mx-auto flex flex-col justify-center animate-fade-in space-y-5 py-6">
            <div className="flex justify-center select-none">
              <div className="flex bg-[#291715]/90 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-lg scale-100 transition-all duration-300">
                <button type="button" onClick={() => setDesktopShowCalendar(false)} className={`py-1.5 px-6 rounded-full text-[10.5px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${!desktopShowCalendar ? 'bg-[#B3181C] text-white shadow-md shadow-[#B3181C]/25 scale-102' : 'text-white/75 hover:text-white hover:bg-white/5'}`}>Connexion</button>
                <button type="button" onClick={() => setDesktopShowCalendar(true)} className={`py-1.5 px-6 rounded-full text-[10.5px] font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${desktopShowCalendar ? 'bg-[#B3181C] text-white shadow-md shadow-[#B3181C]/25 scale-102' : 'text-white/75 hover:text-white hover:bg-white/5'}`}>Calendrier</button>
              </div>
            </div>
            <div className="text-center flex flex-col items-center">
              <EcoleLogo size="lg" />
              <p className="text-[#8E7977] text-[10.5px] font-bold tracking-widest mt-2 select-none uppercase">Sénégal · Plateforme Éducative</p>
            </div>
            <div className="text-center">
              <h2 className="text-[23px] font-[900] text-[#291715] tracking-tight leading-none mb-1">Connexion</h2>
              <p className="text-[#8E7977] text-xs font-semibold">Connectez-vous à votre espace École 221.</p>
            </div>
            <LoginForm />
          </div>
          <div className="mt-auto text-center text-[#8E7977] text-[11px] space-y-2.5 max-w-[370px] w-full mx-auto shrink-0 select-none">
            <p className="leading-relaxed">En vous connectant, vous acceptez les <a href="#" className="font-bold text-[#B3181C] hover:underline">Mentions légales</a> et la <br /> <a href="#" className="font-bold text-[#B3181C] hover:underline">Politique de confidentialité</a>.</p>
            <div className="flex justify-center items-center gap-5 pt-0.5 font-bold text-[#B3181C]">
              <span className="flex items-center gap-1 cursor-pointer hover:text-[#8F1316] transition-colors"><span translate="no" className="material-symbols-outlined text-[14px]">language</span>Français</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-[#8F1316] transition-colors"><span translate="no" className="material-symbols-outlined text-[14px]">help_outline</span>Besoin d'aide ?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
