import React from 'react';
import { GraduationCap, Award, ShieldCheck } from 'lucide-react';

interface ProfileDetailsProps {
  readonly isProf: boolean;
}

export function ProfileDetails({ isProf }: ProfileDetailsProps) {
  return (
    <div className="pt-3 border-t border-neutral-150 space-y-2.5">
      <div className="bg-neutral-gray-50/70 border border-neutral-gray-200/60 rounded-2xl p-3 space-y-2.5 text-[11px] text-secondary font-medium shadow-3xs">
        <div className="flex justify-between items-center gap-3">
          <span className="text-neutral-gray-500 font-label-md text-label-md flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-neutral-400" /> Faculté :
          </span>
          <span className="font-body-md text-body-md text-[#1E293B] font-semibold text-right">Sciences & Tech</span>
        </div>
        <div className="flex justify-between items-center gap-3">
          <span className="text-neutral-gray-500 font-label-md text-label-md flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-neutral-400" /> {isProf ? 'Grade :' : 'Moyenne générale :'}
          </span>
          <span className="font-label-md text-label-md text-brand-red-deep font-black">
            {isProf ? 'Docteur' : '16.69 / 20'}
          </span>
        </div>
        <div className="flex justify-between items-center gap-3">
          <span className="text-neutral-gray-500 font-label-md text-label-md flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" /> Statut :
          </span>
          <span className="text-success-green font-label-md text-label-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse inline-block" />
            {isProf ? 'Enseignant Actif' : 'Inscrit S1 & S2'}
          </span>
        </div>
      </div>
    </div>
  );
}
