import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { TutorSession } from '../../../hooks/useTutor';

interface TutorSessionsSidebarProps {
  sessions: TutorSession[];
  currentSessionId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export function TutorSessionsSidebar({
  sessions, currentSessionId, onSelect, onCreate, onDelete, onRename
}: TutorSessionsSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startRename = (s: TutorSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const saveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF9F7]/90 border-r border-neutral-gray-200/60 p-4" id="tutor-sessions-sidebar">
      <button
        onClick={onCreate}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3f1e1e] hover:bg-[#522727] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer mb-4 shrink-0"
      >
        <Plus className="h-4 w-4" />
        Nouvelle discussion
      </button>

      <div className="flex-grow overflow-y-auto space-y-2 no-scrollbar pr-1">
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-2 block mb-2">
          Dossiers de discussion ({sessions.length})
        </span>

        {sessions.map((s) => {
          const isActive = s.id === currentSessionId;
          const isEditing = s.id === editingId;

          return (
            <div
              key={s.id}
              onClick={() => !isEditing && onSelect(s.id)}
              className={`group flex items-center justify-between gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-white border-[#3f1e1e]/30 shadow-3xs'
                  : 'bg-transparent border-transparent hover:bg-neutral-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-grow">
                <MessageSquare className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-[#3f1e1e]' : 'text-neutral-400'}`} />
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onRename(s.id, editTitle.trim() || s.title);
                        setEditingId(null);
                      }
                    }}
                    className="w-full bg-neutral-100 border-none rounded px-2 py-0.5 text-xs font-bold text-[#291715] focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-[#3f1e1e]' : 'text-neutral-600'}`}>
                    {s.title}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {isEditing ? (
                  <button
                    onClick={(e) => saveRename(s.id, e)}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => startRename(s, e)}
                      title="Renommer"
                      className="p-1 text-neutral-400 hover:text-[#3f1e1e] hover:bg-neutral-100 rounded"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(s.id);
                        }}
                        title="Supprimer"
                        className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
