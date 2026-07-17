import React from 'react';
import { AdmissionType } from '../../../domain/AdmissionsExtendedModels';

interface Props {
  type: AdmissionType;
}

export function CandidateAdmissionBadge({ type }: Props) {
  const mapping: Record<AdmissionType, { label: string; style: string }> = {
    BAC: { label: 'Nouveau Bachelier', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    L2: { label: 'Admission L2', style: 'bg-blue-50 text-blue-700 border-blue-200' },
    L3: { label: 'Admission L3', style: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    M1: { label: 'Admission M1', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    M2: { label: 'Admission M2', style: 'bg-teal-50 text-teal-700 border-teal-200' },
    DOC: { label: 'Doctorat', style: 'bg-purple-50 text-purple-700 border-purple-200' },
    TRANSFER: { label: 'Transfert', style: 'bg-amber-50 text-amber-700 border-amber-200' },
    CHANGE_FILIERE: { label: 'Chgmt Filière', style: 'bg-orange-50 text-orange-700 border-orange-200' },
    CHANGE_FACULTE: { label: 'Chgmt Faculté', style: 'bg-pink-50 text-pink-700 border-pink-200' },
    REORIENTATION: { label: 'Réorientation', style: 'bg-rose-50 text-rose-700 border-rose-200' },
    REPRISE: { label: 'Reprise Études', style: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    REINSCRIPTION: { label: 'Réinscription', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    INT: { label: 'International', style: 'bg-sky-50 text-sky-700 border-sky-200' },
    VAE: { label: 'VAE', style: 'bg-slate-50 text-slate-700 border-slate-200' },
    PRO: { label: 'Form. Continue', style: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
    EXCEPT: { label: 'Admission Exceptionnelle', style: 'bg-[#B3181C]/10 text-[#B3181C] border-[#B3181C]/20' }
  };

  const badge = mapping[type] || { label: type, style: 'bg-neutral-100 text-neutral-700 border-neutral-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${badge.style}`}>
      {badge.label}
    </span>
  );
}
