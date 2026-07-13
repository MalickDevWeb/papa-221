import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useTutor } from '../../hooks/useTutor';
import { TutorHeader } from '../components/tutor/TutorHeader';
import { AcademicDiagnostic } from '../components/tutor/AcademicDiagnostic';
import { CoursesSyntheses } from '../components/tutor/CoursesSyntheses';
import { TutorChatArea } from '../components/tutor/TutorChatArea';
import { QuickPrompts } from '../components/tutor/QuickPrompts';
import { TutorSessionsSidebar } from '../components/tutor/TutorSessionsSidebar';
import { Send, Paperclip, X, FileText, MessageSquare, GraduationCap } from 'lucide-react';

export function StudentTutorPage() {
  const {
    sessions, currentSessionId, activeSession, createSession, deleteSession, renameSession, setCurrentSessionId,
    input, setInput, attachedFile, setAttachedFile, isLoading, grades, courses, homeworks, handleSend
  } = useTutor();
  const chatEndRef = useRef<HTMLDivElement>(null), fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'sessions' | 'diagnostics'>('chat');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setAttachedFile({ name: file.name, mimeType: file.type, data: (r.result as string).split(',')[1] });
    r.readAsDataURL(file);
  };

  const askCourse = (name: string, type: string) => {
    handleSend(type === 'apprendre' ? `Que réviser en priorité pour "${name}" ?` : type === 'comprendre' ? `Explique-moi les concepts de "${name}".` : `Astuces de révision pour "${name}".`);
    setActiveTab('chat');
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="p-1.5 md:p-2 lg:p-2.5 flex flex-col h-[calc(100vh-70px)] md:h-screen overflow-hidden bg-neutral-50/50"
    >
      <TutorHeader />
      <div className="flex lg:hidden bg-white border border-neutral-gray-200 p-1 rounded-xl mb-2 shrink-0 select-none">
        {([['sessions', <MessageSquare className="h-4 w-4" />, 'Dossiers'], ['chat', '💬', 'Chat'], ['diagnostics', <GraduationCap className="h-4 w-4" />, 'Diagnostics']] as const).map(([tab, icon, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all ${activeTab === tab ? 'bg-[#3f1e1e] text-white' : 'text-neutral-500 hover:text-neutral-800'}`}>
            {icon} {label}
          </button>
        ))}
      </div>
      <div className="flex-grow grid grid-cols-12 gap-2.5 overflow-hidden min-h-0">
        <div className={`col-span-12 lg:col-span-3 bg-white border border-neutral-gray-250 rounded-3xl overflow-hidden shadow-3xs flex-col ${activeTab === 'sessions' ? 'flex h-full' : 'hidden lg:flex'}`}>
          <TutorSessionsSidebar sessions={sessions} currentSessionId={currentSessionId} onSelect={(id) => { setCurrentSessionId(id); setActiveTab('chat'); }} onCreate={() => { createSession(); setActiveTab('chat'); }} onDelete={deleteSession} onRename={renameSession} />
        </div>
        <div className={`col-span-12 lg:col-span-6 bg-white border border-neutral-gray-250 rounded-3xl overflow-hidden shadow-3xs flex flex-col h-full ${activeTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
          <TutorChatArea messages={activeSession?.messages || []} isLoading={isLoading} chatEndRef={chatEndRef} />
          {attachedFile && (
            <div className="mx-4 p-2 bg-[#FAF9F7] rounded-xl border border-neutral-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0"><FileText className="h-4 w-4 text-[#3f1e1e]" /><span className="text-[11px] font-bold truncate max-w-[200px]">{attachedFile.name}</span></div>
              <button onClick={() => setAttachedFile(null)} className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-rose-600"><X className="h-4 w-4" /></button>
            </div>
          )}
          <QuickPrompts onSend={handleSend} disabled={isLoading} />
          <div className="p-3 md:p-3.5 bg-white border-t border-neutral-gray-150 shrink-0 flex items-center gap-2">
            <button onClick={() => fileInputRef.current?.click()} title="Fichier" className="p-3 text-neutral-500 hover:text-[#3f1e1e] hover:bg-[#FAF9F7] rounded-xl border border-neutral-gray-200 transition-all cursor-pointer"><Paperclip className="h-4.5 w-4.5" /></button>
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*,application/pdf,audio/*,video/*" />
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex-grow flex items-center gap-2 ml-[-4px]">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Posez votre question académique ou joignez un fichier..." className="flex-grow bg-[#FAF9F7] border border-neutral-gray-200 rounded-xl px-3.5 py-3 text-xs font-bold focus:outline-none focus:border-[#3f1e1e] focus:bg-white text-[#291715] transition-all" />
              <button type="submit" disabled={(!input.trim() && !attachedFile) || isLoading} className="bg-[#3f1e1e] hover:bg-[#522727] text-white p-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-40 shrink-0 cursor-pointer"><Send className="h-4.5 w-4.5" /></button>
            </form>
          </div>
        </div>
        <div className={`col-span-12 lg:col-span-3 bg-white border border-neutral-gray-250 rounded-3xl flex-col overflow-hidden shadow-3xs ${activeTab === 'diagnostics' ? 'flex h-full' : 'hidden lg:flex'}`}>
          <CoursesSyntheses courses={courses} onAskAboutCourse={askCourse} />
          <div className="p-4 border-t border-neutral-gray-200 bg-[#FAF9F7]/40"><AcademicDiagnostic grades={grades} homeworks={homeworks} /></div>
        </div>
      </div>
    </motion.main>
  );
}
