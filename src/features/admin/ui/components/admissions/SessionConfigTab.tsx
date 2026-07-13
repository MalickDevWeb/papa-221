import React, { useState } from 'react';

export function SessionConfigTab() {
  const [isOpen, setIsOpen] = useState(true);
  const [deadline, setDeadline] = useState('2026-10-31');
  const [fees, setFees] = useState(50000); // FCFA

  return (
    <div className="space-y-6 text-xs font-bold text-[#4A5568]" id="session-config-tab">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-sm text-[#1E293B]">Portail Inscriptions & Configuration des Sessions</h3>
        <p className="text-[10px] text-neutral-400 font-semibold">Activez ou désactivez la campagne de candidature en ligne de l'école.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4 shadow-xs">
          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">État Général des Inscriptions</span>

          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-20 h-10 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isOpen ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full bg-white transition-all duration-300 transform ${
                  isOpen ? 'translate-x-10' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-black uppercase tracking-widest ${isOpen ? 'text-emerald-600' : 'text-neutral-500'}`}>
              {isOpen ? 'Session Ouverte ●' : 'Session Fermée ○'}
            </span>
          </div>

          <p className="text-[10px] text-neutral-400 font-semibold max-w-xs">
            Lorsqu'elles sont ouvertes, les candidats externes peuvent soumettre leurs documents et payer les frais de dossier.
          </p>
        </div>

        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-black uppercase text-[#1E293B] block">Paramètres Limites de la Campagne</span>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[9px] text-neutral-400 font-black uppercase block">Date Limite de Dépôt</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] text-neutral-400 font-black uppercase block">Frais d'Inscription (FCFA)</label>
              <input
                type="number"
                value={fees}
                onChange={e => setFees(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => alert('Configuration sauvegardée !')}
            className="w-full py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all cursor-pointer"
          >
            Mettre à jour les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}
