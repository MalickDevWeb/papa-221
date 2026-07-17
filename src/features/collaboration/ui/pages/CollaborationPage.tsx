import React, { useState } from 'react';
import { useCollaborationState } from '../../hooks/useCollaborationState';
import { useAuthStore } from '@/core/store/authStore';
import { MeetScheduler } from '../components/MeetScheduler';
import { GroupCreator } from '../components/GroupCreator';
import { GroupWorkspace } from '../components/GroupWorkspace';
import { GitHubCollaboration } from '../components/GitHubCollaboration';
import { GroupHomeworks } from '../components/GroupHomeworks';
import { AdminGlobalMeetings } from '../components/AdminGlobalMeetings';
import { MeetSessionTracker } from '../components/MeetSessionTracker';
import { Video, Users, CheckCircle } from 'lucide-react';

export function CollaborationPage() {
  const { utilisateur } = useAuthStore();
  const state = useCollaborationState();
  const [activeGroupId, setActiveGroupId] = useState<string>('group-1');
  const [activeMeetId, setActiveMeetId] = useState<string>('meet-1');

  const activeGroup = state.workgroups.find((g) => g.id === activeGroupId) || state.workgroups[0];
  const activeMeet = state.meets.find((m) => m.id === activeMeetId) || state.meets[0];

  const handleJoinMeetSimulate = (meetId: string, meetLink: string) => {
    // Simulate joining with user's email to show authorization restrictions audits
    const name = utilisateur?.nom || 'Invité';
    const email = utilisateur?.email || 'invite@ecole221.sn';
    const isAuthorized = email.endsWith('@ecole221.sn');
    state.recordAttendance(meetId, name, email, isAuthorized);
    window.open(meetLink, '_blank');
  };

  const isTeacher = utilisateur?.role === 'PROFESSEUR';
  const isAdmin = utilisateur?.role === 'ADMIN' || utilisateur?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-8 py-6">
      {state.toast && (
        <div className={`fixed top-4 right-4 z-[220] p-4 rounded-xl shadow-xl flex items-center gap-3 text-white text-xs font-bold ${state.toast.success ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <CheckCircle className="w-5 h-5" />
          <span>{state.toast.message}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-gray-900 to-neutral-gray-800 p-6 rounded-2xl text-white shadow-md">
        <h2 className="text-xl font-black tracking-tight">Espace de Collaboration & Classes Virtuelles</h2>
        <p className="text-xs text-neutral-400 mt-1">Plateforme unifiée d&apos;apprentissage en ligne, de travail d&apos;équipe et d&apos;audit académique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Scheduling/Management */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Virtual Classes */}
          <div className="bg-white rounded-2xl border border-neutral-gray-200 p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-gray-900 flex items-center gap-2 uppercase tracking-wide">
              <Video className="w-4 h-4 text-brand-red-deep" /> Classes Virtuelles Actives
            </h3>
            <div className="space-y-2">
              {state.meets.map((m) => (
                <div key={m.id} onClick={() => setActiveMeetId(m.id)} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeMeetId === m.id ? 'border-brand-red-deep bg-brand-red-light/20' : 'border-neutral-gray-100 hover:border-neutral-200 bg-neutral-gray-50/50'}`}>
                  <span className="font-bold text-xs text-gray-800 block">{m.subjectName}</span>
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-semibold mt-1">
                    <span>{m.teacherName} • {m.time}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleJoinMeetSimulate(m.id, m.meetLink); }} className="px-2 py-1 bg-brand-red-deep text-white font-bold rounded-lg hover:scale-105 transition-all text-[9px]">Rejoindre</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Workgroups */}
          <div className="bg-white rounded-2xl border border-neutral-gray-200 p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-gray-900 flex items-center gap-2 uppercase tracking-wide">
              <Users className="w-4 h-4 text-neutral-900" /> Groupes de Travail Actifs
            </h3>
            <div className="space-y-2">
              {state.workgroups.map((g) => (
                <div key={g.id} onClick={() => setActiveGroupId(g.id)} className={`p-3 rounded-xl border cursor-pointer transition-all ${activeGroupId === g.id ? 'border-neutral-900 bg-neutral-gray-100' : 'border-neutral-100 hover:border-neutral-200'}`}>
                  <span className="font-bold text-xs text-gray-800 block">{g.name}</span>
                  <span className="text-[9px] text-neutral-500 font-bold block mt-0.5">Chef : {g.leaderName} • {g.members.length} membres</span>
                </div>
              ))}
            </div>
          </div>

          {isTeacher && <MeetScheduler onSchedule={state.createVirtualClass} teacherName={utilisateur?.nom || 'Enseignant'} />}
          {isTeacher && <GroupCreator onAutoGenerate={state.generateAutoGroups} />}
        </div>

        {/* Right column: Interactive Collaboration Spaces */}
        <div className="lg:col-span-8 space-y-6">
          {activeGroup && (
            <>
              {/* Private Chat discussion thread */}
              <GroupWorkspace
                groupId={activeGroup.id}
                groupName={activeGroup.name}
                messages={state.messages}
                onSendMessage={state.sendMessage}
                userName={utilisateur?.nom || 'Utilisateur'}
                userRole={utilisateur?.role === 'PROFESSEUR' ? 'PROFESSEUR' : 'ETUDIANT'}
              />

              {/* GitHub Versioning repo space */}
              <GitHubCollaboration
                documents={state.docs}
                groupId={activeGroup.id}
                onCommit={state.addDocVersion}
                onComment={state.addDocComment}
                userName={utilisateur?.nom || 'Utilisateur'}
              />

              {/* Group Homework Deliverables */}
              <GroupHomeworks
                homeworks={state.homeworks}
                groupId={activeGroup.id}
                groupName={activeGroup.name}
                onDeliver={state.submitHomework}
                isLeader={activeGroup.leaderId === utilisateur?.id || isTeacher}
              />
            </>
          )}

          {activeMeet && <MeetSessionTracker attendances={state.attendances} meetId={activeMeet.id} />}
          {isAdmin && <AdminGlobalMeetings meetings={state.adminMeets} onCreate={state.createAdminMeeting} />}
        </div>
      </div>
    </div>
  );
}
export default CollaborationPage;
