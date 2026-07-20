import React from 'react';
import { FileText, Code, Link2, Music } from 'lucide-react';
import { CollabMessage } from '../../domain/CollaborationModels';

interface Props {
  readonly m: CollabMessage;
  readonly isCurrentUser: boolean;
}

export function MessageItem({ m, isCurrentUser }: Props) {
  return (
    <div className={`flex flex-col max-w-[80%] ${isCurrentUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
      <span className="text-[9px] font-bold text-neutral-500 mb-0.5">
        {m.senderName} ({m.senderRole})
      </span>
      <div
        className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
          isCurrentUser
            ? 'bg-neutral-gray-900 text-white rounded-tr-none'
            : 'bg-white text-gray-800 border border-neutral-gray-200 rounded-tl-none shadow-3xs'
        }`}
      >
        <p>{m.text}</p>
        {m.fileType && m.fileType !== 'none' && (
          <div className="mt-2 flex items-center gap-2 bg-black/10 p-2 rounded-xl text-[10px]">
            {m.fileType === 'pdf' && <FileText className="w-4 h-4 text-rose-400" />}
            {m.fileType === 'zip' && <FileText className="w-4 h-4 text-amber-400" />}
            {m.fileType === 'code' && <Code className="w-4 h-4 text-emerald-400" />}
            {m.fileType === 'link' && <Link2 className="w-4 h-4 text-sky-400" />}
            {m.fileType === 'voice' && <Music className="w-4 h-4 text-purple-400" />}
            <span className="font-mono truncate">{m.fileName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
