import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseHeader } from '../components/CourseHeader';
import { CourseGrid } from '../components/CourseGrid';

import { useCourses } from '@/features/courses/hooks/useCourses';

export function StudentCoursesPage() {
  const navigate = useNavigate();
  const { 
    courses, 
    isLoading, 
    error 
  } = useCourses();

  if (isLoading) {
    return (
      <div className="flex-1 px-4 md:px-8 py-6 md:py-8 flex items-center justify-center min-h-screen bg-[#FAF8F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-red-deep/20 border-t-brand-red-deep rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-secondary">Chargement du catalogue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 px-4 md:px-8 py-6 md:py-8 flex items-center justify-center min-h-screen bg-[#FAF8F6]">
         <div className="bg-red-50 text-brand-red-deep p-6 rounded-2xl border border-red-100 text-center">
          <span className="material-symbols-outlined text-[32px] mb-2">error</span>
          <h3 className="font-bold">Erreur</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 md:px-8 py-6 md:py-8 animate-fade-in relative min-h-screen bg-[#FAF8F6]">
      
      {/* Header section */}
      <CourseHeader />

      {/* Main Grid content */}
      <div className="space-y-6">
        <CourseGrid 
          coursFiltrés={courses}
          setActiveDetailCourse={(course) => navigate(`/etudiant/cours/${course.id}`)}
        />
      </div>

    </div>
  );
}
