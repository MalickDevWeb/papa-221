import { Check, MapPin, RefreshCw } from 'lucide-react';

interface PatrolRoundsSectionProps {
  checkpoints: Array<{ id: string; name: string; status: string; lastCheck: string; guard: string }>;
  onCheckCheckpoint: (id: string) => void;
  onResetCheckpoints: () => void;
  progressPercent: number;
  completedCheckpoints: number;
}

export function PatrolRoundsSection({ checkpoints, onCheckCheckpoint, onResetCheckpoints, progressPercent, completedCheckpoints }: PatrolRoundsSectionProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-neutral-800 tracking-tight flex items-center gap-2"><MapPin className="h-5 w-5 text-[#ba0013]" />Mes Rondes de Patrouille</h2>
        <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Suivi en temps réel des points de contrôle</p>
      </div>
      <div className="bg-white border border-neutral-200/80 p-5 rounded-3xl shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div><p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Ronde active</p><h3 className="font-extrabold text-sm text-neutral-800">Ronde de sécurité générale</h3></div>
          <span className="text-[#ba0013] font-black text-lg font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden"><div className="bg-[#E31E24] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} /></div>
        <div className="flex justify-between items-center text-xs text-neutral-500 pt-1">
          <p className="font-bold">{completedCheckpoints} sur {checkpoints.length} points validés</p>
          {completedCheckpoints === checkpoints.length ? <button onClick={onResetCheckpoints} className="text-[#ba0013] font-extrabold flex items-center gap-1 hover:underline"><RefreshCw className="h-3 w-3" /> Recommencer</button> : <span className="text-amber-500 font-extrabold flex items-center gap-1">En cours de patrouille</span>}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest pl-1">Points de passage</p>
        {checkpoints.map((cp) => <div key={cp.id} className={`bg-white border p-4 rounded-2xl flex justify-between items-center transition-all ${cp.status === 'Sécurisé' ? 'border-green-100 shadow-2xs' : 'border-neutral-200'}`}>
          <div className="flex items-start gap-3"><div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center transition-all ${cp.status === 'Sécurisé' ? 'bg-green-50 text-green-600' : 'bg-neutral-50 text-neutral-400'}`}>{cp.status === 'Sécurisé' ? <Check className="h-4 w-4 stroke-[3]" /> : <MapPin className="h-4 w-4" />}</div><div><h4 className={`font-extrabold text-sm ${cp.status === 'Sécurisé' ? 'text-neutral-700' : 'text-neutral-800'}`}>{cp.name}</h4><p className="text-[11px] text-neutral-400 mt-0.5">{cp.status === 'Sécurisé' ? `Vérifié à ${cp.lastCheck} par ${cp.guard}` : 'En attente de vérification'}</p></div></div>
          {cp.status !== 'Sécurisé' && <button onClick={() => onCheckCheckpoint(cp.id)} className="bg-neutral-50 hover:bg-[#ba0013] hover:text-white text-[#ba0013] font-bold text-xs px-3 py-2 rounded-xl transition-all border border-neutral-100">Vérifier</button>}
        </div>)}
      </div>
    </div>
  );
}
