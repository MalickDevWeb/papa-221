export interface AdminRepositoryPort {
  getCounts(): Promise<{ students: number; professors: number; courses: number; promotions: number }>;
  getUsers(): Promise<{ students: any[]; professors: any[]; promotions: any[] }>;
  saveStudent(student: any): Promise<void>;
  deleteStudent(id: string): Promise<boolean>;
  findStudentById(id: string): Promise<any | null>;
  saveProfessor(prof: any): Promise<void>;
  deleteProfessor(id: string): Promise<boolean>;
  getSessions(): Promise<any[]>;
  findSessionById(id: string): Promise<any | null>;
  saveSession(session: any): Promise<void>;
  savePromotion(promo: any): Promise<void>;
  saveCourse(course: any): Promise<void>;
  getPersonnel(): Promise<{ professors: any[]; staff: any[] }>;
  saveStaff(staff: any): Promise<void>;
  deleteStaff(id: string): Promise<boolean>;
}
