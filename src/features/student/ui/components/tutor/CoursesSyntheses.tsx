import React from 'react';
import { BookOpen, Zap, GraduationCap, HelpCircle, Lightbulb } from 'lucide-react';

interface Course {
  id: string;
  titre: string;
  coefficient: number;
  progress: number;
  unites?: string[];
  prochain_cours?: string;
}

interface CoursesSynthesesProps {
  courses: Course[];
  onAskAboutCourse: (courseName: string, type: 'apprendre' | 'comprendre' | 'astuces') => void;
}

export function CoursesSyntheses({ courses, onAskAboutCourse }: CoursesSynthesesProps) {
  // Use real courses or dynamic fallback list if loading/empty
  const displayCourses = courses.length > 0 ? courses : [
    { id: 'c1', titre: 'Programmation Mobile S1', coefficient: 4, progress: 85 },
    { id: 'c2', titre: 'Machine Learning Foundations', coefficient: 5, progress: 65 },
    { id: 'c3', titre: 'Développement Web Fullstack', coefficient: 5, progress: 70 },
  ];

  return (
    <div className="flex-grow overflow-y-auto p-3.5 space-y-3 no-scrollbar" id="courses-syntheses-list">
      <div className="shrink-0 mb-1.5">
        <h3 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="h-4.5 w-4.5 text-[#3f1e1e]" /> Fiches de synthèse des cours
        </h3>
        <p className="text-[10px] text-secondary font-bold leading-relaxed mt-0.5">
          Ordonnez instantanément au tuteur d'analyser vos priorités de révision ou d'en apprendre plus sur chaque matière.
        </p>
      </div>

      <div className="space-y-3">
        {displayCourses.map((course) => (
          <div 
            key={course.id}
            className="bg-[#FAF9F7] rounded-xl border border-neutral-gray-200 p-3 space-y-2.5 hover:border-[#3f1e1e]/40 transition-all hover:shadow-2xs group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-0.5">
                  Coef: {course.coefficient || 4} • Progrès: {course.progress || 0}%
                </span>
                <h3 className="font-extrabold text-xs text-[#291715] group-hover:text-[#3f1e1e] transition-colors">
                  {course.titre}
                </h3>
              </div>
              <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100">
                {(course.coefficient || 4) >= 5 ? 'Élevée' : 'Moyenne'}
              </span>
            </div>

            <div className="bg-white rounded-lg p-2 border border-neutral-gray-200/55">
              <div className="flex items-start gap-1">
                <Zap className="h-3.5 w-3.5 text-[#E3A857] shrink-0 mt-0.5" />
                <p className="text-[10px] font-semibold text-neutral-600 leading-relaxed italic">
                  "Sujets clés: {course.unites?.join(', ') || 'Concepts avancés et travaux pratiques de validation'}"
                </p>
              </div>
            </div>

            {/* Actions row */}
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              <button
                onClick={() => onAskAboutCourse(course.titre, 'apprendre')}
                className="py-1.5 px-0.5 text-center text-[8px] font-black uppercase tracking-wider bg-white border border-neutral-gray-200 text-neutral-500 rounded-lg hover:text-[#3f1e1e] hover:border-[#3f1e1e]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <GraduationCap className="h-3 w-3 text-[#3f1e1e]" />
                Priorités
              </button>
              <button
                onClick={() => onAskAboutCourse(course.titre, 'comprendre')}
                className="py-1.5 px-0.5 text-center text-[8px] font-black uppercase tracking-wider bg-white border border-neutral-gray-200 text-neutral-500 rounded-lg hover:text-[#3f1e1e] hover:border-[#3f1e1e]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <HelpCircle className="h-3 w-3 text-indigo-500" />
                S'exercer
              </button>
              <button
                onClick={() => onAskAboutCourse(course.titre, 'astuces')}
                className="py-1.5 px-0.5 text-center text-[8px] font-black uppercase tracking-wider bg-white border border-neutral-gray-200 text-neutral-500 rounded-lg hover:text-[#3f1e1e] hover:border-[#3f1e1e]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <Lightbulb className="h-3 w-3 text-amber-500" />
                Astuces
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
