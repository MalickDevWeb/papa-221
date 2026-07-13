import type { FormEvent } from 'react';
import type { 
  ClassroomReminder, 
  CourseModule, 
  ProfessorCourse, 
  ProfessorLesson, 
  StudentEnrolled, 
  StudentGrade, 
  ProfessorHomework 
} from '../../../domain/ProfessorModels';
import type { AttendanceByStudent, AttendanceStatus } from '../../../domain/ProfessorAttendance';

export interface ClassroomProps {
  readonly courses: readonly ProfessorCourse[];
  readonly onSelectCourse: (id: string) => void;
  readonly selectedCourse?: ProfessorCourse | null;
  readonly classroomSubTab?: 'modules' | 'homework' | 'grades' | 'attendance' | 'announcements';
  readonly setClassroomSubTab?: (tab: 'modules' | 'homework' | 'grades' | 'attendance' | 'announcements') => void;
  readonly profName?: string;
  readonly triggerToast?: (msg: string) => void;
  readonly modules: readonly CourseModule[];
  readonly reminders: readonly ClassroomReminder[];
  readonly lessons: readonly ProfessorLesson[];
  readonly students: readonly StudentEnrolled[];
  readonly attendance?: AttendanceByStudent;
  readonly onMarkAttendance: (studentId: string, status: AttendanceStatus) => void;
  readonly activeModuleForLesson: string | null;
  readonly isAddingModule: boolean;
  readonly newModuleTitle: string;
  readonly newModuleDesc: string;
  readonly lessonTitle: string;
  readonly lessonDesc: string;
  readonly lessonAttachment: string;
  readonly remContent: string;
  readonly remIsUrgent: boolean;
  readonly setIsAddingModule: (value: boolean) => void;
  readonly setNewModuleTitle: (value: string) => void;
  readonly setNewModuleDesc: (value: string) => void;
  readonly setActiveModuleForLesson: (value: string | null) => void;
  readonly setLessonTitle: (value: string) => void;
  readonly setLessonDesc: (value: string) => void;
  readonly setLessonAttachment: (value: string) => void;
  readonly setRemContent: (value: string) => void;
  readonly setRemIsUrgent: (value: boolean) => void;
  readonly handleCreateModule: (e: FormEvent) => Promise<void>;
  readonly handleLessonSubmit: (e: FormEvent) => Promise<void>;
  readonly handleReminderSubmit: (e: FormEvent) => Promise<void>;

  // Additional grades and homework props
  readonly grades: readonly StudentGrade[];
  readonly editingGradeStudentId: string | null;
  readonly editCC: number;
  readonly editExam: number;
  readonly setEditCC: (value: number) => void;
  readonly setEditExam: (value: number) => void;
  readonly handleGradeEditStart: (studentId: string, currentCC: number, currentExam: number) => void;
  readonly handleGradeSave: (studentId: string) => Promise<void>;
  readonly homeworks: readonly ProfessorHomework[];
  readonly hwTitle: string;
  readonly hwDesc: string;
  readonly hwPrio: 'haute' | 'normale';
  readonly hwDeadline: string;
  readonly setHwTitle: (value: string) => void;
  readonly setHwDesc: (value: string) => void;
  readonly setHwPrio: (value: 'haute' | 'normale') => void;
  readonly setHwDeadline: (value: string) => void;
  readonly handleHomeworkSubmit: (e: FormEvent) => Promise<void>;
}
