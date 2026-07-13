export interface ManagePersonnelUseCase {
  getPersonnel(): Promise<any>;
  addPersonnel(name: string, email: string, role: string, telephone?: string): Promise<any>;
  deletePersonnel(id: string): Promise<void>;
}
