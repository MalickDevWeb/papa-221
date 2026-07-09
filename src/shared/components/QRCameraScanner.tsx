import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

interface Props {
  readonly onScanComplete: () => void;
}

export function QRCameraScanner({ onScanComplete }: Props) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode } })
      .catch(() => navigator.mediaDevices.getUserMedia({ video: true }))
      .then(s => {
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(console.warn);
        }
      }).catch(console.error);

    const timer = setTimeout(() => {
      onScanComplete();
    }, 3200);

    return () => {
      clearTimeout(timer);
      activeStream?.getTracks().forEach(t => t.stop());
    };
  }, [onScanComplete, facingMode]);

  const toggleFacing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="space-y-3" id="qr-camera-scanner">
      <div className="relative aspect-square w-48 mx-auto rounded-2xl bg-neutral-900 border-2 border-brand-red-deep/40 overflow-hidden flex flex-col items-center justify-center text-white">
        <video 
          ref={videoRef}
          autoPlay playsInline muted 
          className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''} ${stream ? 'block' : 'hidden'}`}
        />
        {stream && (
          <button
            type="button"
            onClick={toggleFacing}
            className="absolute top-3 right-3 z-20 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all border border-white/10 active:scale-95 cursor-pointer"
            title="Changer de caméra"
          >
            <Icon icon="lucide:switch-camera" className="h-4 w-4" />
          </button>
        )}
        {!stream && (
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
  );
}
