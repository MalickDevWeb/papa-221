import React, { useState } from 'react';
import { Plus, Trash2, FileText, Video, Link2, Globe, FileSpreadsheet } from 'lucide-react';
import type { Lesson } from '../../../hooks/useModuleLessons';

interface Props {
  readonly chapterId: string | null;
  readonly lessons: readonly Lesson[];
  readonly onAddLesson: (title: string, type: 'text' | 'video' | 'pdf' | 'doc' | 'link', content: string) => void;
  readonly onDeleteLesson: (id: string) => void;
  readonly listContainerStyle?: React.CSSProperties;
}

export function LessonMainList({ chapterId, lessons, onAddLesson, onDeleteLesson, listContainerStyle }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'text' | 'video' | 'pdf' | 'doc' | 'link'>('text');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddLesson(title.trim(), type, content.trim());
      setTitle(''); setContent('');
    }
  };

  const active = lessons.filter((l) => l.chapterId === chapterId);
  if (!chapterId) {
    return (
      <div className="h-full flex items-center justify-center p-8 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-xs font-bold text-neutral-400">
        Sélectionnez ou créez un chapitre pour y ajouter des leçons et des documents de cours.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-150/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nom de la ressource..." className="sm:col-span-2 px-3 py-2 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none" required />
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="px-3 py-2 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none cursor-pointer">
            <option value="text">Notes de cours</option>
            <option value="video">Vidéo explicative</option>
            <option value="pdf">Document PDF</option>
            <option value="doc">Fichier (Word/Excel)</option>
            <option value="link">Lien externe / Web</option>
          </select>
        </div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={type === 'text' ? 'Notes ou explications...' : 'Lien URL du document ou ressource...'} rows={2} className="w-full px-3 py-2 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none resize-none" required />
        <button type="submit" className="w-full py-1.5 bg-brand-red-deep text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border-0">
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> Ajouter au chapitre
        </button>
      </form>

      <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar" style={listContainerStyle}>
        {active.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-[11px] font-bold text-neutral-400">
            Aucun document ou leçon dans ce chapitre.
          </div>
        ) : (
          active.map((les) => (
            <div key={les.id} className="p-2 bg-[#FAF9F6] border border-neutral-150 rounded-xl flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-white border border-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  {les.type === 'text' ? <FileText className="h-4 w-4 text-brand-red-deep" /> :
                   les.type === 'video' ? <Video className="h-4 w-4 text-blue-500" /> :
                   les.type === 'pdf' ? <Link2 className="h-4 w-4 text-red-500" /> :
                   les.type === 'doc' ? <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> :
                   <Globe className="h-4 w-4 text-amber-500" />}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-black tracking-wider text-neutral-400 block">
                    {les.type === 'text' ? 'Notes' : les.type === 'video' ? 'Vidéo' : les.type === 'pdf' ? 'PDF' : les.type === 'doc' ? 'Fichier' : 'Lien'}
                  </span>
                  <h4 className="text-xs font-black text-neutral-800 truncate -mt-0.5 leading-tight">{les.title}</h4>
                  <p className="text-[10px] text-neutral-400 font-semibold truncate max-w-[280px]">{les.content}</p>
                </div>
              </div>
              <button type="button" onClick={() => onDeleteLesson(les.id)} className="text-neutral-300 hover:text-brand-red-deep p-1 rounded-lg border-0 bg-transparent cursor-pointer transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
