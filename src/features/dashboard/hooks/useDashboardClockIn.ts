import { useState, useCallback } from 'react';
import { registerClockInUseCase } from '../infrastructure/config/dependencies';

interface ClockInProps {
  readonly triggerToast: (msg: string) => void;
  readonly loadData: () => Promise<void>;
}

export function useDashboardClockIn({ triggerToast, loadData }: ClockInProps) {
  const [showPointage, setShowPointage] = useState(false);
  const [pointageType, setPointageType] = useState<'arrivée' | 'départ'>('arrivée');
  const [pointageMethod, setPointageMethod] = useState<'selection' | 'qrcode' | 'camera'>('selection');

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
    // No-op - Camera is fully managed by the CameraScanner component
  }, []);

  const registerClockIn = useCallback(async (method: string, keepOpen = false) => {
    playBeep();
    try {
      await registerClockInUseCase(pointageType, method);
      if (!keepOpen) {
        setPointageMethod('selection');
        setShowPointage(false);
      }
      triggerToast(`Pointage ${pointageType} validé`);
      await loadData();
    } catch (e) {
      console.error(e);
      triggerToast("Erreur lors du pointage");
    }
  }, [pointageType, triggerToast, loadData]);

  const startCamera = useCallback(() => {
    setPointageMethod('camera');
  }, []);

  return {
    showPointage,
    setShowPointage,
    pointageType,
    setPointageType,
    pointageMethod,
    setPointageMethod,
    cameraStream: null,
    videoRef: { current: null },
    startCamera,
    stopCamera,
    registerClockIn
  };
}
