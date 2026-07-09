import type { VigilProfile } from './VigilProfile';
import type { VigilScanResult } from './VigilScan';

export interface VigilRepository {
  getProfile(): Promise<VigilProfile>;
  scanBadge(badgeId: string): Promise<VigilScanResult>;
  getLastScan(): Promise<VigilScanResult | null>;
}
