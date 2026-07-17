import React, { useState } from 'react';
import { Users, Shuffle, Award, CheckCircle } from 'lucide-react';
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

export function GroupCreator({ onAutoGenerate }: Props) {
  const [baseName, setBaseName] = useState('Projet Annuel');
  const [classId, setClassId] = useState('L3-INFO');
  const [criterion, setCriterion] = useState<GroupingCriterion>('gpa');
  const [count, setCount] = useState(3);
  const [leaderRule, setLeaderRule] = useState<'random' | 'gpa' | 'teacher'>('gpa');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    onAutoGenerate(baseName, classId, criterion, count, leaderRule);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-brand-red-light text-brand-red-deep">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-gray-900">Générateur Automatique de Groupes</h3>
          <p className="text-xs text-neutral-500">Répartissez les étudiants avec l&apos;algorithme équilibreur</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nom de base</label>
            <input
              type="text"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre de groupes</label>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Critère de répartition équilibrée</label>
          <select
            value={criterion}
            onChange={(e) => setCriterion(e.target.value as GroupingCriterion)}
            className="w-full text-xs font-semibold px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
          >
            <option value="gpa">Moyenne Académique Équilibrée (Zig-zag GPA)</option>
            <option value="gender">Mixité des Sexes Équilibrée (F/M)</option>
            <option value="alpha">Ordre Alphabétique</option>
            <option value="random">Aléatoire Pur</option>
            <option value="mixed">Mélange de profils divers</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Désignation du Chef de groupe</label>
          <select
            value={leaderRule}
            onChange={(e) => setLeaderRule(e.target.value as 'random' | 'gpa' | 'teacher')}
            className="w-full text-xs font-semibold px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
          >
            <option value="gpa">Le plus haut niveau académique (Major GPA)</option>
            <option value="random">Aléatoire au sein du groupe</option>
            <option value="teacher">Manuel / Élection interne</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-neutral-gray-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Shuffle className="w-4 h-4" />
          <span>Générer & Répartir Automatiquement</span>
        </button>
      </form>
    </div>
  );
}
export default GroupCreator;
