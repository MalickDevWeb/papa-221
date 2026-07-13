import React, { useState } from 'react';

export function CryptoKeysTab() {
  const [apiKey, setApiKey] = useState('ec_live_221_a83f...921x');
  const [studentSearch, setStudentSearch] = useState('');
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

  const handleStudentRegen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSearch) return;
    alert(`Clé AES-256 régénérée pour l'élève. L'ancien QR code a été invalidé aux terminaux d'accès.`);
    setStudentSearch('');
  };

  return (
    <div className="space-y-6 text-xs font-bold text-[#4A5568]" id="crypto-keys-tab">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-sm text-[#1E293B]">Clés de Sécurité & Clés API</h3>
        <p className="text-[10px] text-neutral-400 font-semibold">Gérez les jetons d'accès cryptographiques et régénérez les secrets perdus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student QR Regenerator */}
        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[#1E293B] block">Régénérer Clé QR Éleve (Perte de badge/téléphone)</span>
            <p className="text-[10px] text-neutral-400 font-semibold">Invalide l'ancienne clé d'accès et chiffre une nouvelle clé AES-256.</p>
          </div>

          <form onSubmit={handleStudentRegen} className="space-y-3">
            <input
              type="text"
              placeholder="Ex: MAT-2026-103"
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#B3181C] hover:bg-[#921316] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1"
            >
              <span translate="no" className="material-symbols-outlined text-sm">autorenew</span>
              <span>Générer Nouvelle Clé AES-256</span>
            </button>
          </form>
        </div>

        {/* API Key Panel */}
        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[#1E293B] block">Secret de Connexion des Terminaux (Clé API)</span>
            <p className="text-[10px] text-neutral-400 font-semibold">Clé secrète utilisée par les portiques physiques pour authentifier les requêtes de scan.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-white px-3 py-2 border border-neutral-200 rounded-xl font-mono text-[11px] text-[#1E293B] flex items-center justify-between">
              <span>{apiKey}</span>
              <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-black">ACTIVE</span>
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
      </div>
    </div>
  );
}
