import { BadgeScanRepositoryPort } from '../../../../domain/port/repository/BadgeScanRepositoryPort';
import { BadgeScan } from '../../../../domain/model/BadgeScan';
import { readDb, writeDb } from '../../../../../../../backend/db';

export class JsonBadgeScanRepositoryAdapter implements BadgeScanRepositoryPort {
  async save(scan: BadgeScan): Promise<void> {
    const db = readDb();
    db.scanLogs = db.scanLogs || [];
    db.scanLogs.push({
      id: scan.id,
      badgeId: scan.badgeId,
      badgeOwner: scan.badgeOwner,
      studentId: scan.studentId,
      statut: scan.status,
      message: scan.message,
      assiduite: scan.assiduite,
      statutFrais: scan.statutFrais,
      zone: scan.zone,
      time: scan.time,
      date: scan.date,
      type: scan.type
    });
    writeDb(db);
  }

  async findAll(): Promise<BadgeScan[]> {
    const db = readDb();
    const list = db.scanLogs || [];
    return list.map(
      (item: any) => BadgeScan.create(
        item.id || "",
        item.badgeId || item.id || "",
        item.badgeOwner || "",
        item.studentId || "",
        item.statut || "Autorisé",
        item.message || "",
        item.assiduite || "",
        item.statutFrais || "",
        item.zone || "",
        item.time || "",
        item.date || "",
        item.type || ""
      )
    );
  }

  async findRecent(): Promise<BadgeScan | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return list[list.length - 1];
  }

  async findStudentByBadgeId(badgeId: string): Promise<any | null> {
    const db = readDb();
    const students = db.students || [];
    return students.find((s: any) => s.matricule === badgeId || s.id === badgeId) || null;
  }

  async findAttendancesForStudent(studentId: string): Promise<any[]> {
    const db = readDb();
    const attendances = db.attendances || [];
    return attendances.filter((a: any) => a.student_id === studentId);
  }

  async findPromotionById(promotionId: string): Promise<any | null> {
    const db = readDb();
    const promotions = db.promotions || [];
    return promotions.find((p: any) => p.id === promotionId) || null;
  }
}
