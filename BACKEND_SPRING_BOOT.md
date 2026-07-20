# 🏛️ GUIDE TECHNIQUE : Architecture DDD + Hexagonale Spring Boot (École 221)

Ce guide est le **référentiel absolu de développement** pour concevoir et implémenter le backend **Spring Boot** de l'**École 221** en respectant une architecture propre **DDD (Domain-Driven Design) & Hexagonale** (ou Ports et Adaptateurs).

En suivant scrupuleusement ce guide, vous obtiendrez un backend Spring Boot robuste, hautement testable, prêt pour la production, et **100% compatible** avec les appels d'API du frontend React existant.

---

## 📐 Règle d'Or et Bounded Contexts

Chaque module technique de l'École 221 est conçu comme un **Bounded Context** indépendant ou un microservice potentiel. 
1. **ZÉRO couplage direct** entre les couches de domaine.
2. Le **Domaine est le ROI** : il ne contient aucune dépendance vers Spring, Hibernate/JPA, ou des librairies externes. C'est du Java pur (Plain Old Java Objects).
3. Les interactions avec l'extérieur (Base de données, API, Messagerie) se font uniquement à travers des **Ports (interfaces)** déclarés dans le domaine et implémentés dans l'infrastructure.

---

## 📁 Organisation Universelle des Packages (DDD / Hexagonal)

Voici l'arborescence stricte que chaque package ou microservice de votre application Spring Boot doit respecter :

```text
com.ecole221.backend.[module]
│
├── 📁 domain/                                   ← LE ROI (Java Pur, Zéro dépendance technique)
│    ├── 📁 model/                               ← Les Entités Métier (Racines d'Agrégats & Entités secondaires)
│    │    ├── [AggregateRoot].java               (Contient les règles de cohérence et l'état)
│    │    └── [Aggregate]Factory.java            (Création complexe, même package pour les constructeurs protégés)
│    │
│    ├── 📁 valueobject/                         ← Objets de valeur immuables (Spring Boot 16+ records de préférence)
│    │    ├── Email.java
│    │    ├── StatutFrais.java
│    │    └── RoleUtilisateur.java
│    │
│    ├── 📁 exception/                           ← Exceptions métier pures (héritent de RuntimeException)
│    │    └── SoldeInsuffisantException.java
│    │
│    ├── 📁 event/                               ← Événements métiers produits par l'agrégat (records immuables)
│    │    └── BadgeScanneEvent.java
│    │
│    └── 📁 port/                                ← Interfaces de communication (les contrats de l'hexagone)
│         ├── 📁 repository/                     ← Output Ports (Sortants : lecture/écriture en base)
│         │    └── StudentRepositoryPort.java
│         └── 📁 event/                         ← Output Ports (Sortants : envoi d'événements Kafka/RabbitMQ)
│              └── SecurityEventPublisherPort.java
│
├── 📁 application/                              ← LE CHEF D'ORCHESTRE (Logique applicative)
│    ├── 📁 port/                                ← Interfaces d'entrée
│    │    ├── 📁 command/                        ← DTOs de commande d'entrée (Validation Bean-Validation)
│    │    │    └── SubmitCheckInCommand.java
│    │    └── 📁 usecase/                        ← Input Ports (Entrants : ce que l'application sait faire)
│    │         └── SubmitCheckInUseCase.java
│    └── 📁 service/                             ← Implémentation des use cases (Contrôle les transactions Spring)
│         └── SubmitCheckInService.java
│
└── 📁 infrastructure/                           ← L'OUVRIER (Détails techniques : JPA, Web, Sécurité)
     ├── 📁 adapter/
     │    ├── 📁 in/                             ← Adaptateurs Entrants (Ceux qui pilotent l'application)
     │    │    └── 📁 web/                       ← Contrôleurs Rest (Spring MVC)
     │    │         ├── StudentController.java
     │    │         └── dto/ (Requêtes/Réponses REST)
     │    └── 📁 out/                            ← Adaptateurs Sortants (Ceux pilotés par l'application)
     │         └── 📁 persistence/               ← Implémentation JPA / Hibernate
     │              ├── StudentJpaEntity.java    (Entité physique de la BDD avec annotations @Entity)
     │              ├── StudentJpaRepository.java (Interface Spring Data JPA standard)
     │              ├── StudentRepositoryAdapter.java (Implémente StudentRepositoryPort, fait l'appel au JPA)
     │              └── StudentMapper.java        (Mapping bi-directionnel JPA <-> Domaine)
     └── 📁 config/                              ← Déclaration des Beans Spring, Sécurité JWT, CORS
          └── SecurityConfig.java
```

