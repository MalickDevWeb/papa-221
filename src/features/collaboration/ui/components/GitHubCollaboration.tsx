import React, { useState } from 'react';
import { GitBranch, Search } from 'lucide-react';
import { RepoDocument } from '../../domain/CollaborationModels';
import { DocCommitHistory } from './DocCommitHistory';
import { CommitForm } from './CommitForm';

interface Props {
  readonly documents: readonly RepoDocument[];
  readonly groupId: string;
  readonly onCommit: (groupId: string, name: string, desc: string, author: string, comment: string) => void;
  readonly onComment: (docId: string, author: string, text: string) => void;
  readonly userName: string;
}

export function GitHubCollaboration({ documents, groupId, onCommit, onComment, userName }: Props) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const groupDocs = (Array.isArray(documents) ? documents : []).filter((d) => {
    const matchesGroup = d.groupId === groupId;
    const matchesSearch = searchQuery.trim() === '' || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.updatedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const activeDoc = groupDocs.find((d) => d.id === selectedDocId);

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-brand-red-deep" />
          <div>
            <h3 className="font-bold text-sm text-gray-900">Dépôt de Fichiers & Versioning (Workflow GitHub)</h3>
            <p className="text-[10px] text-neutral-500 font-semibold">Commits de versions de fichiers et validation par l&apos;enseignant</p>
          </div>
        </div>

        {/* Search Input for documents */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher fichier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-40 text-[10px] pl-8 pr-2 py-1 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red-deep bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Document List & Commit trigger */}
        <div className="space-y-4">
          <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
            {groupDocs.length === 0 ? (
              <p className="text-center text-neutral-400 text-[11px] py-4 font-semibold">Aucun document trouvé.</p>
            ) : (
              groupDocs.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDocId(d.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedDocId === d.id ? 'border-brand-red-deep bg-brand-red-light/30' : 'border-neutral-gray-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-gray-800">{d.name}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      d.status === 'Validé' ? 'bg-emerald-50 text-emerald-700' : d.status === 'Rejeté' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-500 font-semibold">
                    <span>Version v{d.latestVersion}</span>
                    <span>Modifié par {d.updatedBy}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <CommitForm groupId={groupId} userName={userName} onCommit={onCommit} />
        </div>

        {/* Right: Selected Doc Version History & Comments */}
        {activeDoc ? (
          <DocCommitHistory activeDoc={activeDoc} userName={userName} onComment={onComment} />
        ) : (
          <div className="border border-neutral-gray-100 rounded-2xl p-4 bg-neutral-gray-50/50 flex flex-col justify-center items-center h-[280px]">
            <div className="text-center text-[11px] text-neutral-400 font-semibold">
              Sélectionnez un document à gauche pour inspecter sa timeline GitHub et ajouter des commentaires.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default GitHubCollaboration;
