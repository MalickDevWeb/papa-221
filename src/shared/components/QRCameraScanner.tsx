import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useQRCameraScanner } from './useQRCameraScanner';

interface Props { readonly onScanComplete: (decodedText: string) => void; }

export function QRCameraScanner({ onScanComplete }: Props) {
  const elementId = "shared-qr-camera-element";
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setDims] = useState({ w: 0, h: 0 });

  const {
    error,
    isScanning,
    facingMode,
    setFacingMode,
    zoomSupported,
    currentZoom,
    zoomCaps,
    applyZoom,
  } = useQRCameraScanner(elementId, onScanComplete);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const zoomOptions = [1.0, 1.2, 1.4, 1.6, 2.0].filter(
    (v) => !zoomCaps || (v >= zoomCaps.min && v <= zoomCaps.max)
  );

  return (
    <div className="space-y-3 w-full" id="qr-camera-scanner" ref={containerRef}>
      <style>{`
        #${elementId} { display: grid !important; place-items: center !important; width: 100% !important; height: 100% !important; overflow: hidden !important; }
        #${elementId} video { grid-area: 1 / 1 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; }
        #${elementId} canvas { grid-area: 1 / 1 !important; z-index: 5 !important; object-fit: contain !important; }
      `}</style>
      <div className="relative aspect-square w-48 mx-auto rounded-2xl bg-neutral-950 border-2 border-[#ba0013]/40 overflow-hidden flex flex-col items-center justify-center text-white">
        <div id={elementId} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#ba0013] z-10 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#ba0013] z-10 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#ba0013] z-10 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#ba0013] z-10 pointer-events-none" />
        {isScanning && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFacingMode(p => p === 'environment' ? 'user' : 'environment'); }}
            className="absolute top-3 right-3 z-20 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
          >
            <Icon icon="lucide:switch-camera" className="h-4 w-4" />
          </button>
        )}
        {zoomSupported && zoomOptions.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-black/60 p-1 rounded-full border border-white/10">
            {zoomOptions.map((v) => (
              <button
                key={v}
                type="button"
                onClick={(e) => { e.stopPropagation(); void applyZoom(v); }}
                className={`h-5 px-1.5 text-[8px] font-black rounded-full transition ${Math.abs(currentZoom - v) < 0.1 ? 'bg-[#ba0013] text-white' : 'text-neutral-300 hover:bg-white/10'}`}
              >
                {v.toFixed(1)}x
              </button>
            ))}
          </div>
        )}
        {!isScanning && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 p-4 z-15">
            <Icon icon="lucide:loader" className="h-8 w-8 animate-spin text-[#ba0013] mb-2" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Initialisation...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 p-4 z-20 text-center">
            <Icon icon="lucide:alert-circle" className="h-6 w-6 text-[#ba0013] mb-2" />
            <span className="text-[10px] font-bold leading-normal">{error}</span>
          </div>
        )}
        <motion.div 
          animate={{ y: [0, 180, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute left-3 right-3 h-0.5 bg-[#ba0013] opacity-80 shadow-[0_0_8px_#ba0013] z-10 pointer-events-none"
        />
      </div>
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-bold">
        <span className="h-2 w-2 bg-[#ba0013] rounded-full animate-ping" />
        <span>Scanner actif...</span>
      </div>
    </div>
  );
}
