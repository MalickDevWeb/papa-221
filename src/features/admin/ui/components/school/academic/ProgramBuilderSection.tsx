import React, { useState } from 'react';
import { INITIAL_MODULES } from './AcademicMockData';

export function ProgramBuilderSection() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState(6);
  const [minGrade, setMinGrade] = useState(10);
  const [comps, setComps] = useState('');

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    const arrayComps = comps ? comps.split(',').map(c => c.trim()) : [];
    setModules([
      ...modules,
      {
        id: Date.now().toString(),
        code,
        title,
        credits,
        minGrade,
        competencies: arrayComps,
        teacherId: '',
        roomId: ''
      }
    ]);
    setCode('');
    setTitle('');
    setCredits(6);
    setMinGrade(10);
    setComps('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs font-semibold" id="program-builder-section">
      <form onSubmit={handleAddModule} className="lg:col-span-1 bg-neutral-50 p-4 rounded-2xl border border-neutral-100/80 space-y-3">
        <h4 className="font-extrabold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5 text-[#B3181C]">
          <span className="material-symbols-outlined text-sm">library_add</span> Créer un Module Académique
        </h4>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Code Unique Module</label>
            <input type="text" placeholder="Ex: GL-401" value={code} onChange={e => setCode(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold" />
          </div>
          <div>
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Titre du Module</label>
            <input type="text" placeholder="Ex: Algorithmique Avancée" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Crédits (ECTS)</label>
              <input type="number" min="1" max="15" value={credits} onChange={e => setCredits(Number(e.target.value))} className="w-full mt-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Moyenne de Validation</label>
              <input type="number" min="5" max="20" value={minGrade} onChange={e => setMinGrade(Number(e.target.value))} className="w-full mt-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-neutral-400 font-bold uppercase">Compétences attendues (Séparées par virgules)</label>
            <textarea placeholder="Ex: Concevoir un schéma, Optimiser une requête" value={comps} onChange={e => setComps(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold h-12 resize-none" />
          </div>
        </div>
        <button type="submit" className="w-full py-2 bg-[#B3181C] text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl">
          Définir le Module & Règles
        </button>
      </form>

      <div className="lg:col-span-2 space-y-3">
        <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-neutral-400">Modules Configurés & Règles de Validation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto no-scrollbar">
          {modules.map(m => (
            <div key={m.id} className="bg-white border border-neutral-150 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-600 font-mono text-[9px] font-black">{m.code}</span>
                  <span className="font-black text-[#B3181C]">{m.credits} ECTS</span>
                </div>
                <h5 className="font-extrabold text-[#1E293B] text-[11px] leading-tight">{m.title}</h5>
                <div className="pt-1.5">
                  <p className="text-[8px] text-neutral-400 font-bold uppercase">Compétences visées</p>
                  <ul className="list-disc list-inside text-[9px] text-neutral-600 font-bold pl-0.5 space-y-0.5">
                    {m.competencies.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-t border-neutral-50 pt-2 flex justify-between items-center text-[10px]">
                <span className="text-neutral-400 font-bold">Règle de validation</span>
                <span className="font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-lg">Note ≥ {m.minGrade}/20</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
