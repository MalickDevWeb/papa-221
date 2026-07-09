import React from 'react';
import { GraduationCap, Award, ShieldCheck } from 'lucide-react';

interface ProfileDetailsProps {
  readonly isProf: boolean;
}

export function ProfileDetails({ isProf }: ProfileDetailsProps) {
  return (
    <div className="pt-2 border-t border-neutral-gray-100 space-y-2 text-[11px] text-secondary font-medium">
      <div className="flex justify-between items-center gap-3">
        <span className="text-neutral-gray-500 font-label-md text-label-md flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5 text-neutral-400" /> Faculté :
        </span>
        <span className="font-body-md text-body-md text-[#1E293B] text-right">Sciences & Tech</span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <span className="text-neutral-gray-500 font-label-md text-label-md flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-neutral-400" /> {isProf ? 'Grade :' : 'Moyenne générale :'}
        </span>
        <span className="font-label-md text-label-md text-brand-red-deep font-black">
          {isProf ? 'Docteur' : '16.69 / 20'}
        </span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <span className="text-neutral-gray-500 font-label-md text-label-md flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" /> Statut :
        </span>
        <span className="text-success-green font-label-md text-label-md flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse inline-block" />
          {isProf ? 'Enseignant Actif' : 'Inscrit S1 & S2'}
        </span>
      </div>
    </div>
  );
}
