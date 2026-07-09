import React from 'react';

interface CameraScannerProps {
  cameraStream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onCancel: () => void;
  pointageType?: 'arrivée' | 'départ';
}

export function CameraScanner({ cameraStream, videoRef, onCancel, pointageType = 'arrivée' }: CameraScannerProps) {
  React.useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => {
        console.warn("Error playing video stream:", err);
      });
    }
  }, [cameraStream, videoRef]);

  return (
    <div className="p-6 text-center space-y-4">
      <p className="text-xs text-secondary leading-relaxed font-semibold">
        Scannage en cours... Orientez l'appareil vers le code QR du vigile pour enregistrer votre {pointageType}.
      </p>

      <div className="relative w-full aspect-square bg-[#111] rounded-2xl overflow-hidden border-2 border-brand-red-deep/40 shadow-inner">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transform -scale-x-100 ${cameraStream ? 'block' : 'hidden'}`}
        />

        {!cameraStream && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 relative bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-400">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#112_1px,transparent_1px),linear-gradient(to_bottom,#112_1px,transparent_1px)] bg-[size:16px_16px] opacity-40"></div>
            
            <div className="w-36 h-36 border border-brand-red-deep/40 rounded-full flex items-center justify-center relative animate-pulse">
              <div className="absolute inset-1 border border-brand-red-deep/20 rounded-full animate-ping"></div>
              <div className="w-20 h-20 border border-brand-red-deep/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-brand-red-deep text-xl animate-pulse">photo_camera</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44">
              <p className="text-[9px] text-brand-red-deep uppercase font-black tracking-widest animate-pulse whitespace-nowrap">INITIATION CAPTEUR VIDEO...</p>
              <p className="text-[8px] text-neutral-500 font-medium">Recherche calibration de point de fuite</p>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-brand-red-deep" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-brand-red-deep" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-brand-red-deep" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-brand-red-deep" />

        <div className="absolute left-2 right-2 h-0.5 bg-red-600 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-bounce" style={{ animationDuration: '2.5s' }} />
      </div>

      <button 
        onClick={onCancel}
        className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl font-bold text-xs cursor-pointer"
      >
        Annuler & Retour
      </button>
    </div>
  );
}
