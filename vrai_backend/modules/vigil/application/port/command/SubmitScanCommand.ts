export interface SubmitScanCommand {
  readonly badgeId: string;
  readonly type?: string; // 'Scanner' | 'Manuel'
  readonly zone?: string; // 'Portail Principal' etc.
}