---

## 🏛️ PARTIE 1 : API PAR ACTEUR, FILTRES ET SCHÉMAS DE DONNÉES

Cette section documente précisément les structures de données (JSON), les filtres disponibles, et la correspondance exacte des entrées/sorties avec le frontend.

---

### 👤 1. ACTEUR : ÉTUDIANT (`/api/student`)

L'étudiant accède à son profil, ses pointages NFC/QR, et suit ses cours en direct.

#### 📌 A. Obtenir le Profil de l'Étudiant Connecté
* **Endpoint :** `GET /api/student/profile`
* **Port d'entrée (UseCase) :** `GetStudentProfileUseCase`
* **Contrat de Sortie (JSON) :**
```json
{
  "id": "std-001",
  "nom": "Sall",
  "prenom": "Mamadou",
  "email": "mamadou.sall@gmail.com",
  "role": "STUDENT",
  "classe": {
    "id": "class-1",
    "name": "M1 GL"
  },
  "tuteur": {
    "nom": "Sall",
    "prenom": "Ibrahima",
    "telephone": "+221 77 123 45 67"
  }
}
```

#### 📌 B. Pointage Personnel (Self Check-in / Scan QR)
* **Endpoint :** `POST /api/student/attendances`
* **Port d'entrée (UseCase) :** `RegisterSelfCheckInUseCase`
* **Corps de la Requête (Command JSON) :**
```json
{
  "type": "ENTREE",  // Valeurs : ENTREE, SORTIE (ValueObject TypeScannage)
  "method": "QR_CODE" // Valeurs : QR_CODE, NFC (ValueObject MethodeScannage)
}
```
* **Corps de la Réponse (JSON) :**
```json
{
  "success": true,
  "attendanceId": "att-981",
  "timestamp": "2026-07-20T11:45:00Z",
  "status": "VALIDATED"
}
```

#### 📌 C. Sessions de Cours Interactives en Direct (Live-Sessions)
* **Endpoint :** `GET /api/student/live-sessions`
* **Port d'entrée (UseCase) :** `GetActiveLiveSessionsUseCase`
* **Corps de la Réponse (JSON) :**
```json
[
  {
    "id": "live-session-101",
    "courseTitle": "Architecture Hexagonale & Microservices",
    "professorName": "Prof. Malick Teuw",
    "status": "ACTIVE", // ACTIVE, COMPLETED, SCHEDULED
    "activeUsers": 28,
    "reactions": {
      "heart": 12,
      "thumbs_up": 34,
      "clap": 15,
      "brain": 8
    }
  }
]
```

#### 📌 D. Envoyer une Réaction en Temps Réel
* **Endpoint :** `POST /api/student/live-sessions/{sessionId}/reaction`
* **Corps de la Requête (JSON) :**
```json
{
  "type": "brain" // Valeurs : heart, thumbs_up, clap, brain
}
```
* **Corps de la Réponse :** HTTP 204 No Content ou HTTP 200 avec le nouveau décompte.

#### 📌 E. Envoyer un message sur le chat de la session live
* **Endpoint :** `POST /api/student/live-sessions/{sessionId}/chat`
* **Corps de la Requête (JSON) :**
```json
{
  "user": "Mamadou Sall",
  "text": "Quelle est la date de rendu pour le livrable de l'architecture ?"
}
```

---

### 👨‍🏫 2. ACTEUR : ENSEIGNANT (`/api/professor`)

Le professeur gère ses cours, ses notes, planifie ses devoirs et gère ses chapitres.

