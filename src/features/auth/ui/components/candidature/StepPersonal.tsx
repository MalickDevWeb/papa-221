import React, { useState } from 'react';
import { uploadToCloudinary } from '@/shared/utils/cloudinaryUpload';

interface StepPersonalProps {
  nomComplet: string; setNomComplet: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  telephone: string; setTelephone: (v: string) => void;
  numeroCni: string; setNumeroCni: (v: string) => void;
  nomFichierCni: string; setNomFichierCni: (v: string) => void;
  onNext: () => void;
  cniRequis?: boolean;
}

export function StepPersonal({
  nomComplet, setNomComplet, email, setEmail, telephone, setTelephone,
  numeroCni, setNumeroCni, nomFichierCni, setNomFichierCni, onNext, cniRequis = true
}: StepPersonalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const processFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadToCloudinary(file);
      setNomFichierCni(url);
    } catch (err: any) {
      setUploadError(err.message || 'Erreur lors du dépôt.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const canContinue = nomComplet.trim() && email.trim() && telephone.trim() && numeroCni.trim() && !uploading && (!cniRequis || nomFichierCni !== 'Non fourni');


  return (
    <div className="space-y-3 animate-fade-in text-xs" id="step-personal-form">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Nom complet *</label>
        <input className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-3 text-[#291715] focus:border-[#B3181C] outline-none font-semibold" placeholder="ex: Assane Diop" value={nomComplet} onChange={e => setNomComplet(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Adresse email *</label>
          <input className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-3 text-[#291715] focus:border-[#B3181C] outline-none" placeholder="ex: cand@ecole221.sn" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Téléphone *</label>
          <input className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-3 text-[#291715] focus:border-[#B3181C] outline-none" placeholder="77 000 00 00" value={telephone} onChange={e => setTelephone(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Numéro de CNI / Passeport *</label>
        <input className="w-full h-10 bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl px-3 text-[#291715] focus:border-[#B3181C] outline-none font-mono" placeholder="ex: 1 234 1999 12345" value={numeroCni} onChange={e => setNumeroCni(e.target.value)} />
      </div>

      {cniRequis && (
        <div className="space-y-1" id="cni-upload-container">
          <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">Justificatif d'identité *</label>
          <div onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer relative ${isDragging ? 'border-[#B3181C] bg-[#FFF5F5]' : nomFichierCni !== 'Non fourni' ? 'border-[#1E5E3A] bg-[#EAF7EE]/40' : 'border-[#E2DCDA] hover:bg-[#FAF8F6]'}`}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
            <span translate="no" className={`material-symbols-outlined text-2xl ${uploading ? 'animate-spin text-[#B3181C]' : nomFichierCni !== 'Non fourni' ? 'text-[#1E5E3A]' : 'text-[#8E7977]'}`}>
              {uploading ? 'sync' : nomFichierCni !== 'Non fourni' ? 'verified' : 'contact_emergency'}
            </span>
            <p className="text-[11px] font-bold text-[#3E2927] mt-1">
              {uploading ? 'Téléversement Cloudinary...' : nomFichierCni !== 'Non fourni' ? 'CNI_Charge.pdf (Stocké Cloud)' : 'Glissez-déposez votre CNI ou cliquez'}
            </p>
            <p className="text-[9px] text-[#8E7977]">PDF, PNG ou JPG (Max. 5 Mo)</p>
          </div>
          {uploadError && <p className="text-[10px] text-[#B3181C] font-semibold mt-1">{uploadError}</p>}
        </div>
      )}

      <button type="button" onClick={onNext} disabled={!canContinue} className={`w-full h-10 rounded-xl font-bold uppercase tracking-wider transition-all mt-2 flex items-center justify-center gap-1.5 ${canContinue ? 'bg-[#B3181C] hover:bg-[#8F1316] text-white shadow-md cursor-pointer' : 'bg-[#E2DCDA] text-[#8E7977] cursor-not-allowed'}`} id="step-personal-next-btn">
        <span>Continuer (Parcours Scolaire)</span>
        <span translate="no" className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
    </div>
  );
}
