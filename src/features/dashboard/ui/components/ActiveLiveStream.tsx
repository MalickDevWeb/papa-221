import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { LiveSession } from '@/features/student/types';
import { ActiveLiveChat } from './ActiveLiveChat';
import { LiveSlideViewer } from './LiveSlideViewer';
import { RealTimeMeetRoom } from './RealTimeMeetRoom';
import { ActiveLiveHeader } from './ActiveLiveHeader';
import { ActiveLiveStreamReactions } from './ActiveLiveStreamReactions';

interface ActiveLiveStreamProps {
  readonly selectedLive: LiveSession;
  readonly onQuit: () => void;
  readonly sendLiveReaction: (type: string) => void;
  readonly chatInput: string;
  readonly setChatInput: (val: string) => void;
  readonly onSendChat: (e: React.FormEvent) => void;
  readonly triggerToast: (msg: string) => void;
  readonly userName?: string;
}

export function ActiveLiveStream({
  selectedLive,
  onQuit,
  sendLiveReaction,
  chatInput,
  setChatInput,
  onSendChat,
  triggerToast,
  userName
}: ActiveLiveStreamProps) {
  // Toggle between 'slides' (diapositives) and 'meet' (visioconférence)
  const [mode, setMode] = useState<'slides' | 'meet'>('meet');

  return (
    <div className="bg-white border border-neutral-gray-200 rounded-3xl overflow-hidden shadow-xl mb-8 flex flex-col md:grid md:grid-cols-12 max-h-[85vh] md:max-h-[640px] animate-scale-up">
      {/* Column 1: Core Stream Player and interactions */}
      <div className="md:col-span-8 bg-neutral-950 flex flex-col justify-between text-white relative">
        
        {mode === 'meet' ? (
          <RealTimeMeetRoom 
            selectedLive={selectedLive}
            onLeave={() => setMode('slides')}
            triggerToast={triggerToast}
            userName={userName}
          />
        ) : (
          <>
            <ActiveLiveHeader selectedLive={selectedLive} onQuit={onQuit} />

            {/* Presentation Board */}
            <div className="flex-grow flex items-center justify-center p-8 min-h-[250px] relative overflow-hidden bg-gradient-to-br from-neutral-900 to-[#1e1010]">
              <LiveSlideViewer />

              <div className="absolute bottom-4 right-4 w-28 sm:w-36 h-20 sm:h-24 rounded-xl bg-neutral-900 border border-white/20 shadow-2xl overflow-hidden z-25 flex flex-col">
                <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop" className="w-full h-2/3 object-cover opacity-85" alt="Vidéo du Professeur" />
                <div className="p-1 bg-neutral-900 text-[8px] font-black text-white border-t border-white/10 flex justify-between items-center px-1.5">
                  <span className="truncate">Dr. Cheikh Bamba</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                </div>
              </div>
            </div>

            {/* Stream Controls Reactions */}
            <div className="bg-neutral-950 p-4 border-t border-white/10 flex items-center justify-between z-10">
              <ActiveLiveStreamReactions selectedLive={selectedLive} sendLiveReaction={sendLiveReaction} />
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setMode('meet');
                    triggerToast("Rejoindre la salle de réunion...");
                  }}
                  className="bg-brand-red-deep hover:bg-[#961215] text-white text-[11px] font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-red-deep/20 cursor-pointer hover:scale-102 active:scale-98 transition-all animate-pulse"
                >
                  <Icon icon="lucide:video" className="h-4 w-4" />
                  <span>Rejoindre le Meet</span>
                </button>

                <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-xl">
                  <Icon icon="lucide:users" className="h-3.5 w-3.5 text-emerald-450" />
                  <span className="font-mono text-[9px] font-heavy whitespace-nowrap text-secondary">{selectedLive.attendeesCount + 11} Connectés</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <ActiveLiveChat 
        selectedLive={selectedLive}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onSendChat={onSendChat}
      />
    </div>
  );
}

export default ActiveLiveStream;
