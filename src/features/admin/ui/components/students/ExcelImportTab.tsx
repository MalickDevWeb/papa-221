import React, { useState } from 'react';
import { Student } from '../../../domain/StudentModels';

interface Props {
  students: Student[];
  onAddStudents: (newList: Student[]) => void;
}

export function ExcelImportTab({ onAddStudents }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [previewList, setPreviewList] = useState<any[]>([]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return;
      
      const separator = lines[0].includes(';') ? ';' : lines[0].includes(',') ? ',' : '\t';
      const parsedHeaders = lines[0].split(separator).map(h => h.trim().toLowerCase());
      const rows = lines.slice(1).map(line => line.split(separator).map(cell => cell.trim()));

      const list = rows.map((row, idx) => {
        const student: any = {
          id: `s-imported-${Date.now()}-${idx}`,
          financialStatus: 'En Règle',
          qrStatus: 'AUTORISÉ',
          gpa: '14.5/20',
          phoneParent: '+221 77 000 00 00'
        };
        parsedHeaders.forEach((h, i) => {
          if (h.includes('nom') || h.includes('name')) student.name = row[i];
          else if (h.includes('matr') || h.includes('id')) student.matricule = row[i];
          else if (h.includes('email')) student.email = row[i];
          else if (h.includes('class') || h.includes('promo')) student.classe = row[i];
        });
        if (!student.name) student.name = `Etudiant ${idx + 1}`;
        if (!student.matricule) student.matricule = `MAT-${Date.now()}-${idx}`;
        if (!student.email) student.email = `${student.name.toLowerCase().replace(/\s+/g, '.')}@ecole221.sn`;
        if (!student.classe) student.classe = 'L1 Génie Civil';
        return student;
      });

      setPreviewList(list);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const executeImport = () => {
    onAddStudents(previewList);
    setStep(1);
    setPreviewList([]);
  };

  const downloadTemplate = () => {
    const csvContent = "Nom;Matricule;Email;Classe\nMamadou Diagne;2026-GC-005;mamadou.diagne@ecole221.sn;L1 Génie Civil\nAmina Fall;2026-TI-099;amina.fall@ecole221.sn;Master 1 Spécialité IA";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "modele_import_etudiants.csv";
    link.click();
  };

  return (
    <div className="space-y-4 text-xs font-bold text-neutral-600" id="excel-import-tab">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
        <div>
          <h4 className="font-extrabold text-[#1E293B] text-sm">Importateur Excel / CSV</h4>
          <p className="text-[10px] text-neutral-400 font-semibold">Téléverser et valider des listes d'étudiants.</p>
        </div>
        <button onClick={downloadTemplate} className="px-2.5 py-1 bg-[#B3181C]/10 hover:bg-[#B3181C]/20 text-[#B3181C] font-black uppercase text-[9px] tracking-wider rounded-lg flex items-center gap-1 transition-all">
          <span translate="no" className="material-symbols-outlined text-xs">download</span>
          <span>Modèle CSV</span>
        </button>
      </div>

      {step === 1 ? (
        <div 
          onDragOver={e => e.preventDefault()} 
          onDrop={e => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }} 
          className="border-2 border-dashed border-neutral-200 py-10 rounded-2xl hover:bg-neutral-50/50 transition-colors text-center cursor-pointer flex flex-col items-center justify-center space-y-2"
        >
          <span translate="no" className="material-symbols-outlined text-3xl text-neutral-300">cloud_upload</span>
          <p className="text-xs font-bold text-[#1E293B]">Glissez-déposez le fichier CSV ici</p>
          <input type="file" id="csv-file-input" className="hidden" accept=".csv,.txt" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
          <label htmlFor="csv-file-input" className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md text-[10px] cursor-pointer font-bold inline-block">Parcourir...</label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2.5 rounded-xl text-[10px] leading-tight">
            Analyse terminée. {previewList.length} étudiants détectés avec succès.
          </div>
          <div className="overflow-x-auto border border-neutral-200 rounded-xl max-h-48 overflow-y-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="bg-[#FAF8F6] text-neutral-400 border-b border-neutral-200 uppercase font-black text-[8px]">
                  <th className="px-3 py-1.5">Matricule</th>
                  <th className="px-3 py-1.5">Nom</th>
                  <th className="px-3 py-1.5">Email</th>
                  <th className="px-3 py-1.5">Classe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-bold text-neutral-700 bg-white">
                {previewList.map((p, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1.5 text-neutral-800 font-bold">{p.matricule}</td>
                    <td className="px-3 py-1.5 text-neutral-600">{p.name}</td>
                    <td className="px-3 py-1.5 text-neutral-500 font-normal">{p.email}</td>
                    <td className="px-3 py-1.5 text-neutral-600">{p.classe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setStep(1)} className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50 uppercase tracking-wider text-[9px] font-black">Retour</button>
            <button onClick={executeImport} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg uppercase tracking-wider text-[9px] font-black">Importer les étudiants ({previewList.length})</button>
          </div>
        </div>
      )}
    </div>
  );
}
