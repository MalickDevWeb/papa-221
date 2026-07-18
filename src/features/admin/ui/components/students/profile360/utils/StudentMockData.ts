export interface AcademicEvent {
  year: string;
  title: string;
  desc: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface ERPGrades {
  ue: string;
  module: string;
  coefficient: number;
  grade: number;
  teacher: string;
  status: 'VALIDÉ' | 'RATTRAPAGE';
}

export interface ERPPayment {
  id: string;
  label: string;
  amount: string;
  date: string;
  method: string;
  receiptNumber: string;
  status: 'PAYÉ' | 'EN_ATTENTE';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  module: string;
  action: string;
  result: 'SUCCÈS' | 'ATTENTION' | 'ÉCHEC';
}

export const getStudentERPData = (studentId: string, name: string) => {
  const firstName = name.split(' ')[0] || 'Étudiant';

  // 1. Timeline
  const timeline: AcademicEvent[] = [
    { year: '2023-09', title: 'Candidature & Admission', desc: 'Dossier accepté en L1 Génie Civil (Mention Très Bien au Bac)', status: 'COMPLETED' },
    { year: '2023-10', title: 'Inscription Administrative', desc: 'Paiement frais d\'inscription et création carte étudiante', status: 'COMPLETED' },
    { year: '2024-02', title: 'Validation Semestre 1', desc: 'Moyenne générale de 15.8/20 avec félicitations du jury', status: 'COMPLETED' },
    { year: '2024-07', title: 'Validation L1 Génie Civil', desc: 'Moyenne annuelle 16.1/20. Passage direct en L2', status: 'COMPLETED' },
    { year: '2025-02', title: 'Validation Semestre 3', desc: 'Moyenne 15.9/20. Projet "Pont suspendu" classé premier', status: 'COMPLETED' },
    { year: '2025-07', title: 'Validation L2 & Projet d\'Année', desc: 'Moyenne annuelle 16.3/20. Stage ouvrier de 6 semaines validé', status: 'COMPLETED' },
    { year: '2026-02', title: 'Validation Semestre 5', desc: 'Moyenne 16.5/20. Élection délégué de classe', status: 'COMPLETED' },
    { year: '2026-07', title: 'Fin de Cycle L3 & Stage Fin d\'Études', desc: 'En cours de validation - Mémoire professionnel soumis', status: 'IN_PROGRESS' }
  ];

  // 2. Prior studies
  const admissionDetails = {
    college: 'Collège Notre Dame, Dakar',
    lycee: 'Lycée Blaise Diagne, Dakar',
    bacSerie: 'S1 (Sciences Physiques & Mathématiques)',
    bacYear: '2023',
    bacMention: 'Très Bien',
    bacGrade: '16.82/20',
    equivalences: 'Aucune (Parcours direct national)',
    transfert: 'Non',
    validationAcquis: 'Dossier validé par le rectorat'
  };

  // 3. UE & Modules
  const ueList: ERPGrades[] = [
    { ue: 'UE Scientifique Fondamentale', module: 'Mathématiques & Analyse', coefficient: 4, grade: 16.5, teacher: 'Mme Sow', status: 'VALIDÉ' },
    { ue: 'UE Scientifique Fondamentale', module: 'Physique des Matériaux', coefficient: 3, grade: 15.2, teacher: 'Dr Diop', status: 'VALIDÉ' },
    { ue: 'UE Technique Professionnelle', module: 'Résistance des Matériaux (RDM)', coefficient: 5, grade: 17.8, teacher: 'Prof Diallo', status: 'VALIDÉ' },
    { ue: 'UE Technique Professionnelle', module: 'Ingénierie & Planification', coefficient: 4, grade: 15.0, teacher: 'Prof Diallo', status: 'VALIDÉ' },
    { ue: 'UE Langues & Soft Skills', module: 'Anglais Technique', coefficient: 2, grade: 18.0, teacher: 'Mrs. Fall', status: 'VALIDÉ' },
    { ue: 'UE Langues & Soft Skills', module: 'Communication & Leadership', coefficient: 2, grade: 16.0, teacher: 'M. Cissé', status: 'VALIDÉ' }
  ];

  // 4. Payments
  const payments: ERPPayment[] = [
    { id: 'p-1', label: 'Inscription Annuelle & Assurance', amount: '150 000 FCFA', date: '2025-09-05', method: 'Orange Money', receiptNumber: 'REC-2025-09-001', status: 'PAYÉ' },
    { id: 'p-2', label: 'Frais de Scolarité - Semestre 1', amount: '450 000 FCFA', date: '2025-10-10', method: 'Virement', receiptNumber: 'REC-2025-10-089', status: 'PAYÉ' },
    { id: 'p-3', label: 'Frais de Scolarité - Semestre 2', amount: '450 000 FCFA', date: '2026-03-15', method: 'Chèque', receiptNumber: 'REC-2026-03-042', status: 'PAYÉ' },
    { id: 'p-4', label: 'Cotisation BDE & Activités Sportives', amount: '25 000 FCFA', date: '2025-09-12', method: 'Espèces', receiptNumber: 'REC-2025-09-152', status: 'PAYÉ' }
  ];

  // 5. Connection Logs
  const connectionLogs = [
    { timestamp: '2026-07-17 08:30:12', device: 'Desktop MacBook Pro', browser: 'Chrome 120.0', ip: '196.207.240.11', duration: '45 mins', action: 'Consultation du planning' },
    { timestamp: '2026-07-16 14:15:45', device: 'Mobile iPhone 15', browser: 'Safari 17.2', ip: '196.207.240.11', duration: '12 mins', action: 'Scan QR Code bibliothèque' },
    { timestamp: '2026-07-15 09:02:11', device: 'Desktop MacBook Pro', browser: 'Chrome 120.0', ip: '196.207.240.11', duration: '1h 10m', action: 'Dépôt livrable rapport de stage' },
    { timestamp: '2026-07-14 11:24:00', device: 'Tablet iPad Air', browser: 'Safari Mobile', ip: '196.207.188.54', duration: '30 mins', action: 'Consultation des notes L2' }
  ];

  // 6. Complete Activity Audit Trail
  const activityTrail: ActivityLog[] = [
    { id: 'log-1', timestamp: '2026-07-17 08:35', actor: firstName, module: 'Planning', action: 'Consultation de l\'emploi du temps de la semaine', result: 'SUCCÈS' },
    { id: 'log-2', timestamp: '2026-07-16 14:27', actor: 'Vigile Principal', module: 'Sécurité (Vigil)', action: 'Validation d\'accès via QR Code (Salle RDM)', result: 'SUCCÈS' },
    { id: 'log-3', timestamp: '2026-07-16 11:00', actor: 'Bibliothécaire', module: 'Bibliothèque', action: 'Emprunt livre "Résistance des Matériaux - Tome 2"', result: 'SUCCÈS' },
    { id: 'log-4', timestamp: '2026-07-15 09:12', actor: firstName, module: 'Coffre Documentaire', action: 'Téléversement "Rapport_Stage_Signe_V1.pdf"', result: 'SUCCÈS' },
    { id: 'log-5', timestamp: '2026-07-14 16:30', actor: 'Prof Diallo', module: 'Salle de classe', action: 'Enregistrement présence (Matière: Ingénierie Civil)', result: 'SUCCÈS' },
    { id: 'log-6', timestamp: '2026-07-12 10:45', actor: 'Comptable', module: 'Finance', action: 'Enregistrement paiement Scolarité Tranche 3', result: 'SUCCÈS' }
  ];

  return {
    timeline,
    admissionDetails,
    ueList,
    payments,
    connectionLogs,
    activityTrail,
    extra: {
      bourses: 'Bourse d\'Excellence Nationale (Couverture 100%)',
      discipline: 'Aucun avertissement. Félicitations régulières du conseil de classe.',
      stage: 'Stage chez Eiffage Sénégal en conduite de travaux routiers (Note: 18/20)',
      memoire: 'Sujet : "Modélisation sismique des structures en béton armé à Dakar"',
      projets: 'Projet de fin d\'études L3 - Pont en arc de 12m (Réussi)',
      clubs: 'Club Robotique, Association Humanitaire Sahel, Club Football L221',
      sante: 'Groupe sanguin O+, Pas d\'allergie majeure enregistrée, Certificat médical valide',
      bibliotheque: 'Livre emprunté: "Calcul des structures" (Retour prévu: 25/07/2026)',
      certifications: 'Certification Autodesk AutoCAD Professional, Certification Scrum Foundation',
      rendezVous: 'Prochain rendez-vous le 21/07 à 10:00 avec M. Diallo (Tuteur académique)',
      messages: [
        { sender: 'Prof Diallo', text: 'Bonjour Assane, ton rapport préliminaire est excellent. Continue sur cette voie pour le livrable final.', date: '12/07/2026 14:30' },
        { sender: 'Administration', text: 'Votre certificat de scolarité mis à jour est disponible dans votre coffre documentaire.', date: '10/07/2026 09:00' },
        { sender: 'BDE', text: 'Validation de votre réinscription au club Robotique pour l\'année académique.', date: '01/07/2026 16:00' }
      ]
    }
  };
};
