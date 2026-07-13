import React, { useState } from 'react';
import { StaffMember, STAFF_ROLES } from '../../../domain/PersonnelModels';

interface Props {
  staff: StaffMember[];
  onAddStaff: (member: Omit<StaffMember, 'id'>) => void;
  onToggleStatus: (id: string) => void;
}

export function AccountsTab({ staff, onAddStaff, onToggleStatus }: Props) {
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', role: 'Secrétaire' });
  const [successInfo, setSuccessInfo] = useState<{ id: string; pass: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) return;
    onAddStaff({ ...form, status: 'Actif' });
    const generatedId = `EMP-2026-0${Math.floor(10 + Math.random() * 89)}`;
    const tempPass = Math.random().toString(36).slice(-8).toUpperCase();
    setSuccessInfo({ id: generatedId, pass: tempPass });
    setForm({ firstName: '', lastName: '', email: '', phone: '', role: 'Secrétaire' });
  };

  const filteredStaff = staff.filter(s => {
    const rMatch = filterRole === 'ALL' || s.role === filterRole;
    const sMatch = filterStatus === 'ALL' || s.status === filterStatus;
    return rMatch && sMatch;
  });

  return (
    <div className="space-y-4" id="accounts-tab-root">
      {successInfo && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between animate-fade-in text-xs font-bold text-emerald-800">
          <div className="space-y-1">
            <span className="text-sm font-black text-emerald-950">🎉 Collaborateur Ajouté avec Succès !</span>
            <p>Identifiant Unique : <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-neutral-900">{successInfo.id}</code></p>
            <p>Mot de passe temporaire : <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-neutral-900">{successInfo.pass}</code></p>
          </div>
          <button onClick={() => setSuccessInfo(null)} className="px-3 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 rounded-lg cursor-pointer">OK</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FAF8F6] p-3 border border-neutral-200 rounded-xl">
            <span className="text-[10px] font-black uppercase text-neutral-400">Filtrer l'Annuaire</span>
            <div className="flex gap-2">
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-bold bg-white">
                <option value="ALL">Tous les Rôles</option>
                {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-bold bg-white">
                <option value="ALL">Tous les Statuts</option>
                <option value="Actif">Actif</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F6] text-[10px] font-black text-neutral-400 uppercase border-b border-neutral-200">
                  <th className="px-4 py-2.5">Collaborateur</th>
                  <th className="px-4 py-2.5">Contact</th>
                  <th className="px-4 py-2.5">Rôle</th>
                  <th className="px-4 py-2.5">Statut</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
                {filteredStaff.map(member => (
                  <tr key={member.id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-3">
                      <div className="text-[#1E293B] font-black">{member.firstName} {member.lastName}</div>
                      <div className="text-[9px] text-neutral-400 font-semibold">{member.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{member.email}</div>
                      <div className="text-[9px] text-neutral-400 font-semibold">{member.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] uppercase">{member.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${member.status === 'Actif' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{member.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => onToggleStatus(member.id)} className={`px-2 py-1 text-[10px] font-black rounded-lg border cursor-pointer transition-all ${member.status === 'Actif' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                        {member.status === 'Actif' ? 'Suspendre' : 'Réactiver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-4 shadow-sm h-fit space-y-4">
          <div>
            <h4 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">+ Ajouter un membre</h4>
            <p className="text-[9px] text-neutral-400 font-semibold">Tous les champs sont requis.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-bold text-neutral-600">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Prénom" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white" required />
              <input type="text" placeholder="Nom" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white" required />
            </div>
            <input type="email" placeholder="Email professionnel" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white" required />
            <input type="text" placeholder="Téléphone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white" required />
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white">
              {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button type="submit" className="w-full py-2.5 bg-[#B3181C] hover:bg-[#921316] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs">Créer le Compte</button>
          </form>
        </div>
      </div>
    </div>
  );
}
