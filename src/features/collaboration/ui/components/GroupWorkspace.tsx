import React, { useState } from 'react';
import { Send, FileText, Code, Link2, Paperclip, Music, Users } from 'lucide-react';
import { CollabMessage } from '../../domain/CollaborationModels';

interface Props {
  readonly groupId: string;
  readonly groupName: string;
  readonly messages: readonly CollabMessage[];
  readonly onSendMessage: (groupId: string, senderName: string, text: string, fileType?: CollabMessage['fileType'], fileName?: string) => void;
  readonly userName: string;
  readonly userRole: 'ETUDIANT' | 'PROFESSEUR' | 'ADMIN';
}

export function GroupWorkspace({ groupId, groupName, messages, onSendMessage, userName, userRole }: Props) {
  const [text, setText] = useState('');
  const [fileType, setFileType] = useState<CollabMessage['fileType']>('none');
  const [fileName, setFileName] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && fileType === 'none') return;
    onSendMessage(groupId, userName, text, fileType !== 'none' ? fileType : undefined, fileName || undefined);
    setText('');
    setFileType('none');
    setFileName('');
  };

  const groupMsgs = messages.filter((m) => m.groupId === groupId);

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 shadow-sm flex flex-col h-[500px]">
      <div className="p-4 border-b border-neutral-gray-100 flex items-center justify-between bg-neutral-gray-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-red-deep animate-pulse" />
          <span className="font-bold text-xs text-gray-800">{groupName}</span>
        </div>
        <span className="text-[10px] bg-brand-red-light text-brand-red-deep px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{userRole}</span>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-3 no-scrollbar bg-[#FAF9F6]">
        {groupMsgs.length === 0 ? (
          <p className="text-center text-xs text-neutral-400 py-10 font-medium">Aucun message pour le moment. Lancez la discussion !</p>
        ) : (
          groupMsgs.map((m) => (
            <div key={m.id} className={`flex flex-col max-w-[80%] ${m.senderName === userName ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <span className="text-[9px] font-bold text-neutral-500 mb-0.5">{m.senderName} ({m.senderRole})</span>
              <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${m.senderName === userName ? 'bg-neutral-gray-900 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-neutral-gray-200 rounded-tl-none shadow-3xs'}`}>
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
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-neutral-gray-100 flex gap-2 items-center bg-white rounded-b-2xl">
        <select
          value={fileType}
          onChange={(e) => {
            const val = e.target.value as CollabMessage['fileType'];
            setFileType(val);
            if (val !== 'none') setFileName(`Doc_Partage_${Date.now().toString().slice(-4)}.${val === 'code' ? 'ts' : val === 'voice' ? 'mp3' : val === 'zip' ? 'zip' : 'pdf'}`);
          }}
          className="text-[10px] font-bold border border-neutral-gray-200 rounded-xl px-2 py-1.5 focus:outline-none"
        >
          <option value="none">Texte seul</option>
          <option value="pdf">📄 PDF</option>
          <option value="zip">📦 ZIP / Code</option>
          <option value="code">💻 Fichier Source</option>
          <option value="voice">🎙️ Message Vocal</option>
        </select>

        <input
          type="text"
          placeholder="Écrivez votre message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep font-medium"
        />
        <button type="submit" className="p-2 bg-brand-red-deep text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
export default GroupWorkspace;
