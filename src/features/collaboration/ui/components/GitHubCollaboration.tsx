import React, { useState } from 'react';
import { GitBranch, History, MessageSquare, Check, X, Send } from 'lucide-react';
import { RepoDocument } from '../../domain/CollaborationModels';

interface Props {
  readonly documents: readonly RepoDocument[];
  readonly groupId: string;
  readonly onCommit: (groupId: string, name: string, desc: string, author: string, comment: string) => void;
  readonly onComment: (docId: string, author: string, text: string) => void;
  readonly userName: string;
}

export function GitHubCollaboration({ documents, groupId, onCommit, onComment, userName }: Props) {
  const [docName, setDocName] = useState('');
  const [comment, setComment] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [fileComment, setFileComment] = useState('');

  const groupDocs = documents.filter((d) => d.groupId === groupId);
  const activeDoc = groupDocs.find((d) => d.id === selectedDocId);

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="w-5 h-5 text-brand-red-deep" />
        <div>
          <h3 className="font-bold text-sm text-gray-900">Dépôt de Fichiers & Versioning (Workflow GitHub)</h3>
          <p className="text-[10px] text-neutral-500 font-semibold">Commits de versions de fichiers et validation par l&apos;enseignant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Document List & Commit trigger */}
        <div className="space-y-4">
          <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
            {groupDocs.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDocId(d.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${selectedDocId === d.id ? 'border-brand-red-deep bg-brand-red-light/30' : 'border-neutral-gray-200 hover:border-neutral-300'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-gray-800">{d.name}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${d.status === 'Validé' ? 'bg-emerald-50 text-emerald-700' : d.status === 'Rejeté' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{d.status}</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 font-semibold">
                  <span>Version v{d.latestVersion}</span>
                  <span>Modifié par {d.updatedBy}</span>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (docName && comment) {
                onCommit(groupId, docName, 'Spécifications techniques', userName, comment);
                setDocName('');
                setComment('');
              }
            }}
            className="space-y-2 bg-neutral-gray-50 p-3 rounded-xl"
          >
            <span className="text-[10px] font-bold text-neutral-600 block">Nouveau commit</span>
            <input
              type="text"
              placeholder="Nom du fichier (ex: Rapport_Soutenance.pdf)"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep bg-white"
            />
            <input
              type="text"
              placeholder="Message de commit (ex: v3 - Ajout des diagrammes)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep bg-white"
            />
            <button type="submit" className="w-full py-1.5 bg-neutral-900 text-white font-bold text-[10px] rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-1">
              <GitBranch className="w-3.5 h-3.5" /> Committer & Pousser
            </button>
          </form>
        </div>

        {/* Right: Selected Doc Version History & Comments */}
        <div className="border border-neutral-gray-100 rounded-2xl p-4 bg-neutral-gray-50/50 flex flex-col justify-between h-[280px]">
          {activeDoc ? (
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-3 overflow-y-auto no-scrollbar flex-grow pr-1">
                <span className="text-[10px] font-bold text-neutral-700 block mb-2">Historique des Commits - v{activeDoc.latestVersion}</span>
                {activeDoc.history.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start text-[10px] border-b border-neutral-100 pb-2">
                    <History className="w-3.5 h-3.5 text-neutral-400 mt-0.5" />
                    <div className="flex-grow">
                      <div className="flex justify-between font-bold">
                        <span>v{h.version} par {h.author}</span>
                        <span className="text-[8px] text-neutral-400">{h.updatedAt}</span>
                      </div>
                      <p className="text-neutral-500 italic mt-0.5">&quot;{h.comment}&quot;</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-200">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Commenter le livrable..."
                    value={fileComment}
                    onChange={(e) => setFileComment(e.target.value)}
                    className="flex-grow text-[10px] px-2.5 py-1.5 border border-neutral-200 rounded-xl bg-white"
                  />
                  <button
                    onClick={() => {
                      if (fileComment) {
                        onComment(activeDoc.id, userName, fileComment);
                        setFileComment('');
                      }
                    }}
                    className="p-1.5 bg-brand-red-deep text-white rounded-xl"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-[11px] text-neutral-400 my-auto font-semibold">Sélectionnez un document à gauche pour inspecter sa timeline GitHub et ajouter des commentaires.</div>
          )}
        </div>
      </div>
    </div>
  );
}
export default GitHubCollaboration;
