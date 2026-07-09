import React from 'react';

interface Homework {
  id: string;
  titre: string;
  dateLimite: string;
  points: string;
}

export function CourseHomeworksTab({
  details,
  homeworkStatus,
  uploadedFiles,
  uploadingId,
  uploadProgress,
  handleFileChange,
  setUploadedFiles,
  setHomeworkStatus,
  triggerToast
}: {
  details: { devoirs: Homework[] };
  homeworkStatus: Record<string, 'A rendre' | 'Soumis'>;
  uploadedFiles: Record<string, { name: string; size: string }>;
  uploadingId: string | null;
  uploadProgress: number;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  setUploadedFiles: React.Dispatch<React.SetStateAction<Record<string, { name: string; size: string }>>>;
  setHomeworkStatus: React.Dispatch<React.SetStateAction<Record<string, 'A rendre' | 'Soumis'>>>;
  triggerToast: (msg: string) => void;
}) {
  return (
    <div className="space-y-4 animate-fade-in font-sans">
      <div className="bg-white border border-neutral-gray-250 p-5 rounded-3xl space-y-4">
        <div>
          <h5 className="font-black text-xs text-[#3f1e1e] uppercase tracking-wider flex items-center gap-1.5">
            <span translate="no" className="material-symbols-outlined text-base">upload_file</span>
            Remise des Travaux Dirigés (TD/TP)
          </h5>
          <p className="text-[10px] text-neutral-500 font-bold">Déposez vos livrables ou devoirs avant la date limite.</p>
        </div>

        <div className="space-y-4">
          {details.devoirs.map((dev) => {
            const status = homeworkStatus[dev.id];
            const uploaded = uploadedFiles[dev.id];
            
            return (
              <div key={dev.id} className="bg-[#FAF9F7] rounded-2xl p-4 border border-neutral-gray-250 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-gray-200/60 pb-3">
                  <div>
                    <h6 className="text-xs font-black text-[#291715]">{dev.titre}</h6>
                    <div className="flex flex-wrap gap-2 text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                      <span>Limite : {dev.dateLimite} • Barème : {dev.points}</span>
                    </div>
                  </div>
                  <span className={`self-start sm:self-center text-[9px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${status === 'Soumis' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {status === 'Soumis' ? '🟢 Soumis' : '⏳ À Rendre'}
                  </span>
                </div>

                {uploaded ? (
                  <div className="bg-white rounded-xl p-3 border border-neutral-gray-150 flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-xs font-bold text-neutral-600 min-w-0">
                      <span translate="no" className="material-symbols-outlined text-emerald-500 shrink-0">check_circle</span>
                      <span className="truncate">{uploaded.name} ({uploaded.size})</span>
                    </span>
                    <button 
                      onClick={() => {
                        setUploadedFiles(prev => { const c = { ...prev }; delete c[dev.id]; return c; });
                        setHomeworkStatus(prev => ({ ...prev, [dev.id]: 'A rendre' }));
                        triggerToast("La soumission du devoir a été annulée.");
                      }}
                      className="text-[9px] font-black text-red-500 hover:underline uppercase tracking-wider cursor-pointer font-sans"
                    >
                      Retirer
                    </button>
                  </div>
                ) : uploadingId === dev.id ? (
                  <div className="bg-white rounded-xl p-4 border border-neutral-gray-150 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black text-neutral-500 uppercase tracking-wider">
                      <span>Téléversement...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-red-deep rounded-full duration-100" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-dashed border-neutral-gray-350 p-6 text-center space-y-2 relative hover:bg-neutral-50/50 transition-colors">
                    <input type="file" id={`file-${dev.id}`} onChange={(e) => handleFileChange(e, dev.id)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <span translate="no" className="material-symbols-outlined text-neutral-400 text-3xl">upload_file</span>
                    <p className="text-[11px] font-bold text-[#291715]">Glissez-déposez votre fichier ici, ou <span className="text-brand-red-deep underline">parcourez vos fichiers</span></p>
                    <p className="text-[9px] text-neutral-400 font-bold">PDF, ZIP, RAR, PNG (Max 15 Mo)</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
