import { AdminRepositoryPort } from '../../domain/port/AdminRepositoryPort';
import { readDb, writeDb } from '../../../../../../../backend/db';

export class JsonAdminRepositoryAdapter implements AdminRepositoryPort {
  public async getCounts() {
    const db = readDb();
    return {
      students: (db.students || []).length,
      professors: (db.professors || []).length,
      courses: (db.courses || []).length,
      promotions: (db.promotions || []).length
    };
  }

  public async getUsers() {
    const db = readDb();
    return { students: db.students || [], professors: db.professors || [], promotions: db.promotions || [] };
  }

  private saveItem(collectionKey: string, item: any) {
    const db = readDb() as any;
    db[collectionKey] = db[collectionKey] || [];
    const idx = db[collectionKey].findIndex((x: any) => x.id === item.id);
    if (idx !== -1) db[collectionKey][idx] = { ...db[collectionKey][idx], ...item };
    else db[collectionKey].push(item);
    writeDb(db);
  }

  private deleteItem(collectionKey: string, id: string): boolean {
    const db = readDb() as any;
    db[collectionKey] = db[collectionKey] || [];
    const initial = db[collectionKey].length;
    db[collectionKey] = db[collectionKey].filter((x: any) => x.id !== id);
    writeDb(db);
    return db[collectionKey].length < initial;
  }

  public async saveStudent(s: any) { this.saveItem('students', s); }
  public async deleteStudent(id: string) { return this.deleteItem('students', id); }
  public async findStudentById(id: string) { return (readDb().students || []).find(s => s.id === id) || null; }
  
  public async saveProfessor(p: any) { this.saveItem('professors', p); }
  public async deleteProfessor(id: string) { return this.deleteItem('professors', id); }

  public async getSessions() { return (readDb() as any).sessions || []; }
  public async findSessionById(id: string) { return ((readDb() as any).sessions || []).find((s: any) => s.id === id) || null; }
  public async saveSession(s: any) { this.saveItem('sessions', s); }

  public async savePromotion(p: any) { this.saveItem('promotions', p); }
  public async saveCourse(c: any) { this.saveItem('courses', c); }

  public async getPersonnel() {
    const db = readDb() as any;
    return { professors: db.professors || [], staff: db.staff || [] };
  }
  public async saveStaff(s: any) { this.saveItem('staff', s); }
  public async deleteStaff(id: string) { return this.deleteItem('staff', id); }
}
