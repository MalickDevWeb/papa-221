import React, { useState } from 'react';
import { ExtendedCandidate } from '@/features/admin/domain/AdmissionsExtendedModels';
import { getAdmissionsDb, saveAdmissionsDb, Message } from './admissionsDb';

interface Props {
  candidate: ExtendedCandidate;
}

export function CandidateMessagingTab({ candidate }: Props) {
  const [activeChannel, setActiveChannel] = useState<'SECRETAIRE' | 'ADMIN'>('ADMIN');
  const [inputText, setInputText] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>(() => {
    const db = getAdmissionsDb();
    // Filtre les messages correspondants à ce candidat
    const filtered = db.messages.filter(m => m.id.startsWith(`msg-${candidate.id}-`));
    if (filtered.length === 0) {
      // Message de bienvenue initial automatique
      return [
        {
          id: `msg-${candidate.id}-init`,
          sender: 'Service Admissions (Mme Diop)',
          text: `Bonjour ${candidate.name}, nous avons bien reçu votre demande d'admission. Avez-vous besoin d'aide pour compléter vos documents ?`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          role: 'ADMIN'
        }
      ];
    }
    return filtered;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `msg-${candidate.id}-${Date.now()}`,
      sender: candidate.name,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      role: 'CANDIDAT'
    };

    const updated = [...allMessages, newMessage];
    setAllMessages(updated);
    setInputText('');

    // Sauvegarde en DB
    const db = getAdmissionsDb();
    const otherCandidateMessages = db.messages.filter(m => !m.id.startsWith(`msg-${candidate.id}-`));
    saveAdmissionsDb({ messages: [...otherCandidateMessages, ...updated] });

    // Réponse automatique simulée pro après 800ms !
    setTimeout(() => {
      const reply: Message = {
        id: `msg-${candidate.id}-${Date.now()}-reply`,
        sender: activeChannel === 'ADMIN' ? 'Service Admissions' : 'Secrétariat Général',
        text: `Nous avons bien reçu votre message : "${inputText.trim()}". Notre équipe examine actuellement les pièces de votre dossier d'admission.`,
        timestamp: new Date().toISOString(),
        role: activeChannel
      };
      const finalMsgs = [...updated, reply];
      setAllMessages(finalMsgs);
      saveAdmissionsDb({ messages: [...otherCandidateMessages, ...finalMsgs] });
    }, 800);
  };

  return (
    <div className="space-y-4 animate-fade-in text-xs font-bold text-neutral-600 flex flex-col h-[400px]" id="candidate-messaging-tab">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h4 className="font-extrabold text-[#1E293B]">Messagerie Administrative</h4>
          <p className="text-[10px] text-neutral-400">Échangez de manière sécurisée avec nos équipes pédagogiques.</p>
        </div>
        <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
          <button onClick={() => setActiveChannel('ADMIN')} className={`px-2.5 py-1 text-[9px] font-black uppercase rounded ${activeChannel === 'ADMIN' ? 'bg-white text-[#B3181C] shadow-sm' : 'text-neutral-500'}`}>Admissions</button>
          <button onClick={() => setActiveChannel('SECRETAIRE')} className={`px-2.5 py-1 text-[9px] font-black uppercase rounded ${activeChannel === 'SECRETAIRE' ? 'bg-white text-[#B3181C] shadow-sm' : 'text-neutral-500'}`}>Secrétariat</button>
        </div>
      </div>

      {/* Message Timeline box */}
      <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-2xl p-4 overflow-y-auto space-y-3 min-h-0 no-scrollbar">
        {allMessages.map((m, idx) => {
          const isMe = m.role === 'CANDIDAT';
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[80%] rounded-2xl p-3 shadow-xs space-y-1 ${isMe ? 'bg-[#B3181C] text-white' : 'bg-white text-neutral-600 border border-neutral-200'}`}>
                <div className="flex justify-between gap-6 text-[9px] font-black uppercase opacity-75">
                  <span>{m.sender}</span>
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[11px] leading-relaxed font-semibold">{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Send Message Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
        <input
          required
          type="text"
          placeholder="Rédiger votre question ou réponse ici..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="flex-1 h-11 bg-white border border-neutral-200 rounded-xl px-3.5 outline-none font-semibold text-xs text-[#1E293B] focus:border-[#B3181C]"
        />
        <button type="submit" className="px-4 bg-[#B3181C] hover:bg-[#8F1316] text-white rounded-xl uppercase font-black tracking-wider text-[10px] cursor-pointer flex items-center gap-1.5 transition-all">
          <span translate="no" className="material-symbols-outlined text-xs">send</span>
          <span>Envoyer</span>
        </button>
      </form>
    </div>
  );
}
