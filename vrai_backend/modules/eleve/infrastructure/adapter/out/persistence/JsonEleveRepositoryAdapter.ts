import { EleveRepositoryPort } from '../../../../domain/port/EleveRepositoryPort';
import { Eleve } from '../../../../domain/model/Eleve';
import { ProductionStore } from '../../../../../../shared/infrastructure/store/ProductionStore';

export class JsonEleveRepositoryAdapter implements EleveRepositoryPort {
  private readonly store = ProductionStore.getInstance();

  private mapRecordToDomain(record: any): Eleve {
    const scolarite = record.statutFrais || record.scolarite || 'À Jour';
    let stateVal: 'À Jour' | 'En Retard' | 'Paiement partiel' = 'À Jour';
    if (scolarite === 'En Retard' || scolarite === 'Paiement en retard') {
      stateVal = 'En Retard';
    } else if (scolarite === 'Paiement partiel') {
      stateVal = 'Paiement partiel';
    }

    return Eleve.create(
      record.id,
      record.name,
      record.matricule,
      record.promotion_id || record.promotionId || '',
      stateVal,
      record.average || 0,
      record.gpa || 0,
      record.mood || ''
    );
  }

  public async findById(id: string): Promise<Eleve | null> {
    const record = this.store.findOne('students', (s: any) => s.id === id);
    if (!record) return null;
    return this.mapRecordToDomain(record);
  }

  public async findByMatricule(matricule: string): Promise<Eleve | null> {
    const record = this.store.findOne('students', (s: any) => s.matricule === matricule);
    if (!record) return null;
    return this.mapRecordToDomain(record);
  }

  public async save(eleve: Eleve): Promise<void> {
    const studentId = eleve.id;
    this.store.update('students', studentId, (existing: any) => ({
      name: eleve.name,
      matricule: eleve.matricule,
      promotion_id: eleve.promotionId,
      statutFrais: eleve.scolarite.state,
      average: eleve.average,
      gpa: eleve.gpa,
      mood: eleve.mood
    }));
  }

  public async findPromotionName(promotionId: string): Promise<{ name: string; filiere: string; faculte: string } | null> {
    const promo = this.store.findOne('promotions', (p: any) => p.id === promotionId);
    if (!promo) return null;
    return {
      name: promo.name || '',
      filiere: promo.filiere || '',
      faculte: promo.faculte || ''
    };
  }
}
