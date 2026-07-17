import React from 'react';
import { LiveSession, ChatMessage } from '@/features/student/types';

interface ActiveLiveChatProps {
  selectedLive: LiveSession;
  chatInput: string;
  setChatInput: (val: string) => void;
  onSendChat: (e: React.FormEvent) => void;
}

export function ActiveLiveChat({
  selectedLive,
  chatInput,
  setChatInput,
  onSendChat
}: ActiveLiveChatProps) {
  return (
    <div className="md:col-span-4 bg-white border-l border-neutral-gray-200 flex flex-col justify-between h-[380px] md:h-full max-h-[420px] md:max-h-full">
      {/* Thread Header details */}
      <div className="p-4 border-b border-neutral-gray-150 shrink-0 bg-neutral-50/50">
        <h4 className="font-black text-xs text-[#291715] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-ping shrink-0" />
          Fil de Discussion Clavardage
        </h4>
        <p className="text-[10px] text-neutral-gray-400 font-bold">Interactions en direct du groupe d'étudiants</p>
      </div>

      {/* Scrollable messages history */}
      <div className="flex-grow p-4 space-y-3.5 overflow-y-auto bg-neutral-50/30">
        {selectedLive.chatMessages?.map((msg: ChatMessage) => (
          <div key={msg.id} className="flex flex-col text-xs leading-relaxed max-w-full">
            <div className="flex items-center justify-between select-none mb-0.5">
              <span className={`font-black text-[10px] ${msg.isTeacher ? 'text-brand-red-deep' : 'text-[#291715]'}`}>
                {msg.user} {msg.isTeacher && '🎓'}
              </span>
              <span className="text-[8.5px] text-neutral-400 font-semibold">{msg.timestamp}</span>
            </div>
            <p className={`p-2 rounded-xl text-[11px] font-medium break-words ${
              msg.isTeacher 
                ? 'bg-brand-red-light text-brand-red-deep border border-[#B3181C]/10' 
                : 'bg-white border border-neutral-gray-250 text-on-surface'
            }`}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Chat writing input board prompt */}
      <form onSubmit={onSendChat} className="p-3 border-t border-neutral-gray-150 bg-white flex gap-1.5 shrink-0">
        <input 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Votre message live..."
          type="text" 
          className="flex-grow text-xs border border-neutral-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-red-deep bg-neutral-50 font-medium"
        />
        <button 
          type="submit"
          className="bg-brand-red-deep hover:bg-brand-red-deep/90 text-white rounded-xl p-2.5 shadow-sm active:scale-95 duration-100 flex items-center justify-center shrink-0"
        >
          <span className="material-symbols-outlined text-sm font-bold">send</span>
        </button>
      </form>
    </div>
  );
}
