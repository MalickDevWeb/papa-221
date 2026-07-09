import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CoursItem } from './types';

interface CourseDetailModalProps {
  course: CoursItem;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

const COURSE_DETAILS: Record<string, {
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

const DEFAULT_COURSE_DETAILS = {
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

export function CourseDetailModal({ course, onClose, triggerToast }: CourseDetailModalProps) {
  const details = COURSE_DETAILS[course.id] || DEFAULT_COURSE_DETAILS;

  // Tabs states
  const [activeTab, setActiveTab] = useState<'chapters' | 'resources' | 'quizzes' | 'homework'>('chapters');

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizValidated, setQuizValidated] = useState(false);

  // Homework upload simulation state
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size: string }>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [homeworkStatus, setHomeworkStatus] = useState<Record<string, 'A rendre' | 'Soumis'>>(() => {
    const initial: Record<string, 'A rendre' | 'Soumis'> = {};
    details.devoirs.forEach(dev => {
      initial[dev.id] = dev.statut;
    });
    return initial;
  });

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (quizValidated) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleValidateQuiz = () => {
    if (Object.keys(selectedAnswers).length < details.quizzes.length) {
      triggerToast("Veuillez répondre à toutes les questions avant de valider !");
      return;
    }
    setQuizValidated(true);
    
    // Calculate score
    let correctCount = 0;
    details.quizzes.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.reponseCorrecte) {
        correctCount++;
      }
    });
    
    triggerToast(`Quiz terminé ! Score : ${correctCount}/${details.quizzes.length}`);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizValidated(false);
  };

  const simulateUpload = (homeworkId: string, fileName: string) => {
    if (uploadingId) return;
    setUploadingId(homeworkId);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadedFiles(prev => ({
              ...prev,
              [homeworkId]: { name: fileName, size: "1.4 Mo" }
            }));
            setHomeworkStatus(prev => ({
              ...prev,
              [homeworkId]: 'Soumis'
            }));
            setUploadingId(null);
            triggerToast("Devoir importé et remis avec succès !");
          }, 300);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, homeworkId: string) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(homeworkId, e.target.files[0].name);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#291715]/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="course-workspace-container"
        className="bg-[#FAF9F7] rounded-[32px] w-full max-w-5xl h-[95vh] md:h-[85vh] max-h-[820px] overflow-hidden shadow-2xl border border-neutral-gray-200 flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with course name, category, and close buttons */}
        <div className="relative h-32 md:h-40 bg-neutral-gray-900 shrink-0 select-none">
          <img className="w-full h-full object-cover opacity-60" src={course.image} alt={course.nom} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#291715] via-[#291715]/40 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 bg-black/30 p-2.5 rounded-full transition-all cursor-pointer"
          >
            <span translate="no" className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-0.5 rounded-lg bg-[#E3A857] text-[#291715] text-[10px] font-black uppercase tracking-wider shadow-xs">
                  {course.categorie}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/25 text-white text-[9px] font-black uppercase tracking-wider">
                  {course.volumeHoraire || "30 Heures"}
                </span>
              </div>
              <h4 className="text-xl md:text-2xl font-black leading-tight tracking-tight uppercase drop-shadow-md">
                {course.nom}
              </h4>
            </div>
            
            <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-[10px] font-black uppercase tracking-wider text-white">
                Professeur : <span className="text-[#E3A857]">{course.professeur}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Dual Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Sidebar Area: Course Index & Prof Standing */}
          <div className="w-full md:w-80 bg-white border-r border-neutral-gray-150 flex flex-col overflow-y-auto shrink-0 p-5 space-y-4">
            
            {/* Professor Meta */}
            <div className="bg-[#FAF9F7] rounded-2xl border border-neutral-gray-250 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center text-brand-red-deep shrink-0 border border-brand-red-deep/10">
                  <span translate="no" className="material-symbols-outlined text-[22px]">person_book</span>
                </div>
                <div>
                  <h5 className="font-extrabold text-[#291715] text-xs">Enseignant responsable</h5>
                  <p className="text-[11px] text-neutral-500 font-bold leading-none">{course.professeur}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-neutral-500 pt-2 border-t border-neutral-gray-200/60">
                <div>
                  <span className="block text-neutral-400 text-[8px] uppercase tracking-wider">SALLE</span>
                  <span className="text-[#3f1e1e]">{course.salle || 'En Ligne'}</span>
                </div>
                <div>
                  <span className="block text-neutral-400 text-[8px] uppercase tracking-wider">PROCHAIN COURS</span>
                  <span className="text-[#3f1e1e] truncate block">{course.prochainCours || 'A définir'}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats: Navigation list of Chapters inside the sidebar */}
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-wider text-[#3f1e1e] mb-2.5 px-1 flex items-center gap-1.5">
                <span translate="no" className="material-symbols-outlined text-base">list_alt</span>
                Index des Chapitres ({details.chapitres.length})
              </h5>
              
              <div className="space-y-2">
                {details.chapitres.map((chap, idx) => {
                  const hasActiveLesson = chap.lecons.some(l => l.estDerniereEnseignee);
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all text-left ${
                        hasActiveLesson 
                          ? 'bg-[#FFF8F7] border-brand-red-deep/30 shadow-3xs' 
                          : 'bg-white border-neutral-gray-200/70 hover:bg-[#FAF9F7]'
                      }`}
                    >
                      <h6 className="text-[11px] font-black text-[#291715] line-clamp-1 mb-1.5">
                        {chap.titre}
                      </h6>
                      
                      {/* Sub chapters list */}
                      <div className="space-y-1">
                        {chap.lecons.map((lecon, lIdx) => (
                          <div 
                            key={lIdx}
                            className={`p-2 rounded-xl text-[10px] font-bold flex items-center justify-between gap-1.5 ${
                              lecon.estDerniereEnseignee
                                ? 'bg-[#3f1e1e] text-white'
                                : 'bg-[#FAF9F7]/70 text-neutral-600'
                            }`}
                          >
                            <span className="truncate flex-1">{lecon.titre}</span>
                            
                            {lecon.estDerniereEnseignee ? (
                              <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-[#3f1e1e] text-[8px] font-black uppercase tracking-widest animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B3181C]" />
                                ACTIVE (PROF)
                              </span>
                            ) : lecon.complete ? (
                              <span translate="no" className="material-symbols-outlined text-emerald-500 text-sm shrink-0 font-black">check_circle</span>
                            ) : (
                              <span className="text-[8.5px] font-bold text-neutral-400 shrink-0">{lecon.duree}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro Instruction Help Card */}
            <div className="bg-[#FAF9F7] rounded-2xl p-4 border border-neutral-gray-200 text-[10px] text-neutral-500 font-bold leading-relaxed mt-auto">
              💡 <strong className="text-[#3f1e1e]">Suivi des leçons :</strong> Le repère <span className="bg-[#3f1e1e] text-white px-1 py-0.5 rounded text-[8px] font-black font-mono">ACTIVE (PROF)</span> pointe sur le chapitre où se situe l'enseignant pour vous aider à suivre le syllabus sans encombre.
            </div>

          </div>

          {/* Main Content Workspace Panel */}
          <div className="flex-grow flex flex-col overflow-hidden min-h-0 bg-[#FAF9F7]/30">
            
            {/* Custom Tab Switchers */}
            <div className="flex border-b border-neutral-gray-200 bg-white shrink-0">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`flex-1 py-4 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'chapters'
                    ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'
                }`}
              >
                <span translate="no" className="material-symbols-outlined text-lg">auto_stories</span>
                Détails & Progression
              </button>
              
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 py-4 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'resources'
                    ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'
                }`}
              >
                <span translate="no" className="material-symbols-outlined text-lg">folder_open</span>
                Ressources ({details.ressources.length})
              </button>

              <button
                onClick={() => setActiveTab('quizzes')}
                className={`flex-1 py-4 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'quizzes'
                    ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'
                }`}
              >
                <span translate="no" className="material-symbols-outlined text-lg">quiz</span>
                Quiz Évaluation
              </button>

              <button
                onClick={() => setActiveTab('homework')}
                className={`flex-1 py-4 text-center font-black uppercase tracking-wider text-[10px] sm:text-xs transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'homework'
                    ? 'border-brand-red-deep text-brand-red-deep bg-[#FFF8F7]/30'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-[#FAF9F7]/50'
                }`}
              >
                <span translate="no" className="material-symbols-outlined text-lg">upload_file</span>
                Rendu devoirs
              </button>
            </div>

            {/* Scrollable Work Area */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto min-h-0 space-y-5 no-scrollbar">
              
              {/* TAB 1: DETAILS & LESSONS */}
              {activeTab === 'chapters' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-3">
                    <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
                      <span translate="no" className="material-symbols-outlined text-base">description</span>
                      Description & Objectifs Pédagogiques
                    </h5>
                    <p className="text-xs text-neutral-600 leading-relaxed font-bold">
                      {course.description}
                    </p>
                    <div className="bg-[#FAF9F7] p-3.5 rounded-2xl border border-neutral-gray-200/50 text-[11px] text-neutral-500 font-bold leading-relaxed">
                      L'École 221 encourage l'esprit d'initiative. Pour ce cours hybride, toutes vos ressources sont synchronisées ci-après. Des quizzes d'auto-évaluation et des rendus de travaux dirigés (TD/TP) sont obligatoires pour valider votre certificat.
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-4">
                    <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
                      <span translate="no" className="material-symbols-outlined text-base animate-pulse text-[#B3181C]">emergency</span>
                      Statut d'enseignement en classe
                    </h5>
                    
                    {/* Visual Timeline of where the teacher stands */}
                    <div className="relative border-l-2 border-neutral-gray-200 ml-3.5 pl-6 py-2 space-y-6">
                      {details.chapitres.map((chap, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot indicator */}
                          <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 ${
                            chap.lecons.some(l => l.estDerniereEnseignee)
                              ? 'bg-[#B3181C] border-[#FFF5F5] ring-2 ring-[#B3181C]/20 scale-110'
                              : 'bg-white border-neutral-gray-300'
                          }`} />
                          
                          <div className="space-y-2">
                            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">CHAPITRE {idx + 1}</span>
                            <h6 className="text-xs font-black text-[#291715]">{chap.titre}</h6>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                              {chap.lecons.map((lecon, lIdx) => (
                                <div 
                                  key={lIdx} 
                                  className={`p-3 rounded-2xl border ${
                                    lecon.estDerniereEnseignee
                                      ? 'bg-[#3f1e1e] text-white border-transparent'
                                      : 'bg-neutral-gray-50 border-neutral-gray-150 text-neutral-600'
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-2 mb-1.5">
                                    <span className="text-[10px] font-extrabold leading-snug">{lecon.titre}</span>
                                    {lecon.estDerniereEnseignee && (
                                      <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-[#B3181C] text-[7.5px] font-black uppercase tracking-wider shrink-0">
                                        Cours prof active
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider opacity-90">
                                    <span>Volume : {lecon.duree}</span>
                                    <span>{lecon.complete ? '✅ ACCOMPLI' : lecon.estDerniereEnseignee ? '🚀 EN COURS' : '⏳ A VENIR'}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESOURCES */}
              {activeTab === 'resources' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl">
                    <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span translate="no" className="material-symbols-outlined text-base">cloud_download</span>
                      Supports & Documents Officiels
                    </h5>
                    <p className="text-[10px] text-neutral-500 font-bold mb-4">
                      Documents pédagogiques partagés par votre professeur ({course.professeur}). Cliquez pour les ouvrir.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {details.ressources.map((res, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#FAF9F7] rounded-2xl p-4 border border-neutral-gray-200 hover:border-brand-red-deep/30 hover:shadow-2xs transition-all flex items-center justify-between gap-4 group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              res.type === 'pdf' ? 'bg-red-50 text-red-600 border-red-100' :
                              res.type === 'video' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                              res.type === 'code' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              <span translate="no" className="material-symbols-outlined text-[20px]">
                                {res.type === 'pdf' ? 'picture_as_pdf' :
                                 res.type === 'video' ? 'video_library' :
                                 res.type === 'code' ? 'code' : 'link'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h6 className="text-xs font-extrabold text-[#291715] truncate group-hover:text-brand-red-deep transition-colors">
                                {res.titre}
                              </h6>
                              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                                {res.taille} • {res.type.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => triggerToast(`Ouverture de la ressource : ${res.titre}`)}
                            className="shrink-0 p-2 rounded-xl bg-white border border-neutral-gray-250 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer"
                          >
                            <span translate="no" className="material-symbols-outlined text-[16px]">open_in_new</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex items-start gap-2.5">
                    <span translate="no" className="material-symbols-outlined text-amber-500 text-[18px] shrink-0 mt-0.5">lightbulb</span>
                    <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                      <strong>Tuteur IA Intégré :</strong> Ces ressources sont également lues par votre Tuteur IA. Vous pouvez lui poser des questions ou générer des quiz supplémentaires sur n'importe quel document via le menu latéral principal de l'application !
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: QUIZZES */}
              {activeTab === 'quizzes' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-start gap-3 border-b border-neutral-gray-150 pb-3">
                      <div>
                        <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
                          <span translate="no" className="material-symbols-outlined text-base">quiz</span>
                          Quiz d'Auto-Évaluation
                        </h5>
                        <p className="text-[10px] text-neutral-500 font-bold">
                          Répondez aux questions clés formulées par votre professeur pour évaluer vos connaissances.
                        </p>
                      </div>
                      {quizValidated && (
                        <button 
                          onClick={handleResetQuiz}
                          className="px-3 py-1.5 text-[9px] font-black uppercase bg-[#FAF9F7] border border-neutral-gray-200 text-neutral-500 rounded-xl hover:text-brand-red-deep hover:border-brand-red-deep/40 transition-all"
                        >
                          Réessayer
                        </button>
                      )}
                    </div>

                    <div className="space-y-5">
                      {details.quizzes.map((q, qIdx) => {
                        const selectedOption = selectedAnswers[qIdx];
                        return (
                          <div key={qIdx} className="space-y-2">
                            <h6 className="text-[11px] font-black text-[#291715] flex gap-2">
                              <span>Q{qIdx + 1}.</span>
                              <span>{q.question}</span>
                            </h6>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                              {q.options.map((option, oIdx) => {
                                const isSelected = selectedOption === oIdx;
                                const isCorrect = q.reponseCorrecte === oIdx;
                                
                                let optionStyle = "border-neutral-gray-200/80 bg-neutral-gray-50 text-neutral-700 hover:border-neutral-300";
                                if (isSelected) {
                                  optionStyle = "bg-[#3f1e1e] text-white border-transparent";
                                }

                                if (quizValidated) {
                                  if (isCorrect) {
                                    optionStyle = "bg-emerald-500 text-white border-transparent";
                                  } else if (isSelected) {
                                    optionStyle = "bg-red-500 text-white border-transparent";
                                  } else {
                                    optionStyle = "opacity-40 bg-neutral-100 text-neutral-400 border-neutral-200";
                                  }
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={quizValidated}
                                    onClick={() => handleSelectOption(qIdx, oIdx)}
                                    className={`p-3 rounded-2xl border text-left text-[11px] font-bold transition-all flex justify-between items-center gap-2 ${
                                      !quizValidated ? 'cursor-pointer' : 'cursor-default'
                                    } ${optionStyle}`}
                                  >
                                    <span>{option}</span>
                                    
                                    {quizValidated && isCorrect && (
                                      <span translate="no" className="material-symbols-outlined text-white text-xs shrink-0 font-black">done</span>
                                    )}
                                    {quizValidated && isSelected && !isCorrect && (
                                      <span translate="no" className="material-symbols-outlined text-white text-xs shrink-0 font-black">close</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!quizValidated ? (
                      <div className="pt-3 border-t border-neutral-gray-150 flex justify-end">
                        <button
                          onClick={handleValidateQuiz}
                          className="bg-[#3f1e1e] hover:bg-[#522727] text-white font-black uppercase text-[10px] tracking-wider px-5 py-3 rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all"
                        >
                          Valider mes réponses
                        </button>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-neutral-gray-150 flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-wide bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                        <span className="flex items-center gap-1">
                          <span translate="no" className="material-symbols-outlined text-emerald-500 text-base">workspace_premium</span>
                          Fiche d'exercice validée par l'École 221
                        </span>
                        <span>Score final : {
                          details.quizzes.reduce((acc, q, idx) => acc + (selectedAnswers[idx] === q.reponseCorrecte ? 1 : 0), 0)
                        } / {details.quizzes.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: HOMEWORK */}
              {activeTab === 'homework' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-4">
                    <div>
                      <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
                        <span translate="no" className="material-symbols-outlined text-base">upload_file</span>
                        Remise des Travaux Dirigés (TD/TP)
                      </h5>
                      <p className="text-[10px] text-neutral-500 font-bold">
                        Déposez vos livrables ou devoirs avant la date limite pour que votre professeur puisse les évaluer.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {details.devoirs.map((dev) => {
                        const status = homeworkStatus[dev.id];
                        const uploaded = uploadedFiles[dev.id];
                        
                        return (
                          <div 
                            key={dev.id} 
                            className="bg-[#FAF9F7] rounded-2xl p-4 border border-neutral-gray-250 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-gray-200/60 pb-3">
                              <div>
                                <h6 className="text-xs font-black text-[#291715]">{dev.titre}</h6>
                                <div className="flex flex-wrap gap-2 text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                                  <span>Limite : {dev.dateLimite}</span>
                                  <span>•</span>
                                  <span>Barème : {dev.points}</span>
                                </div>
                              </div>
                              
                              <span className={`self-start sm:self-center text-[9px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${
                                status === 'Soumis'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {status === 'Soumis' ? '🟢 Soumis' : '⏳ À Rendre'}
                              </span>
                            </div>

                            {/* Upload Area / Completed State */}
                            {uploaded ? (
                              <div className="bg-white rounded-xl p-3 border border-neutral-gray-150 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 min-w-0">
                                  <span translate="no" className="material-symbols-outlined text-emerald-500 shrink-0">check_circle</span>
                                  <span className="truncate">{uploaded.name} ({uploaded.size})</span>
                                </div>
                                <button 
                                  onClick={() => {
                                    setUploadedFiles(prev => {
                                      const copy = { ...prev };
                                      delete copy[dev.id];
                                      return copy;
                                    });
                                    setHomeworkStatus(prev => ({ ...prev, [dev.id]: 'A rendre' }));
                                    triggerToast("Soumission de devoir annulée.");
                                  }}
                                  className="text-[9px] font-black text-red-500 hover:underline uppercase tracking-wider"
                                >
                                  Retirer
                                </button>
                              </div>
                            ) : uploadingId === dev.id ? (
                              <div className="bg-white rounded-xl p-4 border border-neutral-gray-150 space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black text-neutral-500 uppercase tracking-wider">
                                  <span>Téléversement du fichier...</span>
                                  <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-neutral-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-brand-red-deep rounded-full duration-100" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-dashed border-neutral-gray-350 p-4 text-center space-y-2 relative hover:bg-neutral-50/50 transition-colors">
                                <input 
                                  type="file"
                                  id={`file-${dev.id}`}
                                  onChange={(e) => handleFileChange(e, dev.id)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <span translate="no" className="material-symbols-outlined text-neutral-400 text-2xl">upload_file</span>
                                <p className="text-[11px] font-bold text-[#291715]">
                                  Glissez-déposez votre fichier ici, ou <span className="text-brand-red-deep underline">parcourez vos fichiers</span>
                                </p>
                                <p className="text-[9px] text-neutral-400 font-bold">
                                  Format supportés : PDF, ZIP, RAR, PNG (Max 15 Mo)
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Panel with status info */}
            <div className="p-4 bg-[#FAF9F7] border-t border-neutral-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-[#3f1e1e] text-[18px]">verified</span>
                <span className="text-[10px] text-neutral-500 font-bold">
                  Syllabus académique certifié par le Secrétariat des Études École 221
                </span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-5 py-3 border border-neutral-gray-300 rounded-2xl font-black uppercase text-[10px] tracking-wider text-neutral-500 hover:bg-white hover:text-[#291715] transition-all cursor-pointer"
                >
                  Fermer l'espace cours
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
