export interface VigilScanResult {
  badgeOwner: string;
  studentId: string;
  statut: 'Autorisé' | 'Refusé';
  message: string;
  assiduite: string;
  statutFrais: string;
  zone: string;
  time: string;
}
