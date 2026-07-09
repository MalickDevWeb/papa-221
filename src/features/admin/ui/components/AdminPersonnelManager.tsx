import React, { useState, useEffect } from 'react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  telephone: string;
}

export function AdminPersonnelManager({ onUpdate }: { onUpdate: () => void }) {
  const [professors, setProfessors] = useState<any[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Professeur');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPersonnel = async () => {
    try {
      const res = await fetch('/api/admin/personnel');
      if (res.ok) {
        const data = await res.json();
        setProfessors(data.professors || []);
        setStaff(data.staff || []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadPersonnel(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, telephone: phone })
      });
      if (res.ok) {
        setName(''); setEmail(''); setPhone('');
        await loadPersonnel();
        onUpdate();
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/personnel/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadPersonnel();
        onUpdate();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white p-3.5 border border-[#E2DCDA] rounded-xl text-xs space-y-3 animate-fade-in" id="admin-personnel-manager">
      <div className="flex justify-between items-center pb-1.5 border-b border-[#E2DCDA]/60">
        <h5 className="font-extrabold text-[#B3181C] uppercase tracking-wider text-[10.5px]">Gestion Optimale du Personnel</h5>
        <span className="text-[9px] text-[#8E7977] font-bold">Corps enseignant & encadrement</span>
      </div>

      <form onSubmit={handleCreate} className="space-y-2 bg-[#FAF8F6] p-2.5 rounded-xl border border-[#E2DCDA]/40">
        <h6 className="font-bold text-[#B3181C] uppercase tracking-wide text-[9.5px]">Embaucher / Ajouter Personnel</h6>
        <div className="grid grid-cols-2 gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom Complet" className="w-full h-8 bg-white border border-[#E2DCDA] rounded-lg px-2 text-[11px]" required />
          <input value={email} type="email" onChange={e => setEmail(e.target.value)} placeholder="Email Professionnel" className="w-full h-8 bg-white border border-[#E2DCDA] rounded-lg px-2 text-[11px]" required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full h-8 bg-white border border-[#E2DCDA] rounded-lg text-[11px] px-1 font-bold">
            {['Professeur', 'Administrateur', 'Scolarité', 'Vigile'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Téléphone (ex: 77 121...)" className="w-full h-8 bg-white border border-[#E2DCDA] rounded-lg px-2 text-[11px]" />
        </div>
        <button type="submit" disabled={loading} className="w-full h-8 bg-[#B3181C] hover:bg-[#8F1316] text-white font-bold uppercase rounded-lg text-[10px]">Ajouter au Personnel</button>
      </form>

      <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
        {professors.map(p => (
          <div key={p.id} className="flex justify-between items-center bg-[#FAF8F6] p-2 rounded-lg border border-[#E2DCDA]/50">
            <div>
              <span className="font-bold text-[#291715] block">{p.name}</span>
              <span className="text-[9px] text-[#8E7977]">Enseignant • {p.email}</span>
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-[9px] text-red-600 hover:underline">Retirer</button>
          </div>
        ))}
        {staff.map(s => (
          <div key={s.id} className="flex justify-between items-center bg-[#FAF8F6] p-2 rounded-lg border border-[#E2DCDA]/50">
            <div>
              <span className="font-bold text-[#291715] block">{s.name} ({s.telephone})</span>
              <span className="text-[9px] text-[#8E7977]">{s.role} • {s.email}</span>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-[9px] text-red-600 hover:underline">Retirer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
