import React from 'react';
import { Sparkles, Lightbulb, MessageSquare } from 'lucide-react';

interface QuickPromptsProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function QuickPrompts({ onSend, disabled }: QuickPromptsProps) {
  return (
    <div className="px-4 py-3 bg-white border-t border-neutral-gray-150 flex gap-2.5 overflow-x-auto no-scrollbar shrink-0 select-none" id="quick-prompts">
      <button 
        onClick={() => onSend("Comment organiser mes révisions pour valider tous mes cours avec brio ?")}
        disabled={disabled}
        className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-[#FAF9F7] border border-neutral-gray-200 rounded-2xl px-4 py-2 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-3xs disabled:opacity-50"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Plan d'étude optimal 📅
      </button>
      <button 
        onClick={() => onSend("Donne-moi 3 astuces d'apprentissage pour mieux retenir les cours d'ingénierie logicielle.")}
        disabled={disabled}
        className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-[#FAF9F7] border border-neutral-gray-200 rounded-2xl px-4 py-2 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-3xs disabled:opacity-50"
      >
        <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Mémorisation rapide 💡
      </button>
      <button 
        onClick={() => onSend("Crée-moi un petit quiz rapide de 3 questions sur mes cours actuels pour m'entraîner.")}
        disabled={disabled}
        className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-[#FAF9F7] border border-neutral-gray-200 rounded-2xl px-4 py-2 text-neutral-500 hover:text-[#3f1e1e] hover:border-[#3f1e1e]/40 transition-all cursor-pointer flex items-center gap-1.5 hover:shadow-3xs disabled:opacity-50"
      >
        <MessageSquare className="h-3.5 w-3.5 text-indigo-500" /> Quiz d'entraînement 🧠
      </button>
    </div>
  );
}
