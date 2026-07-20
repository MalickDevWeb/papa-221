import React, { useState } from 'react';
import { LayoutDashboard, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Workgroup } from '../../domain/CollaborationModels';

interface Props {
  readonly group: Workgroup;
  readonly tasksCount: number;
  readonly completedTasksCount: number;
  readonly onAuditLog: (action: string) => void;
}

export function WorkspaceDashboard({ group, tasksCount, completedTasksCount, onAuditLog }: Props) {
  const [aiOutput, setAiOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const triggerAI = (actionType: string, prompt: string) => {
    setLoading(true);
    setAiOutput('');
    onAuditLog(`Utilisation de l'IA Co-pilote: ${actionType}`);
    setTimeout(() => {
      setLoading(false);
      if (actionType === 'summary') {
        setAiOutput("🤖 [IA Co-pilote - Résumé] : Les discussions récentes portent sur la normalisation des images médicales (224x224). Amadou s'occupe de filtrer les images floues, et Fatou prépare les diapositives pour la soutenance finale.");
      } else if (actionType === 'report') {
        setAiOutput("🤖 [IA Co-pilote - Compte Rendu] : Réunion du 18/07/2026. Absents : Aucun. Décisions : Adopter ResNet50 pour le modèle d'IA. Tâches : Amadou fournit le dataset nettoyé le 22/07.");
      } else if (actionType === 'inactive') {
        setAiOutput("🤖 [IA Co-pilote - Audit d'activité] : Tous les membres sont actifs cette semaine. Amadou a committé v2 aujourd'hui, et Fatou a envoyé 12 messages sur le chat.");
      } else {
        setAiOutput("🤖 [IA Co-pilote - Plan d'Action] : Recommandation : Affecter l'écriture du rapport d'évaluation des performances à Fatou, qui a une disponibilité supérieure ce weekend.");
      }
    }, 800);
  };

  const progress = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 50;

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-5 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-red-light text-brand-red-deep rounded-xl"><LayoutDashboard className="w-4 h-4" /></div>
        <div>
          <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wide">Tableau de Bord de Groupe</h3>
          <p className="text-[10px] text-neutral-500 font-semibold">{group.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 border border-neutral-100 rounded-xl bg-neutral-50/50">
          <span className="text-[10px] font-bold text-neutral-500 block">Progression Projet</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-black text-brand-red-deep">{progress}%</span>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-red-deep h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="p-3 border border-neutral-100 rounded-xl bg-neutral-50/50 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 block">Tâches Accomplies</span>
            <span className="text-base font-black text-gray-800 mt-1 block">{completedTasksCount} / {tasksCount}</span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="p-3 border border-neutral-100 rounded-xl bg-neutral-50/50">
          <span className="text-[10px] font-bold text-neutral-500 block">Chef de Groupe</span>
          <span className="text-xs font-black text-gray-800 mt-1 block">👑 {group.leaderName}</span>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <span className="text-[10px] font-bold text-neutral-600 block uppercase tracking-wider">🤖 Assistant IA Académique</span>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => triggerAI('summary', '')} className="px-2.5 py-1.5 bg-neutral-900 text-white font-bold text-[9px] rounded-lg hover:bg-neutral-800 transition-all flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Résumer le Chat
          </button>
          <button onClick={() => triggerAI('report', '')} className="px-2.5 py-1.5 bg-neutral-900 text-white font-bold text-[9px] rounded-lg hover:bg-neutral-800 transition-all flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Générer CR Réunion
          </button>
          <button onClick={() => triggerAI('inactive', '')} className="px-2.5 py-1.5 bg-neutral-900 text-white font-bold text-[9px] rounded-lg hover:bg-neutral-800 transition-all flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Détecter Inactifs
          </button>
          <button onClick={() => triggerAI('suggest', '')} className="px-2.5 py-1.5 bg-neutral-900 text-white font-bold text-[9px] rounded-lg hover:bg-neutral-800 transition-all flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Suggérer Planning
          </button>
        </div>

        {loading && <p className="text-[10px] text-brand-red-deep font-bold animate-pulse">L&apos;IA analyse les données du groupe...</p>}
        {aiOutput && (
          <div className="p-3 bg-amber-50/70 border border-amber-100 text-neutral-800 rounded-xl text-[10px] leading-relaxed font-semibold">
            {aiOutput}
          </div>
        )}
      </div>
    </div>
  );
}
export default WorkspaceDashboard;
