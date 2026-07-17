export type AttendanceStatus = 'present' | 'absent' | 'retard';

export type AttendanceByStudent = Record<string, AttendanceStatus>;
