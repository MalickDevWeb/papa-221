import React, { useState } from 'react';
import { Student } from '../../../../domain/StudentModels';
import { getStudentERPData } from './utils/StudentMockData';
import { AdmissionCard, MedicalCard } from './GeneralCards';

interface Props {
  selectedStudent: Student;
  onUpdateStudent: (s: Student) => void;
  erpData?: any;
  onUpdateProfileFields?: (fields: any) => Promise<boolean>;
}

export function TabGeneral({ selectedStudent, onUpdateStudent, erpData, onUpdateProfileFields }: Props) {
  const finalErpData = erpData || getStudentERPData(selectedStudent.id, selectedStudent.name);
  const [phone, setPhone] = useState(selectedStudent.phoneParent);
  const [email, setEmail] = useState(selectedStudent.email);
  const [bloodGroup, setBloodGroup] = useState(finalErpData.extra?.sante?.split(',')[0] || 'O+');
  const [allergies, setAllergies] = useState(finalErpData.extra?.sante?.split(',')[1] || 'Aucune');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    onUpdateStudent({
      ...selectedStudent,
      email,
      phoneParent: phone
    });
    if (onUpdateProfileFields) {
      await onUpdateProfileFields({
        email,
        phoneParent: phone,
        bloodGroup,
        allergies
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-general">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-1">
        <div className="border border-neutral-100 p-3.5 rounded-2xl bg-neutral-50/50 space-y-2">
          <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[#B3181C]">
            <span translate="no" className="material-symbols-outlined text-sm">person</span>
            Fiche d'Identité & Contact
          </h4>
          <div className="space-y-1.5">
            <div>
              <label className="text-[10px] text-neutral-400 font-black uppercase">Adresse Email Institutionnelle</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-800" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-black uppercase">Téléphone Parent (Urgence)</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 p-1.5 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-800" />
            </div>
          </div>
        </div>

        <AdmissionCard admissionDetails={finalErpData.admissionDetails} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MedicalCard
          bloodGroup={bloodGroup}
          setBloodGroup={setBloodGroup}
          allergies={allergies}
          setAllergies={setAllergies}
        />

        <div className="border border-neutral-100 p-3.5 rounded-2xl bg-[#FAF8F6] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#B3181C]">
              <span translate="no" className="material-symbols-outlined text-sm">qr_code_2</span>
              Badge Numérique ERP
            </h4>
            <p className="text-[10px] text-neutral-400 leading-relaxed font-bold">
              Ce badge unique valide l'identité de {selectedStudent.name} pour l'accès aux salles, examens, bibliothèque et restaurant.
            </p>
          </div>
          <div className="w-16 h-16 bg-white border border-neutral-200 p-1 rounded-xl flex items-center justify-center shrink-0">
            <span translate="no" className="material-symbols-outlined text-4xl text-neutral-700">qr_code_scanner</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={handleSave} className="px-4 py-2 bg-[#B3181C] hover:bg-[#921316] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-sm">save</span>
          <span>{isSaved ? 'Enregistré avec succès !' : 'Enregistrer les modifications'}</span>
        </button>
      </div>
    </div>
  );
}
