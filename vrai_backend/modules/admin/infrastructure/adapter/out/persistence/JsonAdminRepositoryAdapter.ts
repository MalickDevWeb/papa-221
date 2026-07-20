import { AdminRepositoryPort } from '../../../../domain/port/AdminRepositoryPort';
import { ProductionStore } from '../../../../../../shared/infrastructure/store/ProductionStore';

export class JsonAdminRepositoryAdapter implements AdminRepositoryPort {
  private readonly store = ProductionStore.getInstance();

  private saveItem(table: string, item: any): void {
    const existing = this.store.findOne(table, (x: any) => x.id === item.id);
    if (existing) {
      this.store.update(table, item.id, () => item);
    } else {
      this.store.insert(table, item);
    }
  }

  private deleteItem(table: string, id: string): boolean {
    const list = this.store.getTable(table);
    const index = list.findIndex((item: any) => item.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    this.store.saveTable(table, list);
    return true;
  }

  public async getCounts() {
    return {
      students: this.store.getTable('students').length,
      professors: this.store.getTable('professors').length,
      courses: this.store.getTable('courses').length,
      promotions: this.store.getTable('promotions').length
    };
  }

  public async getUsers() {
    return {
      students: this.store.getTable('students'),
      professors: this.store.getTable('professors'),
      promotions: this.store.getTable('promotions')
    };
  }

  public async saveStudent(student: any) { this.saveItem('students', student); }
  public async deleteStudent(id: string) { return this.deleteItem('students', id); }
  public async findStudentById(id: string) { return this.store.findOne('students', (s: any) => s.id === id); }

  public async saveProfessor(prof: any) { this.saveItem('professors', prof); }
  public async deleteProfessor(id: string) { return this.deleteItem('professors', id); }

  public async getSessions() { return this.store.getTable('sessions'); }
  public async findSessionById(id: string) { return this.store.findOne('sessions', (s: any) => s.id === id); }
  public async saveSession(session: any) { this.saveItem('sessions', session); }

  public async savePromotion(promo: any) { this.saveItem('promotions', promo); }
  public async saveCourse(course: any) { this.saveItem('courses', course); }

  public async getPersonnel() {
    return {
      professors: this.store.getTable('professors'),
      staff: this.store.getTable('staff')
    };
  }

  public async saveStaff(staff: any) { this.saveItem('staff', staff); }
  public async deleteStaff(id: string) { return this.deleteItem('staff', id); }
}
