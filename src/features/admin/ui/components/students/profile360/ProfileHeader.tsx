import React, { useState } from 'react';
import { Student } from '../../../../domain/StudentModels';

interface Props {
  selectedStudent: Student;
  onGenerateCert: () => void;
  certLoading: boolean;
}

export function ProfileHeader({ selectedStudent, onGenerateCert, certLoading }: Props) {
  const [qrRegenerated, setQrRegenerated] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);

  const handleRegenerateQr = () => {
    setQrRegenerated(true);
    setTimeout(() => setQrRegenerated(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between" id="profile-360-header">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-[#B3181C]/10 text-[#B3181C] font-black text-2xl rounded-full flex items-center justify-center border border-[#B3181C]/20 shadow-inner">
          {selectedStudent.name[0]}
        </div>
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-base leading-tight">{selectedStudent.name}</h3>
          <p className="text-xs text-neutral-400 font-bold mt-0.5">
            Matricule : <span className="text-neutral-600">{selectedStudent.matricule}</span> • Classe : <span className="text-neutral-600">{selectedStudent.classe}</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-extrabold uppercase text-neutral-500 tracking-wider">Compte Actif (ERP)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className={`px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-wider text-center ${selectedStudent.qrStatus === 'AUTORISÉ' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800 animate-pulse'}`}>
          {selectedStudent.qrStatus === 'AUTORISÉ' ? '🟢 ACCÈS COMPTEUR VALIDE' : '🔴 ACCÈS INTERDIT'}
        </div>
        <button
          onClick={onGenerateCert}
          disabled={certLoading}
          className="px-3 py-1.5 bg-[#B3181C] hover:bg-[#921316] text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-sm">print</span>
          <span>{certLoading ? 'Génération...' : 'Certificat Scolarité'}</span>
        </button>
        <button
          onClick={handleRegenerateQr}
          className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 bg-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-sm">qr_code_2</span>
          <span>{qrRegenerated ? 'Régénéré' : 'Clé QR'}</span>
        </button>
        <button
          onClick={handlePrint}
          className="p-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 bg-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
          title="Imprimer tout le dossier étudiant"
        >
          <span translate="no" className="material-symbols-outlined text-sm">print_connect</span>
        </button>
      </div>
    </div>
  );
}