#### 📌 A. Liste des cours de l'enseignant (avec Filtres)
* **Endpoint :** `GET /api/professor/courses`
* **Paramètres de filtrage (Query Params) :**
  * `profId` (String, obligatoire, extrait du JWT ou passé en paramètre)
  * `classe` (String, optionnel, filtre par classe comme "M1 GL")
* **Port d'entrée (UseCase) :** `GetProfessorCoursesUseCase`
* **Corps de la Réponse (JSON) :**
```json
[
  {
    "id": "course-101",
    "title": "Architecture Logicielle",
    "classe": "M1 GL",
    "enrolledStudentsCount": 24,
    "hoursAllocated": 45
  }
]
```

#### 📌 B. Liste des étudiants inscrits à un cours (avec Tri & Filtre)
* **Endpoint :** `GET /api/professor/courses/{courseId}/students`
* **Paramètres de filtrage & Tri (Query Params) :**
  * `search` (String, optionnel) : Recherche par nom ou prénom
  * `sortBy` (String, optionnel) : "nom" ou "prenom"
  * `direction` (String, optionnel) : "ASC" ou "DESC"
* **Port d'entrée (UseCase) :** `GetCourseStudentsUseCase`
* **Corps de la Réponse (JSON) :**
```json
[
  {
    "id": "std-001",
    "nom": "Sall",
    "prenom": "Mamadou",
    "email": "mamadou.sall@gmail.com",
    "photo": "https://api.placeholder/avatar.jpg"
  }
]
```

#### 📌 C. Saisie et Enregistrement des Notes des étudiants
* **Enregistrer/Modifier une Note :** `POST /api/professor/courses/{courseId}/grades/{studentId}`
* **Port d'entrée (UseCase) :** `SaveStudentGradeUseCase`
* **Corps de la Requête (Command JSON) :**
```json
{
  "cc": 14.5,      // Note de Contrôle Continu (Double, nullable)
  "examen": 16.0   // Note d'Examen (Double, nullable)
}
```
* **Corps de la Réponse (JSON) :**
```json
{
  "studentId": "std-001",
  "cc": 14.5,
  "examen": 16.0,
  "average": 15.4  // Moyenne calculée automatiquement par le domaine
}
```

#### 📌 D. Création d'un Devoir
* **Endpoint :** `POST /api/professor/courses/{courseId}/homeworks`
* **Corps de la Requête (JSON) :**
```json
{
  "titre": "Projet d'implémentation DDD",
  "desc": "Concevoir un microservice avec Spring Boot et Clean Architecture",
  "prio": "haute", // haute ou normale
  "deadlineStr": "2026-07-30"
}
```

#### 📌 E. Annulation ou Déplacement d'un cours de son planning
* **Annuler :** `POST /api/professor/schedule/{sessionId}/cancel`
  * *Request Body :* `{ "reason": "Empêchement médical" }`
* **Déplacer :** `POST /api/professor/schedule/{sessionId}/reschedule`
  * *Request Body :* `{ "day": "Mercredi", "time": "14:00 - 17:00", "room": "Salle 102" }`

---

### 🛡️ 3. ACTEUR : VIGIL / AGENT DE SÉCURITÉ (`/api/security` & `/api/vigil`)

L'agent de sécurité contrôle les entrées physiques en scannant le QR code ou la puce NFC du badge numérique d'un étudiant.

#### 📌 A. Récupérer le Statut du Point de Contrôle
* **Endpoint :** `GET /api/security/checkpoint-status`
* **Port d'entrée (UseCase) :** `GetSecurityCheckpointStatusUseCase`
* **Corps de la Réponse (JSON) :**
```json
{
  "gate": "Porte Principale",
  "guard": "Agent Mamadou Diallo",
  "totalScansToday": 142,
  "status": "ACTIVE"
}
```

