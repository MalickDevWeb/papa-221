import React, { useState } from 'react';
import { SequenceForm } from './sequences/SequenceForm';
import { SequenceList } from './sequences/SequenceList';
import { StudentTrackingDashboard } from './sequences/StudentTrackingDashboard';

interface Props {
  readonly moduleId: string;
  readonly students: readonly any[];
}

const INITIAL_SEQUENCES = [
  {
    id: 's1',
    title: 'Séquence 1 : Fondements théoriques & Analyse dimensionnelle',
    duration: '2 heures',
    prerequisites: 'Aucun (Cours introductif)',
    competency: 'Modéliser les contraintes planes dans un solide de section homogène',
    pdf: 'https://example.com/assets/slides-rdm-s1.pdf',
    code: 'https://github.com/ecole221/rdm-notebooks',
    releaseRule: 'immediate',
    version: 'v1.0'
  },
  {
    id: 's2',
    title: 'Séquence 2 : Atelier Pratique & Échantillonnage structurel',
    duration: '3 heures',
    prerequisites: 'Validation théorique Séquence 1',
    competency: 'Dimensionner des poutres sur appuis simples sous charges réparties',
    pdf: 'https://example.com/assets/slides-rdm-s2.pdf',
    code: 'https://github.com/ecole221/rdm-lab2',
    releaseRule: 'after_quiz',
    version: 'v1.1'
  }
];

export function ModuleSequencesSection({ moduleId, students }: Props) {
  const [panelTab, setPanelTab] = useState<'plan' | 'tracking'>('plan');
  const [sequences, setSequences] = useState(INITIAL_SEQUENCES);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddSequence = (newSeq: any) => {
    setSequences([...sequences, newSeq]);
  };

  return (
    <div className="space-y-5" id="module-sequences-section">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-3 text-xs font-semibold">
        <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setPanelTab('plan')}
            className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px] font-black transition-all cursor-pointer ${
              panelTab === 'plan' ? 'bg-white text-[#B3181C] shadow-3xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Séquences Pédagogiques ({sequences.length})
          </button>
          <button
            onClick={() => setPanelTab('tracking')}
            className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px] font-black transition-all cursor-pointer ${
              panelTab === 'tracking' ? 'bg-white text-[#B3181C] shadow-3xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Suivi des Étudiants & Diagnostics
          </button>
        </div>

        {panelTab === 'plan' && !isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-3 py-1.5 bg-[#B3181C] text-white rounded-xl uppercase text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all hover:scale-102"
          >
            <span className="material-symbols-outlined text-[14px]">add</span> Ajouter Séquence
          </button>
        )}
      </div>

      <div className="animate-fade-in">
        {panelTab === 'plan' ? (
          <div className="space-y-4">
            {isFormOpen && (
              <SequenceForm onAddSequence={handleAddSequence} onClose={() => setIsFormOpen(false)} />
            )}
            <SequenceList sequences={sequences} />
          </div>
        ) : (
          <StudentTrackingDashboard students={students} />
        )}
      </div>
    </div>
  );
}
export default ModuleSequencesSection;
