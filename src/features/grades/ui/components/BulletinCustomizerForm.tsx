import React from 'react';
import { CustomPdfOptions } from './generateCustomGradePdf';

interface Props {
  options: CustomPdfOptions;
  onChange: (options: CustomPdfOptions) => void;
}

export function BulletinCustomizerForm({ options, onChange }: Props) {
  const updateOption = <K extends keyof CustomPdfOptions>(key: K, val: CustomPdfOptions[K]) => {
    onChange({ ...options, [key]: val });
  };

  const colors: Array<{ id: CustomPdfOptions['themeColor']; bg: string; label: string }> = [
    { id: 'red', bg: 'bg-[#B3181C]', label: 'Rouge École' },
    { id: 'blue', bg: 'bg-slate-700', label: 'Bleu Marine' },
    { id: 'green', bg: 'bg-emerald-600', label: 'Émeraude' },
    { id: 'gold', bg: 'bg-amber-500', label: 'Or Impérial' },
  ];

  return (
    <div className="space-y-5 text-left bg-[#FAF9F7] p-5 rounded-2xl border border-neutral-200">
      <h4 className="font-extrabold text-xs text-neutral-500 uppercase tracking-widest border-b border-neutral-200 pb-2">
        Options de Personnalisation
      </h4>
      
      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
          Nom Complet de l'Étudiant
        </label>
        <input
          type="text"
          value={options.studentName}
          onChange={(e) => updateOption('studentName', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#B3181C]/20 focus:border-[#B3181C] transition-all"
          placeholder="Ex: Oumou Teuw"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
            Niveau d'Études
          </label>
          <input
            type="text"
            value={options.level}
            onChange={(e) => updateOption('level', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#B3181C]"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
            Année Académique
          </label>
          <input
            type="text"
            value={options.academicYear}
            onChange={(e) => updateOption('academicYear', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#B3181C]"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
          Spécialité / Filière
        </label>
        <input
          type="text"
          value={options.specialty}
          onChange={(e) => updateOption('specialty', e.target.value)}
          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#B3181C]"
        />
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
          Autorité Signataire
        </label>
        <select
          value={options.signature}
          onChange={(e) => updateOption('signature', e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#B3181C]"
        >
          <option value="Le Conseil de Direction - École 221">Le Conseil de Direction Académique</option>
          <option value="Le Recteur de l'Université - École 221">Le Recteur de l'Université</option>
          <option value="Le Directeur Général des Études">Le Directeur Général des Études</option>
        </select>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-2">
          Thème de Couleur du Bulletin
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => updateOption('themeColor', c.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                options.themeColor === c.id
                  ? 'border-[#B3181C] bg-[#B3181C]/5 font-black text-[#B3181C]'
                  : 'border-neutral-200 bg-white text-neutral-400 font-semibold'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${c.bg} shadow-xs`} />
              <span className="text-[9px] uppercase tracking-wide truncate max-w-full">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
