import React, { useState } from 'react';
import type { AdminStudent } from '../../domain/AdminModels';

interface TrackerStudent extends AdminStudent {
  observations?: Array<{ id: string; text: string; type: string; date: string; auteur: string }>;
}

export function AdminStudentTracker({ students, onUpdate }: { students: TrackerStudent[]; onUpdate: () => void }) {
  const [selectedId, setSelectedId] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState('Général');
  const [loading, setLoading] = useState(false);

  const student = students.find(s => s.id === selectedId);

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students/${selectedId}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, auteur: 'Directeur Scolarité' })
      });
      if (res.ok) {
        setText('');
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-3.5 border border-[#E2DCDA] rounded-xl text-xs space-y-3" id="admin-student-tracker">
      <div className="flex justify-between items-center pb-1.5 border-b border-[#E2DCDA]/60">
        <h5 className="font-extrabold text-[#B3181C] uppercase tracking-wider text-[10.5px]">Suivi Individuel des Élèves</h5>
        <span className="text-[9px] text-[#8E7977] font-bold">Dossier académique et observations</span>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-[#8E7977]">Sélectionner un étudiant :</label>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full h-9 bg-[#FAF8F6] border border-[#E2DCDA] rounded-lg px-2.5 outline-none font-semibold">
          <option value="">-- Choisir un étudiant --</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.matricule})</option>)}
        </select>
      </div>

      {student ? (
        <div className="space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 bg-[#FAF8F6] p-2.5 rounded-xl border border-[#E2DCDA]/60">
            <div>
              <p className="text-[9px] text-[#8E7977] font-bold uppercase">Moyenne Générale</p>
              <p className="text-sm font-black text-[#B3181C]">{student.average || 12}/20</p>
            </div>
            <div>
              <p className="text-[9px] text-[#8E7977] font-bold uppercase">Humeur / Statut</p>
              <p className="font-bold text-[#291715]">{student.mood || 'Actif'}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="font-black text-[#3E2927] uppercase tracking-wider text-[9.5px]">Journal d'observations :</p>
            <div className="max-h-[120px] overflow-y-auto space-y-1.5 border border-[#E2DCDA]/60 p-2 rounded-lg bg-[#FAF8F6]">
              {(!student.observations || student.observations.length === 0) ? (
                <p className="text-center py-2 text-[#8E7977] italic text-[10px]">Aucune observation saisie.</p>
              ) : (
                student.observations.map(o => (
                  <div key={o.id} className="p-1.5 bg-white border border-[#E2DCDA]/40 rounded-md animate-fade-in">
                    <div className="flex justify-between text-[8px] font-black uppercase text-[#8E7977] mb-0.5">
                      <span>[{o.type}] par {o.auteur}</span>
                      <span>{o.date}</span>
                    </div>
                    <p className="text-[#3E2927] font-semibold leading-tight">{o.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleAddObservation} className="space-y-2 pt-1 border-t border-[#E2DCDA]/60">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#8E7977] uppercase">Catégorie</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full h-8 bg-[#FAF8F6] border border-[#E2DCDA] rounded-md px-1 font-semibold text-[10px]">
                  {['Comportement', 'Notes', 'Retards/Absences', 'Frais Scolaires', 'Général'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#8E7977] uppercase">Ajouter un signalement</label>
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Texte de l'observation..." className="w-full h-8 bg-[#FAF8F6] border border-[#E2DCDA] rounded-md px-2 text-[10px] outline-none focus:border-[#B3181C]" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full h-8 bg-[#B3181C] hover:bg-[#8F1316] text-white font-bold uppercase rounded-md tracking-wider transition-all">{loading ? 'Saisie...' : 'Enregistrer la note'}</button>
          </form>
        </div>
      ) : (
        <div className="py-6 text-center text-[#8E7977] italic bg-[#FAF8F6] rounded-xl border border-[#E2DCDA]/40">Veuillez sélectionner un étudiant pour consulter et enrichir sa fiche de suivi individuel.</div>
      )}
    </div>
  );
}
