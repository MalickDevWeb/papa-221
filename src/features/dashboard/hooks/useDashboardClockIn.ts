import { useState, useRef, useCallback } from 'react';
import { registerClockInUseCase } from '../infrastructure/config/dependencies';

interface ClockInProps {
  readonly triggerToast: (msg: string) => void;
  readonly loadData: () => Promise<void>;
}

export function useDashboardClockIn({ triggerToast, loadData }: ClockInProps) {
  const [showPointage, setShowPointage] = useState(false);
  const [pointageType, setPointageType] = useState<'arrivée' | 'départ'>('arrivée');
  const [pointageMethod, setPointageMethod] = useState<'selection' | 'qrcode' | 'camera'>('selection');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gn = ctx.createGain();
      osc.connect(gn);
      gn.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gn.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn(e);
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraTimeoutRef.current) {
      clearTimeout(cameraTimeoutRef.current);
      cameraTimeoutRef.current = null;
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const registerClockIn = useCallback(async (method: string) => {
    playBeep();
    stopCamera();
    try {
      await registerClockInUseCase(pointageType, method);
      setPointageMethod('selection');
      setShowPointage(false);
      triggerToast(`Pointage ${pointageType} validé`);
      await loadData();
    } catch (e) {
      console.error(e);
      triggerToast("Erreur lors du pointage");
    }
  }, [pointageType, triggerToast, loadData, stopCamera]);

  const startCamera = useCallback(async () => {
    setPointageMethod('camera');
    if (cameraTimeoutRef.current) {
      clearTimeout(cameraTimeoutRef.current);
    }
    try {
      const str = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(str);
      if (videoRef.current) {
        videoRef.current.srcObject = str;
      }
    } catch (e) {
      console.warn(e);
    }
    cameraTimeoutRef.current = setTimeout(() => registerClockIn('Camera Scan'), 3200);
  }, [registerClockIn]);

  return {
    showPointage,
    setShowPointage,
    pointageType,
    setPointageType,
    pointageMethod,
    setPointageMethod,
    cameraStream,
    videoRef,
    startCamera,
    stopCamera,
    registerClockIn
  };
}
