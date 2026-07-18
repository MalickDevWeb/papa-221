import React, { useState } from 'react';

interface AdminAlertsModalProps {
  onClose: () => void;
}

export function AdminAlertsModal({ onClose }: AdminAlertsModalProps) {
  const [alertText, setAlertText] = useState('');
  const [category, setCategory] = useState<'Système' | 'Inscriptions' | 'IT Admin'>('Système');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertText) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Alerte globale diffusée avec succès à tout l\'établissement !');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#FAF8F6] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-[#E2DCDA]">
        <div className="p-4 bg-white border-b border-[#E2DCDA] flex justify-between items-center">
          <h3 className="font-black text-base text-[#291715]">Alerte Globale</h3>
          <button onClick={onClose} className="text-[#8E7977] hover:text-[#B3181C] font-bold">[ Fermer ]</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8E7977] uppercase block">Catégorie</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-white border border-[#E2DCDA] rounded-xl p-2.5 text-xs outline-none focus:border-[#B3181C]"
            >
              <option value="Système">Système (Info)</option>
              <option value="Inscriptions">Inscriptions (Scolarité)</option>
              <option value="IT Admin">IT Admin (Maintenance)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8E7977] uppercase block">Contenu de l'Alerte</label>
            <textarea
              value={alertText}
              onChange={(e) => setAlertText(e.target.value)}
              placeholder="Saisissez le message d'alerte à diffuser..."
              rows={4}
              className="w-full bg-white border border-[#E2DCDA] rounded-xl p-2.5 text-xs outline-none focus:border-[#B3181C]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B3181C] hover:bg-[#8F1316] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#B3181C]/15 transition-all"
          >
            {loading ? 'Diffusion...' : 'Diffuser l\'Alerte'}
          </button>
        </form>
      </div>
    </div>
  );
}