#### 📌 B. Traitement et Décision d'accès lors d'un scan de badge
* **Endpoint :** `POST /api/security/scan-logs`
* **Port d'entrée (UseCase) :** `ProcessSecurityBadgeScanUseCase`
* **Corps de la Requête (Command JSON) :**
```json
{
  "badgeId": "badge-std-001"
}
```
* **Logique Métier pure du Domaine (VIGIL Context) :**
  1. Charger l'étudiant via le `StudentRepositoryPort` grâce à son `badgeId`.
  2. Si l'étudiant est introuvable : lever une `StudentNotFoundException` -> Retourner un code d'erreur HTTP 404.
  3. Vérifier le statut financier (`StatutFrais`) de l'étudiant :
     - Si `StatutFrais == REGLE` ou `StatutFrais == AVANCE` -> **ACCÈS AUTORISÉ**. Enregistrer un log de type `ENTREE` ou `SORTIE` et marquer le statut comme `VALIDE`.
     - Si `StatutFrais == IMPAYE` -> **ACCÈS REFUSÉ**. Ne pas ouvrir le portail. Enregistrer un log d'accès refusé marqué comme `BLOQUE`.
* **Corps de la Réponse (Accès Autorisé - JSON) :**
```json
{
  "success": true,
  "studentName": "Mamadou Sall",
  "status": "ENTREE",
  "timestamp": "2026-07-20T11:50:00Z",
  "statutFrais": "REGLE",
  "accessGranted": true,
  "message": "Accès autorisé. Bienvenue à l'École 221."
}
```
* **Corps de la Réponse (Accès Refusé - JSON) :**
```json
{
  "success": false,
  "studentName": "Awa Diop",
  "status": "BLOQUE",
  "timestamp": "2026-07-20T11:51:12Z",
  "statutFrais": "IMPAYE",
  "accessGranted": false,
  "message": "Accès refusé. Veuillez régulariser votre situation financière auprès de la comptabilité."
}
```

---

### 🏛️ 4. ACTEUR : ADMINISTRATEUR (`/api/admin`)

L'administrateur gère l'infrastructure, modifie le statut des frais de scolarité, et configure la grille d'emploi du temps globale.

#### 📌 A. Assigner un Portail à un Vigil
* **Endpoint :** `POST /api/admin/gates/assign`
* **Request Body :** `{ "gate": "Porte Principale", "guard": "Agent Diallo" }`

#### 📌 B. Modifier le statut financier d'un étudiant
* **Endpoint :** `PATCH /api/admin/students/{id}/status`
* **Corps de la Requête (JSON) :**
```json
{
  "statutFrais": "REGLE" // Valeurs possibles : REGLE, IMPAYE, AVANCE
}
```

#### 📌 C. Planification et Sauvegarde du Planning Scolaire (`/api/planning`)
Ces endpoints permettent de sauvegarder les configurations globales d'aménagement et sont persistés de manière atomique.
* Salles : `PUT /api/planning/rooms` - Corps : Tableau d'objets `Room`.
* Filières : `PUT /api/planning/filieres` - Corps : Tableau d'objets `Filiere`.
* Classes : `PUT /api/planning/classes` - Corps : Tableau d'objets `Classe`.
* Planning : `PUT /api/planning/slots` - Corps : Tableau d'objets `TimeSlot`.

---

### 🤝 5. MODULE DE COLLABORATION (`/api/collaboration`)

Espace d'apprentissage collaboratif et de partage de documents entre étudiants.

#### 📌 A. Récupérer les Groupes de Travail d'un Étudiant
* **Endpoint :** `GET /api/collaboration/workgroups`
* **Corps de la Réponse (JSON) :**
```json
[
  {
    "id": "group-abc",
    "name": "Groupe de Révision GL",
    "description": "Préparation aux examens d'algorithmique",
    "membersCount": 5
  }
]
```

#### 📌 B. Récupérer et Publier des Documents
* Récupérer : `GET /api/collaboration/workgroups/{groupId}/documents`
* Publier : `POST /api/collaboration/workgroups/{groupId}/documents`
  * *Request Body :*
  ```json
  {
    "name": "cours-microservices.pdf",
    "type": "pdf",
    "size": "4.2 MB",
    "url": "https://storage.ecole221.sn/docs/microservices.pdf",
    "addedBy": "Mamadou Sall"
  }
  ```

