import { pool } from './postgresDb';
import { DbSchema } from './types';
import * as mapper from './postgresMapper';
import { upsertRecord } from './postgresUpsert';

export async function fetchFromPostgres(): Promise<DbSchema> {
  const client = await pool.connect();
  try {
    const [
      promotions, students, professors, courses, attendances, homeworks,
      liveSessions, grades, sessions, candidatures, staff, badgeScans, securityEvents
    ] = await Promise.all([
      client.query("SELECT * FROM promotions"),
      client.query("SELECT * FROM students"),
      client.query("SELECT * FROM professors"),
      client.query("SELECT * FROM courses"),
      client.query("SELECT * FROM attendances"),
      client.query("SELECT * FROM homeworks"),
      client.query("SELECT * FROM live_sessions"),
      client.query("SELECT * FROM grades"),
      client.query("SELECT * FROM sessions"),
      client.query("SELECT * FROM candidatures"),
      client.query("SELECT * FROM staff"),
      client.query("SELECT * FROM badge_scans"),
      client.query("SELECT * FROM security_events")
    ]);

    return {
      promotions: promotions.rows,
      students: students.rows.map(mapper.mapStudent),
      professors: professors.rows,
      courses: courses.rows,
      attendances: attendances.rows,
      homeworks: homeworks.rows.map(mapper.mapHomework),
      liveSessions: liveSessions.rows.map(mapper.mapLiveSession),
      grades: grades.rows.map(r => ({ ...r, moyPromo: r.moy_promo ? parseFloat(r.moy_promo) : 0 })),
      sessions: sessions.rows.map(mapper.mapSession),
      candidatures: candidatures.rows.map(mapper.mapCandidature),
      staff: staff.rows,
      badgeScans: badgeScans.rows.map(mapper.mapBadgeScan),
      securityEvents: securityEvents.rows.map(r => ({
        id: r.id,
        eventName: r.event_name,
        occurredAt: r.occurred_at,
        payload: r.payload
      }))
    };
  } finally {
    client.release();
  }
}

export async function saveToPostgres(dbData: DbSchema): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Independent parent tables
    if (dbData.promotions) {
      for (const p of dbData.promotions) {
        await upsertRecord(client, 'promotions', 'id', p, {});
      }
    }
    if (dbData.professors) {
      for (const p of dbData.professors) {
        await upsertRecord(client, 'professors', 'id', p, {});
      }
    }

    // 2. Depends on promotions
    if (dbData.students) {
      for (const s of dbData.students) {
        await upsertRecord(client, 'students', 'id', s, { statutFrais: 'statut_frais' });
      }
    }

    // 3. Depends on promotions and professors
    if (dbData.courses) {
      for (const c of dbData.courses) {
        await upsertRecord(client, 'courses', 'id', c, {});
      }
    }

    // 4. Depends on students / courses
    if (dbData.attendances) {
      for (const a of dbData.attendances) {
        await upsertRecord(client, 'attendances', 'id', a, {});
      }
    }
    if (dbData.homeworks) {
      for (const h of dbData.homeworks) {
        await upsertRecord(client, 'homeworks', 'id', h, { desc: 'description', deadlineStr: 'deadline_str', submittedFiles: 'submitted_files' });
      }
    }
    if (dbData.liveSessions) {
      for (const ls of dbData.liveSessions) {
        await upsertRecord(client, 'live_sessions', 'id', ls, { hlsUrl: 'hls_url', endTime: 'end_time', startTime: 'start_time', chatMessages: 'chat_messages', attendeesCount: 'attendees_count' });
      }
    }

    // 5. Independent child tables
    if (dbData.grades) {
      for (const g of dbData.grades) {
        await upsertRecord(client, 'grades', 'id', g, { moyPromo: 'moy_promo' });
      }
    }
    if (dbData.sessions) {
      for (const s of dbData.sessions) {
        await upsertRecord(client, 'sessions', 'id', s, { dateStr: 'date_str', heureFin: 'heure_fin', heureStr: 'heure_str', heureDebut: 'heure_debut', jourComplet: 'jour_complet' });
      }
    }
    if (dbData.candidatures) {
      for (const cd of dbData.candidatures) {
        await upsertRecord(client, 'candidatures', 'id', cd, { numeroCni: 'numero_cni', typeDepot: 'type_depot', nomComplet: 'nom_complet', promotionNom: 'promotion_nom', nomFichierCni: 'nom_fichier_cni', dateSoumission: 'date_soumission', dernierDiplome: 'dernier_diplome', nomFichierDiplome: 'nom_fichier_diplome', nomFichierBulletin: 'nom_fichier_bulletin', dernierEtablissement: 'dernier_etablissement' });
      }
    }
    if (dbData.staff) {
      for (const sf of dbData.staff) {
        await upsertRecord(client, 'staff', 'id', sf, {});
      }
    }
    if (dbData.badgeScans) {
      for (const bs of dbData.badgeScans) {
        await upsertRecord(client, 'badge_scans', 'id', bs, { badgeId: 'badge_id', badgeOwner: 'badge_owner', studentId: 'student_id', statutFrais: 'statut_frais' });
      }
    }
    if (dbData.securityEvents) {
      for (const se of dbData.securityEvents) {
        await upsertRecord(client, 'security_events', 'id', se, { eventName: 'event_name', occurredAt: 'occurred_at' });
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
