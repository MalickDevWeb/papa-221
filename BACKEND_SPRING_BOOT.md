# 🍃 Guide d'Intégration du Backend Spring Boot — École 221

Ce guide complet est conçu pour vous permettre de développer le backend de l'**École 221** en **Spring Boot (Java)** sans effort, puis d'interconnecter le frontend React instantanément.

---

## ⚙️ Étape 1 : Connecter le Frontend à votre Spring Boot

Le frontend utilise une variable d'environnement `VITE_API_URL` pour cibler le serveur de backend. Par défaut, si cette variable n'est pas définie, il cible le proxy interne `/api`.

Pour rediriger le frontend vers votre serveur Spring Boot local (tournant par défaut sur le port `8080`) :

1. Créez ou modifiez le fichier `.env` à la racine du projet frontend :
```env
VITE_API_URL=http://localhost:8080/api
```

2. Dans votre configuration Spring Boot (`SecurityConfiguration` ou `WebMvcConfigurer`), vous **devez** autoriser les requêtes CORS provenant du frontend (port par défaut d'AI Studio ou `http://localhost:3000`) :
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*") // En développement, ou spécifiez les URLs de l'App
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
```

---

## 📂 Structure Spring Boot Recommandée

Nous vous conseillons de suivre la structure standard de Spring Boot :

```
com.ecole221.backend
├── config                 # Configuration de sécurité, CORS, JWT
├── controller             # Contrôleurs REST (Spring MVC)
├── dto                    # Objets de transfert de données (Requêtes/Réponses)
├── exception              # ExceptionHandlers globaux (@ControllerAdvice)
├── model                  # Entités JPA/Hibernate
├── repository             # Interfaces Spring Data JPA
└── service                # Logique métier (Services applicatifs)
```

---

## 🔐 1. Authentification (`/api/auth`)

### 📌 Connexion
* **Endpoint :** `POST /api/auth/login`
* **Accès :** Public
* **Payload Entrée (`LoginRequest`) :**
```json
{
  "email": "student@ecole221.sn",
  "password": "password123"
}
```
* **Payload Sortie (`LoginResponse`) :**
```json
{
  "token": "votre-jwt-token-generé",
  "user": {
    "id": "usr-001",
    "nom": "Sall",
    "prenom": "Mamadou",
    "email": "student@ecole221.sn",
    "role": "STUDENT" // Valeurs possibles : ADMIN, STUDENT, PROFESSOR, VIGIL
  }
}
```
* **Sécurité :** Générez un token JWT contenant le `role` et l'`email` dans les claims. Le frontend stockera automatiquement ce token dans le `localStorage` sous la clé `access_token` et l'enverra dans le header `Authorization: Bearer <token>` pour toutes les requêtes subséquentes.

---

## 🏛️ 2. Module Administrateur (`/api/admin` & `/api/planning`)

### 📌 Assigner un Portail à un Vigil
* **Endpoint :** `POST /api/admin/gates/assign`
* **Accès :** `ADMIN`
* **Payload Entrée :**
```json
{
  "gate": "Porte Principale",
  "guard": "Mamadou Diallo"
}
```
* **Payload Sortie :**
```json
{
  "success": true,
  "message": "Portail assigné avec succès.",
  "item": {
    "id": "gate-1",
    "gate": "Porte Principale",
    "guard": "Mamadou Diallo",
    "status": "ACTIVE"
  }
}
```

### 📌 Mettre à jour le Statut des Frais d'un Étudiant
* **Endpoint :** `PATCH /api/admin/students/{id}/status`
* **Accès :** `ADMIN`
* **Payload Entrée :**
```json
{
  "statutFrais": "REGLE" // Valeurs possibles : REGLE, IMPAYE, AVANCE
}
```
* **Payload Sortie :**
```json
{
  "success": true,
  "student": {
    "id": "std-002",
    "nom": "Diop",
    "prenom": "Awa",
    "statutFrais": "REGLE"
  }
}
```

### 📌 Assigner un Cours / Emploi du Temps
* **Endpoint :** `POST /api/admin/schedule/assign`
* **Accès :** `ADMIN`
* **Payload Entrée :**
```json
{
  "courseId": "course-101",
  "day": "Lundi",
  "time": "08:30 - 11:30",
  "room": "Amphi B",
  "professorId": "prof-501"
}
```
* **Payload Sortie :**
```json
{
  "success": true,
  "schedule": {
    "id": "sch-999",
    "courseId": "course-101",
    "day": "Lundi",
    "time": "08:30 - 11:30",
    "room": "Amphi B",
    "professorId": "prof-501"
  }
}
```

### 📌 Journal des Logs en Temps Réel (Logs de scannage et d'accès)
* **Endpoint :** `GET /api/admin/realtime-logs`
* **Accès :** `ADMIN`
* **Payload Sortie :**
```json
[
  {
    "id": "log-001",
    "timestamp": "2026-07-20T11:00:00Z",
    "actor": "Vigil Diallo",
    "action": "SCAN_BADGE",
    "details": "Étudiant Mamadou Sall (REGLE) a scanné à la Porte A",
    "status": "VALIDE"
  }
]
```

---

## 📅 3. Gestion du Planning Scolaire (`/api/planning`)

Ces endpoints servent à lire et persister la configuration du calendrier et de la structure de l'école.

### 📌 Récupérer / Enregistrer les Salles de Classe
* **Endpoints :** `GET /api/planning/rooms` et `PUT /api/planning/rooms`
* **Payload JSON (Tableau de Salles) :**
```json
[
  {
    "id": "room-1",
    "name": "Amphi A",
    "capacity": 150,
    "hasProjector": true
  }
]
```

### 📌 Récupérer / Enregistrer les Filières
* **Endpoints :** `GET /api/planning/filieres` et `PUT /api/planning/filieres`
* **Payload JSON (Tableau de Filières) :**
```json
[
  {
    "id": "fil-1",
    "name": "Génie Logiciel",
    "code": "GL",
    "description": "Filière informatique de conception logicielle"
  }
]
```

### 📌 Récupérer / Enregistrer les Classes
* **Endpoints :** `GET /api/planning/classes` et `PUT /api/planning/classes`
* **Payload JSON (Tableau de Classes) :**
```json
[
  {
    "id": "class-1",
    "name": "M1 GL",
    "filiereId": "fil-1",
    "niveau": "Master 1"
  }
]
```

### 📌 Récupérer / Enregistrer les Créneaux Horaires du Planning
* **Endpoints :** `GET /api/planning/slots` et `PUT /api/planning/slots`
* **Payload JSON (Tableau de Créneaux) :**
```json
[
  {
    "id": "slot-1",
    "day": "Lundi",
    "time": "08:00 - 11:00",
    "courseId": "course-1",
    "roomId": "room-1",
    "profId": "prof-1"
  }
]
```

---

## 👨‍🏫 4. Module Professeur (`/api/professor` & `/api/prof`)

Les endpoints professeurs doivent être filtrés par le `profId` de l'enseignant connecté (passé en query param ou extrait du token JWT).

### 📌 Liste des Cours du Professeur
* **Endpoint :** `GET /api/professor/courses`
* **Query Params :** `profId=prof-1`
* **Payload Sortie :**
```json
[
  {
    "id": "course-1",
    "title": "Architecture Logicielle",
    "classe": "M1 GL",
    "enrolledStudentsCount": 24
  }
]
```

### 📌 Liste des Étudiants d'un Cours (avec filtres de tri)
* **Endpoint :** `GET /api/professor/courses/{courseId}/students`
* **Payload Sortie :**
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

### 📌 Récupérer / Modifier les Notes des Étudiants
* **Récupérer :** `GET /api/professor/courses/{courseId}/grades`
  * *Réponse :*
  ```json
  [
    {
      "id": "grade-1",
      "studentId": "std-001",
      "studentName": "Mamadou Sall",
      "cc": 14.5,
      "examen": 16.0,
      "average": 15.4
    }
  ]
  ```
* **Sauvegarder :** `POST /api/professor/courses/{courseId}/grades/{studentId}`
  * *Entrée :* `{ "cc": 15.0, "examen": 14.0 }`
  * *Réponse (Note mise à jour) :*
  ```json
  {
    "studentId": "std-001",
    "cc": 15.0,
    "examen": 14.0,
    "average": 14.4
  }
  ```

### 📌 Gestion des Devoirs
* **Récupérer :** `GET /api/professor/courses/{courseId}/homeworks`
* **Créer :** `POST /api/professor/courses/{courseId}/homeworks`
  * *Entrée :*
  ```json
  {
    "titre": "Projet Architecture Hexagonale",
    "desc": "Implémenter une architecture en couches propres.",
    "prio": "haute", // haute ou normale
    "deadlineStr": "2026-07-28"
  }
  ```

### 📌 Emploi du Temps Hebdomadaire de l'Enseignant
* **Endpoint :** `GET /api/professor/schedule`
* **Query Params :** `profId=prof-1`
* **Payload Sortie :**
```json
[
  {
    "id": "session-1",
    "courseTitle": "Architecture Logicielle",
    "day": "Lundi",
    "time": "08:00 - 11:00",
    "room": "Amphi A",
    "courseId": "course-1",
    "type": "CM", // CM, TD, TP
    "dateStr": "Lundi 06 Juillet 2026",
    "status": "a_venir", // a_venir, annule, deplace
    "cancellationReason": "",
    "classe": "M1 GL"
  }
]
```

### 📌 Annulation et Déplacement de Cours
* **Annuler :** `POST /api/professor/schedule/{sessionId}/cancel`
  * *Entrée :* `{ "reason": "Conférence de recherche" }`
* **Déplacer :** `POST /api/professor/schedule/{sessionId}/reschedule`
  * *Entrée :* `{ "day": "Mercredi", "time": "14:00 - 17:00", "room": "Salle 102" }`

### 📌 Gestion des Ressources pédagogiques (Chapitres / Leçons / Modules)
* **Créer Module :** `POST /api/professor/courses/{courseId}/modules`
  * *Entrée :* `{ "title": "Chapitre 1: Introduction", "description": "Bases de l'architecture" }`
* **Créer Leçon :** `POST /api/professor/courses/{courseId}/lessons`
  * *Entrée :* `{ "title": "Leçon 1.1", "description": "Les principes SOLID", "attachmentName": "solid.pdf", "attachmentUrl": "https://storage.sn/solid.pdf", "moduleId": "module-1" }`
* **Créer un Quiz :** `POST /api/api/professor/modules/{moduleId}/quizzes`
  * *Entrée :*
  ```json
  {
    "title": "Quiz SOLID",
    "description": "Vérification des connaissances SOLID",
    "questions": [
      {
        "id": "q-1",
        "text": "Que signifie le S de SOLID ?",
        "options": ["Single Responsibility", "State", "Scope"],
        "correctOptionIndex": 0
      }
    ]
  }
  ```

### 📌 Feuille d'Appel (Ancien format compatible)
* **Soumettre Présences / Absences d'un cours :** `POST /api/prof/attendance/submit`
  * *Entrée :*
  ```json
  {
    "classId": "class-1",
    "absences": ["std-001", "std-004"] // IDs des absents
  }
  ```

---

## 🎓 5. Module Étudiant (`/api/student`)

### 📌 Tableau de Bord Principal de l'Étudiant
* **Endpoint :** `GET /api/student/profile` : Profil complet (nom, classe, tuteur).
* **Endpoint :** `GET /api/student/dashboard` : Stats de présence et de notes globales.
* **Endpoint :** `GET /api/student/digital-badge` : Badge NFC / QR Code de l'étudiant pour pointage physique.
* **Endpoint :** `GET /api/student/attendances` : Liste historique de ses scans d'entrée/sortie.

### 📌 Pointage personnel (Self Check-in / Scan QR)
* **Endpoint :** `POST /api/student/attendances`
* **Payload Entrée :**
```json
{
  "type": "ENTREE", // ENTREE, SORTIE
  "method": "QR_CODE" // QR_CODE, NFC
}
```

### 📌 Cours Interactifs en Direct (Live-Sessions)
* **Endpoint :** `GET /api/student/live-sessions` : Récupère les cours en direct.
* **Envoyer Réaction :** `POST /api/student/live-sessions/{sessionId}/reaction`
  * *Entrée :* `{ "type": "heart" }` // heart, thumbs_up, clap, clap, brain
* **Chatter en direct :** `POST /api/student/live-sessions/{sessionId}/chat`
  * *Entrée :* `{ "user": "Mamadou Sall", "text": "Est-ce que le projet est pour lundi ?" }`

---

## 🤝 6. Module de Collaboration (`/api/collaboration`)

Permet de gérer l'apprentissage collaboratif entre étudiants.

### 📌 Groupes d'Étude
* **Récupérer Groupes :** `GET /api/collaboration/workgroups`
* **Créer Groupe :** `POST /api/collaboration/workgroups`
  * *Entrée :* `{ "name": "Groupe Algo 221", "description": "Entraide algorithmique" }`

### 📌 Partage de Documents dans le Groupe
* **Récupérer :** `GET /api/collaboration/workgroups/{groupId}/documents`
* **Publier :** `POST /api/collaboration/workgroups/{groupId}/documents`
  * *Entrée :* `{ "name": "cours-arbres-binaires.pdf", "type": "pdf", "size": "2.4 MB", "url": "https://storage.sn/doc123.pdf", "addedBy": "Awa Diop" }`

### 📌 Tâches et Devoirs du Groupe
* **Tâches :** `GET` et `POST` `/api/collaboration/workgroups/{groupId}/tasks`
  * *Entrée POST :* `{ "title": "Rédiger l'introduction", "assignedTo": "Awa Diop", "status": "a_faire" }`
* **Devoirs de groupe :** `GET` et `POST` `/api/collaboration/workgroups/{groupId}/homeworks`

### 📌 Chat / Messagerie de Groupe
* **Récupérer messages :** `GET /api/collaboration/workgroups/{groupId}/messages`
* **Envoyer message :** `POST /api/collaboration/workgroups/{groupId}/messages`
  * *Entrée :* `{ "text": "Bonjour à tous, réunion ce soir !", "user": "Mamadou Sall" }`

### 📌 Visioconférences (Meets)
* **Récupérer Meets planifiés :** `GET /api/collaboration/meets`
* **Planifier Meet :** `POST /api/collaboration/meets`
  * *Entrée :* `{ "title": "Sprint Review Groupe 1", "startTime": "18:00", "duration": 45, "url": "https://meet.google.com/abc-defg-hij" }`

---

## 🛡️ 7. Module Agent de Sécurité / Vigil (`/api/security` & `/api/vigil`)

### 📌 Statut du Point de Contrôle Actuel
* **Endpoint :** `GET /api/security/checkpoint-status`
* **Payload Sortie :**
```json
{
  "gate": "Porte Principale",
  "guard": "Agent Diallo",
  "totalScansToday": 142,
  "status": "ACTIVE"
}
```

### 📌 Soumettre un Scan de Badge d'Étudiant (Scannage physique)
* **Endpoint :** `POST /api/security/scan-logs`
* **Payload Entrée :**
```json
{
  "badgeId": "badge-std-001" // ID lu par le scan NFC ou le décodeur QR-code du Vigil
}
```
* **Payload Sortie :**
Ce service doit d'abord vérifier en base si l'étudiant est en règle de paiement. S'il est en règle, il autorise l'accès et crée un log. S'il est impayé, il refuse l'accès.
```json
{
  "success": true,
  "studentName": "Mamadou Sall",
  "status": "ENTREE",
  "timestamp": "2026-07-20T11:42:00Z",
  "statutFrais": "REGLE" // REGLE, IMPAYE, AVANCE
}
```

---

## 📝 Exemple de Contrôleur Spring Boot (`AuthController.java`)

Voici un exemple simple de contrôleur pour l'authentification avec Spring Boot :

```java
package com.ecole221.backend.controller;

import com.ecole221.backend.dto.LoginRequest;
import com.ecole221.backend.dto.LoginResponse;
import com.ecole221.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}
```

---

## ✅ Checklist pour une Transition Parfaite
1. Implémentez tous les contrôleurs ci-dessus dans Spring Boot avec un préfixe commun `/api`.
2. Configurez le CORS pour autoriser l'URL de votre application React.
3. Activez le support de la sécurité et du JWT dans Spring Boot.
4. Mettez à jour le fichier `.env` du frontend avec `VITE_API_URL=http://localhost:8080/api` (ou l'URL de production de Spring Boot).
5. Lancez et profitez d'une architecture full-stack ultra-performante et totalement découplée !