---

## 💻 PARTIE 2 : EXEMPLES DE CODE SPRING BOOT DDD ET HEXAGONAL

Pour illustrer comment transcrire cette architecture dans votre projet Java Spring Boot, voici l'implémentation complète pour le cas d'utilisation critique du **Scan de Badge par l'Agent de sécurité**.

### 1. La Couche Domaine (0 dépendance externe)

#### 📝 Record Value Object : `StatutFrais.java`
```java
package com.ecole221.backend.security.domain.valueobject;

public enum StatutFrais {
    REGLE,
    AVANCE,
    IMPAYE
}
```

#### 📝 La Racine d'Agrégat : `Student.java`
```java
package com.ecole221.backend.security.domain.model;

import com.ecole221.backend.security.domain.valueobject.StatutFrais;
import com.ecole221.backend.security.domain.exception.AccessDeniedException;

public class Student {
    private final String id;
    private final String nom;
    private final String prenom;
    private final String badgeId;
    private StatutFrais statutFrais;

    public Student(String id, String nom, String prenom, String badgeId, StatutFrais statutFrais) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.badgeId = badgeId;
        this.statutFrais = statutFrais;
    }

    // Règle métier pure
    public boolean estAutoriseAEntrer() {
        return this.statutFrais == StatutFrais.REGLE || this.statutFrais == StatutFrais.AVANCE;
    }

    public void verifierAcces() {
        if (!estAutoriseAEntrer()) {
            throw new AccessDeniedException("Accès refusé à l'étudiant " + prenom + " " + nom + " pour motif : Scolarité Impayée.");
        }
    }

    // Getters simples
    public String getId() { return id; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getBadgeId() { return badgeId; }
    public StatutFrais getStatutFrais() { return statutFrais; }
}
```

#### 📝 Contrat de Sortie (Output Port) : `StudentRepositoryPort.java`
```java
package com.ecole221.backend.security.domain.port.repository;

import com.ecole221.backend.security.domain.model.Student;
import java.util.Optional;

public interface StudentRepositoryPort {
    Optional<Student> findByBadgeId(String badgeId);
    void saveScanLog(String studentId, String studentName, String gate, String status, boolean allowed);
}
```

---

### 2. La Couche Application (Orchestrateur)

#### 📝 Port d'entrée (Input Port) : `ProcessSecurityBadgeScanUseCase.java`
```java
package com.ecole221.backend.security.application.port.usecase;

import com.ecole221.backend.security.application.port.command.ScanBadgeCommand;
import com.ecole221.backend.security.application.port.dto.ScanResultDto;

public interface ProcessSecurityBadgeScanUseCase {
    ScanResultDto execute(ScanBadgeCommand command);
}
```

#### 📝 Implémentation du Use Case : `ProcessSecurityBadgeScanService.java`
```java
package com.ecole221.backend.security.application.service;

import com.ecole221.backend.security.application.port.usecase.ProcessSecurityBadgeScanUseCase;
import com.ecole221.backend.security.application.port.command.ScanBadgeCommand;
import com.ecole221.backend.security.application.port.dto.ScanResultDto;
import com.ecole221.backend.security.domain.model.Student;
import com.ecole221.backend.security.domain.port.repository.StudentRepositoryPort;
import com.ecole221.backend.security.domain.exception.StudentNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class ProcessSecurityBadgeScanService implements ProcessSecurityBadgeScanUseCase {

    private final StudentRepositoryPort studentRepositoryPort;

    public ProcessSecurityBadgeScanService(StudentRepositoryPort studentRepositoryPort) {
        this.studentRepositoryPort = studentRepositoryPort;
    }

    @Override
    public ScanResultDto execute(ScanBadgeCommand command) {
        // 1. Récupération de l'étudiant via le port de sortie
        Student student = studentRepositoryPort.findByBadgeId(command.badgeId())
                .orElseThrow(() -> new StudentNotFoundException("Badge introuvable : " + command.badgeId()));

        boolean accessGranted = student.estAutoriseAEntrer();
        String status = accessGranted ? "ENTREE" : "BLOQUE";

        // 2. Persister le log de scannage physique
        studentRepositoryPort.saveScanLog(
                student.getId(),
                student.getPrenom() + " " + student.getNom(),
                "Porte Principale",
                status,
                accessGranted
        );

        // 3. Retourner le résultat à l'adaptateur Rest (In-Web)
        return new ScanResultDto(
                accessGranted,
                student.getPrenom() + " " + student.getNom(),
                status,
                LocalDateTime.now(),
                student.getStatutFrais().name(),
                accessGranted ? "Accès autorisé." : "Accès refusé : Frais impayés."
        );
    }
}
```

