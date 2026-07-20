import React, { useState } from 'react';
import { History, Send } from 'lucide-react';
import { RepoDocument } from '../../domain/CollaborationModels';

interface Props {
  readonly activeDoc: RepoDocument;
  readonly userName: string;
  readonly onComment: (docId: string, author: string, text: string) => void;
}

export function DocCommitHistory({ activeDoc, userName, onComment }: Props) {
  const [fileComment, setFileComment] = useState('');

  const handleSendComment = () => {
    if (!fileComment.trim()) return;
    onComment(activeDoc.id, userName, fileComment.trim());
    setFileComment('');
  };

  return (
    <div className="border border-neutral-gray-100 rounded-2xl p-4 bg-neutral-gray-50/50 flex flex-col justify-between h-[280px]">
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-3 overflow-y-auto no-scrollbar flex-grow pr-1">
          <span className="text-[10px] font-bold text-neutral-700 block mb-2">
            Historique des Commits - v{activeDoc.latestVersion}
          </span>
          {activeDoc.history.map((h, i) => (
            <div key={i} className="flex gap-2 items-start text-[10px] border-b border-neutral-100 pb-2">
              <History className="w-3.5 h-3.5 text-neutral-400 mt-0.5" />
              <div className="flex-grow">
                <div className="flex justify-between font-bold">
                  <span>v{h.version} par {h.author}</span>
                  <span className="text-[8px] text-neutral-400">{h.updatedAt}</span>
                </div>
                <p className="text-neutral-500 italic mt-0.5">&quot;{h.comment}&quot;</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 pt-2 border-t border-neutral-200">
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Commenter le livrable..."
              value={fileComment}
              onChange={(e) => setFileComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendComment();
              }}
              className="flex-grow text-[10px] px-2.5 py-1.5 border border-neutral-200 rounded-xl bg-white"
            />
            <button onClick={handleSendComment} className="p-1.5 bg-brand-red-deep text-white rounded-xl">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DocCommitHistory;
