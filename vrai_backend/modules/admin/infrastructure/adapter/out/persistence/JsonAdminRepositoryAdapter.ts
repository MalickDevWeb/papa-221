import { AdminRepositoryPort } from '../../../../domain/port/AdminRepositoryPort';
import { readDb, writeDb } from '../../../../../../../backend/db';

export class JsonAdminRepositoryAdapter implements AdminRepositoryPort {
  async getCounts() {
    const db = readDb();
    return {
      students: (db.students || []).length,
      professors: (db.professors || []).length,
      courses: (db.courses || []).length,
      promotions: (db.promotions || []).length
    };
  }

  async getUsers() {
    const db = readDb();
    return { students: db.students || [], professors: db.professors || [], promotions: db.promotions || [] };
  }

  private saveItem(collectionKey: string, item: any) {
    const db = readDb();
    db[collectionKey] = db[collectionKey] || [];
    const idx = db[collectionKey].findIndex((x: any) => x.id === item.id);
    if (idx !== -1) db[collectionKey][idx] = { ...db[collectionKey][idx], ...item };
    else db[collectionKey].push(item);
    writeDb(db);
  }

  private deleteItem(collectionKey: string, id: string): boolean {
    const db = readDb();
    db[collectionKey] = db[collectionKey] || [];
    const initial = db[collectionKey].length;
    db[collectionKey] = db[collectionKey].filter((x: any) => x.id !== id);
    writeDb(db);
    return db[collectionKey].length < initial;
  }

  async saveStudent(s: any) {
    this.saveItem("students", s);
  }

  async deleteStudent(id: string) {
    return this.deleteItem("students", id);
  }

  async findStudentById(id: string) {
    return (readDb().students || []).find((s: any) => s.id === id) || null;
  }

  async saveProfessor(p: any) {
    this.saveItem("professors", p);
  }

  async deleteProfessor(id: string) {
    return this.deleteItem("professors", id);
  }

  async getSessions() {
    return readDb().sessions || [];
  }

  async findSessionById(id: string) {
    return (readDb().sessions || []).find((s: any) => s.id === id) || null;
  }

  async saveSession(s: any) {
    this.saveItem("sessions", s);
  }

  async savePromotion(p: any) {
    this.saveItem("promotions", p);
  }

  async saveCourse(c: any) {
    this.saveItem("courses", c);
  }

  async getPersonnel() {
    const db = readDb();
    return { professors: db.professors || [], staff: db.staff || [] };
  }

  async saveStaff(s: any) {
    this.saveItem("staff", s);
  }

  async deleteStaff(id: string) {
    return this.deleteItem("staff", id);
  }
}
