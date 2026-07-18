import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidatureForm } from '../components/CandidatureForm';
import { EcoleBadge } from '../components/EcoleBadge';
import { EcoleLogo } from '../components/EcoleLogo';
import { ROUTES } from '@/shared/constants';

export function CandidaturePage() {
  const navigate = useNavigate();
  const bgImageUrl = "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80')";

  const handleBack = () => {
    navigate(ROUTES.login);
  };

  return (
    <main className="min-h-screen w-full bg-[#FAF8F6] flex items-stretch overflow-y-auto lg:overflow-hidden select-none">
      {/* Visual Banner on Desktop */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-[#FAF8F6] shrink-0 border-r border-[#E2DCDA]/60">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-100 hover:scale-102" 
          style={{ backgroundImage: bgImageUrl }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/30"></div>
          
          <div className="absolute top-8 left-8 z-20 shadow-xl">
            <EcoleBadge />
          </div>

          <div className="absolute bottom-12 left-12 right-12 text-white select-none z-10 animate-fade-in space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-[#B3181C] text-[10px] font-black tracking-widest uppercase inline-block">
              Admissions 2026/2027
            </span>
            <h1 className="font-sans font-[900] text-3xl tracking-tight leading-tight uppercase">
              Rejoignez l'excellence <br />de l'École 221
            </h1>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              Déposez votre dossier de candidature en ligne en quelques étapes simples pour intégrer nos promotions de haut niveau en Génie Logiciel, Cloud, Réseaux et Cybersécurité au Sénégal.
            </p>
            <div className="pt-4 border-t border-white/20 flex gap-6 text-[11px] font-black uppercase text-white/95 tracking-wide">
              <div>📍 Dakar, Sénégal</div>
              <div>⚡ Cursus certifié</div>
              <div>🎓 Taux d'insertion +90%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col justify-center bg-white p-6 md:p-12 lg:p-16 overflow-y-auto no-scrollbar">
        <div className="max-w-[480px] w-full mx-auto space-y-6 py-4 animate-fade-in">
          {/* Mobile Header Logo */}
          <div className="flex lg:hidden flex-col items-center text-center space-y-2 mb-2 select-none">
            <EcoleLogo size="md" />
            <span className="px-2 py-0.5 rounded-md bg-[#B3181C]/10 text-[#B3181C] text-[9px] font-black uppercase tracking-widest">
              Portail de Candidature
            </span>
          </div>

          <div className="bg-[#FAF8F6] lg:bg-white rounded-[24px] border border-[#E2DCDA]/80 lg:border-none p-5 md:p-6 lg:p-0 shadow-[0_8px_32px_rgba(41,23,21,0.03)] lg:shadow-none">
            <CandidatureForm onBack={handleBack} />
          </div>

          {/* Footer information */}
          <div className="text-center text-[#8E7977] text-[10px] space-y-2 pt-2 select-none">
            <p className="leading-relaxed font-semibold">
              Des questions sur l'inscription ? Contactez notre secrétariat au <span className="text-[#B3181C] font-bold">+221 33 800 00 00</span> ou écrivez à <span className="text-[#B3181C] font-bold">admissions@ecole221.sn</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
