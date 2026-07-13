export interface AdminStats {
  studentsCount: number;
  professorsCount: number;
  coursesCount: number;
  classesCount: number;
  presentProfessors: string;
  salleOccupation: string;
}

export interface AdminStudent {
  id: string;
  name: string;
  matricule: string;
  promotion_id: string;
  average: number;
  gpa: number;
  mood: string;
  statutFrais?: string;
}

export interface AdminSession {
  id: string;
  nom: string;
  jourComplet: string;
  heureStr: string;
  salle: string;
  professeur: string;
}

export interface AdminProfessor {
  id: string;
  name: string;
  email: string;
}

export interface AdminPromotion {
  id: string;
  name: string;
  filiere: string;
  faculte: string;
}

export interface AdminSystemAlert {
  id: string;
  text: string;
  timestamp: string;
  category: "Système" | "Inscriptions" | "IT Admin" | "Annonce";
}
