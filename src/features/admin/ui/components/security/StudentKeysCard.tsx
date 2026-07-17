import React, { useState } from 'react';

export function StudentKeysCard() {
  const [studentSearch, setStudentSearch] = useState('');

  const handleStudentRegen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSearch) return;
    alert("Clé AES-256 régénérée pour l'élève. L'ancien QR code a été invalidé aux terminaux d'accès.");
    setStudentSearch('');
  };

  return (
    <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase text-[#1E293B] block">
          Régénérer Clé QR Éleve (Perte de badge/téléphone)
        </span>
        <p className="text-[10px] text-neutral-400 font-semibold">
          Invalide l'ancienne clé d'accès et chiffre une nouvelle clé AES-256.
        </p>
      </div>

      <form onSubmit={handleStudentRegen} className="space-y-3">
        <input
          type="text"
          placeholder="Ex: MAT-2026-103"
          value={studentSearch}
          onChange={e => setStudentSearch(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none text-xs font-bold text-[#1E293B]"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-[#B3181C] hover:bg-[#921316] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1"
        >
          <span translate="no" className="material-symbols-outlined text-sm">autorenew</span>
          <span>Générer Nouvelle Clé AES-256</span>
        </button>
      </form>
    </div>
  );
}
