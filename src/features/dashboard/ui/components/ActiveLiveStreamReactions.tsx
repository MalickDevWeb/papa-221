import React from 'react';
import { LiveSession } from '@/features/student/types';

interface ActiveLiveStreamReactionsProps {
  readonly selectedLive: LiveSession;
  readonly sendLiveReaction: (type: string) => void;
}

export function ActiveLiveStreamReactions({ selectedLive, sendLiveReaction }: ActiveLiveStreamReactionsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {(['heart', 'clap', 'like', 'mindblown'] as const).map((rx) => {
        const icons: Record<string, string> = { heart: '❤️', clap: '👏', like: '👍', mindblown: '🧠' };
        return (
          <button 
            key={rx} 
            onClick={() => sendLiveReaction(rx)}
            className="bg-white/5 hover:bg-white/15 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span className="text-sm">{icons[rx]}</span>
            <span className="font-mono text-[9px] font-bold text-neutral-300">{selectedLive.reactions?.[rx] || 0}</span>
          </button>
        );
      })}
    </div>
  );
}
