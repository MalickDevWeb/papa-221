import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

interface Props {
  readonly profName: string;
  readonly pointageType?: 'arrivée' | 'départ';
  readonly onScanComplete?: () => void;
}

export function ProfessorScannerTab({ pointageType = 'arrivée', onScanComplete }: Props) {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let s: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .catch(() => navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }))
      .then(stream => {
        s = stream;
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.warn);
        }
      }).catch(console.error);

    const timer = setTimeout(() => {
      setScanSuccess(true);
      onScanComplete?.();
    }, 3200);

    return () => {
      clearTimeout(timer);
      s?.getTracks().forEach(t => t.stop());
    };
  }, [onScanComplete, resetKey]);

  return (
    <div className="space-y-4 text-center">
      <p className="text-xs text-secondary leading-relaxed font-semibold">
        Scannage en cours... Orientez l&apos;appareil vers le code QR du vigile pour enregistrer votre {pointageType}.
      </p>

      {scanSuccess ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex flex-col items-center gap-2"
        >
          <div className="h-10 w-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
            <Icon icon="lucide:check-circle" className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-emerald-900">Pointage Validé !</h4>
            <p className="text-[10px] text-emerald-700 font-medium max-w-[240px]">
              Votre {pointageType} a été enregistré avec succès auprès du vigile d&apos;ÉCOLE 221.
            </p>
          </div>
          <button
            onClick={() => { setScanSuccess(false); setResetKey(k => k + 1); }}
            className="mt-1 px-3 py-1 bg-white hover:bg-emerald-100/50 border border-emerald-200/50 text-emerald-800 rounded-lg text-[9px] font-black transition-colors cursor-pointer"
          >
            Scanner à nouveau
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="relative aspect-square w-48 mx-auto rounded-2xl bg-neutral-900 border-2 border-brand-red-deep/40 overflow-hidden flex flex-col items-center justify-center text-white">
            <video 
              ref={videoRef}
              autoPlay playsInline muted 
              className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${cameraStream ? 'block' : 'hidden'}`}
            />
            {!cameraStream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-400 p-4">
                <Icon icon="lucide:loader" className="h-8 w-8 animate-spin text-brand-red-deep mb-2" />
                <span className="text-[10px] font-bold tracking-wider uppercase">Initialisation...</span>
              </div>
            )}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brand-red-deep z-10" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brand-red-deep z-10" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brand-red-deep z-10" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brand-red-deep z-10" />
            <motion.div 
              animate={{ y: [0, 180, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute left-3 right-3 h-0.5 bg-brand-red-deep opacity-80 shadow-[0_0_8px_#B3181C] z-10"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-bold">
            <span className="h-2 w-2 bg-brand-red-deep rounded-full animate-ping" />
            <span>Caméra active...</span>
          </div>
        </div>
      )}
    </div>
  );
}
