import React from 'react';
import type { StudentEnrolled } from '../../../domain/ProfessorModels';
import type { AttendanceStatus } from '../../../domain/ProfessorAttendance';

interface RowProps {
  readonly student: StudentEnrolled;
  readonly status: AttendanceStatus;
  readonly onMark: (studentId: string, status: AttendanceStatus) => void;
}

export function ProfessorAttendanceRow({ student, status, onMark }: RowProps) {
  const prenomChar = student && student.prenom ? student.prenom.charAt(0) : '';
  const nomChar = student && student.nom ? student.nom.charAt(0) : '';
  const initials = `${prenomChar}${nomChar}`.toUpperCase() || 'ST';

  const getStatusColor = (current: AttendanceStatus) => {
    if (current === 'present') return {
      bg: 'bg-[#E6F4EA]', border: 'border-[#CEEAD6]', text: 'text-[#137333]', indicator: 'bg-[#137333]'
    };
    if (current === 'retard') return {
      bg: 'bg-[#FEF7E0]', border: 'border-[#FEEFC3]', text: 'text-[#B06000]', indicator: 'bg-[#B06000]'
    };
    return {
      bg: 'bg-[#FCE8E6]', border: 'border-[#FAD2CF]', text: 'text-[#C5221F]', indicator: 'bg-[#C5221F]'
    };
  };

  const currentColors = getStatusColor(status);

  return (
    <div 
      className="bg-white border border-neutral-200/95 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 shadow-sm hover:shadow-md transition-all w-full sm:w-[674px] h-auto sm:h-[54px] p-3 sm:pl-[7px] sm:pr-[4px] sm:py-[10px]"
    >
      <div className="flex items-center gap-3.5 pl-1 sm:pl-3 min-w-0">
        <div className={`h-11 w-11 rounded-xl font-black text-xs flex items-center justify-center select-none shrink-0 border ${currentColors.bg} ${currentColors.text} ${currentColors.border}`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[13.5px] font-black text-neutral-800 tracking-tight flex flex-wrap items-center gap-2">
            <span>{student.prenom} {student.nom}</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${currentColors.bg} ${currentColors.text} border ${currentColors.border}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${currentColors.indicator}`} />
              {status === 'present' ? 'Présent' : status === 'retard' ? 'Retard' : 'Absent'}
            </span>
          </h4>
          <p className="text-[10.5px] text-neutral-400 font-bold mt-1 font-mono truncate">
            Matricule: {student.matricule} • <span className="text-neutral-500 font-sans">{student.email}</span>
          </p>
        </div>
      </div>

      <div 
        className="flex items-center gap-2 select-none shrink-0 justify-between sm:justify-start w-full sm:w-[247px] mr-0 sm:mr-[1px] ml-0 sm:ml-[24px] px-1 sm:px-0"
      >
        {(['present', 'retard', 'absent'] as const).map((opt) => {
          const optColors = getStatusColor(opt);
          const isAct = status === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onMark(student.id, opt)}
              className={`flex-1 sm:flex-initial text-center px-3 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                isAct
                  ? `${optColors.bg} ${optColors.text} ${optColors.border} shadow-2xs scale-102 font-black`
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-400 border-neutral-200/70 hover:text-neutral-700'
              }`}
            >
              {opt === 'present' ? 'Présent' : opt === 'retard' ? 'Retard' : 'Absent'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
