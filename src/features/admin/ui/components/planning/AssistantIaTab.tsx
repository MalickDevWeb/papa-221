import React, { useState } from 'react';
import { IaConfigForm } from './IaConfigForm';
import { IaResultsDisplay } from './IaResultsDisplay';

interface Props {
  onApplyIaSchedule: (newSlots: any[], info: string) => void;
}

export function AssistantIaTab({ onApplyIaSchedule }: Props) {
  const [promptInput, setPromptInput] = useState('');
  const [rules, setRules] = useState({
    noGaps: true,
    respectQuota: false,
    prioritizeLargeAmphis: true,
    evenDistribution: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedResult(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedResult({
        score: '98%',
        conflits: '0',
        recommendations: [
          'Affecté Béton Armé en Amphi A le Lundi à 14h (priorité L2 Génie Civil)',
          'Positionné Machine Learning le Mercredi matin pour Mme Sow (disponibilité optimale)',
          'Zéro chevauchement de salle ou de professeur détecté',
        ],
        slots: [
          { id: 'ai-s1', subject: 'Béton Armé', prof: 'Dr. Diallo', room: 'Salle 1 - Amphi A', classe: 'L2 Génie Civil', day: 'Lundi', slot: '14h - 16h', type: 'soir' },
          { id: 'ai-s2', subject: 'Machine Learning', prof: 'Mme. Sow', room: 'Salle 3 - Labo GC', classe: 'Master 1 Spécialité IA', day: 'Mercredi', slot: '08h - 10h', type: 'matin' },
        ]
      });
    }, 2800);
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyIaSchedule(generatedResult.slots, 'Planning optimisé par l\'IA appliqué avec succès !');
      setGeneratedResult(null);
    }
  };

  return (
    <div className="space-y-4 text-xs font-bold text-[#4A5568]" id="assistant-ia-tab">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2">
          <span translate="no" className="material-symbols-outlined text-[#B3181C]">psychology</span>
          <span>Assistant IA & Optimisation des Horaires</span>
        </h3>
        <p className="text-[10px] text-neutral-400 font-semibold">Génération automatisée intelligente sous contraintes pédagogiques et logistiques.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IaConfigForm
          promptInput={promptInput}
          setPromptInput={setPromptInput}
          rules={rules}
          setRules={setRules}
          isGenerating={isGenerating}
          handleGenerate={handleGenerate}
        />

        <IaResultsDisplay
          isGenerating={isGenerating}
          generatedResult={generatedResult}
          handleApply={handleApply}
        />
      </div>
    </div>
  );
}
