import React from 'react';
import { AcademicUploadField } from './AcademicUploadField';

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

  const canContinue = dernierEtablissement.trim() && dernierDiplome.trim() && 
    (!bulletinRequis || nomFichierBulletin !== 'Non fourni') && 
    (!diplomeRequis || nomFichierDiplome !== 'Non fourni');

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
        <AcademicUploadField 
          label="Bulletins de Notes (Transcripts) *" 
          icon="text_snippet" 
          value={nomFichierBulletin} 
          onChange={setNomFichierBulletin} 
          accept=".pdf,.zip,.jpg,.jpeg,.png"
        />
      )}

      {diplomeRequis && (
        <AcademicUploadField 
          label="Copie du dernier Diplôme *" 
          icon="school" 
          value={nomFichierDiplome} 
          onChange={setNomFichierDiplome} 
          accept=".pdf,.jpg,.jpeg,.png"
        />
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
