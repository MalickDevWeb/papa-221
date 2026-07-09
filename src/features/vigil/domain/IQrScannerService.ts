/**
 * IQrScannerService
 * Domain service interface for QR / Barcode scanning.
 * Provides abstraction so that the QR scanning library (e.g. html5-qrcode) can be swapped easily.
 */
export interface IQrScannerService {
  /**
   * Starts the camera scanner inside a specified DOM element.
   * @param elementId The ID of the HTML container element
   * @param onSuccess Callback triggered when a QR code is scanned successfully
   * @param onFailure Callback triggered when a scan attempt fails
   * @param facingMode 'user' for front-facing camera, 'environment' for back-facing camera
   */
  start(
    elementId: string,
    onSuccess: (decodedText: string) => void,
    onFailure?: (errorMessage: string) => void,
    facingMode?: 'user' | 'environment'
  ): Promise<void>;

  /**
   * Stops the active camera scanner.
   */
  stop(): Promise<void>;

  /**
   * Returns whether the scanner is currently active and scanning.
   */
  isScanning(): boolean;
}
