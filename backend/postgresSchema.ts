export const TABLE_SCHEMAS = [
  `CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    faculte VARCHAR(255),
    filiere VARCHAR(255)
  );`,

  `CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    matricule VARCHAR(255) UNIQUE,
    gpa NUMERIC(4,2),
    average NUMERIC(5,2),
    mood VARCHAR(255),
    statut_frais VARCHAR(255),
    promotion_id VARCHAR(255) REFERENCES promotions(id) ON DELETE SET NULL ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS professors (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
  );`,

  `CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(255) PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    unites JSONB NOT NULL DEFAULT '[]'::jsonb,
    progress INTEGER DEFAULT 0,
    coefficient INTEGER DEFAULT 1,
    promotion_id VARCHAR(255) REFERENCES promotions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    professeur_id VARCHAR(255) REFERENCES professors(id) ON DELETE SET NULL ON UPDATE CASCADE,
    prochain_cours VARCHAR(255)
  );`,

  `CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(50),
    salle VARCHAR(255),
    method VARCHAR(100),
    status VARCHAR(100),
    location VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE,
    student_id VARCHAR(255) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS homeworks (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT,
    prio VARCHAR(50),
    titre VARCHAR(255),
    statut VARCHAR(100),
    progress INTEGER DEFAULT 0,
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    deadline_str VARCHAR(255),
    submitted_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    note VARCHAR(100)
  );`,

  `CREATE TABLE IF NOT EXISTS live_sessions (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    hls_url VARCHAR(500),
    status VARCHAR(50),
    end_time VARCHAR(50),
    start_time VARCHAR(50),
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    reactions JSONB DEFAULT '{}'::jsonb,
    chat_messages JSONB DEFAULT '[]'::jsonb,
    attendees_count INTEGER DEFAULT 0,
    thumbnail VARCHAR(500)
  );`,

  `CREATE TABLE IF NOT EXISTS grades (
    id VARCHAR(255) PRIMARY KEY,
    module VARCHAR(255) NOT NULL,
    prof VARCHAR(255),
    ects INTEGER,
    cc NUMERIC(5,2),
    examen NUMERIC(5,2),
    moy_promo NUMERIC(5,2)
  );`,

  `CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    jour VARCHAR(10),
    type VARCHAR(50),
    salle VARCHAR(100),
    status VARCHAR(50),
    date_str VARCHAR(100),
    heure_fin VARCHAR(10),
    heure_str VARCHAR(50),
    heure_debut VARCHAR(10),
    professeur VARCHAR(255),
    description TEXT,
    jour_complet VARCHAR(20)
  );`,

  `CREATE TABLE IF NOT EXISTS candidatures (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    statut VARCHAR(50),
    numero_cni VARCHAR(100),
    telephone VARCHAR(100),
    type_depot VARCHAR(100),
    motivation TEXT,
    nom_complet VARCHAR(255),
    promotion_nom VARCHAR(255),
    nom_fichier_cni VARCHAR(255),
    date_soumission TIMESTAMP WITH TIME ZONE,
    dernier_diplome VARCHAR(255),
    nom_fichier_diplome VARCHAR(255),
    nom_fichier_bulletin VARCHAR(255),
    dernier_etablissement VARCHAR(255)
  );`,

  `CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(100),
    telephone VARCHAR(100)
  );`,

  `CREATE TABLE IF NOT EXISTS badge_scans (
    id VARCHAR(255) PRIMARY KEY,
    badge_id VARCHAR(255),
    badge_owner VARCHAR(255),
    student_id VARCHAR(255),
    statut VARCHAR(100),
    message VARCHAR(500),
    assiduite VARCHAR(100),
    statut_frais VARCHAR(100),
    zone VARCHAR(255),
    time VARCHAR(50),
    date VARCHAR(50),
    type VARCHAR(50)
  );`,

  `CREATE TABLE IF NOT EXISTS security_events (
    id VARCHAR(255) PRIMARY KEY,
    event_name VARCHAR(255),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payload JSONB DEFAULT '{}'::jsonb
  );`
];
