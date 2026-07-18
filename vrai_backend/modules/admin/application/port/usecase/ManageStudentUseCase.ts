export interface ManageStudentUseCase {
  addStudent(name: string, matricule: string, promotionId?: string): Promise<any>;
  deleteStudent(id: string): Promise<void>;
  updatePayment(id: string, statutFrais: string): Promise<any>;
  addObservation(studentId: string, text: string, type?: string, auteur?: string): Promise<any>;
  bulkImport(students: any[]): Promise<any>;
}
