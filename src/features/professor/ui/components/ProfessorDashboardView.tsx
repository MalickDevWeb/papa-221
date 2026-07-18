import React, { useState } from 'react';
import type { ProfessorCourse, ProfessorSchedule, StudentEnrolled } from '../../domain/ProfessorModels';
import type { AttendanceStatus } from '../../domain/ProfessorAttendance';
import { Award, CheckCircle2, Users } from 'lucide-react';
import { ProfessorHeaderBanner } from './ProfessorHeaderBanner';
import { ProfessorWeeklySchedule } from './ProfessorWeeklySchedule';
import { ProfessorPresenceModal } from './ProfessorPresenceModal';
import { ProfessorQRZoomOverlay } from './ProfessorQRZoomOverlay';

interface Props {
  readonly profName: string;
  readonly courses: readonly ProfessorCourse[];
  readonly homeworksCount: number;
  readonly validatedGrades: number;
  readonly classAvg: number;
  readonly schedule: readonly ProfessorSchedule[];
  readonly students: readonly StudentEnrolled[];
  readonly onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
  readonly onEnterCourse?: (courseId: string) => void;
}

export function ProfessorDashboardView({
  profName,
  courses,
  homeworksCount,
  validatedGrades,
  classAvg,
  schedule,
  students,
  onMarkAttendance,
  onEnterCourse,
}: Props) {
  const [showPresence, setShowPresence] = useState(false);
  const [presenceTab, setPresenceTab] = useState<'badge' | 'scanner'>('badge');
  const [pointageType, setPointageType] = useState<'arrivée' | 'départ'>('arrivée');
  const [localVigilCheckInsCount, setLocalVigilCheckInsCount] = useState(0);
  const [showQRZoom, setShowQRZoom] = useState(false);

  return (
    <div className="space-y-6">
      <ProfessorHeaderBanner
        profName={profName}
        coursesCount={courses.length}
        vigilCheckInsCount={localVigilCheckInsCount}
        onOpenPresence={(tab, type) => {
          setPresenceTab(tab);
          setPointageType(type);
          setShowPresence(true);
        }}
        onZoomQR={() => setShowQRZoom(true)}
      />

      <ProfessorWeeklySchedule schedule={schedule} onEnterCourse={onEnterCourse} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-[28px] bg-white p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 text-[#B3181C]">
            <div className="p-2 bg-[#FFF5F5] rounded-xl border border-[#B3181C]/10">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Performance moyenne</span>
          </div>
          <p className="mt-5 text-3xl font-black text-neutral-800">{classAvg} <span className="text-sm font-semibold text-neutral-400">/ 20</span></p>
          <p className="mt-2.5 text-xs text-neutral-400 font-bold">Moyenne générale de vos classes</p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 text-[#B3181C]">
            <div className="p-2 bg-[#FFF5F5] rounded-xl border border-[#B3181C]/10">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Activité évaluations</span>
          </div>
          <p className="mt-5 text-3xl font-black text-neutral-800">{validatedGrades}</p>
          <p className="mt-2.5 text-xs text-neutral-400 font-bold">Évaluations validées cette période</p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 text-[#B3181C]">
            <div className="p-2 bg-[#FFF5F5] rounded-xl border border-[#B3181C]/10">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Workflow</span>
          </div>
          <p className="mt-5 text-3xl font-black text-neutral-800">{courses.length * 3}</p>
          <p className="mt-2.5 text-xs text-neutral-400 font-bold">Actions pédagogiques à mener</p>
        </div>
      </div>

      {showPresence && (
        <ProfessorPresenceModal
          profName={profName}
          students={students}
          onClose={() => setShowPresence(false)}
          onMarkAttendance={onMarkAttendance}
          initialTab={presenceTab}
          pointageType={pointageType}
          onScanComplete={() => setLocalVigilCheckInsCount(prev => prev + 1)}
        />
      )}

      {showQRZoom && (
        <ProfessorQRZoomOverlay
          profName={profName}
          onClose={() => setShowQRZoom(false)}
        />
      )}
    </div>
  );
}
