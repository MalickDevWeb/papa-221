import React from 'react';

export function CourseHeader({ course }: { course: any }) {
  return (
    <div className="relative h-32 md:h-48 bg-neutral-gray-900 shrink-0 select-none">
      <img className="w-full h-full object-cover opacity-60" src={course.image} alt={course.nom} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#291715] via-[#291715]/40 to-transparent"></div>

      <div className="absolute bottom-4 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-lg bg-[#E3A857] text-[#291715] text-[10px] font-black uppercase tracking-wider shadow-xs">
              {course.categorie}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-white/25 text-white text-[9px] font-black uppercase tracking-wider">
              {course.volumeHoraire || "30 Heures"}
            </span>
          </div>
          <h1 className="text-lg md:text-2xl font-black leading-tight tracking-tight uppercase drop-shadow-md">
            {course.nom}
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-[10px] font-black uppercase tracking-wider text-white">
            Professeur : <span className="text-[#E3A857]">{course.professeur}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
