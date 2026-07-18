import React, { useState } from 'react';
import { Plus, Trash2, Clipboard } from 'lucide-react';
import type { Homework } from '../../../hooks/useModuleHomework';

interface Props {
  readonly homeworks: readonly Homework[];
  readonly activeHomeworkId: string | null;
  readonly onSelectHomework: (id: string) => void;
  readonly onAddHomework: (title: string, desc: string, pts: number, due: string, workType: any, allowedFormat: any) => void;
  readonly onDeleteHomework: (id: string) => void;
}

export function HomeworkSidebar({ homeworks, activeHomeworkId, onSelectHomework, onAddHomework, onDeleteHomework }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [pts, setPts] = useState(20);
  const [due, setDue] = useState('');
  const [type, setType] = useState<'devoir' | 'td' | 'test' | 'quiz'>('devoir');
  const [fmt, setFmt] = useState<'pdf' | 'word' | 'zip' | 'link' | 'image' | 'audio' | 'any'>('pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const fallbackDue = due || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    onAddHomework(title.trim(), desc.trim(), pts, fallbackDue, type, fmt);
    setTitle(''); setDesc(''); setPts(20); setDue('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-150/80 space-y-2">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du devoir..." className="w-full px-3 py-2 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none" required />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Consignes de rendu..." rows={1} className="w-full px-3 py-2 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none resize-none" />
        <div className="grid grid-cols-2 gap-2">
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full px-2 py-1.5 bg-white border border-neutral-200 text-[10px] font-bold rounded-xl outline-none cursor-pointer">
            <option value="devoir">Devoir maison</option>
            <option value="td">Travaux Dirigés</option>
            <option value="test">Test / Éval</option>
            <option value="quiz">Quiz papier</option>
          </select>
          <select value={fmt} onChange={(e) => setFmt(e.target.value as any)} className="w-full px-2 py-1.5 bg-white border border-neutral-200 text-[10px] font-bold rounded-xl outline-none cursor-pointer">
            <option value="pdf">Format PDF</option>
            <option value="word">Format Word</option>
            <option value="zip">Archive ZIP</option>
            <option value="link">Lien externe</option>
            <option value="image">Image JPG/PNG</option>
            <option value="any">Tout format</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={pts} onChange={(e) => setPts(parseInt(e.target.value) || 20)} placeholder="Points max" className="w-full px-3 py-1.5 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none" />
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="w-full px-3 py-1.5 bg-white border border-neutral-200 text-xs font-semibold rounded-xl outline-none text-neutral-600" />
        </div>
        <button type="submit" className="w-full py-1.5 bg-brand-red-deep text-white font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer border-0">
          <Plus className="h-3.5 w-3.5" /> Créer l'évaluation
        </button>
      </form>

      <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
        {homeworks.length === 0 ? (
          <p className="text-[11px] text-neutral-400 text-center py-6 font-bold border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">Aucun travail créé.</p>
        ) : (
          homeworks.map((hw) => (
            <div key={hw.id} onClick={() => onSelectHomework(hw.id)} className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${activeHomeworkId === hw.id ? 'bg-[#FFF5F5] border-[#B3181C]/20 text-brand-red-deep font-black' : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50'}`}>
              <div className="text-xs truncate max-w-[150px] flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-wider text-neutral-400 block -mb-0.5">
                  {hw.workType === 'td' ? 'TD' : hw.workType === 'test' ? 'Test' : hw.workType === 'quiz' ? 'Quiz' : 'Devoir'}
                </span>
                <span className="flex items-center gap-1">
                  <Clipboard className="h-3 w-3 text-neutral-400 shrink-0" /> {hw.title}
                </span>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); onDeleteHomework(hw.id); }} className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-brand-red-deep p-1 rounded-lg border-0 bg-transparent cursor-pointer transition-all shrink-0">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
