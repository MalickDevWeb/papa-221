import { AdmissionType } from "@/features/admin/domain/AdmissionsExtendedModels";

export interface Campaign {
  id: string;
  title: string;
  code: AdmissionType;
  state: "Brouillon" | "Planifiée" | "Ouverte" | "Suspendue" | "Fermée" | "Archivée";
  deadline: string;
  fees: number;
  requirements: string[];
  imageUrl: string;
}

export interface AuditLog {
  id: string;
  candidateId: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  role: "CANDIDAT" | "ADMIN" | "SECRETAIRE";
}
