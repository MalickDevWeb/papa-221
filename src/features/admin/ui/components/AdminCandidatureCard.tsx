import React, { useState } from 'react';

interface Candidature {
  id: string; nomComplet: string; email: string; telephone: string;
  typeDepot: 'En ligne' | 'Présentiel'; promotionNom: string; motivation: string;
  statut: 'En attente' | 'Accepté' | 'Refusé'; dateSoumission: string;
  numeroCni?: string; dernierEtablissement?: string; dernierDiplome?: string;
  nomFichierCni?: string; nomFichierBulletin?: string; nomFichierDiplome?: string;
}

export function AdminCandidatureCard({ cand, processingId, onUpdateStatus }: {
  cand: Candidature; processingId: string | null; onUpdateStatus: (id: string, s: 'Accepté' | 'Refusé') => void;
}) {
  const [viewDoc, setViewDoc] = useState<string | null>(null);
  const docs = [
    { label: 'CNI / Passeport', icon: 'contact_emergency', filename: cand.nomFichierCni || 'Non fourni', id: 'cni' },
    { label: 'Bulletins / Relevés', icon: 'text_snippet', filename: cand.nomFichierBulletin || 'Non fourni', id: 'bulletin' },
    { label: 'Diplôme obtenu', icon: 'school', filename: cand.nomFichierDiplome || 'Non fourni', id: 'diplome' }
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-[#E2DCDA] shadow-sm space-y-3 animate-fade-in text-xs">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#291715]">{cand.nomComplet}</span>
            <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${cand.typeDepot === 'En ligne' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>Dépôt {cand.typeDepot}</span>
          </div>
          <p className="text-[10px] text-[#8E7977] font-semibold mt-0.5">📧 {cand.email} • 📞 {cand.telephone}</p>
        </div>
        <span className="text-[9px] font-bold text-[#8E7977] bg-[#FAF8F6] px-2 py-0.5 rounded border border-[#E2DCDA]">Promotion {cand.promotionNom}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-[#FAF8F6] p-2.5 rounded-xl border border-[#E2DCDA]/60 text-[10px]">
        <div>
          <span className="text-[#8E7977] block text-[8px] font-black">ÉTABLISSEMENT D'ORIGINE</span>
          <span className="font-bold text-[#291715]">{cand.dernierEtablissement || 'Non renseigné'}</span>
        </div>
        <div>
          <span className="text-[#8E7977] block text-[8px] font-black">DERNIER DIPLÔME</span>
          <span className="font-bold text-[#291715]">{cand.dernierDiplome || 'Non renseigné'}</span>
        </div>
        <div className="col-span-2 mt-1 pt-1 border-t border-[#E2DCDA]/40">
          <span className="text-[#8E7977] block text-[8px] font-black">NUMÉRO NATIONAL CNI</span>
          <span className="font-mono font-bold text-[#B3181C]">{cand.numeroCni || 'N/A'}</span>
        </div>
      </div>

      {cand.motivation && <div className="text-[10px] italic text-[#8E7977] bg-[#FAF8F6] p-2 rounded-xl border border-[#E2DCDA]/60">" {cand.motivation} "</div>}

      <div>
        <span className="text-[8px] font-black text-[#8E7977] uppercase block mb-1">Justificatifs Académiques & d'Identité</span>
        <div className="grid grid-cols-3 gap-2">
          {docs.map(doc => (
            <button key={doc.id} onClick={() => setViewDoc(viewDoc === doc.id ? null : doc.id)} className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${viewDoc === doc.id ? 'bg-[#FFF5F5] border-[#B3181C] text-[#B3181C]' : 'bg-white border-[#E2DCDA] text-[#3E2927] hover:bg-[#FAF8F6]'}`}>
              <span translate="no" className="material-symbols-outlined text-lg mb-0.5">{doc.icon}</span>
              <span className="text-[8.5px] font-black uppercase tracking-tight block truncate w-full">{doc.label}</span>
              <span className="text-[8px] text-[#8E7977] block truncate w-full mt-0.5">{doc.filename}</span>
            </button>
          ))}
        </div>
      </div>

      {viewDoc && (
        <div className="bg-[#EAF7EE] p-2 rounded-xl border border-[#D0EBD9] flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-[#1E5E3A] font-bold">
            <span translate="no" className="material-symbols-outlined text-sm">verified_user</span>
            <span>Document original ({viewDoc.toUpperCase()})</span>
          </div>
          {(() => {
            const currentDoc = docs.find(d => d.id === viewDoc);
            const isUrl = currentDoc && (currentDoc.filename.startsWith("http://") || currentDoc.filename.startsWith("https://"));
            if (isUrl) {
              return (
                <a 
                  href={currentDoc.filename} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-2 py-1 rounded bg-[#1E5E3A] text-white text-[9px] font-bold uppercase transition-all hover:bg-[#154228]"
                >
                  Ouvrir ↗
                </a>
              );
            }
            return <span className="text-[9px] font-semibold text-[#1E5E3A]/80 uppercase">[ Conforme ]</span>;
          })()}
        </div>
      )}

      {cand.statut === 'En attente' && (
        <div className="flex gap-2 justify-end pt-1">
          <button disabled={processingId !== null} onClick={() => onUpdateStatus(cand.id, 'Refusé')} className="px-3.5 py-1.5 rounded-xl text-[9.5px] font-black uppercase bg-[#FFF5F5] text-[#B3181C] border border-[#FFD1D1] hover:bg-[#FFE6E6] transition-all">Refuser</button>
          <button disabled={processingId !== null} onClick={() => onUpdateStatus(cand.id, 'Accepté')} className="px-4 py-1.5 rounded-xl text-[9.5px] font-black uppercase bg-[#EAF7EE] text-[#1E5E3A] border border-[#D0EBD9] hover:bg-[#D9F2E2] transition-all">Accepter & Inscrire</button>
        </div>
      )}
    </div>
  );
}
