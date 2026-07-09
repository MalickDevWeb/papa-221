export const ROUTES = {
  login:       '/',
  candidature: '/candidature',
  dashboard:   '/dashboard',
  admin: {
    dashboard: '/admin',
  },
  student: {
    dashboard: '/etudiant',
    cours:     '/etudiant/cours',
    devoirs:   '/etudiant/devoirs',
    planning:  '/etudiant/planning',
    notes:     '/etudiant/notes',
    tuteur:    '/etudiant/tuteur',
  },
  vigil: {
    dashboard: '/vigile',
    rondes:    '/vigile/rondes',
    rapports:  '/vigile/rapports',
  },
  professor: {
    dashboard: '/professeur',
  }
} as const;
