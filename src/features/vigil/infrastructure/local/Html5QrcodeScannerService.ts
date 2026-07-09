import { Html5Qrcode } from 'html5-qrcode';
import { IQrScannerService } from '../../domain/IQrScannerService';
import { APP_CONFIG } from '@/core/config/app.config';

/**
 * Html5QrcodeScannerService
 * Concrete implementation of IQrScannerService using the html5-qrcode library.
 */
export class Html5QrcodeScannerService implements IQrScannerService {
  private html5QrCode: Html5Qrcode | null = null;
  private activeElementId: string | null = null;
  private currentOp: Promise<void> = Promise.resolve();

  async start(
    elementId: string,
    onSuccess: (decodedText: string) => void,
    onFailure?: (errorMessage: string) => void,
    facingMode: 'user' | 'environment' = 'environment'
  ): Promise<void> {
    // Chain onto the operation promise queue to ensure strict sequential execution
    this.currentOp = this.currentOp.then(async () => {
      // If already scanning on any element, stop it cleanly first
      if (this.html5QrCode && this.html5QrCode.isScanning) {
        try {
          await this.html5QrCode.stop();
        } catch (e) {
          console.warn('Error stopping previous scanner instance in start chain:', e);
        }
        this.html5QrCode = null;
      }

      this.html5QrCode = new Html5Qrcode(elementId);
      this.activeElementId = elementId;

      const config = {
        fps: APP_CONFIG.scanner.fps,
        qrbox: {
          width: APP_CONFIG.scanner.qrbox.width,
          height: APP_CONFIG.scanner.qrbox.height,
        },
      };

      await this.html5QrCode.start(
        { facingMode },
        config,
        onSuccess,
        onFailure || (() => {})
      );
    });

    return this.currentOp;
  }

  async stop(): Promise<void> {
    this.currentOp = this.currentOp.then(async () => {
      if (this.html5QrCode) {
        if (this.html5QrCode.isScanning) {
          try {
            await this.html5QrCode.stop();
          } catch (e) {
            console.warn('Error stopping scanner instance in stop chain:', e);
          }
        }
        this.html5QrCode = null;
      }
      this.activeElementId = null;
    });

    return this.currentOp;
  }

  isScanning(): boolean {
    return !!(this.html5QrCode && this.html5QrCode.isScanning);
  }
}
