import React from 'react';
import { createPortal } from 'react-dom';
import { CoursItem } from '@/features/student/types';

interface CourseDetailModalProps {
  course: CoursItem;
  onClose: () => void;
  onRedirect: (msg: string) => void;
}

export function CourseDetailModal({ course, onClose, onRedirect }: CourseDetailModalProps) {
  return createPortal(
    <div 
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-gray-200/50 flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-brand-red-deep p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all cursor-pointer"
          >
            <span translate="no" className="material-symbols-outlined text-[18px]">close</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-[10px] font-bold uppercase">
              {course.type}
            </span>
            {course.enCours && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#E3A857] text-[#291715] text-[10px] font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#291715] animate-pulse"></span>
                En Cours
              </span>
            )}
          </div>
          <h4 className="text-lg font-black leading-tight">{course.nom}</h4>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span translate="no" className="material-symbols-outlined text-brand-red-deep shrink-0 text-base mt-0.5">schedule</span>
            <div>
              <h5 className="font-extrabold text-[10px] text-secondary uppercase tracking-wider">Horaire & Jour</h5>
              <p className="text-xs text-on-surface font-semibold">{course.jour} • {course.heure}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span translate="no" className="material-symbols-outlined text-brand-red-deep shrink-0 text-base mt-0.5">location_on</span>
            <div>
              <h5 className="font-extrabold text-[10px] text-secondary uppercase tracking-wider">Salle (Campus Dakar)</h5>
              <p className="text-xs text-on-surface font-semibold">{course.salle}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span translate="no" className="material-symbols-outlined text-brand-red-deep shrink-0 text-base mt-0.5">person</span>
            <div>
              <h5 className="font-extrabold text-[10px] text-secondary uppercase tracking-wider">Enseignant responsable</h5>
              <p className="text-xs text-on-surface font-semibold">{course.professeur}</p>
            </div>
          </div>

          {course.description && (
            <div className="pt-3 border-t border-neutral-gray-100">
              <h5 className="font-extrabold text-[10px] text-secondary mb-1 uppercase tracking-wider">Aperçu du cours</h5>
              <p className="text-[11px] text-on-surface-variant leading-relaxed bg-[#FFF5F5] p-3.5 rounded-xl border border-[#B3181C]/5 font-medium">
                {course.description}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-surface-container-low border-t border-neutral-gray-200/50 flex gap-2">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 text-center border border-neutral-gray-200 rounded-xl font-bold text-xs cursor-pointer hover:bg-neutral-50 transition-colors"
          >
            Fermer
          </button>
          <button 
            onClick={() => {
              onRedirect(`Redirection vers l'espace de cours.`);
              onClose();
            }}
            className="flex-1 py-2.5 text-center bg-brand-red-deep hover:bg-[#8F1316] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow cursor-pointer transition-colors"
          >
            <span translate="no" className="material-symbols-outlined text-[14px]">school</span>
            Cours
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
