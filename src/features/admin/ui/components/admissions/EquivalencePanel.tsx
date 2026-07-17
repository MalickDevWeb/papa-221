import React, { useState } from 'react';
import { EquivalenceDetails } from '../../../domain/AdmissionsExtendedModels';

interface Props {
  initialEquivalence?: EquivalenceDetails;
  onSave: (eq: EquivalenceDetails) => void;
}

export function EquivalencePanel({ initialEquivalence, onSave }: Props) {
  const [comparedProgram, setComparedProgram] = useState(initialEquivalence?.comparedProgram || '');
  const [validatedCredits, setValidatedCredits] = useState(initialEquivalence?.validatedCredits || 0);
  const [dispense, setDispense] = useState('');
  const [dispenses, setDispenses] = useState<string[]>(initialEquivalence?.dispenses || []);
  const [complement, setComplement] = useState('');
  const [complements, setComplements] = useState<string[]>(initialEquivalence?.complements || []);

  const handleAddDispense = () => {
    if (dispense.trim()) {
      setDispenses([...dispenses, dispense.trim()]);
      setDispense('');
    }
  };

  const handleAddComplement = () => {
    if (complement.trim()) {
      setComplements([...complements, complement.trim()]);
      setComplement('');
    }
  };

  const handleSave = () => {
    onSave({
      status: 'approved',
      comparedProgram,
      validatedCredits,
      dispenses,
      complements,
      decisionBy: 'Commission des Équivalences',
      decisionDate: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs font-bold text-neutral-600">
      <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center">
        <span className="font-extrabold text-[#1E293B] uppercase text-[10px] tracking-wide">Moteur d'Équivalences Académiques</span>
        <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-black uppercase">Étude de Dossier</span>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-[9px] text-neutral-400 font-black uppercase block">Comparaison des Programmes / Cursus d'origine</label>
          <input
            type="text"
            placeholder="Ex: L1 Physique-Chimie UCAD vs L1 Génie Civil"
            className="w-full bg-white px-3 py-2 border border-neutral-200 rounded-lg text-xs"
            value={comparedProgram}
            onChange={e => setComparedProgram(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-neutral-400 font-black uppercase block">Crédits Validés & Transférés (ECTS / ANAQ)</label>
          <input
            type="number"
            className="w-full bg-white px-3 py-2 border border-neutral-200 rounded-lg text-xs"
            value={validatedCredits}
            onChange={e => setValidatedCredits(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 font-black uppercase block">Dispenses d'UE accordées</label>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Ex: Algèbre"
                className="flex-1 bg-white px-2 py-1 border border-neutral-200 rounded-lg text-xs"
                value={dispense}
                onChange={e => setDispense(e.target.value)}
              />
              <button onClick={handleAddDispense} className="px-2 bg-slate-200 rounded-lg font-black text-black hover:bg-slate-300">+</button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {dispenses.map((d, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">{d}</span>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 font-black uppercase block">Compléments de formation requis</label>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Ex: Dessin technique"
                className="flex-1 bg-white px-2 py-1 border border-[#E2DCDA] rounded-lg text-xs"
                value={complement}
                onChange={e => setComplement(e.target.value)}
              />
              <button onClick={handleAddComplement} className="px-2 bg-slate-200 rounded-lg font-black text-black hover:bg-slate-300">+</button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {complements.map((c, i) => (
                <span key={i} className="bg-rose-50 text-rose-800 text-[8px] font-bold px-1.5 py-0.5 rounded border border-rose-200">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white text-[9.5px] font-black uppercase rounded-lg transition-all"
      >
        Enregistrer la Décision d'Équivalence
      </button>
    </div>
  );
}
