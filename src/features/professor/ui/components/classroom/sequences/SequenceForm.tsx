import React, { useState } from 'react';

interface Props {
  readonly onAddSequence: (seq: any) => void;
  readonly onClose: () => void;
}

export function SequenceForm({ onAddSequence, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('2 heures');
  const [prereq, setPrereq] = useState('');
  const [comp, setComp] = useState('');
  const [pdf, setPdf] = useState('');
  const [code, setCode] = useState('');
  const [releaseRule, setReleaseRule] = useState('immediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddSequence({
      id: Date.now().toString(),
      title,
      duration,
      prerequisites: prereq || 'Aucun',
      competency: comp || 'Compétence générale du module',
      pdf: pdf || 'https://storage.googleapis.com/pdf-example.pdf',
      code: code || 'https://github.com/example/repo',
      releaseRule,
      version: 'v1.1.0'
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs font-semibold" id="sequence-form">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
        <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#B3181C]">
          <span className="material-symbols-outlined text-sm">post_add</span> Planifier une Séquence
        </h4>
        <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600">Fermer</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[10px] text-neutral-400 uppercase">Titre de la Séquence</label>
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 bg-white rounded-lg text-xs font-bold" placeholder="Ex: Séquence 1 - Introduction à la RDM" />
        </div>
        <div>
          <label className="text-[10px] text-neutral-400 uppercase">Durée de l'intervention</label>
          <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 bg-white rounded-lg text-xs font-bold" />
        </div>
        <div>
          <label className="text-[10px] text-neutral-400 uppercase">Prérequis Académiques</label>
          <input type="text" value={prereq} onChange={e => setPrereq(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 bg-white rounded-lg text-xs font-bold" placeholder="Ex: Résolution d'équations" />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] text-neutral-400 uppercase">Compétence principale ciblée</label>
          <input type="text" value={comp} onChange={e => setComp(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 bg-white rounded-lg text-xs font-bold" placeholder="Ex: Être capable de calculer les contraintes" />
        </div>
        <div>
          <label className="text-[10px] text-neutral-400 uppercase">Support PDF (Versionné)</label>
          <input type="text" value={pdf} onChange={e => setPdf(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 bg-white rounded-lg text-xs font-bold" placeholder="Lien du support de cours" />
        </div>
        <div>
          <label className="text-[10px] text-neutral-400 uppercase">Dépôt Code / GitHub / Notebook</label>
          <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 bg-white rounded-lg text-xs font-bold" placeholder="Lien vers le dépôt" />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] text-neutral-400 uppercase">Règle de Publication / Déblocage</label>
          <select value={releaseRule} onChange={e => setReleaseRule(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 bg-white rounded-lg text-xs font-bold">
            <option value="immediate">Libération Immédiate (Publié)</option>
            <option value="after_quiz">Déblocage conditionnel (Après validation du Quiz précédent)</option>
            <option value="timed">Publication planifiée (À une date précise)</option>
            <option value="completion">Selon progression minimale de l'étudiant</option>
          </select>
        </div>
      </div>

      <button type="submit" className="w-full mt-2 py-2 bg-[#B3181C] hover:bg-[#921316] text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl transition-all">
        Publier & Versionner la Séquence
      </button>
    </form>
  );
}
