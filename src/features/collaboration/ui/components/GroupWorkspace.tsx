import React, { useState } from 'react';
import { Send, Search, Users } from 'lucide-react';
import { CollabMessage } from '../../domain/CollaborationModels';
import { MessageItem } from './MessageItem';

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
  const [searchQuery, setSearchQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && fileType === 'none') return;
    onSendMessage(groupId, userName, text, fileType !== 'none' ? fileType : undefined, fileName || undefined);
    setText('');
    setFileType('none');
    setFileName('');
  };

  const groupMsgs = messages.filter((m) => {
    const matchesGroup = m.groupId === groupId;
    const matchesSearch = searchQuery.trim() === '' || 
      m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.fileName && m.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 shadow-sm flex flex-col h-[500px]">
      <div className="p-4 border-b border-neutral-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-gray-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-red-deep animate-pulse" />
          <span className="font-bold text-xs text-gray-800">{groupName}</span>
          <span className="text-[10px] bg-brand-red-light text-brand-red-deep px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{userRole}</span>
        </div>
        
        {/* Search input to filter chat */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-40 text-[10px] pl-8 pr-2 py-1 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
          />
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-3 no-scrollbar bg-[#FAF9F6]">
        {groupMsgs.length === 0 ? (
          <p className="text-center text-xs text-neutral-400 py-10 font-medium">
            {searchQuery ? 'Aucun résultat trouvé pour cette recherche.' : 'Aucun message pour le moment.'}
          </p>
        ) : (
          groupMsgs.map((m) => (
            <MessageItem key={m.id} m={m} isCurrentUser={m.senderName === userName} />
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-neutral-gray-100 flex gap-2 items-center bg-white rounded-b-2xl">
        <select
          value={fileType}
          onChange={(e) => {
            const val = e.target.value as CollabMessage['fileType'];
            setFileType(val);
            if (val !== 'none') {
              setFileName(`Doc_Partage_${Date.now().toString().slice(-4)}.${val === 'code' ? 'ts' : val === 'voice' ? 'mp3' : val === 'zip' ? 'zip' : 'pdf'}`);
            }
          }}
          className="text-[10px] font-bold border border-neutral-gray-200 rounded-xl px-2 py-1.5 focus:outline-none bg-white"
        >
          <option value="none">Texte seul</option>
          <option value="pdf">📄 PDF</option>
          <option value="zip">📦 ZIP</option>
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
