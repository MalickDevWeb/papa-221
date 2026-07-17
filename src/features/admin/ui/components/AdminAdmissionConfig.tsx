import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase';

interface Config {
  ouvert: boolean;
  dateOuverture: string;
  dateFermeture: string;
  messageAvis: string;
  docsRequis: {
    cni: boolean;
    bulletin: boolean;
    diplome: boolean;
    motivation: boolean;
  };
}

export function AdminAdmissionConfig() {
  const [config, setConfig] = useState<Config>({
    ouvert: true,
    dateOuverture: '2026-06-01',
    dateFermeture: '2026-09-30',
    messageAvis: '',
    docsRequis: { cni: true, bulletin: true, diplome: true, motivation: false }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'admission_config', 'settings'));
        if (snap.exists()) setConfig(snap.data() as Config);
      } catch (err) { console.error('Firestore load error:', err); }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(false);
    try {
      await setDoc(doc(db, 'admission_config', 'settings'), config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Firestore save error:', err);
    } finally { setLoading(false); }
  };

  const toggleDoc = (key: keyof Config['docsRequis']) => {
    setConfig(p => ({ ...p, docsRequis: { ...p.docsRequis, [key]: !p.docsRequis[key] } }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 text-xs animate-fade-in" id="admin-admission-config-form">
      <div className="flex justify-between items-center pb-2 border-b border-[#E2DCDA]/60">
        <div>
          <h4 className="font-extrabold text-[#291715] uppercase tracking-wide text-[11px]">Configuration de l'Admission (Firestore)</h4>
          <p className="text-[9px] text-[#8E7977] font-semibold">Statut, dates et documents exigés</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${config.ouvert ? 'bg-[#EAF7EE] text-[#1E5E3A] border border-[#D0EBD9]' : 'bg-[#FFF5F5] text-[#B3181C] border border-[#FFD1D1]'}`}>
          {config.ouvert ? 'Actif' : 'Désactivé'}
        </span>
      </div>

      <div className="flex items-center justify-between p-2.5 bg-[#FAF8F6] rounded-xl border border-[#E2DCDA]/60">
        <div>
          <span className="font-bold text-[#291715] block">Campagne ouverte aux dépôts</span>
          <span className="text-[9.5px] text-[#8E7977]">Contrôle le formulaire public en temps réel</span>
        </div>
        <button type="button" onClick={() => setConfig(p => ({ ...p, ouvert: !p.ouvert }))} className={`w-12 h-6 rounded-full p-0.5 transition-all relative ${config.ouvert ? 'bg-[#B3181C]' : 'bg-[#E2DCDA]'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all absolute top-0.5 ${config.ouvert ? 'left-[26px]' : 'left-0.5'}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-[#8E7977] uppercase">Date d'Ouverture</label>
          <input type="date" className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-2.5 outline-none text-xs font-semibold text-[#291715]" value={config.dateOuverture} onChange={e => setConfig(p => ({ ...p, dateOuverture: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-[#8E7977] uppercase">Date Limite (Clôture)</label>
          <input type="date" className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-2.5 outline-none text-xs font-semibold text-[#291715]" value={config.dateFermeture} onChange={e => setConfig(p => ({ ...p, dateFermeture: e.target.value }))} />
        </div>
      </div>

      <div className="p-3 bg-[#FAF8F6] border border-[#E2DCDA]/60 rounded-xl space-y-2">
        <span className="font-black text-[#3E2927] uppercase tracking-wider block text-[9.5px]">Documents obligatoires exigés :</span>
        <div className="grid grid-cols-2 gap-2">
          {([['cni', 'Copie CNI / Passeport'], ['bulletin', 'Bulletins de Notes'], ['diplome', 'Dernier Diplôme'], ['motivation', 'Motivation']] as const).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer font-bold text-[#3E2927]" id={`checkbox-label-${k}`}>
              <input type="checkbox" checked={config.docsRequis[k]} onChange={() => toggleDoc(k)} className="w-3.5 h-3.5 text-[#B3181C] accent-[#B3181C]" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black text-[#8E7977] uppercase">Note / Message public d'information</label>
        <textarea rows={2} className="w-full bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl p-2 outline-none text-[#291715]" value={config.messageAvis} onChange={e => setConfig(p => ({ ...p, messageAvis: e.target.value }))} />
      </div>

      <div className="flex gap-2 items-center pt-1.5">
        <button type="submit" disabled={loading} className="flex-1 h-10 bg-[#B3181C] hover:bg-[#8F1316] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5" id="save-admission-config-btn">
          <span translate="no" className="material-symbols-outlined text-[15px]">save</span>
          <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
        {success && <div className="text-[#1E5E3A] bg-[#EAF7EE] px-3 py-2 border border-[#D0EBD9] rounded-xl font-bold text-[10px] animate-fade-in" id="save-success-indicator">Enregistré dans Firestore !</div>}
      </div>
    </form>
  );
}
