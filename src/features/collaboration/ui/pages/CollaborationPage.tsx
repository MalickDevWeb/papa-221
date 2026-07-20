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
import { ActiveClassesList } from '../components/ActiveClassesList';
import { WorkgroupsList } from '../components/WorkgroupsList';
import { WorkspacePanels } from '../components/WorkspacePanels';
import { CheckCircle } from 'lucide-react';

export function CollaborationPage() {
  const { utilisateur } = useAuthStore();
  const state = useCollaborationState();
  const { activeGroupId, setActiveGroupId } = state;
  const [activeMeetId, setActiveMeetId] = useState<string>('meet-1');

  const activeGroup = state.workgroups.find((g) => g.id === activeGroupId) || state.workgroups[0];
  const activeMeet = state.meets.find((m) => m.id === activeMeetId) || state.meets[0];

  const handleJoinMeetSimulate = (meetId: string, meetLink: string) => {
    const name = utilisateur?.nom || 'Invité';
    const email = utilisateur?.email || 'invite@ecole221.sn';
    state.recordAttendance(meetId, name, email, email.endsWith('@ecole221.sn'));
    window.open(meetLink, '_blank');
  };

  const actualRole = utilisateur?.role || 'PROFESSEUR'; // Default to PROFESSEUR for preview if not signed in, giving immediate visibility
  const isTeacher = actualRole === 'PROFESSEUR';
  const isAdmin = actualRole === 'ADMIN' || actualRole === 'SUPER_ADMIN';
  const senderRole = isTeacher ? 'PROFESSEUR' : (actualRole === 'ADMIN' ? 'ADMIN' : 'ETUDIANT');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-8 py-6">
      {state.toast && (
        <div className="fixed top-4 right-4 z-[220] p-4 rounded-xl shadow-xl flex items-center gap-3 text-white text-xs font-bold bg-emerald-600 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5" />
          <span>{state.toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <ActiveClassesList meets={state.meets} activeMeetId={activeMeetId} onSelectMeet={setActiveMeetId} onJoinMeet={handleJoinMeetSimulate} />
          <WorkgroupsList workgroups={state.workgroups} activeGroupId={activeGroupId} onSelectGroup={setActiveGroupId} />
          {isTeacher && <MeetScheduler onSchedule={state.createVirtualClass} teacherName={utilisateur?.nom || 'Enseignant'} />}
          {isTeacher && (
            <GroupCreator
              onAutoGenerate={state.generateAutoGroups}
              onCreateManual={state.createManualGroup}
            />
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          {activeGroup && (
            <>
              <WorkspacePanels activeGroup={activeGroup} state={state} isTeacher={isTeacher} userName={utilisateur?.nom || 'Utilisateur'} />
              <GroupWorkspace
                groupId={activeGroup.id}
                groupName={activeGroup.name}
                messages={state.messages}
                onSendMessage={(gId, sName, txt, fType, fName) => state.sendMessage(gId, sName, senderRole, txt, fType, fName)}
                userName={utilisateur?.nom || 'Utilisateur'}
                userRole={senderRole}
              />
              <GitHubCollaboration documents={state.docs} groupId={activeGroup.id} onCommit={state.addDocVersion} onComment={state.addDocComment} userName={utilisateur?.nom || 'Utilisateur'} />
              <GroupHomeworks homeworks={state.homeworks} groupId={activeGroup.id} groupName={activeGroup.name} onDeliver={state.submitHomework} isLeader={activeGroup.leaderId === utilisateur?.id || isTeacher} />
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
