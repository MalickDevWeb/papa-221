import React, { useState } from 'react';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmInput({ onConfirm, onCancel }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = localStorage.getItem('school_delete_security_code') || '221';
    if (code === correctCode) {
      onConfirm();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-2.5 animate-fade-in w-full text-left">
      <div className="text-[10px] font-black text-red-800 uppercase tracking-wide flex items-center gap-1">
        <span translate="no" className="material-symbols-outlined text-xs">security</span>
        <span>Validation de Sécurité Requise</span>
      </div>
      <p className="text-[9.5px] text-neutral-500 font-semibold leading-tight">
        Saisissez le code de sécurité pour confirmer cette action.
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Code de sécurité"
          className={`flex-grow px-2.5 py-1.5 border rounded-lg text-xs font-bold focus:outline-none focus:border-red-600 bg-white ${
            error ? 'border-red-500 text-red-600' : 'border-neutral-200 text-[#1E293B]'
          }`}
          required
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-[#B3181C] hover:bg-[#921316] text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0 border-0"
        >
          Valider
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0 border-0"
        >
          Annuler
        </button>
      </div>
      {error && (
        <p className="text-[9px] text-red-600 font-black tracking-tight">
          Code incorrect. Action refusée.
        </p>
      )}
    </form>
  );
}
