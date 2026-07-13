import React, { useState } from 'react';
import { StepPersonal } from './candidature/StepPersonal';
import { StepAcademic } from './candidature/StepAcademic';
import { StepSubmission } from './candidature/StepSubmission';
import { CandidatureSuccess } from './candidature/CandidatureSuccess';
import { CampaignOfflineMessage } from './candidature/CampaignOfflineMessage';
import { CandidatureStepper } from './candidature/CandidatureStepper';
import { useCandidatureSettings } from '../../hooks/useCandidatureSettings';

export function CandidatureForm({ onBack }: { onBack: () => void }) {
  const { settings, loading: settingsLoading, isCampaignActive } = useCandidatureSettings();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nomComplet: '', email: '', telephone: '', numeroCni: '', nomFichierCni: 'Non fourni',
    dernierEtablissement: '', dernierDiplome: 'Baccalauréat Général', promotionNom: '221-GL',
    nomFichierBulletin: 'Non fourni', nomFichierDiplome: 'Non fourni',
    typeDepot: 'En ligne' as 'En ligne' | 'Présentiel', motivation: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, val: any) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await fetch('/api/candidatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) setSuccess(true);
      else {
        const errData = await res.json();
        setError(errData.error || 'Erreur lors du dépôt.');
      }
    } catch { setError('Impossible de joindre le serveur.'); } finally { setLoading(false); }
  };

  if (success) return <CandidatureSuccess nomComplet={form.nomComplet} promotionNom={form.promotionNom} typeDepot={form.typeDepot} onBack={onBack} />;
  if (settingsLoading) return <div className="text-center py-10 text-xs text-[#8E7977] font-semibold animate-pulse">Vérification...</div>;
  if (!isCampaignActive) return <CampaignOfflineMessage dateOuverture={settings.dateOuverture} dateFermeture={settings.dateFermeture} messageAvis={settings.messageAvis} onBack={onBack} />;

  const docsRequis = settings.docsRequis || { cni: true, bulletin: true, diplome: true, motivation: false };

  return (
    <div className="space-y-4 animate-fade-in" id="candidature-main-form">
      <div className="flex justify-between items-center pb-2 border-b border-[#E2DCDA]/60 text-xs">
        <div>
          <h4 className="font-black text-[#3E2927] uppercase tracking-wider text-[11px]">Dépôt de Dossier Officiel</h4>
          <p className="text-[9px] text-[#8E7977] font-semibold uppercase">Clôture : {settings.dateFermeture}</p>
        </div>
        <button type="button" onClick={onBack} className="text-[#8E7977] hover:text-[#B3181C] font-bold uppercase cursor-pointer">[ Connexion ]</button>
      </div>

      <CandidatureStepper step={step} />
      {error && <div className="p-2 text-xs text-[#B3181C] bg-[#FFF5F5] rounded-xl border border-[#B3181C]/20 font-semibold">{error}</div>}

      {step === 1 && (
        <StepPersonal 
          nomComplet={form.nomComplet} setNomComplet={v => update('nomComplet', v)}
          email={form.email} setEmail={v => update('email', v)}
          telephone={form.telephone} setTelephone={v => update('telephone', v)}
          numeroCni={form.numeroCni} setNumeroCni={v => update('numeroCni', v)}
          nomFichierCni={form.nomFichierCni} setNomFichierCni={v => update('nomFichierCni', v)}
          onNext={() => setStep(2)}
          cniRequis={docsRequis.cni}
        />
      )}

      {step === 2 && (
        <StepAcademic 
          dernierEtablissement={form.dernierEtablissement} setDernierEtablissement={v => update('dernierEtablissement', v)}
          dernierDiplome={form.dernierDiplome} setDernierDiplome={v => update('dernierDiplome', v)}
          promotionNom={form.promotionNom} setPromotionNom={v => update('promotionNom', v)}
          nomFichierBulletin={form.nomFichierBulletin} setNomFichierBulletin={v => update('nomFichierBulletin', v)}
          nomFichierDiplome={form.nomFichierDiplome} setNomFichierDiplome={v => update('nomFichierDiplome', v)}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          bulletinRequis={docsRequis.bulletin}
          diplomeRequis={docsRequis.diplome}
        />
      )}

      {step === 3 && (
        <StepSubmission 
          typeDepot={form.typeDepot} setTypeDepot={v => update('typeDepot', v)}
          motivation={form.motivation} setMotivation={v => update('motivation', v)}
          loading={loading} onBack={() => setStep(2)} onSubmit={handleSubmit}
          nomComplet={form.nomComplet} promotionNom={form.promotionNom}
        />
      )}
    </div>
  );
}
