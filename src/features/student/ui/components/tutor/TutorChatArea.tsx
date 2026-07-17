import React from 'react';
import { Brain, FileText, Image as ImageIcon, Music, Video } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  file?: { name: string; mimeType: string };
}

interface TutorChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export function TutorChatArea({ messages, isLoading, chatEndRef }: TutorChatAreaProps) {
  const getFileIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (mime.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (mime.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatTextLine = (line: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0, match;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIdx) parts.push(line.substring(lastIdx, match.index));
      parts.push(
        <strong key={match.index} className="font-extrabold text-[#3f1e1e] bg-amber-100/60 px-1 rounded">
          {match[1]}
        </strong>
      );
      lastIdx = boldRegex.lastIndex;
    }
    if (lastIdx < line.length) parts.push(line.substring(lastIdx));
    return parts.length > 0 ? parts : line;
  };

  return (
    <div className="flex-grow p-3 md:p-4.5 overflow-y-auto space-y-3 no-scrollbar bg-[#FAF9F7]/30" id="tutor-chat-viewport">
      {messages.map((msg, index) => (
        <div key={index} className={`flex gap-2.5 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[92%] sm:max-w-[85%] rounded-[20px] p-3 text-xs font-bold leading-relaxed shadow-3xs border ${
            msg.role === 'user' ? 'bg-[#3f1e1e] text-white border-transparent rounded-tr-none' : 'bg-white text-neutral-850 border-neutral-gray-200/70 rounded-tl-none'
          }`}>
            {msg.file && (
              <div className="flex items-center gap-2 mb-2 p-2 rounded-xl bg-white/15 border border-white/20 text-white text-[10px] font-black">
                {getFileIcon(msg.file.mimeType)}
                <span className="truncate max-w-[150px]">{msg.file.name}</span>
                <span className="text-[8px] uppercase tracking-wider opacity-60 ml-auto">({(msg.file.mimeType || '').split('/')[1] || ''})</span>
              </div>
            )}
            <div className="space-y-2">
              {(msg.text || '').split('\n').map((line, i) => line.startsWith('```') || line.endsWith('```') ? null : (
                <p key={i} className="leading-relaxed">{formatTextLine(line)}</p>
              ))}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-2.5 items-start justify-start">
          <div className="bg-white text-neutral-500 border border-neutral-gray-200/50 rounded-[20px] rounded-tl-none p-3 text-xs font-bold flex items-center gap-2 shadow-3xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f1e1e] animate-bounce [animation-delay:0ms]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f1e1e] animate-bounce [animation-delay:150ms]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f1e1e] animate-bounce [animation-delay:300ms]" />
            <span className="text-[10px] ml-1 text-secondary font-black uppercase tracking-wider">Le tuteur IA formule une réponse...</span>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}