---

### 3. La Couche Infrastructure (Adaptateurs techniques)

#### 📝 Adaptateur Entrant REST : `SecurityController.java`
```java
package com.ecole221.backend.security.infrastructure.adapter.in.web;

import com.ecole221.backend.security.application.port.usecase.ProcessSecurityBadgeScanUseCase;
import com.ecole221.backend.security.application.port.command.ScanBadgeCommand;
import com.ecole221.backend.security.application.port.dto.ScanResultDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final ProcessSecurityBadgeScanUseCase processSecurityBadgeScanUseCase;

    public SecurityController(ProcessSecurityBadgeScanUseCase processSecurityBadgeScanUseCase) {
        this.processSecurityBadgeScanUseCase = processSecurityBadgeScanUseCase;
    }

    @PostMapping("/scan-logs")
    public ResponseEntity<ScanResultDto> scanBadge(@RequestBody ScanRequest request) {
        // Traduction du JSON REST vers le type de commande applicative
        ScanBadgeCommand command = new ScanBadgeCommand(request.badgeId());
        
        // Exécution du cas d'utilisation métier
        ScanResultDto result = processSecurityBadgeScanUseCase.execute(command);
        
        return ResponseEntity.ok(result);
    }
}
```

#### 📝 Adaptateur Sortant Persistance JPA : `StudentRepositoryAdapter.java`
```java
package com.ecole221.backend.security.infrastructure.adapter.out.persistence;

import com.ecole221.backend.security.domain.model.Student;
import com.ecole221.backend.security.domain.port.repository.StudentRepositoryPort;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class StudentRepositoryAdapter implements StudentRepositoryPort {

    private final StudentJpaRepository studentJpaRepository;
    private final ScanLogJpaRepository scanLogJpaRepository;
    private final StudentMapper studentMapper;

    public StudentRepositoryAdapter(
            StudentJpaRepository studentJpaRepository,
            ScanLogJpaRepository scanLogJpaRepository,
            StudentMapper studentMapper) {
        this.studentJpaRepository = studentJpaRepository;
        this.scanLogJpaRepository = scanLogJpaRepository;
        this.studentMapper = studentMapper;
    }

    @Override
    public Optional<Student> findByBadgeId(String badgeId) {
        return studentJpaRepository.findByBadgeId(badgeId)
                .map(studentMapper::toDomain);
    }

    @Override
    public void saveScanLog(String studentId, String studentName, String gate, String status, boolean allowed) {
        ScanLogJpaEntity logEntity = new ScanLogJpaEntity();
        logEntity.setStudentId(studentId);
        logEntity.setStudentName(studentName);
        logEntity.setGate(gate);
        logEntity.setStatus(status);
        logEntity.setAllowed(allowed);
        logEntity.setTimestamp(LocalDateTime.now());
        
        scanLogJpaRepository.save(logEntity);
    }
}
```

---

## 🚀 ÉTAPES DE TRANSITION ET DE DÉPLOIEMENT

1. **Construire le backend Spring Boot** en suivant le découpage par module ci-dessus.
2. **Configurer l'URL de votre backend** dans l'application React en modifiant le fichier d'environnement `.env` :
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
3. **Tester de bout en bout** en vérifiant le bon scannage des badges étudiants, la gestion des notes professeurs, et la persistance des données.
