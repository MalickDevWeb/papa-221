import { EleveRepositoryPort } from '../../../../domain/port/EleveRepositoryPort';
import { Eleve } from '../../../../domain/model/Eleve';
import { readDb, writeDb } from '../../../../../../../backend/db';

export class JsonEleveRepositoryAdapter implements EleveRepositoryPort {
  async findById(id: string): Promise<Eleve | null> {
    const db = readDb();
    const student = (db.students || []).find((s: any) => s.id === id);
    if (!student) return null;
    const scolariteVal = student.financialStatus === "En Retard" ? "En Retard" : "À Jour";
    return Eleve.create(
      student.id,
      student.name,
      student.matricule,
      student.promotion_id || "p-1",
      scolariteVal,
      parseFloat(student.average) || 15,
      parseFloat(student.gpa) || 3.5,
      student.mood || ""
    );
  }

  async findByMatricule(matricule: string): Promise<Eleve | null> {
    const db = readDb();
    const student = (db.students || []).find((s: any) => s.matricule === matricule);
    if (!student) return null;
    const scolariteVal = student.financialStatus === "En Retard" ? "En Retard" : "À Jour";
    return Eleve.create(
      student.id,
      student.name,
      student.matricule,
      student.promotion_id || "p-1",
      scolariteVal,
      parseFloat(student.average) || 15,
      parseFloat(student.gpa) || 3.5,
      student.mood || ""
    );
  }

  async save(eleve: Eleve): Promise<void> {
    const db = readDb();
    db.students = db.students || [];
    const idx = db.students.findIndex((s: any) => s.id === eleve.id);
    const updatedStudent = {
      id: eleve.id,
      name: eleve.name,
      matricule: eleve.matricule,
      promotion_id: eleve.promotionId,
      average: eleve.average,
      gpa: eleve.gpa,
      mood: eleve.mood || "",
      financialStatus: eleve.scolarite.state === "En Retard" ? "En Retard" : "En Règle",
      qrStatus: eleve.scolarite.state === "En Retard" ? "SUSPENDU" : "AUTORISÉ"
    };
    if (idx !== -1) {
      db.students[idx] = { ...db.students[idx], ...updatedStudent };
    } else {
      db.students.push(updatedStudent);
    }
    writeDb(db);
  }

  async findPromotionName(promotionId: string): Promise<{ name: string; filiere: string; faculte: string } | null> {
    const db = readDb();
    const promo = (db.promotions || []).find((p: any) => p.id === promotionId);
    if (!promo) return null;
    return {
      name: promo.name,
      filiere: promo.filiere || "",
      faculte: promo.faculte || ""
    };
  }
}
