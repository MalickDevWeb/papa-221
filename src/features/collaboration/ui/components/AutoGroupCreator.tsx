import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { GroupingCriterion } from '../../domain/CollaborationAlgorithms';

interface Props {
  readonly onAutoGenerate: (
    baseName: string,
    classId: string,
    criterion: GroupingCriterion,
    count: number,
    leaderRule: 'random' | 'gpa' | 'teacher'
  ) => void;
}

export function AutoGroupCreator({ onAutoGenerate }: Props) {
  const [baseName, setBaseName] = useState('Projet Annuel');
  const [classId, setClassId] = useState('L3-INFO');
  const [criterion, setCriterion] = useState<GroupingCriterion>('gpa');
  const [count, setCount] = useState(3);
  const [leaderRule, setLeaderRule] = useState<'random' | 'gpa' | 'teacher'>('gpa');
  const [minSize, setMinSize] = useState(2);
  const [maxSize, setMaxSize] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAutoGenerate(baseName, classId, criterion, count, leaderRule);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Nom de base</label>
          <input
            type="text"
            value={baseName}
            onChange={(e) => setBaseName(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg focus:ring-1 focus:ring-brand-red-deep"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Nbr Groupes</label>
          <input
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg focus:ring-1 focus:ring-brand-red-deep"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Taille Min</label>
          <input
            type="number"
            min="1"
            value={minSize}
            onChange={(e) => setMinSize(Number(e.target.value))}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Taille Max</label>
          <input
            type="number"
            min="1"
            value={maxSize}
            onChange={(e) => setMaxSize(Number(e.target.value))}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Critère de répartition équilibrée</label>
        <select
          value={criterion}
          onChange={(e) => setCriterion(e.target.value as GroupingCriterion)}
          className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg font-semibold"
        >
          <option value="gpa">Moyenne Générale / Niveau Académique</option>
          <option value="gender">Mixité des Sexes Équilibrée (F/M)</option>
          <option value="mixed">Compétences, Spécialités & Disponibilité</option>
          <option value="alpha">Ordre Alphabétique</option>
          <option value="random">Répartition Aléatoire</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Désignation du Chef de groupe</label>
        <select
          value={leaderRule}
          onChange={(e) => setLeaderRule(e.target.value as 'random' | 'gpa' | 'teacher')}
          className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg font-semibold"
        >
          <option value="gpa">Major de promo (GPA le plus élevé)</option>
          <option value="random">Désignation Aléatoire</option>
          <option value="teacher">Manuel / Élection interne</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
      >
        <Shuffle className="w-3.5 h-3.5" />
        <span>Répartir automatiquement</span>
      </button>
    </form>
  );
}
export default AutoGroupCreator;
