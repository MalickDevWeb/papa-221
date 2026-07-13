import React from 'react';
import { X, CheckCircle } from 'lucide-react';

export function QRModal({ state }: { state: any }) {
  if (!state.showQRModal) return null;

  return (
    <div 
      className="fixed inset-0 z-[280] flex items-center justify-center bg-zinc-900/60 p-4"
      onClick={() => state.setShowQRModal(false)}
    >
      <div 
        className="bg-white rounded-[24px] border border-neutral-200 p-6 max-w-[340px] w-full text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <span className="text-[11px] font-black uppercase">Badge de présence</span>
          <button onClick={() => state.setShowQRModal(false)} className="p-1"><X className="h-4 w-4" /></button>
        </div>
        <div className="relative h-44 w-44 mx-auto bg-neutral-50 rounded-2xl border flex items-center justify-center">
          {state.presenceLoading && <span className="text-[9.5px] font-black text-[#5D2EE7]">Authentification...</span>}
          {state.presenceSuccess && <div className="absolute inset-0 bg-emerald-500 text-white flex flex-col items-center justify-center"><CheckCircle className="h-10 w-10" /></div>}
        </div>
        <div className="space-y-2 pt-2">
          <button onClick={state.triggerAttendanceScan} disabled={state.presenceLoading || state.presenceSuccess} className="w-full py-2.5 bg-[#5D2EE7] text-white text-xs font-black rounded-xl">{state.presenceSuccess ? "Émargement effectué" : "Simuler Émargement"}</button>
          <button onClick={() => state.setShowQRModal(false)} className="w-full py-1.5 bg-neutral-100 text-[10.5px] font-black rounded-xl">Retour</button>
        </div>
      </div>
    </div>
  );
}
