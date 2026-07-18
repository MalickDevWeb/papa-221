import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Document {
  id: string;
  name: string;
  size: string;
  url: string;
}

export function CoffreSubTab({ studentId }: { studentId: string }) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/students/${studentId}/documents`);
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const upRes = await axios.post('/api/upload', { fileStr: reader.result as string });
        if (upRes.data?.url) {
          const docRes = await axios.post(`/api/admin/students/${studentId}/documents`, {
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} Mo`,
            url: upRes.data.url
          });
          setDocs(docRes.data?.documents || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 text-xs" id="coffre-sub-tab">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) {
            uploadFile(e.dataTransfer.files[0]);
          }
        }}
        className="border border-dashed border-neutral-300 p-4 rounded-xl hover:bg-neutral-50 text-center cursor-pointer text-neutral-500 flex flex-col items-center justify-center transition-colors"
      >
        <span translate="no" className="material-symbols-outlined text-xl text-neutral-400 mb-0.5">
          upload_file
        </span>
        <span className="font-bold text-neutral-700">Déposer ou sélectionner un fichier</span>
        <input
          type="file"
          id="file-upload-input"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        />
        <label
          htmlFor="file-upload-input"
          className="mt-1 px-2.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-semibold text-[9px] cursor-pointer inline-block"
        >
          Parcourir...
        </label>
      </div>

      {uploading && (
        <div className="text-center py-1.5 text-[9px] text-neutral-500 font-bold animate-pulse">
          ⏳ Téléversement Cloudinary...
        </div>
      )}

      <div className="space-y-1.5">
        <h5 className="font-bold text-[#1E293B] text-[9px] uppercase tracking-wider">
          Documents Archivés ({docs.length})
        </h5>
        {loading ? (
          <p className="text-[10px] text-neutral-400">Chargement...</p>
        ) : docs.length === 0 ? (
          <p className="text-[10px] text-neutral-400">Aucun document.</p>
        ) : (
          docs.map((d) => (
            <div
              key={d.id || d.name}
              className="flex items-center justify-between p-2 border border-neutral-150 rounded-xl bg-white hover:border-[#B3181C]/20 transition-all shadow-3xs"
            >
              <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                <span translate="no" className="material-symbols-outlined text-neutral-400 text-xs">
                  description
                </span>
                <span className="truncate font-bold text-neutral-700 text-[11px]">{d.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] text-neutral-400 font-medium">{d.size}</span>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 bg-[#B3181C]/10 text-[#B3181C] hover:bg-[#B3181C]/20 rounded-md font-black text-[9px] uppercase tracking-wider transition-colors inline-block"
                >
                  Ouvrir
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
