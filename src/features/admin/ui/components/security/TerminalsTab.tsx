import React, { useState } from 'react';
import { AccessTerminal } from '../../../domain/SecurityModels';
import { adminService } from '@/shared/lib/apiService';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  terminals: AccessTerminal[];
  onToggleTerminal: (id: string) => void;
  onRevokeTerminal: (id: string) => void;
}

export function TerminalsTab({ terminals, onToggleTerminal, onRevokeTerminal }: Props) {
  const [gate, setGate] = useState('Portail Principal');
  const [guard, setGuard] = useState('Aboulaye Diallo');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await adminService.assignGate(gate, guard);
      setSuccessMsg(`Session activée pour ${res.assignment.guard} à la porte ${res.assignment.gate}! Code QR de session généré.`);
    } catch (err) {
      setErrorMsg("Échec de l'assignation de la porte. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 text-xs font-bold text-[#4A5568]" id="terminals-tab">
      <div className="pb-2 border-b border-neutral-100 flex justify-between items-end">
        <div>
          <h3 className="font-extrabold text-sm text-[#1E293B]">Gestion des Bornes & Lecteurs d'Accès</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Supervisez et réglez l'accès des scanneurs de portiques ou des terminaux vigiles.</p>
        </div>
      </div>

      {/* Real Gate/Vigil Assignment Interactive Form */}
      <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-neutral-800 text-xs font-extrabold uppercase">
          <Shield className="h-4 w-4 text-[#B3181C]" />
          <span>Affecter un Vigile à une Porte de Contrôle</span>
        </div>
        <form onSubmit={handleAssign} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-[9px] uppercase text-neutral-400 font-black mb-1">Porte / Portique</label>
            <select
              value={gate}
              onChange={(e) => setGate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none font-bold"
            >
              <option value="Portail Principal">Portail Principal (Entrée)</option>
              <option value="Portail Ouest">Portail Ouest (Sortie)</option>
              <option value="Entrée Bibliothèque">Entrée Bibliothèque</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase text-neutral-400 font-black mb-1">Vigile Assigné</label>
            <select
              value={guard}
              onChange={(e) => setGuard(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none font-bold"
            >
              <option value="Aboulaye Diallo">Aboulaye Diallo</option>
              <option value="Malick Sow">Malick Sow</option>
              <option value="Ousmane Fall">Ousmane Fall</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B3181C] hover:bg-[#ba0013] text-white py-2.5 px-4 rounded-xl font-black uppercase text-[10px] tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Assignation...' : 'Assigner la porte'}
          </button>
        </form>

        {successMsg && (
          <div className="flex gap-2 items-center bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 rounded-xl text-[10px] font-bold">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex gap-2 items-center bg-rose-50 border border-rose-100 text-rose-800 p-2.5 rounded-xl text-[10px] font-bold">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {terminals.map(term => {
          const isRevoked = term.status === 'Révoqué';
          const isActive = term.status === 'Actif';
          return (
            <div key={term.id} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-black text-xs text-[#1E293B]">{term.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    isActive ? 'bg-emerald-50 text-emerald-700' :
                    isRevoked ? 'bg-neutral-100 text-neutral-400' : 'bg-amber-50 text-amber-700'
                  }`}>{term.status}</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-semibold mt-1">📍 Localisation : {term.location}</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase font-mono mt-0.5">ID : {term.id}</div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-neutral-50">
                {!isRevoked ? (
                  <>
                    <button
                      onClick={() => onToggleTerminal(term.id)}
                      className="px-2.5 py-1.5 border border-neutral-300 hover:bg-neutral-100 text-[#1E293B] text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer"
                    >
                      {isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => onRevokeTerminal(term.id)}
                      className="px-2.5 py-1.5 bg-[#FFF5F5] border border-red-200 text-[#B3181C] hover:bg-red-50 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer"
                    >
                      Révoquer
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-neutral-400 font-black uppercase py-1">⚠️ Accès Révoqué</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
