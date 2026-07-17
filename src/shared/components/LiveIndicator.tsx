import React from 'react';

interface LiveIndicatorProps {
  readonly status: 'en-cours' | 'prochain' | 'none';
  readonly size?: 'sm' | 'md';
}

export function LiveIndicator({ status, size = 'sm' }: LiveIndicatorProps) {
  if (status === 'none') return null;

  const isEnCours = status === 'en-cours';
  
  if (isEnCours) {
    return (
      <span 
        id="live-indicator-en-cours"
        className={`inline-flex items-center gap-1 font-black uppercase rounded-md bg-red-600 text-white animate-pulse transition-all duration-300 ${
          size === 'sm' 
            ? 'text-[7px] xl:text-[8px] px-1.5 xl:px-2 py-0.5 tracking-tight xl:tracking-wider ring-1 xl:ring-2 ring-red-500/20' 
            : 'text-[10px] px-2.5 py-1 ring-2 ring-red-500/30 tracking-wider'
        }`}
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
        </span>
        En Cours
      </span>
    );
  }

  return (
    <span 
      id="live-indicator-prochain"
      className={`inline-flex items-center gap-1 font-black uppercase rounded-md bg-amber-500 text-white transition-all duration-300 ${
        size === 'sm' 
          ? 'text-[7px] xl:text-[8px] px-1.5 xl:px-2 py-0.5 tracking-tight xl:tracking-wider ring-1 xl:ring-2 ring-amber-500/20' 
          : 'text-[10px] px-2.5 py-1 ring-2 ring-amber-500/30 tracking-wider'
      }`}
    >
      <span className="relative flex h-1 w-1 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1 w-1 bg-white"></span>
      </span>
      Prochain
    </span>
  );
}
