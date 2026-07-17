import React, { useState } from 'react';
import { AdmissionType } from '../../../domain/AdmissionsExtendedModels';

interface Rule {
  type: AdmissionType;
  label: string;
  minCredits?: number;
  minExperienceYears?: number;
  requiresTranscripts: boolean;
  requiresPassportAndVisa: boolean;
  autoCheckPastEnrollment: boolean;
  requiresOfficialDecision: boolean;
}

const INITIAL_RULES: Rule[] = [
  { type: 'BAC', label: 'Nouveau Bachelier', requiresTranscripts: false, requiresPassportAndVisa: false, autoCheckPastEnrollment: false, requiresOfficialDecision: false },
  { type: 'L2', label: 'Admission L2', minCredits: 60, requiresTranscripts: true, requiresPassportAndVisa: false, autoCheckPastEnrollment: false, requiresOfficialDecision: false },
  { type: 'L3', label: 'Admission L3', minCredits: 120, requiresTranscripts: true, requiresPassportAndVisa: false, autoCheckPastEnrollment: false, requiresOfficialDecision: false },
  { type: 'TRANSFER', label: 'Transfert Universitaire', minCredits: 60, requiresTranscripts: true, requiresPassportAndVisa: false, autoCheckPastEnrollment: false, requiresOfficialDecision: false },
  { type: 'REINSCRIPTION', label: 'Réinscription Interne', requiresTranscripts: false, requiresPassportAndVisa: false, autoCheckPastEnrollment: true, requiresOfficialDecision: false },
  { type: 'INT', label: 'Étudiant International', requiresTranscripts: true, requiresPassportAndVisa: true, autoCheckPastEnrollment: false, requiresOfficialDecision: false },
  { type: 'VAE', label: 'Validation des Acquis (VAE)', minExperienceYears: 3, requiresTranscripts: true, requiresPassportAndVisa: false, autoCheckPastEnrollment: false, requiresOfficialDecision: false },
  { type: 'EXCEPT', label: 'Admission Exceptionnelle', requiresTranscripts: false, requiresPassportAndVisa: false, autoCheckPastEnrollment: false, requiresOfficialDecision: true }
];

export function AdmissionsRulesEngine() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number>(0);

  const updateRule = (index: number, fields: Partial<Rule>) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, ...fields } : r));
  };

  const active = rules[selectedRuleIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs text-[#4A5568] font-bold" id="rules-engine-root">
      <div className="lg:col-span-1 bg-[#FAF8F6] border border-neutral-200 rounded-xl p-4 flex flex-col gap-1.5 max-h-[360px] overflow-y-auto">
        <span className="text-[9px] font-black uppercase tracking-wider text-[#1E293B] mb-1">Moteurs de Règles</span>
        {rules.map((rule, idx) => (
          <button
            key={rule.type}
            onClick={() => setSelectedRuleIndex(idx)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
              selectedRuleIndex === idx
                ? 'bg-[#B3181C] text-white border-[#B3181C]'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
            }`}
          >
            <span className="truncate">{rule.label}</span>
            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-black/10">{rule.type}</span>
          </button>
        ))}
      </div>

      <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
        <div className="border-b border-neutral-100 pb-2">
          <h4 className="font-extrabold text-sm text-[#1E293B]">Spécifications : {active.label}</h4>
          <p className="text-[10px] text-neutral-400 font-semibold">Configurez les contraintes logiques et documents requis à valider automatiquement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2.5 p-3 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-50/50">
            <input
              type="checkbox"
              checked={active.requiresTranscripts}
              onChange={e => updateRule(selectedRuleIndex, { requiresTranscripts: e.target.checked })}
              className="w-4 h-4 rounded text-[#B3181C] accent-[#B3181C]"
            />
            <div>
              <span className="block text-[#1E293B]">Exiger relevés de notes originaux</span>
              <span className="text-[9px] text-neutral-400 font-semibold">Bloquant si non téléversé</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-50/50">
            <input
              type="checkbox"
              checked={active.requiresPassportAndVisa}
              onChange={e => updateRule(selectedRuleIndex, { requiresPassportAndVisa: e.target.checked })}
              className="w-4 h-4 rounded text-[#B3181C] accent-[#B3181C]"
            />
            <div>
              <span className="block text-[#1E293B]">Contrôle Passeport + Visa d'étude</span>
              <span className="text-[9px] text-neutral-400 font-semibold">Exigé pour les internationaux</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-50/50">
            <input
              type="checkbox"
              checked={active.autoCheckPastEnrollment}
              onChange={e => updateRule(selectedRuleIndex, { autoCheckPastEnrollment: e.target.checked })}
              className="w-4 h-4 rounded text-[#B3181C] accent-[#B3181C]"
            />
            <div>
              <span className="block text-[#1E293B]">Vérification automatique scolarité</span>
              <span className="text-[9px] text-neutral-400 font-semibold">Contrôle dettes, sanctions, validation N-1</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-50/50">
            <input
              type="checkbox"
              checked={active.requiresOfficialDecision}
              onChange={e => updateRule(selectedRuleIndex, { requiresOfficialDecision: e.target.checked })}
              className="w-4 h-4 rounded text-[#B3181C] accent-[#B3181C]"
            />
            <div>
              <span className="block text-[#1E293B]">Décision officielle requise (Dérogatoire)</span>
              <span className="text-[9px] text-neutral-400 font-semibold">Nécessite avis du Recteur / Ministère</span>
            </div>
          </label>
        </div>

        <div className="flex gap-4 p-3 bg-[#FAF8F6] border border-neutral-200 rounded-xl">
          {active.minCredits !== undefined && (
            <div className="space-y-1 flex-1">
              <label className="text-[9px] font-black uppercase text-neutral-400">Crédits minimum validés requis</label>
              <input
                type="number"
                value={active.minCredits}
                onChange={e => updateRule(selectedRuleIndex, { minCredits: Number(e.target.value) })}
                className="w-full bg-white px-2.5 py-1.5 border border-neutral-200 rounded-lg outline-none font-extrabold text-xs"
              />
            </div>
          )}

          {active.minExperienceYears !== undefined && (
            <div className="space-y-1 flex-1">
              <label className="text-[9px] font-black uppercase text-neutral-400">Expérience pro minimum (années VAE)</label>
              <input
                type="number"
                value={active.minExperienceYears}
                onChange={e => updateRule(selectedRuleIndex, { minExperienceYears: Number(e.target.value) })}
                className="w-full bg-white px-2.5 py-1.5 border border-neutral-200 rounded-lg outline-none font-extrabold text-xs"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
