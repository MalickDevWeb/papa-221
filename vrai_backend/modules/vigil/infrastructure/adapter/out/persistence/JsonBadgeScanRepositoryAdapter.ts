import { BadgeScanRepositoryPort } from '../../../../domain/port/repository/BadgeScanRepositoryPort';
import { BadgeScan } from '../../../../domain/model/BadgeScan';
import { ProductionStore } from '../../../../../../shared/infrastructure/store/ProductionStore';

export class JsonBadgeScanRepositoryAdapter implements BadgeScanRepositoryPort {
  private readonly store = ProductionStore.getInstance();

  public async save(scan: BadgeScan): Promise<void> {
    const scanJson = scan.toJSON();
    this.store.insert('badgeScans', scanJson);

    if (scan.status === 'Autorisé') {
      const pastAtt = await this.findAttendancesForStudent(scan.studentId);
      const isArrival = pastAtt.length % 2 === 0;
      
      const attendanceRecord = {
        id: `att-${isArrival ? 'arr' : 'dep'}-${scan.studentId}-${pastAtt.length}`,
        type: isArrival ? 'arrivée' : 'départ',
        salle: scan.zone || 'Portail Principal',
        method: 'QR Code Scan',
        status: "Validé d'office",
        location: "Dakar Campus - Coordonnées GPS: 14.6937, -17.4441",
        timestamp: new Date().toISOString(),
        student_id: scan.studentId
      };
      
      this.store.insert('attendances', attendanceRecord);
    }
  }

  public async findAll(): Promise<BadgeScan[]> {
    const scans = this.store.getTable('badgeScans');
    return scans.map((s: any) => BadgeScan.create(
      s.id,
      s.badgeId || 'B-001',
      s.badgeOwner,
      s.studentId,
      s.statut === 'Autorisé' || s.status === 'Autorisé' ? 'Autorisé' : 'Refusé',
      s.message,
      s.assiduite,
      s.statutFrais,
      s.zone,
      s.time,
      s.date,
      s.type || 'Scanner'
    ));
  }

  public async findRecent(): Promise<BadgeScan | null> {
    const scans = await this.findAll();
    return scans.length > 0 ? scans[0] : null;
  }

  public async findStudentByBadgeId(badgeId: string): Promise<any | null> {
    const students = this.store.getTable('students');
    return students.find((s: any) => s.matricule === badgeId || s.id === badgeId) || null;
  }

  public async findAttendancesForStudent(studentId: string): Promise<any[]> {
    const attendances = this.store.getTable('attendances');
    return attendances.filter((a: any) => a.student_id === studentId || a.studentId === studentId);
  }

  public async findPromotionById(promotionId: string): Promise<any | null> {
    const promotions = this.store.getTable('promotions');
    return promotions.find((p: any) => p.id === promotionId) || null;
  }
}
