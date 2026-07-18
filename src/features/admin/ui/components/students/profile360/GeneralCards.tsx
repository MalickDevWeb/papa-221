import React from 'react';

interface AdmissionProps {
  admissionDetails: {
    lycee: string;
    bacSerie: string;
    bacGrade: string;
    bacMention: string;
  };
}

export function AdmissionCard({ admissionDetails }: AdmissionProps) {
  return (
    <div className="border border-neutral-100 p-3.5 rounded-2xl bg-neutral-50/50 space-y-2" id="admission-card">
      <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[#B3181C]">
        <span translate="no" className="material-symbols-outlined text-sm">school</span>
        Parcours Pré-Universitaire (Admission)
      </h4>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <p className="text-[9px] text-neutral-400 font-bold uppercase">Lycée d'origine</p>
          <p className="text-neutral-800 font-extrabold">{admissionDetails.lycee}</p>
        </div>
        <div>
          <p className="text-[9px] text-neutral-400 font-bold uppercase">Série Bac</p>
          <p className="text-neutral-800 font-extrabold">{admissionDetails.bacSerie}</p>
        </div>
        <div>
          <p className="text-[9px] text-neutral-400 font-bold uppercase">Note Bac</p>
          <p className="text-[#B3181C] font-extrabold">{admissionDetails.bacGrade}</p>
        </div>
        <div>
          <p className="text-[9px] text-neutral-400 font-bold uppercase">Mention Bac</p>
          <p className="text-emerald-700 font-extrabold">{admissionDetails.bacMention}</p>
        </div>
      </div>
    </div>
  );
}

interface MedicalProps {
  bloodGroup: string;
  setBloodGroup: (val: string) => void;
  allergies: string;
  setAllergies: (val: string) => void;
}

export function MedicalCard({ bloodGroup, setBloodGroup, allergies, setAllergies }: MedicalProps) {
  return (
    <div className="border border-neutral-100 p-3.5 rounded-2xl bg-neutral-50/50 space-y-2" id="medical-card">
      <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#B3181C]">
        <span translate="no" className="material-symbols-outlined text-sm">medical_services</span>
        Fiche Médicale (Sécurisée)
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] text-neutral-400 font-bold uppercase">Groupe Sanguin</label>
          <input
            type="text"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full mt-1 p-1 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-800"
          />
        </div>
        <div>
          <label className="text-[9px] text-neutral-400 font-bold uppercase">Allergies / Particularités</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full mt-1 p-1 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-800"
          />
        </div>
      </div>
    </div>
  );
}
