import { getAccessToken } from './googleAuth';

/**
 * Creates a dynamic Google Meet Space using Google Meet API v2
 */
export async function createGoogleMeetSpace(): Promise<string> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Veuillez vous connecter à Google pour créer un salon Google Meet.");
  }

  const response = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Erreur lors de la création de l'espace Google Meet.");
  }

  const data = await response.json();
  if (!data.meetingUri) {
    throw new Error("L'API Google Meet n'a pas retourné de lien de réunion.");
  }

  return data.meetingUri;
}
