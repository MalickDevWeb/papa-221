export const COURSE_DETAILS: Record<string, {
  chapitres: {
    titre: string;
    lecons: { titre: string; estDerniereEnseignee?: boolean; duree: string; complete: boolean }[];
  }[];
  ressources: { titre: string; type: 'pdf' | 'video' | 'code' | 'link'; taille: string }[];
  quizzes: { question: string; options: string[]; reponseCorrecte: number }[];
  devoirs: { id: string; titre: string; dateLimite: string; points: string; statut: 'A rendre' | 'Soumis' }[];
}> = {
  'course-1': {
    chapitres: [
      {
        titre: "Chapitre 1 : Introduction aux Microservices",
        lecons: [
          { titre: "1.1 Architecture Monolithique vs Microservices", duree: "45 min", complete: true },
          { titre: "1.2 Découpage des domaines métier (DDD)", duree: "1h 15m", complete: true }
        ]
      },
      {
        titre: "Chapitre 2 : Communication & Scalabilité",
        lecons: [
          { titre: "2.1 Communication synchrone (REST, gRPC)", duree: "1h 00m", complete: true },
          { titre: "2.2 Messages asynchrones (RabbitMQ, Kafka)", estDerniereEnseignee: true, duree: "1h 30m", complete: false },
          { titre: "2.3 API Gateways & Service Discovery", duree: "1h 10m", complete: false }
        ]
      },
      {
        titre: "Chapitre 3 : Sécurité & Observabilité",
        lecons: [
          { titre: "3.1 Authentification distribuée (OAuth2/OIDC)", duree: "55 min", complete: false },
          { titre: "3.2 Tracing distribué & Centralisation de logs", duree: "1h 20m", complete: false }
        ]
      }
    ],
    ressources: [
      { titre: "Supports de cours complet - Microservices.pdf", type: "pdf", taille: "8.4 Mo" },
      { titre: "Vidéo - TP d'implémentation de RabbitMQ avec Node.js.mp4", type: "video", taille: "124 Mo" },
      { titre: "Exemple de code source - API Gateway Express.zip", type: "code", taille: "1.2 Mo" },
      { titre: "Documentation officielle sur l'observabilité", type: "link", taille: "Lien externe" }
    ],
    quizzes: [
      {
        question: "Quel protocole est généralement recommandé pour une communication synchrone haute performance entre microservices ?",
        options: ["SOAP / XML", "gRPC / Protocol Buffers", "FTP", "WebSockets"],
        reponseCorrecte: 1
      },
      {
        question: "Quel composant agit comme point d'entrée unique pour acheminer les requêtes vers les microservices appropriés ?",
        options: ["Le Message Broker", "Le Service Registry", "L'API Gateway", "La base de données distribuée"],
        reponseCorrecte: 2
      },
      {
        question: "Qu'est-ce que le 'Service Discovery' dans un environnement de microservices ?",
        options: [
          "Un outil pour découvrir de nouveaux frameworks",
          "Un mécanisme permettant aux services de localiser dynamiquement les adresses des autres services",
          "Une technique de débogage",
          "La configuration des serveurs DNS"
        ],
        reponseCorrecte: 1
      }
    ],
    devoirs: [
      { id: "dev-1", titre: "TP 1 : Configuration d'un API Gateway avec routage dynamique", dateLimite: "Dans 3 jours (28 Juin 2026)", points: "20 pts", statut: "A rendre" },
      { id: "dev-2", titre: "Mini-projet : Architecture d'un système e-commerce résilient", dateLimite: "Passée (15 Juin 2026)", points: "40 pts", statut: "Soumis" }
    ]
  },
  'course-2': {
    chapitres: [
      {
        titre: "Chapitre 1 : Fondements du Management Stratégique",
        lecons: [
          { titre: "1.1 Définition et niveaux de la stratégie", duree: "35 min", complete: true },
          { titre: "1.2 Analyse de l'environnement : PESTEL & 5 Forces de Porter", duree: "1h 05m", complete: true }
        ]
      },
      {
        titre: "Chapitre 2 : Diagnostic Interne & Choix Stratégiques",
        lecons: [
          { titre: "2.1 Matrice SWOT et chaîne de valeur", duree: "50 min", complete: true },
          { titre: "2.2 Avantages concurrentiels de Domination par les coûts vs Différenciation", estDerniereEnseignee: true, duree: "1h 20m", complete: false },
          { titre: "2.3 Stratégies de diversification et d'internationalisation", duree: "1h 15m", complete: false }
        ]
      }
    ],
    ressources: [
      { titre: "Slides - Analyse stratégique & Diagnostics internes.pdf", type: "pdf", taille: "4.1 Mo" },
      { titre: "Cas d'étude - Expansion de la FinTech sénégalaise Wave.pdf", type: "pdf", taille: "2.8 Mo" },
      { titre: "Vidéo explicative - Porter appliqué aux plateformes digitales.mp4", type: "video", taille: "85 Mo" }
    ],
    quizzes: [
      {
        question: "Parmi les éléments suivants, lequel ne fait pas partie des 5 forces de Porter ?",
        options: ["Le pouvoir de négociation des clients", "La menace des produits de substitution", "L'influence des réseaux sociaux", "L'intensité de la concurrence sectorielle"],
        reponseCorrecte: 2
      },
      {
        question: "Qu'est-ce que la différenciation selon Michael Porter ?",
        options: [
          "Proposer un produit identique moins cher",
          "Proposer un produit unique perçu comme supérieur par le client, justifiant un prix plus élevé",
          "Vendre uniquement en ligne",
          "Changer de logo tous les ans"
        ],
        reponseCorrecte: 1
      }
    ],
    devoirs: [
      { id: "dev-3", titre: "Cas pratique : Diagnostic stratégique d'une entreprise locale", dateLimite: "Dans 5 jours (30 Juin 2026)", points: "30 pts", statut: "A rendre" }
    ]
  },
  'course-3': {
    chapitres: [
      {
        titre: "Chapitre 1 : Philosophie DevOps & Automatisation",
        lecons: [
          { titre: "1.1 Origines, culture et bénéfices du DevOps", duree: "45 min", complete: true },
          { titre: "1.2 Automatisation et infrastructure as code (IaC)", duree: "1h 10m", complete: true }
        ]
      },
      {
        titre: "Chapitre 2 : Conteneurisation & Intégration Continue",
        lecons: [
          { titre: "2.1 Docker : Images, conteneurs et volumes", duree: "1h 45m", complete: true },
          { titre: "2.2 Création de pipelines CI/CD (GitHub Actions, GitLab CI)", estDerniereEnseignee: true, duree: "2h 00m", complete: true }
        ]
      }
    ],
    ressources: [
      { titre: "Manuel complet de DevOps & CI/CD.pdf", type: "pdf", taille: "12.3 Mo" },
      { titre: "Code template - Pipeline GitHub Actions pour React.yml", type: "code", taille: "12 Ko" },
      { titre: "Vidéo - Démarrer avec Docker en 20 minutes.mp4", type: "video", taille: "45 Mo" }
    ],
    quizzes: [
      {
        question: "Quel est le rôle principal d'un pipeline d'Intégration Continue (CI) ?",
        options: [
          "Héberger les fichiers du site web",
          "Automatiser les tests et la validation du code à chaque modification",
          "Remplacer le travail des développeurs",
          "Surveiller les performances réseau"
        ],
        reponseCorrecte: 1
      },
      {
        question: "Quelle instruction Dockerfile permet de copier des fichiers locaux dans l'image ?",
        options: ["COPY", "ADD_FILE", "MOVE", "PUSH"],
        reponseCorrecte: 0
      }
    ],
    devoirs: [
      { id: "dev-4", titre: "Projet final : Déployer une application Dockerisée via une CI/CD", dateLimite: "Passée (10 Juin 2026)", points: "50 pts", statut: "Soumis" }
    ]
  },
  'course-4': {
    chapitres: [
      {
        titre: "Chapitre 1 : Fondements de la Cybersécurité",
        lecons: [
          { titre: "1.1 Concepts de base (CIA triad, menaces)", duree: "50 min", complete: false },
          { titre: "1.2 Cryptographie symétrique & asymétrique", estDerniereEnseignee: true, duree: "1h 30m", complete: false }
        ]
      },
      {
        titre: "Chapitre 2 : Sécurité Réseau & Web",
        lecons: [
          { titre: "2.1 Protocoles sécurisés (HTTPS, SSH, TLS)", duree: "1h 05m", complete: false },
          { titre: "2.2 OWASP Top 10 et failles web courantes", duree: "1h 40m", complete: false }
        ]
      }
    ],
    ressources: [
      { titre: "Introduction à la Cryptographie Moderne.pdf", type: "pdf", taille: "6.2 Mo" },
      { titre: "Guide de l'ANCD Sénégal - Bonnes pratiques de cybersécurité.pdf", type: "pdf", taille: "3.5 Mo" }
    ],
    quizzes: [
      {
        question: "Que signifie le sigle 'CIA' en sécurité de l'information ?",
        options: [
          "Central Intelligence Agency",
          "Confidentiality, Integrity, Availability",
          "Cloud Infrastructure Architecture",
          "Computer Intrusion Alert"
        ],
        reponseCorrecte: 1
      }
    ],
    devoirs: [
      { id: "dev-5", titre: "Exercice : Déchiffrement et analyse de trames réseau", dateLimite: "Dans 10 jours (05 Juillet 2026)", points: "20 pts", statut: "A rendre" }
    ]
  },
  'course-5': {
    chapitres: [
      {
        titre: "Chapitre 1 : Communication & Trac",
        lecons: [
          { titre: "1.1 Physiologie du trac et techniques de respiration", duree: "30 min", complete: true },
          { titre: "1.2 Communication non-verbal (regard, posture, voix)", estDerniereEnseignee: true, duree: "1h 10m", complete: true }
        ]
      },
      {
        titre: "Chapitre 2 : Structuration du Discours",
        lecons: [
          { titre: "2.1 L'accroche et l'art de raconter une histoire (Storytelling)", duree: "1h 00m", complete: true },
          { titre: "2.2 Clore avec impact et gérer les questions du public", duree: "50 min", complete: true }
        ]
      }
    ],
    ressources: [
      { titre: "Guide de l'art oratoire et de la posture.pdf", type: "pdf", taille: "2.4 Mo" },
      { titre: "Fiche d'exercice : La respiration ventrale.pdf", type: "pdf", taille: "1.1 Mo" }
    ],
    quizzes: [
      {
        question: "Quelle proportion de notre communication est estimée non-verbale lors d'une prise de parole ?",
        options: ["Moins de 10%", "Environ 30%", "Plus de 50%", "Exactement 100%"],
        reponseCorrecte: 2
      }
    ],
    devoirs: [
      { id: "dev-6", titre: "Vidéo d'entraînement : Pitcher son projet de fin d'études en 3 minutes", dateLimite: "Passée (12 Juin 2026)", points: "20 pts", statut: "Soumis" }
    ]
  }
};

export const DEFAULT_COURSE_DETAILS = {
  chapitres: [
    {
      titre: "Chapitre 1 : Introduction générale",
      lecons: [
        { titre: "1.1 Concepts généraux et définitions", duree: "45 min", complete: true },
        { titre: "1.2 Première application pratique", estDerniereEnseignee: true, duree: "1h 00m", complete: false }
      ]
    }
  ],
  ressources: [
    { titre: "Supports de cours de base.pdf", type: "pdf" as const, taille: "2.5 Mo" }
  ],
  quizzes: [
    {
      question: "Quel est l'objectif premier de ce cours ?",
      options: ["Acquérir les bases fondamentales", "Se reposer en amphi", "Rien d'important"],
      reponseCorrecte: 0
    }
  ],
  devoirs: [
    { id: "dev-def", titre: "Exercice de récapitulation générale", dateLimite: "Dans 7 jours", points: "10 pts", statut: "A rendre" as const }
  ]
};
