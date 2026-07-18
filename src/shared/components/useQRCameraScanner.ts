import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useQRCameraScanner(elementId: string, onScanComplete: (text: string) => void) {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [zoomSupported, setZoomSupported] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1.6);
  const [zoomCaps, setZoomCaps] = useState<{ min: number; max: number } | null>(null);
  const qrRef = useRef<Html5Qrcode | null>(null);

  const applyZoom = async (val: number) => {
    if (!qrRef.current) return;
    try {
      const track = qrRef.current.getRunningTrack();
      if (track) {
        const caps = track.getCapabilities() as any;
        if (caps?.zoom) {
          const clamped = Math.max(caps.zoom.min ?? 1, Math.min(val, caps.zoom.max ?? 1));
          await track.applyConstraints({ advanced: [{ zoom: clamped }] } as any);
          setCurrentZoom(clamped);
        }
      }
    } catch (e) { console.warn("Apply zoom err", e); }
  };

  useEffect(() => {
    let isMounted = true;
    const html5QrCode = new Html5Qrcode(elementId);
    qrRef.current = html5QrCode;
    let startPromise: Promise<any> | null = null;

    const startScanner = async () => {
      try {
        const config = {
          fps: 24,
          qrbox: (w: number, h: number) => {
            const size = Math.min(w, h) * 0.7;
            return { width: Math.max(140, Math.min(size, 250)), height: Math.max(140, Math.min(size, 250)) };
          },
          videoConstraints: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        };

        startPromise = html5QrCode.start(
          { facingMode },
          config,
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

        if (isMounted) {
          setIsScanning(true);
          setError(null);
          try {
            const track = html5QrCode.getRunningTrack();
            if (track) {
              const caps = track.getCapabilities() as any;
              const constraints: any = {};
              if (caps?.focusMode?.includes("continuous")) constraints.focusMode = "continuous";
              if (caps?.exposureMode?.includes("continuous")) constraints.exposureMode = "continuous";
              if (caps?.whiteBalanceMode?.includes("continuous")) constraints.whiteBalanceMode = "continuous";
              if (caps?.zoom) {
                setZoomSupported(true);
                setZoomCaps({ min: caps.zoom.min ?? 1, max: caps.zoom.max ?? 1 });
                const initialZoom = Math.max(caps.zoom.min ?? 1, Math.min(1.6, caps.zoom.max ?? 1));
                constraints.zoom = initialZoom;
                setCurrentZoom(initialZoom);
              }
              if (Object.keys(constraints).length > 0) {
                await track.applyConstraints({ advanced: [constraints] } as any);
              }
            }
          } catch (e) { console.warn("Constraints apply err", e); }
        }
      } catch (err) {
        if (isMounted) { console.error(err); setError("Erreur caméra ou accès requis"); }
      }
    };
    void startScanner();

    return () => {
      isMounted = false;
      void (async () => {
        if (startPromise) { try { await startPromise; } catch (e) { console.debug("ignored", e); } }
        if (html5QrCode.isScanning) { try { await html5QrCode.stop(); } catch (e) { console.debug("ignored", e); } }
      })();
      qrRef.current = null;
    };
  }, [onScanComplete, facingMode, elementId]);

  return { error, isScanning, facingMode, setFacingMode, zoomSupported, currentZoom, zoomCaps, applyZoom };
}
