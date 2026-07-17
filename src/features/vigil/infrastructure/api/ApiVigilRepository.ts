import type { AxiosInstance } from 'axios';
import type { VigilProfile } from '../../domain/VigilProfile';
import type { VigilRepository } from '../../domain/VigilRepository';
import type { VigilScanResult } from '../../domain/VigilScan';

export class ApiVigilRepository implements VigilRepository {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async getProfile(): Promise<VigilProfile> {
    const { data } = await this.http.get('/vigil/profile');
    return this.mapProfile(data);
  }

  async scanBadge(badgeId: string): Promise<VigilScanResult> {
    const { data } = await this.http.post('/vigil/scan', { badgeId });
    return this.mapScan(data);
  }

  async getLastScan(): Promise<VigilScanResult | null> {
    const { data } = await this.http.get('/vigil/last-scan');
    return data ? this.mapScan(data) : null;
  }

  private mapProfile(data: Record<string, unknown>): VigilProfile {
    return {
      id: String(data.id ?? ''),
      nom: String(data.nom ?? ''),
      prenom: String(data.prenom ?? ''),
      badgeId: String(data.badgeId ?? data.badge_id ?? ''),
      equipe: String(data.equipe ?? data.team ?? ''),
      derniereConnexion: String(data.derniereConnexion ?? data.lastConnection ?? ''),
      statut: (data.statut as VigilProfile['statut']) ?? 'Opérationnel',
    };
  }

  private mapScan(data: Record<string, unknown>): VigilScanResult {
    return {
      badgeOwner: String(data.badgeOwner ?? data.badge_owner ?? ''),
      studentId: String(data.studentId ?? data.student_id ?? ''),
      statut: (data.statut as VigilScanResult['statut']) ?? 'Refusé',
      message: String(data.message ?? ''),
      assiduite: String(data.assiduite ?? data.attendance ?? ''),
      statutFrais: String(data.statutFrais ?? data.feesStatus ?? ''),
      zone: String(data.zone ?? ''),
      time: String(data.time ?? ''),
    };
  }
}
