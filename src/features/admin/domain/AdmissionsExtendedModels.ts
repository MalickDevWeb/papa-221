export type AdmissionType =
  | 'BAC'          // Nouvelle admission (Nouveau bachelier)
  | 'L2'           // Admission L2
  | 'L3'           // Admission L3
  | 'M1'           // Admission Master 1
  | 'M2'           // Admission Master 2
  | 'DOC'          // Admission Doctorat
  | 'TRANSFER'     // Transfert universitaire
  | 'CHANGE_FILIERE' // Changement de filière
  | 'CHANGE_FACULTE' // Changement de faculté
  | 'REORIENTATION'  // Réorientation
  | 'REPRISE'      // Reprise d'études
  | 'REINSCRIPTION'  // Réinscription
  | 'INT'          // Étudiants internationaux
  | 'VAE'          // Validation des acquis (VAE)
  | 'PRO'          // Formation continue
  | 'EXCEPT';      // Admission exceptionnelle

export interface EquivalenceDetails {
  status: 'pending' | 'approved' | 'rejected';
  comparedProgram: string;
  validatedCredits: number;
  dispenses: string[];
  complements: string[];
  decisionBy: string;
  decisionDate?: string;
}

export interface CandidateDocs {
  diploma: boolean;
  idCard: boolean;
  transcripts?: boolean;
  equivalenceLetter?: boolean;
  passport?: boolean;
  visa?: boolean;
  originalUniDecision?: boolean;
  officialDecisionDoc?: boolean;
}

export interface CandidateDetails {
  // Transfert
  universityOfOrigin?: string;
  facultyOfOrigin?: string;
  departmentOfOrigin?: string;
  validatedCredits?: number;
  transferReason?: string;
  originalUniDecision?: string;
  
  // Changement de filière / réorientation / faculté
  oldFiliere?: string;
  newFiliere?: string;
  reorientationReason?: string;
  
  // Reprise d'études
  interruptedYears?: number;
  lastEnrollmentYear?: string;
  
  // Réinscription
  previousYearValidated?: boolean;
  unpaidDues?: number;
  sanctionsCount?: number;
  
  // International
  passportNumber?: string;
  visaStatus?: string;
  insuranceChecked?: boolean;
  
  // VAE
  vaeExperienceYears?: number;
  vaeTargetDegree?: string;
  
  // Exceptionnelle
  exceptionalJustification?: string;
  exceptionalAuthority?: string;
  officialDecisionRef?: string;
}

export interface AdmissionNotification {
  id: string;
  type: string;
  message: string;
  sentAt: string;
}

export interface ExtendedCandidate {
  id: string;
  name: string;
  email: string;
  type: AdmissionType;
  course: string;
  step: 'new' | 'docs' | 'admitted' | 'rejected';
  docs: CandidateDocs;
  registrationFeePaid: boolean;
  details?: CandidateDetails;
  equivalence?: EquivalenceDetails;
  notifications: AdmissionNotification[];
}
