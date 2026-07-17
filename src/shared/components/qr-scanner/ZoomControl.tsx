import React from 'react';

interface ZoomControlProps {
  readonly currentZoom: number;
  readonly zoomCaps: { min: number; max: number } | null;
  readonly onZoomChange: (val: number) => void;
}

export function ZoomControl({ currentZoom, zoomCaps, onZoomChange }: ZoomControlProps) {
  if (!zoomCaps) return null;

  const basePresets = [1.0, 1.2, 1.4, 1.6, 2.0];
  const { min, max } = zoomCaps;

  const presets = basePresets.filter(p => p >= min && p <= max);
  const showMax = max > 2.0;

  return (
    <div className="absolute bottom-12 left-1 right-1 z-20 flex justify-center items-center gap-1 bg-black/50 backdrop-blur-md py-1 px-1.5 rounded-full overflow-x-auto no-scrollbar">
      {presets.map(p => {
        const isActive = Math.abs(currentZoom - p) < 0.05;
        return (
          <button
            key={p}
            type="button"
            onClick={(e) => { e.stopPropagation(); onZoomChange(p); }}
            className={`text-[8px] font-extrabold h-5 px-1.5 rounded-full transition-all duration-150 active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-white text-black font-black'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {p.toFixed(1)}x
          </button>
        );
      })}
      {showMax && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onZoomChange(max); }}
          className={`text-[8px] font-extrabold h-5 px-1.5 rounded-full transition-all duration-150 active:scale-95 cursor-pointer ${
            Math.abs(currentZoom - max) < 0.05
              ? 'bg-white text-black font-black'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          Max
        </button>
      )}
    </div>
  );
}
