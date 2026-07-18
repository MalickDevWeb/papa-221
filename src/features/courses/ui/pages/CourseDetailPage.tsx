import React from 'react';
import { useCourseDetailState } from '../components/course-details/useCourseDetailState';
import { CourseHeader } from '../components/course-details/CourseHeader';
import { CourseSidebar } from '../components/course-details/CourseSidebar';
import { CourseTabsNav } from '../components/course-details/CourseTabsNav';
import { CourseChaptersTab } from '../components/course-details/CourseChaptersTab';
import { CourseResourcesTab } from '../components/course-details/CourseResourcesTab';
import { CourseQuizzesTab } from '../components/course-details/CourseQuizzesTab';
import { CourseHomeworksTab } from '../components/course-details/CourseHomeworksTab';
import { CourseRemindersList } from '../components/course-details/CourseRemindersList';
import { CourseParcoursTab } from '../components/course-details/CourseParcoursTab';

export function CourseDetailPage() {
  const state = useCourseDetailState();
  const { navigate, course, details, isLoading, showToast, activeTab, courseReminders, triggerToast } = state;

  if (isLoading) return <div className="p-12 text-center text-xs font-bold text-neutral-500">Chargement du cours...</div>;
  if (!course) return <div className="p-12 text-center text-xs font-bold text-red-500">Cours introuvable</div>;

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1280px] mx-auto w-full animate-fade-in pb-24 font-sans bg-[#FAF8F6]">
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 text-xs font-bold">
          <span translate="no" className="material-symbols-outlined text-emerald-400">check_circle</span> {showToast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold">
          <button onClick={() => navigate('/etudiant/cours')} className="hover:text-[#3f1e1e] flex items-center gap-1 cursor-pointer bg-transparent border-none">
            <span translate="no" className="material-symbols-outlined text-sm">school</span> Cours
          </button>
          <span>/</span> <span className="text-neutral-800 font-bold truncate max-w-[200px]">{course.nom}</span>
        </div>
        <button onClick={() => navigate('/etudiant/cours')} className="px-4 py-2 border border-neutral-gray-300 rounded-xl font-bold text-xs text-neutral-600 hover:bg-white hover:text-neutral-800 flex items-center gap-1.5 transition-all cursor-pointer">
          <span translate="no" className="material-symbols-outlined text-sm">arrow_back</span> Retour
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-gray-200 flex flex-col">
        <CourseHeader course={course} />
        <div className="flex flex-col lg:flex-row bg-[#FAF9F7]/30">
          <CourseSidebar course={course} details={details} />
          <div className="flex-grow flex flex-col">
            <CourseTabsNav state={state} />
            <div className="p-5 md:p-6 space-y-5">
              {activeTab === 'parcours' && <CourseParcoursTab course={course} details={details} />}
              {activeTab === 'chapters' && (
                <>
                  {courseReminders.length > 0 && <CourseRemindersList reminders={courseReminders} salle={course.salle} />}
                  <CourseChaptersTab state={state} />
                </>
              )}
              {activeTab === 'resources' && <CourseResourcesTab course={course} details={details} triggerToast={triggerToast} />}
              {activeTab === 'quizzes' && (
                <CourseQuizzesTab
                  details={details}
                  quizValidated={state.quizValidated}
                  selectedAnswers={state.selectedAnswers}
                  handleResetQuiz={state.handleResetQuiz}
                  handleSelectOption={state.handleSelectOption}
                  handleValidateQuiz={state.handleValidateQuiz}
                />
              )}
              {activeTab === 'homework' && (
                <CourseHomeworksTab
                  details={details}
                  homeworkStatus={state.homeworkStatus}
                  uploadedFiles={state.uploadedFiles}
                  uploadingId={state.uploadingId}
                  uploadProgress={state.uploadProgress}
                  handleFileChange={state.handleFileChange}
                  setUploadedFiles={state.setUploadedFiles}
                  setHomeworkStatus={state.setHomeworkStatus}
                  triggerToast={triggerToast}
                />
              )}
            </div>
            <div className="p-4 bg-[#FAF9F7] border-t border-neutral-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded-b-3xl text-[10px] text-neutral-500 font-bold">
              <span className="flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-[#3f1e1e] text-[18px]">verified</span>
                Syllabus académique certifié par l'École 221
              </span>
              <button onClick={() => navigate('/etudiant/cours')} className="px-5 py-3 border border-neutral-gray-300 rounded-2xl font-black uppercase text-[10px] tracking-wider text-neutral-500 hover:bg-white hover:text-[#291715] transition-all cursor-pointer">
                Retour aux cours
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
