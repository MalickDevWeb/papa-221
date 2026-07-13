import type { ProfessorSchedule } from '../domain/ProfessorModels';
import type { CourseSession } from '@/features/schedule/domain/Schedule';

const DAY_MAP: Record<string, 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN'> = {
  'Lundi': 'LUN',
  'Mardi': 'MAR',
  'Mercredi': 'MER',
  'Jeudi': 'JEU',
  'Vendredi': 'VEN',
};

export function mapProfessorScheduleToCourseSession(s: ProfessorSchedule): CourseSession {
  const [start = '08:00', end = '10:00'] = s.time.split(' - ');
  const mappedDay = DAY_MAP[s.day] || 'LUN';
  return {
    id: s.id,
    nom: s.courseTitle,
    professeur: 'Enseignant',
    salle: s.room,
    jour: mappedDay,
    heureDebut: start,
    heureFin: end,
    type: s.type,
    status: s.status === 'annule' ? 'termine' : 'a_venir',
    description: `Cours d'enseignement : ${s.courseTitle}. Salle: ${s.room}. Type: ${s.type}. Statut: ${s.status === 'annule' ? 'ANNULÉ' : 'CONFIRMÉ'}`
  };
}
