import React from 'react';

export function CourseHeader() {
  return (
    <div className="w-full mb-8">
      {/* Title & subtitle taking full width */}
      <div className="w-full border-b border-neutral-gray-200/50 pb-5">
        <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-2 font-black tracking-tight">
          Catalogue des Cours
        </h1>
        <p className="text-sm md:text-base text-neutral-gray-500 font-medium">
          Gérez votre parcours académique et explorez de nouvelles spécialités.
        </p>
      </div>
    </div>
  );
}

