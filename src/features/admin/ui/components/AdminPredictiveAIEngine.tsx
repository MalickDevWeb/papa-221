import React, { useState } from 'react';

const SUGGESTIONS = [
  "Montre-moi les étudiants à risque d'abandon",
  "Qui n'a pas payé sa scolarité depuis 3 mois ?",
  "Prévision financière du chiffre d'affaires",
];

export function AdminPredictiveAIEngine() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = (q: string) => {
    setQuery(q);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (q.includes('abandon') || q.includes('risque')) {
        setResult("⚠️ Détection active (Modèle de régression logistique) :\n- Amadou Diallo (Master IA 1) : Risque élevé (84%). Cause : assiduité de 58% et absence injustifiée aux 3 derniers TP.");
      } else if (q.includes('payé') || q.includes('scolarité')) {
        setResult("💰 Analyse Financière :\n- 3 étudiants identifiés en retard de paiement de plus de 60 jours. Impact Trésorerie : -360 000 FCFA.");
      } else {
        setResult("📈 Modèle Prédictif Financier (6 mois) :\n- Prévision de Chiffre d'Affaires : Croissance de +12% estimée grâce au taux de réinscription anticipé.");
      }
    }, 1200);
  };

  return (
    <div className="space-y-4" id="predictive-ai-root">
      <div className="bg-gradient-to-r from-red-50/50 to-amber-50/20 border border-red-200/60 p-5 rounded-2xl shadow-sm space-y-3">
        <h4 className="text-xs font-black text-[#B3181C] uppercase tracking-wider flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-lg animate-pulse">psychology</span>
          Assistant IA Prédictif & Analyse Décisionnelle
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Posez une question en langage naturel (ex: Qui risque de décrocher ?)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-grow px-4 py-2 border border-red-200/60 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#B3181C] bg-white"
          />
          <button onClick={() => handleAsk(query)} className="px-5 py-2 bg-[#B3181C] text-white rounded-xl text-xs font-bold hover:bg-[#B3181C]/90 transition-colors cursor-pointer shrink-0">Interroger</button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => handleAsk(s)} className="text-[10px] bg-white border border-red-200 text-[#B3181C] px-2.5 py-1 rounded-full hover:bg-red-50/50 transition-all font-bold cursor-pointer">{s}</button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center p-8 text-xs font-black text-[#B3181C] animate-pulse">L'IA de pilotage analyse les modèles prédictifs de l'établissement...</div>}

      {result && !loading && (
        <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-sm text-xs font-bold text-neutral-600 whitespace-pre-line leading-relaxed border-l-4 border-l-[#B3181C]">
          {result}
        </div>
      )}

      {/* Forecast widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-neutral-600">
        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-black text-neutral-400">Prognostic Réussite Examen L3</span>
          <div className="flex items-center justify-between">
            <span>Probabilité estimée</span>
            <span className="text-emerald-500 font-extrabold">91.4% de réussite</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full" style={{ width: '91.4%' }}></div></div>
        </div>

        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-black text-neutral-400">Prévision Trésorerie (Semestre Suivant)</span>
          <div className="flex items-center justify-between">
            <span>Projection à 6 mois</span>
            <span className="text-[#B3181C] font-extrabold">+18 200 000 FCFA</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden"><div className="bg-[#B3181C] h-full" style={{ width: '75%' }}></div></div>
        </div>
      </div>
    </div>
  );
}
