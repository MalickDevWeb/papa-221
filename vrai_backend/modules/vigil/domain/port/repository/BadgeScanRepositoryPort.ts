import { BadgeScan } from '../../model/BadgeScan';

export interface BadgeScanRepositoryPort {
  save(scan: BadgeScan): Promise<void>;
  findAll(): Promise<BadgeScan[]>;
  findRecent(): Promise<BadgeScan | null>;
  findStudentByBadgeId(badgeId: string): Promise<any | null>;
  findAttendancesForStudent(studentId: string): Promise<any[]>;
  findPromotionById(promotionId: string): Promise<any | null>;
}
