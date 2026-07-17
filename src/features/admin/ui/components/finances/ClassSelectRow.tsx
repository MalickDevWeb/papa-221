import React from 'react';
import { StudentFinance, CLASSES_LIST } from '../../../domain/FinancesModels';

interface Props {
  selectedClass: string;
  onSelectClass: (classe: string) => void;
  students: StudentFinance[];
}

export function ClassSelectRow({ selectedClass, onSelectClass, students }: Props) {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 md:grid md:grid-cols-4 scrollbar-thin snap-x" id="class-select-row-root">
      {CLASSES_LIST.map((classe) => {
        const count = students.filter(s => s.classe === classe).length;
        const isSelected = selectedClass === classe;
        return (
          <button
            key={classe}
            onClick={() => onSelectClass(classe)}
            className={`p-3.5 border rounded-xl text-left transition-all cursor-pointer shrink-0 min-w-[155px] md:min-w-0 select-none ${
              isSelected
                ? 'bg-[#B3181C]/5 border-[#B3181C] shadow-xs'
                : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <div className="font-extrabold text-xs text-[#1E293B] truncate">{classe}</div>
            <div className="text-[9px] text-neutral-400 font-bold mt-1 uppercase">{count} Élèves</div>
          </button>
        );
      })}
    </div>
  );
}
