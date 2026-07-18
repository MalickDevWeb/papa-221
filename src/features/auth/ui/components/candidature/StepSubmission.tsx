import React from 'react';

interface StepSubmissionProps {
  typeDepot: 'En ligne' | 'Présentiel';
  setTypeDepot: (v: 'En ligne' | 'Présentiel') => void;
  motivation: string;
  setMotivation: (v: string) => void;
  loading: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  nomComplet: string;
  promotionNom: string;
}

export function StepSubmission({
  typeDepot, setTypeDepot, motivation, setMotivation, loading, onBack, onSubmit, nomComplet, promotionNom
}: StepSubmissionProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 animate-fade-in">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Mode de Dépôt de Dossier *</label>
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button" 
            onClick={() => setTypeDepot('En ligne')}
            className={`py-3.5 px-3 rounded-xl border text-center transition-all ${typeDepot === 'En ligne' ? 'bg-[#FFF5F5] border-[#B3181C] text-[#B3181C]' : 'bg-white border-[#E2DCDA] text-[#8E7977] hover:bg-[#FAF8F6]'}`}
          >
            <span translate="no" className="material-symbols-outlined text-lg block mb-1">cloud_upload</span>
            <span className="text-xs font-bold block">100% En Ligne</span>
            <span className="text-[9px] text-[#8E7977] block mt-0.5">Validation numérique</span>
          </button>
          <button 
            type="button" 
            onClick={() => setTypeDepot('Présentiel')}
            className={`py-3.5 px-3 rounded-xl border text-center transition-all ${typeDepot === 'Présentiel' ? 'bg-[#FFF5F5] border-[#B3181C] text-[#B3181C]' : 'bg-white border-[#E2DCDA] text-[#8E7977] hover:bg-[#FAF8F6]'}`}
          >
            <span translate="no" className="material-symbols-outlined text-lg block mb-1">business_center</span>
            <span className="text-xs font-bold block">Dépôt Présentiel</span>
            <span className="text-[9px] text-[#8E7977] block mt-0.5">Entretien physique</span>
          </button>
        </div>
      </div>

      <div className="bg-[#FAF8F6] p-2.5 rounded-xl border border-[#E2DCDA] text-[10px] text-[#8E7977] leading-relaxed">
        {typeDepot === 'En ligne' ? (
          <span>ℹ️ Vos justificatifs d'identité et de notes seront vérifiés numériquement par la scolarité de l'École. Restez connecté pour suivre votre statut.</span>
        ) : (
          <span>ℹ️ En choisissant le dépôt présentiel, vous devez vous présenter dans nos locaux avec la CNI originale, le relevé de notes du Bac, et les bulletins originaux.</span>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Pourquoi souhaitez-vous rejoindre l'École ? *</label>
        <textarea 
          rows={3}
          className="w-full bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl text-xs p-2 text-[#291715] focus:border-[#B3181C] outline-none resize-none font-medium"
          placeholder="Rédigez quelques lignes sur vos motivations et vos projets professionnels..."
          required
          value={motivation}
          onChange={e => setMotivation(e.target.value)}
        />
      </div>

      <div className="bg-[#EAF7EE] p-2.5 rounded-xl border border-[#D0EBD9] text-[10px] text-[#1E5E3A] font-bold">
        ✍️ Je certifie sur l'honneur l'exactitude des informations fournies par {nomComplet} pour la promotion {promotionNom}.
      </div>

      <div className="flex gap-2 mt-2">
        <button 
          type="button" 
          onClick={onBack}
          disabled={loading}
          className="flex-1 h-10 border border-[#E2DCDA] rounded-xl text-xs font-bold uppercase tracking-wider text-[#8E7977] hover:bg-[#FAF8F6] active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <span translate="no" className="material-symbols-outlined text-[14px]">arrow_back</span>
          <span>Retour</span>
        </button>
        <button 
          type="submit" 
          disabled={loading || !motivation.trim()}
          className={`flex-[2] h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${(!loading && motivation.trim()) ? 'bg-[#B3181C] hover:bg-[#8F1316] text-white shadow-lg' : 'bg-[#E2DCDA] text-[#8E7977] cursor-not-allowed'}`}
        >
          <span>{loading ? 'Envoi...' : 'Confirmer l\'Inscription'}</span>
          <span translate="no" className="material-symbols-outlined text-[14px]">check_circle</span>
        </button>
      </div>
    </form>
  );
}
