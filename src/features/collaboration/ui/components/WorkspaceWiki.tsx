import React, { useState } from 'react';
import { BookOpen, FileText, Plus, ShieldCheck } from 'lucide-react';
import { WikiPage, CollabNote } from '../../domain/TaskWikiModels';

interface Props {
  readonly wikiPages: readonly WikiPage[];
  readonly notes: readonly CollabNote[];
  readonly groupId: string;
  readonly onAddWiki: (groupId: string, title: string, content: string, author: string) => void;
  readonly onAddNote: (groupId: string, title: string, content: string, isPrivate: boolean, authorId: string, authorName: string) => void;
  readonly userName: string;
}

export function WorkspaceWiki({ wikiPages, notes, groupId, onAddWiki, onAddNote, userName }: Props) {
  const [wikiTitle, setWikiTitle] = useState('');
  const [wikiContent, setWikiContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedWikiId, setSelectedWikiId] = useState<string | null>(null);

  const groupWikis = wikiPages.filter((w) => w.groupId === groupId);
  const groupNotes = notes.filter((n) => n.groupId === groupId && (!n.isPrivate || n.authorName === userName));
  const activeWiki = groupWikis.find((w) => w.id === selectedWikiId) || groupWikis[0];

  const handleAddWiki = (e: React.FormEvent) => {
    e.preventDefault();
    if (wikiTitle && wikiContent) {
      onAddWiki(groupId, wikiTitle, wikiContent, userName);
      setWikiTitle('');
      setWikiContent('');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteTitle && noteContent) {
      onAddNote(groupId, noteTitle, noteContent, isPrivate, 'stud-current', userName);
      setNoteTitle('');
      setNoteContent('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-5 shadow-sm space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Wiki Section */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase text-neutral-500 tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-red-deep" /> Wiki Collaboratif du Groupe
          </span>
          <div className="flex gap-2 max-h-[80px] overflow-x-auto no-scrollbar py-1">
            {groupWikis.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWikiId(w.id)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border shrink-0 transition-all ${
                  activeWiki?.id === w.id ? 'border-brand-red-deep bg-brand-red-light/25 text-brand-red-deep' : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {w.title}
              </button>
            ))}
          </div>

          {activeWiki && (
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-[10px] space-y-1">
              <span className="font-bold text-gray-800 text-xs block">{activeWiki.title}</span>
              <p className="text-neutral-600 font-medium leading-relaxed">{activeWiki.content}</p>
              <span className="text-[8px] text-neutral-400 font-bold block pt-1">Mis à jour par {activeWiki.author} le {activeWiki.updatedAt}</span>
            </div>
          )}

          <form onSubmit={handleAddWiki} className="space-y-1.5 p-2.5 bg-neutral-50/50 rounded-xl border border-neutral-100">
            <input type="text" placeholder="Titre de la nouvelle page..." value={wikiTitle} onChange={(e) => setWikiTitle(e.target.value)} className="w-full text-[10px] px-2 py-1.5 border border-neutral-200 rounded-lg bg-white" required />
            <textarea placeholder="Contenu explicatif..." value={wikiContent} onChange={(e) => setWikiContent(e.target.value)} className="w-full text-[10px] px-2 py-1.5 border border-neutral-200 rounded-lg bg-white resize-none h-12" required />
            <button type="submit" className="w-full py-1 bg-brand-red-deep text-white font-bold text-[9px] rounded-lg">Créer Page Wiki</button>
          </form>
        </div>

        {/* Right: Prise de Notes */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase text-neutral-500 tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-neutral-900" /> Prise de Notes & Favoris
          </span>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
            {groupNotes.map((n) => (
              <div key={n.id} className={`p-2 rounded-xl border text-[10px] relative ${n.isPrivate ? 'border-amber-200 bg-amber-50/30' : 'border-neutral-200 bg-white'}`}>
                <div className="flex justify-between font-bold">
                  <span>{n.title}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${n.isPrivate ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {n.isPrivate ? 'Privée' : `Partagée (par ${n.authorName})`}
                  </span>
                </div>
                <p className="text-neutral-500 italic mt-0.5">&quot;{n.content}&quot;</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddNote} className="space-y-1.5 p-2.5 bg-neutral-50/50 rounded-xl border border-neutral-100">
            <input type="text" placeholder="Titre de la note..." value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} className="w-full text-[10px] px-2 py-1.5 border border-neutral-200 rounded-lg bg-white" required />
            <input type="text" placeholder="Corps de la note..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} className="w-full text-[10px] px-2 py-1.5 border border-neutral-200 rounded-lg bg-white" required />
            <div className="flex justify-between items-center text-[9px] font-bold text-neutral-500">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="h-3 w-3 rounded text-amber-500" /> Note privée (personnelle)
              </label>
              <button type="submit" className="px-3 py-1 bg-neutral-900 text-white rounded-lg font-bold">Ajouter Note</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
export default WorkspaceWiki;
