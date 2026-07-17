import { SubmitScanUseCase } from '../port/usecase/SubmitScanUseCase';
import { SubmitScanCommand } from '../port/command/SubmitScanCommand';
import { BadgeScan } from '../../domain/model/BadgeScan';
import { BadgeScanFactory } from '../../domain/model/BadgeScanFactory';
import { BadgeScanRepositoryPort } from '../../domain/port/repository/BadgeScanRepositoryPort';
import { SecurityEventPublisherPort } from '../../domain/port/event/SecurityEventPublisherPort';
import { BadgeScannedEvent } from '../../domain/event/BadgeScannedEvent';
import { validateDynamicBadge } from '../../../../../backend/qrSecurity';

export class SubmitScanService implements SubmitScanUseCase {
  constructor(
    private readonly repository: BadgeScanRepositoryPort,
    private readonly publisher: SecurityEventPublisherPort
  ) {}

  public async execute(command: SubmitScanCommand): Promise<BadgeScan> {
    const { badgeId, type = 'Scanner', zone = 'Portail Entrée' } = command;
    if (!badgeId || !badgeId.trim()) {
      throw new Error("L'identifiant du badge est requis");
    }

    const validation = validateDynamicBadge(badgeId);
    if (!validation.valid) {
      const scan = BadgeScanFactory.createNewScan(
        badgeId, 
        "Inconnu", 
        badgeId.substring(0, 15) + (badgeId.length > 15 ? "..." : ""), 
        "Refusé", 
        validation.error || "Code QR non reconnu par l'École 221", 
        "0%", 
        "Inconnu", 
        zone, 
        type
      );
      await this.repository.save(scan);
      return scan;
    }

    const student = await this.repository.findStudentByBadgeId(validation.matricule!);
    if (!student) {
      const scan = BadgeScanFactory.createNewScan(
        badgeId, 
        "Inconnu", 
        validation.matricule!, 
        "Refusé", 
        "Étudiant non enregistré dans la base de données", 
        "0%", 
        "Inconnu", 
        zone, 
        type
      );
      await this.repository.save(scan);
      return scan;
    }

    const promotion = await this.repository.findPromotionById(student.promotion_id);
    const promoName = promotion?.name || "École 221";

    const pastAtt = await this.repository.findAttendancesForStudent(student.id);
    const validAtt = pastAtt.filter(a => a.status !== "Refusé");
    const nextType = validAtt.length % 2 === 0 ? "arrivée" : "départ";

    const isLatePayment = student.statutFrais === "Paiement en retard";
    let scanStatus: 'Autorisé' | 'Refusé' = isLatePayment ? 'Refusé' : 'Autorisé';
    let scanMessage = isLatePayment 
      ? "Accès refusé - Scolarité non réglée"
      : `Accès autorisé - Promotion ${promoName} (${nextType})`;

    // Cooldown verification for multiple scans
    if (!isLatePayment && nextType === "départ" && validAtt.length > 0) {
      const lastArrival = validAtt[0];
      const lastArrivalTime = new Date(lastArrival.timestamp).getTime();
      const diffMs = Date.now() - lastArrivalTime;
      const delayMs = 2 * 60 * 1000;

      if (diffMs < delayMs) {
        const remainingSec = Math.ceil((delayMs - diffMs) / 1000);
        scanStatus = 'Refusé';
        scanMessage = `Tu es déjà entré. Attendez encore ${remainingSec}s avant de pouvoir marquer votre sortie.`;
      }
    }

    const scan = BadgeScanFactory.createNewScan(
      badgeId,
      student.name,
      student.matricule,
      scanStatus,
      scanMessage,
      `${Math.round(student.average * 6)}% d'assiduité`,
      isLatePayment ? "Paiement en retard" : "Scolarité à jour",
      zone,
      type
    );

    await this.repository.save(scan);
    await this.publisher.publish(new BadgeScannedEvent(scan.id, scan.badgeId, scan.studentId, scan.badgeOwner, scan.status, scan.time));

    return scan;
  }
}
