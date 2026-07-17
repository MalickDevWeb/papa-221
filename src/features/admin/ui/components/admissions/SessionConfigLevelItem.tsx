import React from 'react';

export interface LevelSessionConfig {
  code: string;
  label: string;
  isOpen: boolean;
  deadline: string;
  fees: number;
}

interface Props {
  config: LevelSessionConfig;
  onUpdate: (updated: LevelSessionConfig) => void;
}

export function SessionConfigLevelItem({ config, onUpdate }: Props) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3 shadow-xs hover:shadow-md transition-all">
      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
        <div>
          <h4 className="font-extrabold text-[#1E293B] text-xs">{config.label}</h4>
          <span className="text-[9px] font-black uppercase text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
            Code: {config.code}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onUpdate({ ...config, isOpen: !config.isOpen })}
          className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
            config.isOpen
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
              : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}
        >
          {config.isOpen ? 'Ouvert ●' : 'Fermé ○'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold">
        <div className="space-y-1">
          <label className="text-[9px] text-neutral-400 font-black uppercase block">Date Limite</label>
          <input
            type="date"
            value={config.deadline}
            onChange={(e) => onUpdate({ ...config, deadline: e.target.value })}
            className="w-full px-2 py-1.5 border border-neutral-200 bg-neutral-50 rounded-lg text-neutral-700 font-bold focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-neutral-400 font-black uppercase block">Frais (FCFA)</label>
          <input
            type="number"
            value={config.fees}
            onChange={(e) => onUpdate({ ...config, fees: Number(e.target.value) })}
            className="w-full px-2 py-1.5 border border-neutral-200 bg-neutral-50 rounded-lg text-neutral-700 font-bold focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
