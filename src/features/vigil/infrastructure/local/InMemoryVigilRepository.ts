import type { VigilProfile } from '../../domain/VigilProfile';
import type { VigilRepository } from '../../domain/VigilRepository';
import type { VigilScanResult } from '../../domain/VigilScan';
import { APP_CONFIG } from '@/core/config/app.config';

export class InMemoryVigilRepository implements VigilRepository {
  private lastScan: VigilScanResult | null = {
    ...APP_CONFIG.studentMock,
    statut: 'Autorisé',
  };

  async getProfile(): Promise<VigilProfile> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      ...APP_CONFIG.vigilMock,
      statut: 'Opérationnel',
    };
  }

  async scanBadge(badgeId: string): Promise<VigilScanResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.lastScan = {
      ...APP_CONFIG.studentMock,
      studentId: badgeId,
      statut: 'Autorisé',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    return this.lastScan;
  }

  async getLastScan(): Promise<VigilScanResult | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.lastScan;
  }
}
