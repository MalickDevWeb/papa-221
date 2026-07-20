import React, { useState } from 'react';
import { ShieldCheck, Search, Info } from 'lucide-react';
import { AuditLog } from '../../domain/TaskWikiModels';

interface Props {
  readonly audits: readonly AuditLog[];
  readonly groupId: string;
}

export function WorkspaceAuditLogs({ audits, groupId }: Props) {
  const [query, setQuery] = useState('');

  const filtered = audits.filter((log) => {
    const matchesGroup = log.groupId === groupId;
    const matchesQuery = query.trim() === '' ||
      log.userName.toLowerCase().includes(query.toLowerCase()) ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.ipAddress.includes(query);
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-neutral-900" />
          <div>
            <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wide">Journal d&apos;Activité & Logs d&apos;Audit</h3>
            <p className="text-[9px] text-neutral-500 font-semibold">Traçabilité complète des connexions, modifications et messages (Conforme ERP)</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2 h-3 w-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher log..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-[9px] pl-7 pr-2 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[160px] border border-neutral-100 rounded-xl divide-y divide-neutral-100 no-scrollbar">
        {filtered.length === 0 ? (
          <p className="text-center text-[10px] text-neutral-400 py-6 font-semibold">Aucun log d&apos;activité enregistré.</p>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className="p-2.5 flex justify-between items-start sm:items-center gap-2 text-[9px] hover:bg-neutral-50 transition-colors">
              <div className="space-y-0.5">
                <span className="font-bold text-gray-800">{log.action}</span>
                <div className="flex items-center gap-2 text-neutral-400 font-bold">
                  <span>👤 {log.userName}</span>
                  <span>•</span>
                  <span>🖥️ IP : {log.ipAddress}</span>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[8px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded font-black">{log.timestamp}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-start gap-1.5 bg-neutral-50 p-2 rounded-lg text-neutral-500 text-[8px] font-bold">
        <Info className="w-3.5 h-3.5 text-neutral-700 shrink-0 mt-0.5" />
        <span>Les adresses IP et logs de connexion sont gérés automatiquement par le reverse proxy de l&apos;établissement.</span>
      </div>
    </div>
  );
}
export default WorkspaceAuditLogs;
