import React, { useState } from 'react';
import type { AdminPromotion, AdminProfessor } from '../../domain/AdminModels';

interface ClassFiliereProps {
  promotions: AdminPromotion[];
  professors: AdminProfessor[];
  onCreated: () => void;
}

export function AdminClassFiliereManager({ promotions, professors, onCreated }: ClassFiliereProps) {
  const [promoName, setPromoName] = useState('');
  const [filiere, setFiliere] = useState('');
  const [faculte, setFaculte] = useState('Sciences & Technologies');
  
  const [courseTitre, setCourseTitre] = useState('');
  const [coef, setCoef] = useState('3');
  const [profId, setProfId] = useState('');
  const [promoId, setPromoId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName || !filiere) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: promoName, filiere, faculte })
      });
      if (res.ok) {
        setPromoName(''); setFiliere('');
        onCreated();
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const activePromo = promoId || (promotions[0]?.id || '');
    if (!courseTitre || !activePromo) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre: courseTitre, coefficient: coef, professeur_id: profId, promotion_id: activePromo })
      });
      if (res.ok) {
        setCourseTitre(''); setCoef('3');
        onCreated();
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="bg-white p-3.5 border border-[#E2DCDA] rounded-xl text-xs space-y-4" id="admin-class-filiere-manager">
      <div className="pb-1.5 border-b border-[#E2DCDA]/60 flex justify-between items-center">
        <h5 className="font-extrabold text-[#B3181C] uppercase tracking-wider text-[10.5px]">Création Classes & Filières</h5>
        <span className="text-[9px] text-[#8E7977] font-bold">Structure pédagogique</span>
      </div>

      <form onSubmit={handleCreatePromo} className="space-y-2 bg-[#FAF8F6] p-2.5 rounded-xl border border-[#E2DCDA]/40 animate-fade-in">
        <h6 className="font-bold text-[#B3181C] uppercase tracking-wide text-[9.5px]">1. Créer une Classe / Promotion</h6>
        <div className="grid grid-cols-2 gap-2">
          <input value={promoName} onChange={e => setPromoName(e.target.value)} placeholder="Nom (ex: 221-CD)" className="w-full h-8 bg-white border border-[#E2DCDA] rounded-lg px-2 text-[11px]" required />
          <input value={filiere} onChange={e => setFiliere(e.target.value)} placeholder="Spécialité / Filière" className="w-full h-8 bg-white border border-[#E2DCDA] rounded-lg px-2 text-[11px]" required />
        </div>
        <button type="submit" disabled={loading} className="w-full h-8 bg-[#3E2927] hover:bg-[#291715] text-white font-bold uppercase rounded-lg tracking-wider text-[10px]">Créer la Classe</button>
      </form>

      <form onSubmit={handleCreateCourse} className="space-y-2 bg-[#FAF8F6] p-2.5 rounded-xl border border-[#E2DCDA]/40 animate-fade-in">
        <h6 className="font-bold text-[#B3181C] uppercase tracking-wide text-[9.5px]">2. Créer une Matière & Assigner Enseignant</h6>
        <div className="space-y-1.5">
          <input value={courseTitre} onChange={e => setCourseTitre(e.target.value)} placeholder="Nom du Cours (ex: Intelligence Artificielle)" className="w-full h-8 bg-white border border-[#E2DCDA] rounded-lg px-2 text-[11px]" required />
          <div className="grid grid-cols-3 gap-1.5">
            <select value={promoId} onChange={e => setPromoId(e.target.value)} className="bg-white border border-[#E2DCDA] h-8 rounded-lg text-[10px] px-1 font-bold">
              <option value="">-- Classe --</option>
              {promotions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={profId} onChange={e => setProfId(e.target.value)} className="bg-white border border-[#E2DCDA] h-8 rounded-lg text-[10px] px-1">
              <option value="">-- Enseignant --</option>
              {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input value={coef} type="number" onChange={e => setCoef(e.target.value)} placeholder="Coef" className="bg-white border border-[#E2DCDA] h-8 rounded-lg text-[10px] px-2" min="1" max="10" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full h-8 bg-[#B3181C] hover:bg-[#8F1316] text-white font-bold uppercase rounded-lg tracking-wider text-[10px]">Ajouter la Matière</button>
      </form>
    </div>
  );
}
