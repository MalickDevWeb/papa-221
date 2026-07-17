import React, { useState } from 'react';

export function ApiKeyCard() {
  const [apiKey, setApiKey] = useState('ec_live_221_a83f...921x');
  const [generating, setGenerating] = useState(false);

  const regenerateApiKey = () => {
    setGenerating(true);
    setTimeout(() => {
      const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
      setApiKey(`ec_live_221_${rand}...921x`);
      setGenerating(false);
      alert('Nouvelle clé API générée avec succès !');
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase text-[#1E293B] block">
          Secret de Connexion des Terminaux (Clé API)
        </span>
        <p className="text-[10px] text-neutral-400 font-semibold">
          Clé secrète utilisée par les portiques physiques pour authentifier les requêtes de scan.
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-white px-3 py-2 border border-neutral-200 rounded-xl font-mono text-[11px] text-[#1E293B] flex items-center justify-between">
          <span>{apiKey}</span>
          <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-black">
            ACTIVE
          </span>
        </div>

        <button
          onClick={regenerateApiKey}
          disabled={generating}
          className="w-full py-2 bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
        >
          <span translate="no" className="material-symbols-outlined text-sm">key</span>
          <span>{generating ? 'Régénération...' : 'Régénérer la Clé API'}</span>
        </button>
      </div>
    </div>
  );
}
