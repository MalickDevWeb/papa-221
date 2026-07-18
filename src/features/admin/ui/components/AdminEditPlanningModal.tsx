import React, { useEffect, useState, useCallback } from 'react';
import { useAdminPlanning } from '../../hooks/useAdminPlanning';
import type { AdminSession } from '../../domain/AdminModels';

export function AdminEditPlanningModal({ onClose }: { onClose: () => void }) {
  const { sessions, reprogrammerSession } = useAdminPlanning();
  const [selectedId, setSelectedId] = useState<string>('');
  const [day, setDay] = useState('LUNDI');
  const [time, setTime] = useState('08:00 - 10:00');
  const [room, setRoom] = useState('Amphi A');
  const [saving, setSaving] = useState(false);

  const selectSession = useCallback((s: AdminSession) => {
    setSelectedId(s.id);
    setDay(s.jourComplet);
    setTime(s.heureStr);
    setRoom(s.salle);
  }, []);

  useEffect(() => {
    if (sessions.length > 0 && !selectedId) {
      selectSession(sessions[0]);
    }
  }, [sessions, selectedId, selectSession]);

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    const ok = await reprogrammerSession(selectedId, { jourComplet: day, heureStr: time, salle: room });
    setSaving(false);
    if (ok) {
      alert('Séance reprogrammée avec succès !');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAF8F6] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-[#E2DCDA]">
        <div className="p-4 bg-white border-b border-[#E2DCDA] flex justify-between items-center">
          <h3 className="font-black text-sm text-[#291715]">Éditer le Planning</h3>
          <button onClick={onClose} className="text-[#8E7977] hover:text-[#B3181C] text-xs font-bold">[ Fermer ]</button>
        </div>
        <div className="p-4 space-y-3">
          <select 
            value={selectedId} 
            onChange={e => { 
              const f = sessions.find(s => s.id === e.target.value); 
              if (f) selectSession(f); 
            }} 
            className="w-full bg-white border border-[#E2DCDA] rounded-xl p-2 text-xs outline-none focus:border-[#B3181C]"
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.nom} ({s.jourComplet} {s.heureStr})</option>
            ))}
          </select>
          <form onSubmit={handleReschedule} className="space-y-2 bg-white p-3 border border-[#E2DCDA] rounded-xl">
            <div>
              <label className="text-[10px] font-bold text-[#8E7977] block">Jour</label>
              <select value={day} onChange={e => setDay(e.target.value)} className="w-full bg-[#FAF8F6] border border-[#E2DCDA] rounded-lg p-1.5 text-xs outline-none">
                {['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#8E7977] block">Plage Horaire</label>
              <input value={time} onChange={e => setTime(e.target.value)} className="w-full bg-[#FAF8F6] border border-[#E2DCDA] rounded-lg p-1.5 text-xs outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#8E7977] block">Salle</label>
              <input value={room} onChange={e => setRoom(e.target.value)} className="w-full bg-[#FAF8F6] border border-[#E2DCDA] rounded-lg p-1.5 text-xs outline-none" required />
            </div>
            <button type="submit" disabled={saving} className="w-full bg-[#B3181C] text-white font-bold py-1.5 rounded-lg text-xs uppercase mt-2">
              {saving ? 'Enregistrement...' : 'Confirmer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
