import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';

interface Props {
  readonly groupId: string;
  readonly userName: string;
  readonly onCommit: (groupId: string, name: string, desc: string, author: string, comment: string) => void;
}

export function CommitForm({ groupId, userName, onCommit }: Props) {
  const [docName, setDocName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docName && comment) {
      onCommit(groupId, docName, 'Spécifications techniques', userName, comment);
      setDocName('');
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-neutral-gray-50 p-3 rounded-xl">
      <span className="text-[10px] font-bold text-neutral-600 block">Nouveau commit</span>
      <input
        type="text"
        placeholder="Nom du fichier (ex: Rapport_Soutenance.pdf)"
        value={docName}
        onChange={(e) => setDocName(e.target.value)}
        className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none bg-white"
        required
      />
      <input
        type="text"
        placeholder="Message de commit (ex: v3 - Ajout des diagrammes)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none bg-white"
        required
      />
      <button type="submit" className="w-full py-1.5 bg-neutral-900 text-white font-bold text-[10px] rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-1">
        <GitBranch className="w-3.5 h-3.5" /> Committer & Pousser
      </button>
    </form>
  );
}
export default CommitForm;
