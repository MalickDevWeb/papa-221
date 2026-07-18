export interface ManageAcademicUseCase {
  getSchedule(): Promise<any[]>;
  rescheduleSession(id: string, jourComplet: string, heureStr: string, salle: string): Promise<any>;
  createPromotion(name: string, filiere: string, faculte?: string): Promise<any>;
  createCourse(titre: string, coefficient: number, professeurId?: string, promotionId?: string, prochainCours?: string): Promise<any>;
}
