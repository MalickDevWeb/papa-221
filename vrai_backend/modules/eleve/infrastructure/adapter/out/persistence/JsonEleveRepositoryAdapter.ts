import { EleveRepositoryPort } from '../../../../domain/port/EleveRepositoryPort';
import { Eleve } from '../../../../domain/model/Eleve';
import { readDb, writeDb } from '../../../../../../../backend/db';

export class JsonEleveRepositoryAdapter implements EleveRepositoryPort {
  public async findById(id: string): Promise<Eleve | null> {
    const db = readDb();
    const student = (db.students || []).find(s => s.id === id);
    if (!student) return null;
    
    const scolariteVal = student.financialStatus === 'En Retard' ? 'En Retard' : 'À Jour';
    
    return Eleve.create(
      student.id,
      student.name,
      student.matricule,
      student.promotion_id || 'p-1',
      scolariteVal,
      parseFloat(student.average as any) || 15.0,
      parseFloat(student.gpa as any) || 3.5,
      student.mood || ""
    );
  }

  public async findByMatricule(matricule: string): Promise<Eleve | null> {
    const db = readDb();
    const student = (db.students || []).find(s => s.matricule === matricule);
    if (!student) return null;
    
    const scolariteVal = student.financialStatus === 'En Retard' ? 'En Retard' : 'À Jour';
    
    return Eleve.create(
      student.id,
      student.name,
      student.matricule,
      student.promotion_id || 'p-1',
      scolariteVal,
      parseFloat(student.average as any) || 15.0,
      parseFloat(student.gpa as any) || 3.5,
      student.mood || ""
    );
  }

  public async save(eleve: Eleve): Promise<void> {
    const db = readDb();
    db.students = db.students || [];
    const idx = db.students.findIndex(s => s.id === eleve.id);
    const updatedStudent: any = {
      id: eleve.id,
      name: eleve.name,
      matricule: eleve.matricule,
      promotion_id: eleve.promotionId,
      average: eleve.average,
      gpa: eleve.gpa,
      mood: eleve.mood || "",
      financialStatus: eleve.scolarite.state === 'En Retard' ? 'En Retard' : 'En Règle',
      qrStatus: eleve.scolarite.state === 'En Retard' ? 'SUSPENDU' : 'AUTORISÉ'
    };

    if (idx !== -1) {
      db.students[idx] = { ...db.students[idx], ...updatedStudent };
    } else {
      db.students.push(updatedStudent);
    }
    writeDb(db);
  }

  public async findPromotionName(promotionId: string): Promise<{ name: string; filiere: string; faculte: string } | null> {
    const db = readDb();
    const promo = (db.promotions || []).find(p => p.id === promotionId);
    if (!promo) return null;
    return {
      name: promo.name,
      filiere: promo.filiere || "",
      faculte: promo.faculte || ""
    };
  }
}
