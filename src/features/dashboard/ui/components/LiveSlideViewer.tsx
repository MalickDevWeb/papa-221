import React from 'react';

export function LiveSlideViewer() {
  return (
    <div className="max-w-md w-full bg-neutral-900/95 border border-white/10 p-5 rounded-2xl shadow-2xl relative z-10 text-center space-y-4">
      <div className="flex justify-between items-center text-left text-neutral-400 border-b border-white/5 pb-2">
        <span className="text-[9px] font-mono tracking-widest text-[#E3A857]">SLIDE NO. 4 / 22</span>
        <span className="text-[9px] font-bold">Réseau Neuronal Convolutif</span>
      </div>
      
      <div className="py-4 font-bold">
        <div className="w-fit mx-auto p-4 bg-black/40 rounded-xl border border-white/5 mb-3 flex gap-3 text-white/90">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[8px] uppercase tracking-wide opacity-50 font-black">Image Entrée</span>
            <div className="w-11 h-11 bg-white/10 border border-brand-red-deep rounded-lg flex items-center justify-center text-xs font-extrabold text-[#E3A857]">C221</div>
          </div>
          <div className="self-center text-secondary text-xs">➔</div>
          
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[8px] uppercase tracking-wide opacity-50 font-black">Couche CNN</span>
            <div className="w-11 h-11 bg-white/10 rounded-lg flex flex-col justify-around text-[6px] font-mono p-1">
              <div className="h-1 bg-red-500 rounded-full w-full"></div>
              <div className="h-1 bg-red-400 rounded-full w-2/3"></div>
              <div className="h-1 bg-red-300 rounded-full w-3/4"></div>
            </div>
          </div>
          <div className="self-center text-secondary text-xs">➔</div>
          
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[8px] uppercase tracking-wide opacity-50 font-black">Sortie</span>
            <div className="w-11 h-11 bg-[#B3181C]/30 border border-brand-red-deep text-white rounded-lg flex items-center justify-center text-[9px] font-black">Clas: L1</div>
          </div>
        </div>
        
        <p className="text-xs text-secondary font-black text-white/95">Analyse de convolutions : Les filtres de détection de contours (Sébastien filter)</p>
        <p className="text-[10px] text-[#E3A857] font-semibold mt-1">Équation : S(i,j) = (I * K)(i,j) = ∑∑ I(i-m, j-n)K(m,n)</p>
      </div>
      
      <div className="bg-white/5 p-3 rounded-lg text-left text-[9px] text-white/70 font-semibold space-y-1">
        <div className="text-xs font-black text-brand-red-light">📝 Tableau (Direct) :</div>
        <p className="italic">"N'oubliez pas d'utiliser le padding 'same' si vous voulez conserver les dimensions."</p>
      </div>
    </div>
  );
}
export default LiveSlideViewer;
