import React, { useState, useEffect } from 'react';

export function DeleteSecurityCodeCard() {
  const [code, setCode] = useState('221');
  const [showCode, setShowCode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('school_delete_security_code');
    if (stored) {
      setCode(stored);
    } else {
      localStorage.setItem('school_delete_security_code', '221');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('school_delete_security_code', code);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase text-[#1E293B] block">
          Code de Sécurité (Suppressions & Annulations)
        </span>
        <p className="text-[10px] text-neutral-400 font-semibold">
          Ce code/mot de passe sera requis pour valider toute suppression de créneau ou annulation de cours.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="relative">
          <input
            type={showCode ? 'text' : 'password'}
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none text-xs font-bold text-[#1E293B] pr-10"
            placeholder="Ex: 221"
            required
          />
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none border-0 bg-transparent cursor-pointer flex items-center justify-center"
          >
            <span translate="no" className="material-symbols-outlined text-sm font-black">
              {showCode ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1 text-white ${
            saved ? 'bg-emerald-600 hover:bg-emerald-750' : 'bg-[#B3181C] hover:bg-[#921316]'
          }`}
        >
          <span translate="no" className="material-symbols-outlined text-sm">
            {saved ? 'check_circle' : 'save'}
          </span>
          <span>{saved ? 'Code Enregistré !' : 'Enregistrer le Code'}</span>
        </button>
      </form>
    </div>
  );
}
