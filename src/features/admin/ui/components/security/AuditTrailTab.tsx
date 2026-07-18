import React, { useState } from 'react';
import { AuditLog } from '../../../domain/SecurityModels';

interface Props {
  logs: AuditLog[];
}

export function AuditTrailTab({ logs }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const sMatch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const rMatch = filterRole === 'ALL' || log.role === filterRole;
    return sMatch && rMatch;
  });

  return (
    <div className="space-y-4 text-xs font-bold text-[#4A5568]" id="audit-trail-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
        <div>
          <h3 className="font-extrabold text-sm text-[#1E293B]">Piste d'Audit Interne (Logs Immutables)</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Toutes les actions sensibles des administrateurs et enseignants sont journalisées.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher une action..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 border border-neutral-200 bg-white rounded-xl focus:outline-none w-44"
          />
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-200 rounded-xl bg-white focus:outline-none"
          >
            <option value="ALL">Tous les Rôles</option>
            <option value="Secrétaire">Secrétaire</option>
            <option value="Enseignant">Enseignant</option>
            <option value="Comptable">Comptable</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#FAF8F6] font-black text-neutral-400 uppercase border-b border-neutral-200">
                <th className="px-4 py-3">Horodatage</th>
                <th className="px-4 py-3">Utilisateur</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Détails de l'événement</th>
                <th className="px-4 py-3">Adresse IP</th>
                <th className="px-4 py-3">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-[#1E293B] whitespace-nowrap">{log.time}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#1E293B] font-extrabold">{log.user}</span>
                      <span className="bg-neutral-100 text-neutral-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">{log.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#B3181C] uppercase font-black">{log.action}</td>
                  <td className="px-4 py-3.5 font-medium max-w-[250px] truncate" title={log.details}>{log.details}</td>
                  <td className="px-4 py-3.5 font-mono text-neutral-400">{log.ip}</td>
                  <td className="px-4 py-3.5 font-mono text-neutral-400 truncate max-w-[120px]">{log.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
