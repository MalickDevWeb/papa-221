import React, { useState } from 'react';
import { uploadToCloudinary } from '@/shared/utils/cloudinaryUpload';

interface AcademicUploadFieldProps {
  label: string;
  icon: string;
  value: string;
  onChange: (val: string) => void;
  accept?: string;
}

export function AcademicUploadField({ label, icon, value, onChange, accept = '.pdf,.jpg' }: AcademicUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const processFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Téléversement échoué');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const isUploaded = value !== 'Non fourni' && value !== '';

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-[#3E2927] uppercase tracking-wider">{label}</label>
      <div 
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }} 
        onDragLeave={() => setIsDragging(false)} 
        onDrop={handleDrop} 
        className={`border-2 border-dashed rounded-xl p-2.5 text-center transition-all cursor-pointer relative ${isDragging ? 'border-[#B3181C] bg-[#FFF5F5]' : isUploaded ? 'border-[#1E5E3A] bg-[#EAF7EE]/40' : 'border-[#E2DCDA] hover:bg-[#FAF8F6]'}`}
      >
        <input type="file" accept={accept} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
        <span translate="no" className={`material-symbols-outlined text-xl ${uploading ? 'animate-spin text-[#B3181C]' : isUploaded ? 'text-[#1E5E3A]' : 'text-[#8E7977]'}`}>
          {uploading ? 'sync' : isUploaded ? 'cloud_done' : icon}
        </span>
        <p className="text-[10px] font-bold text-[#3E2927] mt-1">
          {uploading ? 'Téléversement Cloudinary...' : isUploaded ? 'Document_Charge.pdf (Stocké Cloud)' : `Cliquer pour ajouter un fichier`}
        </p>
      </div>
      {error && <p className="text-[9px] text-[#B3181C] font-semibold mt-0.5">{error}</p>}
    </div>
  );
}
