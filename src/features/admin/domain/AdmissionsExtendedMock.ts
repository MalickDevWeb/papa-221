import { ExtendedCandidate } from './AdmissionsExtendedModels';

export const INITIAL_EXTENDED_CANDIDATES: ExtendedCandidate[] = [
  {
    id: 'cand-2026-001',
    name: 'Nafissatou Diallo',
    email: 'nafi.diallo@gmail.com',
    type: 'BAC',
    course: 'Licence 1 Génie Logiciel',
    step: 'new',
    docs: { diploma: true, idCard: false },
    registrationFeePaid: false,
    notifications: [
      { id: 'not-1', type: 'dossier_recu', message: 'Dossier de candidature en L1 reçu par la scolarité.', sentAt: '2026-07-01T10:00:00Z' }
    ]
  },
  {
    id: 'cand-2026-002',
    name: 'Ibrahima Ba',
    email: 'ibrahima.ba@gmail.com',
    type: 'TRANSFER',
    course: 'Licence 2 Génie Civil',
    step: 'docs',
    docs: { diploma: true, idCard: true, transcripts: true, originalUniDecision: true },
    registrationFeePaid: false,
    details: {
      universityOfOrigin: 'Université Cheikh Anta Diop (UCAD)',
      facultyOfOrigin: 'FST',
      departmentOfOrigin: 'Physique-Chimie',
      validatedCredits: 60,
      transferReason: 'Rapprochement familial à Dakar',
      originalUniDecision: 'Accord favorable du Doyen'
    },
    equivalence: {
      status: 'pending',
      comparedProgram: 'L1 Sciences de l\'Ingénieur vs L1 Génie Civil',
      validatedCredits: 50,
      dispenses: ['Physique Générale', 'Algèbre 1'],
      complements: ['Dessin Technique de Bâtiment'],
      decisionBy: 'Commission Pédagogique'
    },
    notifications: [
      { id: 'not-2', type: 'dossier_recu', message: 'Dossier de transfert universitaire enregistré.', sentAt: '2026-07-02T11:30:00Z' },
      { id: 'not-3', type: 'etude_equivalences', message: 'Mise en étude des équivalences par la commission pédagogique.', sentAt: '2026-07-03T09:00:00Z' }
    ]
  },
  {
    id: 'cand-2026-003',
    name: 'Amadou Sow',
    email: 'amadou.sow@gmail.com',
    type: 'CHANGE_FILIERE',
    course: 'Licence 2 Réseaux & Télécoms',
    step: 'new',
    docs: { diploma: true, idCard: true, transcripts: true },
    registrationFeePaid: true,
    details: {
      oldFiliere: 'Licence 1 Génie Civil',
      newFiliere: 'Licence 2 Réseaux & Télécoms',
      reorientationReason: 'Réalignement avec mon projet professionnel dans la cybersécurité'
    },
    notifications: []
  },
  {
    id: 'cand-2026-004',
    name: 'Fatou Bensouda',
    email: 'fatou.bensouda@int.sn',
    type: 'INT',
    course: 'Master 1 Management & Big Data',
    step: 'docs',
    docs: { diploma: true, idCard: true, passport: true, visa: true, equivalenceLetter: true },
    registrationFeePaid: false,
    details: {
      passportNumber: 'N-SEN-1299831',
      visaStatus: 'Visa d\'études validé',
      insuranceChecked: true
    },
    notifications: [
      { id: 'not-4', type: 'dossier_recu', message: 'Candidature internationale reçue.', sentAt: '2026-07-05T14:20:00Z' },
      { id: 'not-5', type: 'demande_pieces', message: 'Copie de l\'attestation d\'équivalence consulaire validée.', sentAt: '2026-07-06T10:00:00Z' }
    ]
  },
  {
    id: 'cand-2026-005',
    name: 'Khadim Rassoul',
    email: 'khadim.rassoul@gmail.com',
    type: 'REINSCRIPTION',
    course: 'Licence 3 Informatique',
    step: 'admitted',
    docs: { diploma: true, idCard: true },
    registrationFeePaid: true,
    details: {
      previousYearValidated: true,
      unpaidDues: 0,
      sanctionsCount: 0
    },
    notifications: [
      { id: 'not-6', type: 'dossier_recu', message: 'Demande de réinscription déposée.', sentAt: '2026-07-10T08:00:00Z' },
      { id: 'not-7', type: 'admission_conditionnelle', message: 'Réinscription admissible après audit automatique des frais et du bulletin.', sentAt: '2026-07-11T12:00:00Z' }
    ]
  },
  {
    id: 'cand-2026-006',
    name: 'Chérif Ousmane Sarr',
    email: 'cherif.sarr@gmail.com',
    type: 'REINSCRIPTION',
    course: 'Master 2 Administration des Affaires',
    step: 'new',
    docs: { diploma: true, idCard: true },
    registrationFeePaid: false,
    details: {
      previousYearValidated: true,
      unpaidDues: 150000, // FCFA en suspens
      sanctionsCount: 1
    },
    notifications: [
      { id: 'not-8', type: 'dossier_incomplet', message: 'Alerte auto-check : Bloqué pour arriérés de paiement de l\'année passée.', sentAt: '2026-07-12T09:15:00Z' }
    ]
  },
  {
    id: 'cand-2026-007',
    name: 'Marie-Antoinette Gomes',
    email: 'marie.gomes@pro.sn',
    type: 'VAE',
    course: 'Master 2 Génie Logiciel (VAE)',
    step: 'docs',
    docs: { diploma: true, idCard: true, transcripts: true },
    registrationFeePaid: true,
    details: {
      vaeExperienceYears: 8,
      vaeTargetDegree: 'Master Professionnel Génie Logiciel'
    },
    notifications: [
      { id: 'not-9', type: 'etude_equivalences', message: 'Dossier VAE transféré aux jurys académiques.', sentAt: '2026-07-12T16:00:00Z' }
    ]
  },
  {
    id: 'cand-2026-008',
    name: 'Souleymane Camara',
    email: 'souleymane.camara@gmail.com',
    type: 'EXCEPT',
    course: 'Licence 3 Réseaux',
    step: 'docs',
    docs: { diploma: true, idCard: true, officialDecisionDoc: true },
    registrationFeePaid: true,
    details: {
      exceptionalJustification: 'Sportif sénégalais de haut niveau (Médaillé d\'Or aux Jeux de l\'UEMOA)',
      exceptionalAuthority: 'Doyen de la Faculté / Convention Ministère des Sports',
      officialDecisionRef: 'DEC-RECT-2026-342'
    },
    notifications: [
      { id: 'not-10', type: 'dossier_recu', message: 'Dossier d\'admission dérogatoire / exceptionnelle enregistré sous référence DEC-RECT-2026-342.', sentAt: '2026-07-13T10:00:00Z' }
    ]
  }
];
