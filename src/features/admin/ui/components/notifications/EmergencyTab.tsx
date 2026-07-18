import React, { useState } from 'react';

interface Props {
  onTriggerEmergency: (type: string) => void;
}

export function EmergencyTab({ onTriggerEmergency }: Props) {
  const [selectedType, setSelectedType] = useState('Incident Majeur');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const startEmergency = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onTriggerEmergency(selectedType);
            setRunning(false);
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="bg-[#FFF5F5] border border-red-200 rounded-2xl p-6 text-xs font-bold text-[#4A5568] space-y-6 shadow-sm" id="emergency-tab">
      <div className="flex items-center gap-3 pb-3 border-b border-red-100">
        <span translate="no" className="material-symbols-outlined text-red-600 text-3xl font-black animate-pulse">campaign</span>
        <div>
          <h3 className="font-extrabold text-sm text-red-950">🚨 Module de Diffusion d'Urgence SMS & Push</h3>
          <p className="text-[10px] text-red-700 font-bold">ATTENTION : Ce canal contourne tous les verrous et force la notification prioritaire.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase text-red-900 tracking-wider">Type d'Incident d'Urgence</span>
          <div className="space-y-2">
            {[
              { type: 'Incident Majeur', label: '🛑 Incident Majeur & Évacuation (Intrusion/Danger)' },
              { type: 'Alerte Météo', label: '🌧️ Alerte Météo & Inondation (Fermeture)' },
              { type: 'Réunion d\'Urgence', label: '📅 Convocation d\'Urgence administrative' },
            ].map(item => (
              <label key={item.type} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedType === item.type ? 'bg-red-100 border-red-300 text-red-950' : 'bg-white border-neutral-200 text-neutral-600'}`}>
                <input type="radio" name="emergency-type" checked={selectedType === item.type} onChange={() => setSelectedType(item.type)} className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer" />
                <span className="font-black text-xs">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-red-100 rounded-2xl p-5 flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-[10px] font-black uppercase text-red-800 tracking-wider">Activer le protocole de diffusion</span>
          <p className="text-[10px] text-neutral-400 font-semibold max-w-xs">
            Cette action envoie immédiatement un SMS prioritaire de haute visibilité aux tuteurs, enseignants et personnels de l'établissement.
          </p>

          <button
            onClick={startEmergency}
            disabled={running}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl uppercase tracking-widest text-[10px] font-black transition-all cursor-pointer shadow-lg shadow-red-500/20"
          >
            {running ? 'Diffusion critique en cours...' : '👉 Déclencher l\'Alerte d\'Urgence 👈'}
          </button>
        </div>
      </div>

      {running && (
        <div className="bg-white border border-red-200 p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-[10px] font-black text-red-900 uppercase">
            <span>Délivrance de l'alerte aux téléphones en cours...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-red-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
