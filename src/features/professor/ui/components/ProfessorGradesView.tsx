import React, { useState, useMemo } from 'react';
import type { ProfessorCourse, StudentGrade } from '../../domain/ProfessorModels';
import { StudentCard } from './grades/StudentCard';
import { StudentDetailModal } from './grades/StudentDetailModal';
import { Search, Users } from 'lucide-react';

interface Props {
  readonly selectedCourse?: ProfessorCourse | null;
  readonly grades: readonly StudentGrade[];
  readonly editingGradeStudentId: string | null;
  readonly editCC: number;
  readonly editExam: number;
  readonly setEditCC: (value: number) => void;
  readonly setEditExam: (value: number) => void;
  readonly handleGradeEditStart: (studentId: string, currentCC: number, currentExam: number) => void;
  readonly handleGradeSave: (studentId: string) => Promise<void>;
}

export function ProfessorGradesView({
  selectedCourse,
  grades,
  editCC,
  editExam,
  setEditCC,
  setEditExam,
  handleGradeEditStart,
  handleGradeSave,
}: Props) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'valid' | 'retake'>('all');
  const [selectedStudentGrade, setSelectedStudentGrade] = useState<StudentGrade | null>(null);

  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      const matchSearch = (g.studentNom || "").toLowerCase().includes(search.toLowerCase()) ||
        (g.studentId || "").toLowerCase().includes(search.toLowerCase());
      const isPass = g.finalGrade >= 10;
      if (activeTab === 'valid') return matchSearch && isPass;
      if (activeTab === 'retake') return matchSearch && !isPass;
      return matchSearch;
    });
  }, [grades, search, activeTab]);

  const stats = useMemo(() => {
    const total = grades.length;
    const valid = grades.filter((g) => g.finalGrade >= 10).length;
    const retake = total - valid;
    return { total, valid, retake };
  }, [grades]);

  const handleOpenDetail = (g: StudentGrade) => {
    handleGradeEditStart(g.studentId, g.cc, g.examen);
    setSelectedStudentGrade(g);
  };

  // Keep modal open grade state in sync if parent props change
  const currentGradeForModal = selectedStudentGrade
    ? grades.find(g => g.studentId === selectedStudentGrade.studentId) || selectedStudentGrade
    : null;

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <section className="bg-white border border-neutral-100 rounded-[28px] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div className="flex flex-wrap gap-1.5 bg-neutral-100 p-1 rounded-xl w-fit">
            {([
              { key: 'all', label: 'Tous', count: stats.total },
              { key: 'valid', label: 'Validés', count: stats.valid },
              { key: 'retake', label: 'Rattrapage', count: stats.retake },
            ] as const).map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveTab(filter.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === filter.key ? 'bg-white text-neutral-800 shadow-3xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {filter.label}
                <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded-full text-neutral-600 font-mono">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un élève..."
              className="pl-9.5 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 focus:border-[#B3181C] text-xs font-bold text-neutral-700 rounded-xl outline-none w-full sm:w-[240px] transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3 max-h-[520px] overflow-y-auto no-scrollbar pr-0.5">
          {filteredGrades.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 p-10 text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-neutral-300 text-4xl">person_search</span>
              <p className="text-sm font-black text-neutral-400 mt-1">Aucun élève trouvé</p>
              <p className="text-xs text-neutral-400 font-semibold">Ajustez votre recherche ou vos filtres.</p>
            </div>
          ) : (
            filteredGrades.map((g) => (
              <StudentCard
                key={g.studentId}
                grade={g}
                onClick={() => handleOpenDetail(g)}
              />
            ))
          )}
        </div>
      </section>

      {currentGradeForModal && selectedCourse && (
        <StudentDetailModal
          studentId={currentGradeForModal.studentId}
          studentNom={currentGradeForModal.studentNom}
          courseId={selectedCourse.id}
          grade={currentGradeForModal}
          editCC={editCC}
          editExam={editExam}
          setEditCC={setEditCC}
          setEditExam={setEditExam}
          onSave={handleGradeSave}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
