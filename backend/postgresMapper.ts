export function mapStudent(r: any): any {
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    matricule: r.matricule,
    gpa: r.gpa ? parseFloat(r.gpa) : 0,
    average: r.average ? parseFloat(r.average) : 0,
    mood: r.mood,
    statutFrais: r.statut_frais,
    promotion_id: r.promotion_id
  };
}

export function mapHomework(r: any): any {
  if (!r) return null;
  return {
    id: r.id,
    desc: r.description,
    prio: r.prio,
    titre: r.titre,
    statut: r.statut,
    progress: r.progress,
    course_id: r.course_id,
    deadlineStr: r.deadline_str,
    submittedFiles: r.submitted_files || [],
    note: r.note
  };
}

export function mapLiveSession(r: any): any {
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    hlsUrl: r.hls_url,
    status: r.status,
    endTime: r.end_time,
    startTime: r.start_time,
    course_id: r.course_id,
    reactions: r.reactions || {},
    chatMessages: r.chat_messages || [],
    attendeesCount: r.attendees_count || 0,
    thumbnail: r.thumbnail
  };
}

export function mapSession(r: any): any {
  if (!r) return null;
  return {
    id: r.id,
    nom: r.nom,
    jour: r.jour,
    type: r.type,
    salle: r.salle,
    status: r.status,
    dateStr: r.date_str,
    heureFin: r.heure_fin,
    heureStr: r.heure_str,
    heureDebut: r.heure_debut,
    professeur: r.professeur,
    description: r.description,
    jourComplet: r.jour_complet
  };
}

export function mapCandidature(r: any): any {
  if (!r) return null;
  return {
    id: r.id,
    email: r.email,
    statut: r.statut,
    numeroCni: r.numero_cni,
    telephone: r.telephone,
    typeDepot: r.type_depot,
    motivation: r.motivation,
    nomComplet: r.nom_complet,
    promotionNom: r.promotion_nom,
    nomFichierCni: r.nom_fichier_cni,
    dateSoumission: r.date_soumission,
    dernierDiplome: r.dernier_diplome,
    nomFichierDiplome: r.nom_fichier_diplome,
    nomFichierBulletin: r.nom_fichier_bulletin,
    dernierEtablissement: r.dernier_etablissement
  };
}

export function mapBadgeScan(r: any): any {
  if (!r) return null;
  return {
    id: r.id,
    badgeId: r.badge_id,
    badgeOwner: r.badge_owner,
    studentId: r.student_id,
    statut: r.statut,
    message: r.message,
    assiduite: r.assiduite,
    statutFrais: r.statut_frais,
    zone: r.zone,
    time: r.time,
    date: r.date,
    type: r.type
  };
}
