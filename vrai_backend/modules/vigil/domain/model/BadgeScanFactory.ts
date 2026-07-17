import { BadgeScan } from './BadgeScan';

export class BadgeScanFactory {
  public static createNewScan(
    badgeId: string,
    badgeOwner: string,
    studentId: string,
    status: 'Autorisé' | 'Refusé',
    message: string,
    assiduite: string,
    statutFrais: string,
    zone: string,
    type: string = 'Scanner'
  ): BadgeScan {
    const id = `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const date = "Aujourd'hui";

    return BadgeScan.create(
      id,
      badgeId,
      badgeOwner,
      studentId,
      status,
      message,
      assiduite,
      statutFrais,
      zone,
      time,
      date,
      type
    );
  }
}
