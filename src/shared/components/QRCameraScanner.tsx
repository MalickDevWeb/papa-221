import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

interface Props { readonly onScanComplete: (decodedText: string) => void; }

export function QRCameraScanner({ onScanComplete }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const qrRef = useRef<Html5Qrcode | null>(null);
  const elementId = "shared-qr-camera-element";

  useEffect(() => {
    let isMounted = true;
    const html5QrCode = new Html5Qrcode(elementId);
    qrRef.current = html5QrCode;
    let startPromise: Promise<any> | null = null;

    const startScanner = async () => {
      try {
        startPromise = html5QrCode.start({ facingMode }, { fps: 15, qrbox: { width: 180, height: 180 } }, async (text) => {
          if (!isMounted) return;
          if (html5QrCode.isScanning) {
            try { await html5QrCode.stop(); } catch (err) { console.warn("Failed stop", err); }
          }
          if (isMounted) onScanComplete(text);
        }, () => {});
        await startPromise;
        if (isMounted) {
          setIsScanning(true);
          setError(null);
          try {
            const track = html5QrCode.getRunningTrack();
            if (track) {
              const caps = track.getCapabilities() as any;
              if (caps?.zoom) {
                const targetZoom = Math.min(caps.zoom.min * 1.5, caps.zoom.max);
                await track.applyConstraints({ advanced: [{ zoom: targetZoom }] } as any);
              }
            }
          } catch (e) { console.warn("Track zoom err", e); }
        }
      } catch (err) {
        if (isMounted) { console.error(err); setError("Erreur caméra ou accès requis"); }
      }
    };
    void startScanner();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        if (startPromise) {
          try { await startPromise; } catch (e) { /* Ignored */ }
        }
        if (html5QrCode.isScanning) {
          try { await html5QrCode.stop(); } catch (err) { console.warn("Failed stop on cleanup", err); }
        }
      };
      void cleanup();
      qrRef.current = null;
    };
  }, [onScanComplete, facingMode]);

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
            onClick={(e) => { e.stopPropagation(); setFacingMode(p => p === 'environment' ? 'user' : 'environment'); }}
            className="absolute top-3 right-3 z-20 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
          >
            <Icon icon="lucide:switch-camera" className="h-4 w-4" />
          </button>
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
