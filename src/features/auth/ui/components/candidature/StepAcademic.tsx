import React, { useState } from 'react';

interface StepAcademicProps {
  dernierEtablissement: string; setDernierEtablissement: (v: string) => void;
  dernierDiplome: string; setDernierDiplome: (v: string) => void;
  promotionNom: string; setPromotionNom: (v: string) => void;
  nomFichierBulletin: string; setNomFichierBulletin: (v: string) => void;
  nomFichierDiplome: string; setNomFichierDiplome: (v: string) => void;
  onBack: () => void; onNext: () => void;
  bulletinRequis?: boolean; diplomeRequis?: boolean;
}

export function StepAcademic({
  dernierEtablissement, setDernierEtablissement, dernierDiplome, setDernierDiplome,
  promotionNom, setPromotionNom, nomFichierBulletin, setNomFichierBulletin,
  nomFichierDiplome, setNomFichierDiplome, onBack, onNext,
  bulletinRequis = true, diplomeRequis = true
}: StepAcademicProps) {
  const [dragB, setDragB] = useState(false);
  const [dragD, setDragD] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent, field: 'B' | 'D') => {
    e.preventDefault();
    const files = ('dataTransfer' in e) ? e.dataTransfer.files : e.target.files;
    if (files && files[0]) {
      const name = files[0].name;
      if (field === 'B') setNomFichierBulletin(name); else setNomFichierDiplome(name);
    }
    if (field === 'B') setDragB(false); else setDragD(false);
  };

  const canContinue = dernierEtablissement.trim() && dernierDiplome.trim() && (!bulletinRequis || nomFichierBulletin !== 'Non fourni') && (!diplomeRequis || nomFichierDiplome !== 'Non fourni');

  return (
    <div className="space-y-3 animate-fade-in text-xs" id="step-academic-form">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Établissement d'origine *</label>
          <input className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-3 text-[#291715] focus:border-[#B3181C] outline-none font-semibold" placeholder="ex: Lycée Lamine Guèye" value={dernierEtablissement} onChange={e => setDernierEtablissement(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Dernier diplôme *</label>
          <select className="w-full h-10 bg-white border border-[#E2DCDA] rounded-xl px-2 text-[#291715] focus:border-[#B3181C] outline-none" value={dernierDiplome} onChange={e => setDernierDiplome(e.target.value)}>
            {['Baccalauréat Général', 'Bac Technique', 'Licence 1/2', 'Licence 3 / DST', 'Autre Diplôme'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Filière / Promotion visée à l'École *</label>
        <select className="w-full h-10 bg-white border border-[#E2DCDA] rounded-xl px-2 text-[#291715] focus:border-[#B3181C] outline-none font-bold text-[#B3181C]" value={promotionNom} onChange={e => setPromotionNom(e.target.value)}>
          {['221-GL', '221-IAGE', '221-CD', '221-RI'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {bulletinRequis && (
        <div className="space-y-1" id="bulletin-upload-container">
          <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Bulletins de Notes (Transcripts) *</label>
          <div onDragOver={e => { e.preventDefault(); setDragB(true); }} onDragLeave={() => setDragB(false)} onDrop={e => handleFile(e, 'B')} className={`border-2 border-dashed rounded-xl p-2.5 text-center transition-all cursor-pointer relative ${dragB ? 'border-[#B3181C] bg-[#FFF5F5]' : nomFichierBulletin !== 'Non fourni' ? 'border-[#1E5E3A] bg-[#EAF7EE]/40' : 'border-[#E2DCDA] hover:bg-[#FAF8F6]'}`}>
            <input type="file" accept=".pdf,.zip,.jpg" onChange={e => handleFile(e, 'B')} className="absolute inset-0 opacity-0 cursor-pointer" />
            <span translate="no" className={`material-symbols-outlined text-xl ${nomFichierBulletin !== 'Non fourni' ? 'text-[#1E5E3A]' : 'text-[#8E7977]'}`}>{nomFichierBulletin !== 'Non fourni' ? 'cloud_done' : 'text_snippet'}</span>
            <p className="text-[10px] font-bold text-[#3E2927] mt-1">{nomFichierBulletin !== 'Non fourni' ? nomFichierBulletin : 'Uploader vos relevés de notes'}</p>
          </div>
        </div>
      )}

      {diplomeRequis && (
        <div className="space-y-1" id="diplome-upload-container">
          <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Copie du dernier Diplôme *</label>
          <div onDragOver={e => { e.preventDefault(); setDragD(true); }} onDragLeave={() => setDragD(false)} onDrop={e => handleFile(e, 'D')} className={`border-2 border-dashed rounded-xl p-2.5 text-center transition-all cursor-pointer relative ${dragD ? 'border-[#B3181C] bg-[#FFF5F5]' : nomFichierDiplome !== 'Non fourni' ? 'border-[#1E5E3A] bg-[#EAF7EE]/40' : 'border-[#E2DCDA] hover:bg-[#FAF8F6]'}`}>
            <input type="file" accept=".pdf,.jpg" onChange={e => handleFile(e, 'D')} className="absolute inset-0 opacity-0 cursor-pointer" />
            <span translate="no" className={`material-symbols-outlined text-xl ${nomFichierDiplome !== 'Non fourni' ? 'text-[#1E5E3A]' : 'text-[#8E7977]'}`}>{nomFichierDiplome !== 'Non fourni' ? 'cloud_done' : 'school'}</span>
            <p className="text-[10px] font-bold text-[#3E2927] mt-1">{nomFichierDiplome !== 'Non fourni' ? nomFichierDiplome : 'Uploader le diplôme obtenu'}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <button type="button" onClick={onBack} className="flex-1 h-10 border border-[#E2DCDA] rounded-xl font-bold uppercase tracking-wider text-[#8E7977] hover:bg-[#FAF8F6] active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer">
          <span translate="no" className="material-symbols-outlined text-[14px]">arrow_back</span>
          <span>Retour</span>
        </button>
        <button type="button" onClick={onNext} disabled={!canContinue} className={`flex-[2] h-10 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${canContinue ? 'bg-[#B3181C] hover:bg-[#8F1316] text-white shadow-md cursor-pointer' : 'bg-[#E2DCDA] text-[#8E7977] cursor-not-allowed'}`} id="step-academic-next-btn">
          <span>Continuer</span>
          <span translate="no" className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
