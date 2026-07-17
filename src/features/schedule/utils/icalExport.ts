import { CourseSession } from '../domain/Schedule';

/**
 * Génère un fichier iCalendar (.ics) standard pour importer tout l'emploi du temps
 * dans Google Calendar, Apple Calendar, Outlook, etc.
 */
export function exportToICS(sessions: CourseSession[], className: string = 'L3-GL') {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ecole221//StudentPortal//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Emploi du Temps ' + className + ' - École 221',
    'X-WR-TIMEZONE:Africa/Dakar'
  ];

  // Helper pour formater les dates sous forme YYYYMMDDTHHMMSS
  const getFormattedDate = (jour: string, time: string): string => {
    // La semaine de référence dans le mock est du 23 au 27 Octobre 2023
    let datePrefix = '20231023'; // Lundi 23 Octobre
    if (jour === 'MAR') datePrefix = '20231024';
    if (jour === 'MER') datePrefix = '20231025';
    if (jour === 'JEU') datePrefix = '20231026';
    if (jour === 'VEN') datePrefix = '20231027';

    // Remplacer les deux points de l'heure par rien (ex: "08:00" -> "080000")
    const cleanTime = time.replace(':', '') + '00';
    return `${datePrefix}T${cleanTime}`;
  };

  sessions.forEach((s) => {
    const startStr = getFormattedDate(s.jour, s.heureDebut);
    const endStr = getFormattedDate(s.jour, s.heureFin);

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:session_${s.id}@ecole221.sn`);
    icsContent.push(`DTSTAMP:${getFormattedDate('LUN', '08:00')}Z`);
    icsContent.push(`DTSTART;TZID=Africa/Dakar:${startStr}`);
    icsContent.push(`DTEND;TZID=Africa/Dakar:${endStr}`);
    icsContent.push(`SUMMARY:[${s.type}] ${s.nom}`);
    icsContent.push(`DESCRIPTION:Enseignant : ${s.professeur}\\nType : ${s.type}\\n\\nSyllabus/Description :\\n${s.description.replace(/\n/g, '\\n')}`);
    icsContent.push(`LOCATION:${s.salle}`);
    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('SEQUENCE:0');
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const fullContent = icsContent.join('\r\n');
  
  // Téléchargement du fichier
  const blob = new Blob([fullContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `ecole221_schedule_${className.toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
