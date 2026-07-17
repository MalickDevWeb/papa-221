import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useQRScanner } from './qr-scanner/useQRScanner';
import { ZoomControl } from './qr-scanner/ZoomControl';

interface Props { readonly onScanComplete: (decodedText: string) => void; }

export function QRCameraScanner({ onScanComplete }: Props) {
  const elementId = "shared-qr-camera-element";
  const {
    error,
    isScanning,
    facingMode,
    toggleFacingMode,
    currentZoom,
    zoomCaps,
    applyZoom
  } = useQRScanner({ elementId, onScanComplete });

  return (
    <div className="space-y-3 w-full" id="qr-camera-scanner" style={{ width: '191px', height: '234px' }}>
      <style>{`
        #${elementId} video {
          transform: scale(1.5) !important;
          transform-origin: center center !important;
          object-fit: cover !important;
        }
      `}</style>
      <div className="relative aspect-square w-48 mx-auto rounded-2xl bg-neutral-950 border-2 border-[#ba0013]/40 overflow-hidden flex flex-col items-center justify-center text-white">
        <div id={elementId} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#ba0013] z-10 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#ba0013] z-10 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#ba0013] z-10 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#ba0013] z-10 pointer-events-none" />
        
        {isScanning && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleFacingMode(); }}
            className="absolute top-3 right-3 z-20 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
          >
            <Icon icon="lucide:switch-camera" className="h-4 w-4" />
          </button>
        )}

        {isScanning && (
          <ZoomControl
            currentZoom={currentZoom}
            zoomCaps={zoomCaps}
            onZoomChange={applyZoom}
          />
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
