import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  MessageSquare, 
  User, 
  Brain,
  CheckCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import axios from 'axios';

export function AITutorPanel() {
  const [activeTab, setActiveTab] = useState<'chat' | 'simulateur'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat State
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { 
      sender: 'ai', 
      text: "Bonjour Abdoulaye ! J'ai analysé vos relevés de notes. Vous êtes actuellement à **15.42/20** de moyenne générale. Souhaitez-vous simuler l'impact de vos prochains devoirs ou questions d'examens ?" 
    }
  ]);

  // Simulator State
  const [noteDevoir, setNoteDevoir] = useState<number>(14.5);
  const [noteProjet, setNoteProjet] = useState<number>(16.0);
  const [noteExamen, setNoteExamen] = useState<number>(15.0);
  const [absencesSimulees, setAbsencesSimulees] = useState<number>(1);

  // Math recalculations for simulation
  const coefDevoir = 0.3;
  const coefProjet = 0.3;
  const coefExamen = 0.4;
  const moyenneSimulee = (noteDevoir * coefDevoir) + (noteProjet * coefProjet) + (noteExamen * coefExamen);

  // Attendance simulation calculations (assuming 25 total lectures, 100% start)
  const totalClasses = 25;
  const tauxPresenceSimule = Math.max(50, Math.round(((totalClasses - absencesSimulees) / totalClasses) * 100));

  // Determine standard mention
  let mention = "Sans mention";
  let mentionColor = "text-neutral-500 bg-neutral-100 border-neutral-200/50";
  if (moyenneSimulee >= 16) {
    mention = "Excellent / Très Bien ✔️";
    mentionColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
  } else if (moyenneSimulee >= 14) {
    mention = "Bien ✨";
    mentionColor = "text-amber-600 bg-amber-50 border-amber-100";
  } else if (moyenneSimulee >= 12) {
    mention = "Assez Bien 👍";
    mentionColor = "text-indigo-600 bg-indigo-50 border-indigo-150";
  } else if (moyenneSimulee < 10) {
    mention = "Attention (Rattrapages) ⚠️";
    mentionColor = "text-red-600 bg-red-50 border-red-100";
  }

  const handleApplyPreset = (type: 'ideal' | 'seuil' | 'rattrapage') => {
    if (type === 'ideal') {
      setNoteDevoir(18.5);
      setNoteProjet(19.0);
      setNoteExamen(18.0);
      setAbsencesSimulees(0);
    } else if (type === 'seuil') {
      setNoteDevoir(12.0);
      setNoteProjet(12.0);
      setNoteExamen(11.5);
      setAbsencesSimulees(2);
    } else {
      setNoteDevoir(8.0);
      setNoteProjet(9.5);
      setNoteExamen(9.0);
      setAbsencesSimulees(4);
    }
  };

  const handleResetSimulator = () => {
    setNoteDevoir(14.5);
    setNoteProjet(16.0);
    setNoteExamen(15.0);
    setAbsencesSimulees(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMsg = prompt.trim();
    const updatedLog = [
      ...chatLog, 
      { sender: 'user' as const, text: userMsg }
    ];
    setChatLog(updatedLog);
    setPrompt("");
    setIsLoading(true);

    try {
      // Map chat log format to API role format
      const history = chatLog.map(log => ({
        role: log.sender === 'ai' ? 'model' as const : 'user' as const,
        text: log.text
      }));

      const response = await axios.post('/api/student/tutor/chat', {
        message: userMsg,
        history: history
      });

      if (response.data && response.data.text) {
        setChatLog(prev => [...prev, { sender: 'ai' as const, text: response.data.text }]);
      } else {
        throw new Error("Format de réponse inconnu");
      }
    } catch (error) {
      console.error("Error with backend AI Tutor panel:", error);
      // Fallback local clever message
      setTimeout(() => {
        let aiResponse = "";
        if (userMsg.toLowerCase().includes('simul') || userMsg.toLowerCase().includes('note') || userMsg.toLowerCase().includes('calcul')) {
          aiResponse = `D'après mes simulations d'algorithmes, si vous visez une moyenne générale supérieure à **16/20** ("Excellent"), vous devez impérativement obtenir au moins **16.5/20** à l'examen final de Machine Learning Foundations (coefficient 0.4). Utilisez l'onglet **SIMULATEUR** pour tester d'autres coefficients.`;
        } else if (userMsg.toLowerCase().includes('absence') || userMsg.toLowerCase().includes('présence') || userMsg.toLowerCase().includes('assiduité')) {
          aiResponse = `Le règlement des examens impose un taux d'assiduité minimal de **90%** (soit maximum **2 absences** non justifiées par semestre). Avec vos ${absencesSimulees} absences actuelles simulées, vous restez à **${tauxPresenceSimule}%**. Attention à ne pas dépasser le seuil d'avertissement automatique !`;
        } else {
          aiResponse = `Je vous conseille de concentrer vos efforts sur le prochain projet de groupe d'Ingénierie Logicielle (Scolarité Coef 0.3). Une note de **17/20** sur ce projet sécurisera définitivement votre mention "Bien" pour ce trimestre ! Renseignez-la dans le simulateur ci-dessus.`;
        }
        setChatLog(prev => [...prev, { sender: 'ai' as const, text: aiResponse }]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-tutor-assistant" className="col-span-12 lg:col-span-4 bg-white/90 backdrop-blur-md border border-neutral-gray-250 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[450px]">
      
      {/* Dynamic Header */}
      <div className="shrink-0 space-y-3">
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span translate="no" className="material-symbols-outlined text-[#B3181C]">smart_toy</span>
            <h3 className="font-black text-xs text-[#291715] tracking-tight uppercase whitespace-nowrap">Conseiller Académique IA</h3>
          </div>
          
          <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 select-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Simulation Connectée
          </span>
        </div>

        {/* Tab Selector: Diagnostic Chat vs Simulation Engine */}
        <div className="flex bg-[#FAF8F6] p-1 rounded-xl border border-neutral-200/60 select-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1 flex items-center justify-center gap-1.5 font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-[#B3181C] shadow-xs border border-neutral-250/20'
                : 'text-neutral-400 hover:text-[#291715]'
            }`}
          >
            <MessageSquare className="h-3 w-3" />
            Conseils IA
          </button>
          
          <button
            onClick={() => setActiveTab('simulateur')}
            className={`flex-1 py-1 flex items-center justify-center gap-1.5 font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'simulateur'
                ? 'bg-white text-[#B3181C] shadow-xs border border-neutral-250/20'
                : 'text-neutral-400 hover:text-[#291715]'
            }`}
          >
            <Sliders className="h-3 w-3 animate-spin-slow" />
            Simulateur
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow mt-3 overflow-y-auto no-scrollbar relative min-h-0 pl-0.5">
        
        {/* Tab 1: AI Advisor Chat Log */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col justify-between gap-2">
            
            {/* Scrollable logs list */}
            <div className="flex-grow space-y-2.5 overflow-y-auto pr-1 text-xs no-scrollbar select-none max-h-[224px]">
              {chatLog.map((log, i) => (
                <div 
                  key={i} 
                  className={`flex gap-2 items-start ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {log.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-[#B3181C]/5 flex items-center justify-center shrink-0 border border-[#B3181C]/10">
                      <Brain className="h-3.5 w-3.5 text-[#B3181C]" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[10.5px] font-bold leading-relaxed border ${
                      log.sender === 'user'
                        ? 'bg-[#291715] text-white border-transparent rounded-tr-none'
                        : 'bg-[#FAF8F6] text-neutral-800 border-neutral-200/50 rounded-tl-none'
                    }`}
                  >
                    {log.text}
                  </div>
                  
                  {log.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 border border-neutral-300">
                      <User className="h-3.5 w-3.5 text-neutral-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-start justify-start">
                  <div className="w-6 h-6 rounded-full bg-[#B3181C]/5 flex items-center justify-center shrink-0 border border-[#B3181C]/10">
                    <Brain className="h-3.5 w-3.5 text-[#B3181C] animate-bounce" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2 bg-[#FAF8F6] text-neutral-500 border border-neutral-200/50 rounded-tl-none text-[10px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3181C] animate-ping" />
                    Tuteur IA réfléchit...
                  </div>
                </div>
              )}
            </div>

            {/* Micro Quick Suggestion Tags */}
            <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar select-none">
              <button 
                onClick={() => { setPrompt("Comment passer de 15.4 à 16.5 de moyenne ?"); }}
                className="shrink-0 text-[8.5px] font-black uppercase tracking-wider bg-neutral-50 border border-neutral-200/60 rounded-lg px-2.5 py-1 text-neutral-500 hover:text-[#B3181C] hover:border-[#B3181C]/25 transition-all cursor-pointer"
              >
                Cible Examen 🎯
              </button>
              <button 
                onClick={() => { setPrompt("Que se passe-t-il si je rate le Devoir 2 ?"); }}
                className="shrink-0 text-[8.5px] font-black uppercase tracking-wider bg-neutral-50 border border-neutral-200/60 rounded-lg px-2.5 py-1 text-neutral-500 hover:text-[#B3181C] hover:border-[#B3181C]/25 transition-all cursor-pointer"
              >
                Simulation Échec ⚠️
              </button>
              <button 
                onClick={() => { setPrompt("Calculer mon assiduité de fin d'année"); }}
                className="shrink-0 text-[8.5px] font-black uppercase tracking-wider bg-neutral-50 border border-neutral-200/60 rounded-lg px-2.5 py-1 text-neutral-500 hover:text-[#B3181C] hover:border-[#B3181C]/25 transition-all cursor-pointer"
              >
                Objectif Présence 📅
              </button>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSubmit} className="relative mt-1 shrink-0">
              <input 
                className="w-full pl-3 pr-10 py-2.5 bg-neutral-50 border border-neutral-gray-200 rounded-xl text-xs font-semibold focus:border-brand-red-deep focus:outline-none placeholder-neutral-400" 
                placeholder="Simuler une note à l'écrit..." 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#B3181C] text-white rounded-lg active:scale-95 duration-100 hover:opacity-90 cursor-pointer flex items-center justify-center">
                <span translate="no" className="material-symbols-outlined text-xs font-black">send</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Interactive Simulation Engine */}
        {activeTab === 'simulateur' && (
          <div className="h-full flex flex-col justify-between gap-3 text-xs">
            
            {/* Quick Presets container */}
            <div className="flex items-center justify-between gap-1 select-none shrink-0 border-b border-neutral-200/50 pb-2">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#E3A857]" /> Autopilote IA
              </span>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => handleApplyPreset('ideal')}
                  className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-all"
                >
                  Excellent
                </button>
                <button 
                  onClick={() => handleApplyPreset('seuil')}
                  className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-all"
                >
                  Seuil
                </button>
                <button 
                  onClick={() => handleApplyPreset('rattrapage')}
                  className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase bg-red-50 text-red-600 border border-red-200 cursor-pointer hover:bg-red-100 transition-all"
                >
                  Risque
                </button>
              </div>
            </div>

            {/* Realtime computed indicators banner */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              
              {/* Simulated Grade block */}
              <div className="p-2.5 rounded-xl bg-[#FAF8F6] border border-neutral-200/50 flex flex-col gap-0.5 relative overflow-hidden select-none">
                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider">Moyenne Estimée</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-[#291715]">{moyenneSimulee.toFixed(2)}</span>
                  <span className="text-[8.5px] font-bold text-neutral-400">/ 20</span>
                </div>
                <span className={`absolute right-1.5 bottom-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase border tracking-wider leading-none ${mentionColor}`}>
                  {mention}
                </span>
              </div>

              {/* Simulated Attendance block */}
              <div className="p-2.5 rounded-xl bg-[#FAF8F6] border border-neutral-200/50 flex flex-col gap-0.5 relative overflow-hidden select-none">
                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider">Taux de Présence</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-[#291715]">{tauxPresenceSimule}</span>
                  <span className="text-[8.5px] font-bold text-neutral-400">%</span>
                </div>
                {tauxPresenceSimule >= 90 ? (
                  <span className="absolute right-1.5 bottom-1.5 text-emerald-500 flex items-center gap-0.5 text-[8.5px] font-black uppercase">
                    <CheckCircle className="h-3 w-3" /> Validé
                  </span>
                ) : (
                  <span className="absolute right-1.5 bottom-1.5 text-[#B3181C] flex items-center gap-0.5 text-[8.5px] font-black uppercase animate-pulse">
                    <AlertTriangle className="h-3 w-3" /> Exclu
                  </span>
                )}
              </div>

            </div>

            {/* Sliders Area */}
            <div className="flex-grow space-y-2 overflow-y-auto no-scrollbar max-h-[140px]">
              
              {/* Note Devoir */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-neutral-600">
                  <span className="flex items-center gap-1 text-[#291715] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3181C]" />
                    Devoirs Continus (Coef {coefDevoir})
                  </span>
                  <span className="font-black text-brand-red-deep bg-[#FFF5F5] px-1.5 py-0.5 rounded">{noteDevoir.toFixed(1)} / 20</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={noteDevoir}
                  onChange={(e) => setNoteDevoir(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#B3181C]"
                />
              </div>

              {/* Note Projet */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-neutral-600">
                  <span className="flex items-center gap-1 text-[#291715] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E3A857]" />
                    Projet Trimestriel (Coef {coefProjet})
                  </span>
                  <span className="font-black text-[#E3A857] bg-[#FFF9F2] px-1.5 py-0.5 rounded">{noteProjet.toFixed(1)} / 20</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={noteProjet}
                  onChange={(e) => setNoteProjet(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#E3A857]"
                />
              </div>

              {/* Note Examen */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-neutral-600">
                  <span className="flex items-center gap-1 text-[#291715] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Examen Final S1 (Coef {coefExamen})
                  </span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{noteExamen.toFixed(1)} / 20</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={noteExamen}
                  onChange={(e) => setNoteExamen(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Assiduité (Absences) */}
              <div className="space-y-1 pb-1">
                <div className="flex justify-between text-[10px] font-bold text-neutral-600">
                  <span className="flex items-center gap-1 text-[#291715] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Absences simulées (sur 25)
                  </span>
                  <span className={`font-black px-1.5 py-0.5 rounded ${absencesSimulees > 2 ? 'text-red-600 bg-red-50' : 'text-purple-600 bg-purple-50'}`}>
                    {absencesSimulees} {absencesSimulees > 1 ? 'absences' : 'absence'}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={absencesSimulees}
                  onChange={(e) => setAbsencesSimulees(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

            </div>

            {/* Bottom tools action bar - Reset simulation */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between select-none shrink-0">
              <span className="text-[8.5px] font-bold text-neutral-400">
                Pondération officielle École 221
              </span>
              <button
                onClick={handleResetSimulator}
                className="flex items-center gap-1 text-[#B3181C] hover:opacity-85 text-[9px] font-black uppercase tracking-wider cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Réinitialiser
              </button>
            </div>

          </div>
        )}

      </div>

    </section>
  );
}
