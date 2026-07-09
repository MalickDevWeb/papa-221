import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Brain, 
  Send, 
  BookOpen, 
  Zap, 
  HelpCircle, 
  RefreshCw,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const LOCAL_STORAGE_KEY = 'mon_ecole_ai_tutor_history_v2';

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'model',
    text: "Bonjour Abdoulaye ! Je suis votre **Tuteur IA de l'École 221**. Je connais l'ensemble de votre dossier académique et de vos cours.\n\nJe suis conçu pour vous aider dans **tous les domaines** :\n- **Comprendre ce que vous ne maîtrisez pas** (ex : expliquer un concept, décortiquer un bout de code).\n- **Savoir quoi apprendre en priorité** pour optimiser votre temps de révision.\n- **Obtenir des fiches de synthèse**, des astuces de réussite ou des exercices d'entraînement.\n\nQuel sujet ou cours souhaitez-vous aborder aujourd'hui ?"
  }
];

export function StudentTutorPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse AI Tutor chat history:", e);
      }
    }
    return INITIAL_MESSAGES;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const coursesList = [
    {
      id: 'mobile',
      name: 'Programmation Mobile S1',
      code: 'INF-301',
      professor: 'M. Aly Niang',
      difficulty: 'Élevée',
      tips: 'Concentrez-vous sur le State Hoisting en Jetpack Compose, les Coroutines Kotlin pour les tâches asynchrones, et la navigation multi-écrans.',
      toLearn: '1. Cycle de vie Compose\n2. Flow & StateFlow\n3. SQLite / Room'
    },
    {
      id: 'ml',
      name: 'Machine Learning Foundations',
      code: 'INF-304',
      professor: 'Pr. Cheikh Anta',
      difficulty: 'Très Élevée',
      tips: 'Maîtrisez la régression logistique, le compromis Biais-Variance, la descente de gradient, et la validation croisée (K-Fold).',
      toLearn: '1. Cost functions & Optimization\n2. Classification vs Régression\n3. Surapprentissage (Overfitting)'
    },
    {
      id: 'web',
      name: 'Ingénierie Logicielle / Web',
      code: 'INF-302',
      professor: 'Scolarité Master GL',
      difficulty: 'Moyenne',
      tips: 'Comprenez bien les architectures MVC et REST, la gestion des sessions utilisateurs sécurisées (JWT) et le déploiement Cloud.',
      toLearn: '1. API RESTful design\n2. Middlewares Express\n3. ORM Drizzle & SQL'
    },
    {
      id: 'bdd',
      name: 'Bases de Données Avancées',
      code: 'INF-303',
      professor: 'Dr. Aly Niang',
      difficulty: 'Moyenne',
      tips: 'Pratiquez l\'optimisation de requêtes avec des index, les transactions ACID, et la conception de schémas normalisés (3NF).',
      toLearn: '1. Indexation B-Tree\n2. Transactions & Locks\n3. NoSQL vs SQL'
    }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/student/tutor/chat', {
        message: userMsg,
        history: messages
      });

      if (response.data && response.data.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.data.text }]);
      } else {
        throw new Error("Format de réponse inconnu");
      }
    } catch (error) {
      console.error("Error communicating with AI tutor:", error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          text: "Désolé, je rencontre des difficultés de connexion avec le serveur cérébral Gemini de l'École 221. Voici une fiche mémo rapide :\n\nPour vos révisions de **Machine Learning**, révisez impérativement la différence entre le Surapprentissage (Overfitting) et le Sous-apprentissage (Underfitting) !" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const askAboutCourse = (courseName: string, type: 'apprendre' | 'comprendre' | 'astuces') => {
    let query: string;
    if (type === 'apprendre') {
      query = `Que dois-je apprendre en priorité pour réussir le cours de "${courseName}" ? Donne-moi un plan d'action précis.`;
    } else if (type === 'comprendre') {
      query = `Je ne comprends pas bien certains concepts du cours de "${courseName}". Peux-tu m'expliquer les points les plus difficiles de manière super simple avec des exemples concrets ?`;
    } else {
      query = `Donne-moi des astuces de révision, fiches mémo et méthodologies d'excellence pour valider avec 18/20 la matière "${courseName}".`;
    }
    handleSend(query);
  };

  const clearChat = () => {
    if (window.confirm("Voulez-vous vraiment effacer l'historique de discussion avec le Tuteur IA ?")) {
      setMessages([
        {
          role: 'model',
          text: "Discussion réinitialisée ! Quel autre domaine ou cours de l'École 221 souhaitez-vous approfondir ?"
        }
      ]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 md:p-6 lg:p-8 flex flex-col h-[calc(100vh-70px)] md:h-screen overflow-hidden"
    >
      {/* Dynamic Upper Banner */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span translate="no" className="material-symbols-outlined text-[#3f1e1e] text-[28px]">smart_toy</span>
            <h1 className="text-2xl font-black text-[#291715] tracking-tight uppercase">Tuteur IA Personnel</h1>
          </div>
          <p className="text-xs font-semibold text-secondary">
            Conseiller pédagogique interactif et expert d'étude personnalisé pour l'École 221
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-gray-250 text-[#3f1e1e] text-xs font-black uppercase tracking-wider rounded-2xl hover:bg-[#FAF9F7] active:scale-95 transition-all shadow-3xs cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Réinitialiser
          </button>
          <div className="bg-[#3f1e1e] text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-[#3f1e1e]/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Gemini 3.5 Active
          </div>
        </div>
      </div>

      {/* Dual Pane Workspace */}
      <div className="flex-grow grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Pane: Interactive Study Helper Side Rail */}
        <div className="hidden lg:flex lg:col-span-4 bg-white border border-neutral-gray-250 rounded-3xl flex-col overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-gray-150 bg-[#FAF9F7] shrink-0">
            <h2 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-[#3f1e1e]" /> Fiches de synthèse des cours
            </h2>
            <p className="text-[11px] text-secondary font-bold leading-relaxed">
              Cliquez sur les actions rapides ci-dessous pour ordonner au tuteur d'analyser ou de vous tester instantanément sur chaque matière.
            </p>
          </div>

          <div className="flex-grow overflow-y-auto p-5 space-y-4 no-scrollbar">
            {coursesList.map((course) => (
              <div 
                key={course.id}
                className="bg-[#FAF9F7] rounded-2xl border border-neutral-gray-200 p-4 space-y-3 hover:border-[#3f1e1e]/40 transition-all hover:shadow-2xs group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-0.5">{course.code} • Prof. {course.professor.split(' ').pop()}</span>
                    <h3 className="font-extrabold text-xs text-[#291715] group-hover:text-[#3f1e1e] transition-colors">{course.name}</h3>
                  </div>
                  <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                    course.difficulty === 'Très Élevée' ? 'bg-red-50 text-red-600 border-red-100' :
                    course.difficulty === 'Élevée' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-neutral-gray-200/55">
                  <div className="flex items-start gap-1.5">
                    <Zap className="h-4 w-4 text-[#E3A857] shrink-0 mt-0.5" />
                    <p className="text-[10px] font-semibold text-neutral-600 leading-relaxed italic">
                      "{course.tips}"
                    </p>
                  </div>
                </div>

                {/* Micro CTA Actions */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => askAboutCourse(course.name, 'apprendre')}
                    className="py-2 px-1 text-center text-[8.5px] font-black uppercase tracking-wider bg-white border border-neutral-gray-200 text-neutral-500 rounded-xl hover:text-[#3f1e1e] hover:border-[#3f1e1e]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-[#3f1e1e]" />
                    Priorités
                  </button>
                  <button
                    onClick={() => askAboutCourse(course.name, 'comprendre')}
                    className="py-2 px-1 text-center text-[8.5px] font-black uppercase tracking-wider bg-white border border-neutral-gray-200 text-neutral-500 rounded-xl hover:text-[#3f1e1e] hover:border-[#3f1e1e]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
                    S'exercer
                  </button>
                  <button
                    onClick={() => askAboutCourse(course.name, 'astuces')}
                    className="py-2 px-1 text-center text-[8.5px] font-black uppercase tracking-wider bg-white border border-neutral-gray-200 text-neutral-500 rounded-xl hover:text-[#3f1e1e] hover:border-[#3f1e1e]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    Astuces
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-[#FAF9F7] border-t border-neutral-gray-150 text-[11px] font-bold text-[#3f1e1e]/90 flex items-center gap-2">
            <span translate="no" className="material-symbols-outlined text-[#3f1e1e] text-[18px]">workspace_premium</span>
            <span>Conseil d'étude : Abdoulaye, augmentez de 5% votre temps sur le Machine Learning S1.</span>
          </div>
        </div>

        {/* Right Pane: Main chat system interface */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-neutral-gray-250 rounded-3xl flex flex-col overflow-hidden shadow-xs h-full">
          
          {/* Active Logs Viewport */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4 no-scrollbar bg-[#FAF9F7]/30">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-3.5 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-9 h-9 rounded-xl bg-[#3f1e1e]/10 flex items-center justify-center shrink-0 border border-[#3f1e1e]/15">
                    <Brain className="h-5 w-5 text-[#3f1e1e]" />
                  </div>
                )}

                <div 
                  className={`max-w-[85%] rounded-[24px] p-4 text-xs font-bold leading-relaxed shadow-3xs border ${
                    msg.role === 'user'
                      ? 'bg-[#3f1e1e] text-white border-transparent rounded-tr-none'
                      : 'bg-white text-neutral-850 border-neutral-gray-200/70 rounded-tl-none'
                  }`}
                >
                  <div className="space-y-2">
                    {msg.text.split('\n').map((line, i) => {
                      // Format bold markdown
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      const parts: React.ReactNode[] = [];
                      let lastIdx = 0;
                      let match;

                      while ((match = boldRegex.exec(line)) !== null) {
                        if (match.index > lastIdx) {
                          parts.push(line.substring(lastIdx, match.index));
                        }
                        parts.push(<strong key={match.index} className="font-extrabold text-[#3f1e1e] bg-amber-100/60 px-1 rounded">{match[1]}</strong>);
                        lastIdx = boldRegex.lastIndex;
                      }
                      if (lastIdx < line.length) {
                        parts.push(line.substring(lastIdx));
                      }

                      if (line.startsWith('```') || line.endsWith('```')) {
                        return null; // Ignore formatting delimiters locally
                      }

                      return (
                        <p key={i} className="leading-relaxed">
                          {parts.length > 0 ? parts : line}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-gray-200">
                    <span className="material-symbols-outlined text-neutral-600 text-[20px]">person</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3.5 items-start justify-start">
                <div className="w-9 h-9 rounded-xl bg-[#3f1e1e]/5 flex items-center justify-center shrink-0 border border-[#3f1e1e]/15">
                  <Brain className="h-5 w-5 text-[#3f1e1e] animate-bounce" />
                </div>
                <div className="bg-white text-neutral-500 border border-neutral-gray-200/50 rounded-[24px] rounded-tl-none p-4 text-xs font-bold flex items-center gap-2.5 shadow-3xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f1e1e] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f1e1e] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f1e1e] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] ml-1 text-secondary font-black uppercase tracking-wider">Le tuteur IA école 221 formule une réponse...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Hub */}
          <div className="px-4 py-3 bg-white border-t border-neutral-gray-150 flex gap-2.5 overflow-x-auto no-scrollbar shrink-0 select-none">
            <button 
              onClick={() => handleSend("Comment organiser mes révisions pour valider tous mes cours avec brio ?")}
              className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-[#FAF9F7] border border-neutral-gray-200 rounded-2xl px-4 py-2 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-3xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Plan d'étude optimal 📅
            </button>
            <button 
              onClick={() => handleSend("Donne-moi 3 astuces d'apprentissage pour mieux retenir les cours d'ingénierie logicielle.")}
              className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-[#FAF9F7] border border-neutral-gray-200 rounded-2xl px-4 py-2 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-3xs"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Mémorisation rapide 💡
            </button>
            <button 
              onClick={() => handleSend("Crée-moi un petit quiz rapide de 3 questions sur le Machine Learning S1 pour m'entraîner.")}
              className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-[#FAF9F7] border border-neutral-gray-200 rounded-2xl px-4 py-2 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-3xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-indigo-500" /> Quiz ML interactif 🧠
            </button>
          </div>

          {/* Form Action Area */}
          <div className="p-4 md:p-5 bg-white border-t border-neutral-gray-150 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-center gap-3"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez n'importe quelle question académique, cours, astuces ou priorités de révision..." 
                className="flex-grow bg-[#FAF9F7] border border-neutral-gray-200 rounded-2xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#3f1e1e] focus:bg-white text-[#291715] placeholder-neutral-400/80 transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#3f1e1e] hover:bg-[#522727] text-white p-3.5 rounded-2xl transition-all shadow-md active:scale-95 duration-100 disabled:opacity-40 disabled:scale-100 shrink-0 cursor-pointer flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </motion.main>
  );
}
