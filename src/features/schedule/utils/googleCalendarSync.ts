import { CourseSession } from '../domain/Schedule';

// Identifiant client OAuth Google public de test / ou configurable.
// Les utilisateurs d'AI Studio peuvent l'utiliser car il accepte les requêtes de localhost/Cloud Run
const GOOGLE_CLIENT_ID = '868846175150-1r8orom4a1o68nnt0b51070e176k0v6t.apps.googleusercontent.com';

/**
 * Génère un lien direct d'ajout à Google Calendar sans aucune authentification requise.
 * C'est l'expérience utilisateur la plus robuste, instantanée et sans bugs.
 */
export function getGoogleCalendarTemplateUrl(s: CourseSession): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  // La semaine de référence dans le mock est du 23 au 27 Octobre 2023
  let datePrefix = '20231023'; // Lundi 23 Octobre
  if (s.jour === 'MAR') datePrefix = '20231024';
  if (s.jour === 'MER') datePrefix = '20231025';
  if (s.jour === 'JEU') datePrefix = '20231026';
  if (s.jour === 'VEN') datePrefix = '20231027';

  const startStr = `${datePrefix}T${s.heureDebut.replace(':', '')}00`;
  const endStr = `${datePrefix}T${s.heureFin.replace(':', '')}00`;

  const text = encodeURIComponent(`[${s.type}] ${s.nom}`);
  const dates = `${startStr}/${endStr}`;
  const details = encodeURIComponent(`Enseignant : ${s.professeur}\nType : ${s.type}\n\nSyllabus : ${s.description}`);
  const location = encodeURIComponent(s.salle);

  return `${base}&text=${text}&dates=${dates}&details=${details}&location=${location}&ctz=Africa/Dakar`;
}

/**
 * Lance le flux d'authentification Google OAuth2 (implicit flow)
 */
export function initiateGoogleOAuth() {
  const redirectUri = window.location.origin + window.location.pathname;
  const scope = 'https://www.googleapis.com/auth/calendar.events';
  const state = 'google-calendar-sync';
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=token` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}`;

  // Rediriger vers Google
  window.location.href = authUrl;
}

/**
 * Crée un événement sur le vrai Google Calendar de l'utilisateur connecté via l'API Google Calendar.
 */
export async function createGoogleCalendarEvent(
  accessToken: string,
  s: CourseSession
): Promise<{ success: boolean; error?: string }> {
  // Configurer la date de l'événement
  let datePrefix = '2023-10-23'; // Lundi 23 Octobre
  if (s.jour === 'MAR') datePrefix = '2023-10-24';
  if (s.jour === 'MER') datePrefix = '2023-10-25';
  if (s.jour === 'JEU') datePrefix = '2023-10-26';
  if (s.jour === 'VEN') datePrefix = '2023-10-27';

  const startTime = `${datePrefix}T${s.heureDebut}:00`;
  const endTime = `${datePrefix}T${s.heureFin}:00`;

  const eventPayload = {
    summary: `[${s.type}] ${s.nom}`,
    location: s.salle,
    description: `Cours de l'École 221\nEnseignant : ${s.professeur}\n\n${s.description}`,
    start: {
      dateTime: startTime,
      timeZone: 'Africa/Dakar',
    },
    end: {
      dateTime: endTime,
      timeZone: 'Africa/Dakar',
    },
  };

  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur lors de la création de l\'événement');
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Erreur de synchronisation Google Calendar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return { success: false, error: errorMessage };
  }
}

/**
 * Synchronise une liste complète de cours sur le Google Calendar de l'utilisateur
 */
export async function syncAllCoursesToGoogleCalendar(
  accessToken: string,
  sessions: CourseSession[],
  onProgress?: (current: number, total: number) => void
): Promise<{ successCount: number; failedCount: number }> {
  let successCount = 0;
  let failedCount = 0;
  const total = sessions.length;

  for (let i = 0; i < total; i++) {
    if (onProgress) onProgress(i + 1, total);
    
    const result = await createGoogleCalendarEvent(accessToken, sessions[i]);
    if (result.success) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  return { successCount, failedCount };
}
