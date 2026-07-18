import React, { useState, useEffect } from 'react';

interface Settings {
  ouvert: boolean;
  dateOuverture: string;
  dateFermeture: string;
  messageAvis: string;
}

export function AdminCampaignSettings() {
  const [settings, setSettings] = useState<Settings>({
    ouvert: true,
    dateOuverture: '2026-06-01',
    dateFermeture: '2026-09-30',
    messageAvis: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/candidatures/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(false);
    try {
      const res = await fetch('/api/admin/candidatures/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white p-4 rounded-xl border border-[#E2DCDA] shadow-sm space-y-3 text-xs animate-fade-in">
      <div className="flex justify-between items-center pb-2 border-b border-[#E2DCDA]/60">
        <div>
          <h4 className="font-extrabold text-[#291715] uppercase tracking-wide text-[11px]">Configuration de la Campagne</h4>
          <p className="text-[9px] text-[#8E7977] font-semibold">Statut & Délais officiels des inscriptions</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${settings.ouvert ? 'bg-[#EAF7EE] text-[#1E5E3A] border border-[#D0EBD9]' : 'bg-[#FFF5F5] text-[#B3181C] border border-[#FFD1D1]'}`}>
          {settings.ouvert ? 'Actif' : 'Désactivé'}
        </span>
      </div>

      <div className="flex items-center justify-between p-2.5 bg-[#FAF8F6] rounded-xl border border-[#E2DCDA]/60">
        <div>
          <span className="font-bold text-[#291715] block">Autoriser les dépôts de dossiers</span>
          <span className="text-[9.5px] text-[#8E7977]">Active ou désactive instantanément le formulaire public</span>
        </div>
        <button 
          type="button" 
          onClick={() => setSettings(prev => ({ ...prev, ouvert: !prev.ouvert }))}
          className={`w-12 h-6 rounded-full p-0.5 transition-all relative cursor-pointer ${settings.ouvert ? 'bg-[#B3181C]' : 'bg-[#E2DCDA]'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all absolute top-0.5 ${settings.ouvert ? 'left-[26px]' : 'left-0.5'}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-[#8E7977] uppercase">Date d'Ouverture (Réouverture)</label>
          <input 
            type="date"
            className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-2.5 outline-none text-xs font-semibold text-[#291715] focus:border-[#B3181C]"
            value={settings.dateOuverture}
            onChange={e => setSettings(prev => ({ ...prev, dateOuverture: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-[#8E7977] uppercase">Date Limite (Clôture)</label>
          <input 
            type="date"
            className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-2.5 outline-none text-xs font-semibold text-[#291715] focus:border-[#B3181C]"
            value={settings.dateFermeture}
            onChange={e => setSettings(prev => ({ ...prev, dateFermeture: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black text-[#8E7977] uppercase">Note / Message public d'information</label>
        <textarea 
          rows={2}
          placeholder="ex: Session d'été ouverte pour les filières GL et CD..."
          className="w-full bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl p-2 outline-none text-xs text-[#291715] focus:border-[#B3181C] resize-none"
          value={settings.messageAvis}
          onChange={e => setSettings(prev => ({ ...prev, messageAvis: e.target.value }))}
        />
      </div>

      <div className="flex gap-2 items-center pt-1.5">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 h-10 bg-[#B3181C] hover:bg-[#8F1316] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span translate="no" className="material-symbols-outlined text-[15px]">save</span>
          <span>{loading ? 'Sauvegarde...' : 'Sauvegarder les configurations'}</span>
        </button>
        {success && (
          <div className="text-[#1E5E3A] bg-[#EAF7EE] px-3 py-2 border border-[#D0EBD9] rounded-xl font-bold text-[10px] animate-fade-in">
            Enregistré avec succès !
          </div>
        )}
      </div>
    </form>
  );
}
