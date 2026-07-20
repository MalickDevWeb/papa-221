import React, { useState } from 'react';
import { UserPlus, Star, Check } from 'lucide-react';
import { GroupMember } from '../../domain/CollaborationModels';
import { COLLAB_STUDENTS_MOCK } from '../../domain/CollaborationMockData';

interface Props {
  readonly onCreateManual: (
    name: string,
    description: string,
    classId: string,
    leader: GroupMember,
    members: readonly GroupMember[]
  ) => void;
}

export function ManualGroupCreator({ onCreateManual }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('L3-INFO');
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([]);
  const [leaderId, setLeaderId] = useState('');

  const handleToggleStudent = (studentId: string) => {
    setSelectedIds((prev) => {
      const isSelected = prev.includes(studentId);
      const next = isSelected ? prev.filter((id) => id !== studentId) : [...prev, studentId];
      if (isSelected && leaderId === studentId) setLeaderId('');
      return next;
    });
  };

  const selectedStudents = COLLAB_STUDENTS_MOCK.filter((s) => selectedIds.includes(s.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) return;
    const leader = selectedStudents.find((s) => s.id === leaderId) || selectedStudents[0];
    onCreateManual(name, description, classId, leader, selectedStudents);
    setName('');
    setDescription('');
    setSelectedIds([]);
    setLeaderId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Nom du Groupe</label>
          <input
            type="text"
            placeholder="Ex: Groupe Delta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg focus:ring-1 focus:ring-brand-red-deep"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Classe</label>
          <input
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg focus:ring-1 focus:ring-brand-red-deep"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Sélectionner les Étudiants ({selectedStudents.length})</label>
        <div className="max-h-24 overflow-y-auto border border-neutral-gray-200 rounded-lg p-1.5 space-y-1 bg-gray-50">
          {COLLAB_STUDENTS_MOCK.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            return (
              <button
                key={student.id}
                type="button"
                onClick={() => handleToggleStudent(student.id)}
                className={`w-full flex items-center justify-between text-left px-2 py-1 rounded text-xs transition-colors ${
                  isSelected ? 'bg-indigo-50 text-indigo-900 border border-indigo-100' : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>{student.name} ({student.gender} - GPA {student.gpa})</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {selectedStudents.length > 0 && (
        <div>
          <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Désigner le Chef de Groupe</label>
          <select
            value={leaderId}
            onChange={(e) => setLeaderId(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-gray-200 rounded-lg"
            required
          >
            <option value="">-- Choisir un chef --</option>
            {selectedStudents.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={selectedStudents.length === 0 || !name}
        className="w-full py-2 bg-neutral-gray-900 text-white font-bold text-xs rounded-lg hover:bg-neutral-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Créer le Groupe Manuellement</span>
      </button>
    </form>
  );
}
export default ManualGroupCreator;
