import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface UseQRScannerProps {
  readonly elementId: string;
  readonly onScanComplete: (text: string) => void;
}

export function useQRScanner({ elementId, onScanComplete }: UseQRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [currentZoom, setCurrentZoom] = useState<number>(1.6);
  const [zoomCaps, setZoomCaps] = useState<{ min: number; max: number } | null>(null);
  const qrRef = useRef<Html5Qrcode | null>(null);

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const applyZoom = async (val: number) => {
    if (!qrRef.current) return;
    try {
      const track = qrRef.current.getRunningTrack();
      if (track && zoomCaps) {
        const clamped = Math.max(zoomCaps.min, Math.min(val, zoomCaps.max));
        setCurrentZoom(clamped);
        await track.applyConstraints({ advanced: [{ zoom: clamped }] } as any);
      }
    } catch (e) {
      console.warn("Zoom error:", e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const html5QrCode = new Html5Qrcode(elementId);
    qrRef.current = html5QrCode;
    let startPromise: Promise<any> | null = null;

    const startScanner = async () => {
      try {
        const videoConstraints = {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        };
        startPromise = html5QrCode.start(
          videoConstraints,
          { fps: 15, qrbox: { width: 180, height: 180 } },
          async (text) => {
            if (!isMounted) return;
            if (html5QrCode.isScanning) {
              try { await html5QrCode.stop(); } catch (err) { console.warn("Stop err", err); }
            }
            if (isMounted) onScanComplete(text);
          },
          () => {}
        );
        await startPromise;
        if (!isMounted) return;
        setIsScanning(true);
        setError(null);

        try {
          const track = html5QrCode.getRunningTrack();
          if (track) {
            const caps = track.getCapabilities() as any;
            if (caps?.focusMode?.includes('continuous')) {
              await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] } as any);
            }
            if (caps?.zoom) {
              const capsZoom = { min: caps.zoom.min, max: caps.zoom.max };
              setZoomCaps(capsZoom);
              const defaultZoom = Math.max(capsZoom.min, Math.min(1.6, capsZoom.max));
              setCurrentZoom(defaultZoom);
              await track.applyConstraints({ advanced: [{ zoom: defaultZoom }] } as any);
            }
          }
        } catch (e) {
          console.warn("Track optimization err:", e);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError("Erreur caméra ou accès requis");
        }
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
          try { await html5QrCode.stop(); } catch (err) { console.warn("Cleanup stop err", err); }
        }
      };
      void cleanup();
      qrRef.current = null;
    };
  }, [elementId, onScanComplete, facingMode]);

  return { error, isScanning, facingMode, toggleFacingMode, currentZoom, zoomCaps, applyZoom };
}
