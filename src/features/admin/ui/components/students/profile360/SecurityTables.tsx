import React from 'react';
import { exportToCSV } from './utils/ExportUtils';

interface ConnectionsProps {
  connectionLogs: any[];
  studentName: string;
}

export function ConnectionsTable({ connectionLogs, studentName }: ConnectionsProps) {
  return (
    <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white" id="connections-table">
      <div className="bg-neutral-50 border-b border-neutral-100 px-3 py-2.5 flex items-center justify-between">
        <span className="text-[#1E293B] font-extrabold text-[11px] uppercase tracking-wider">Sécurité d'Accès : Appareils & Adresses IP</span>
        <button
          onClick={() => exportToCSV(connectionLogs, `Connexions_${studentName}`)}
          className="px-2 py-1 border border-neutral-200 hover:bg-white text-neutral-700 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-xs">download</span>
          <span>Exporter CSV</span>
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-neutral-50/50 text-[9px] text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
            <th className="p-2.5">Date & Heure</th>
            <th className="p-2.5">Appareil / Navigateur</th>
            <th className="p-2.5">Adresse IP</th>
            <th className="p-2.5">Durée</th>
          </tr>
        </thead>
        <tbody>
          {connectionLogs.map((log: any, idx: number) => (
            <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 text-[11px]">
              <td className="p-2.5 font-bold text-neutral-800">{log.timestamp}</td>
              <td className="p-2.5 font-bold">
                <p className="text-neutral-700">{log.device}</p>
                <p className="text-[10px] text-neutral-400 font-bold">{log.browser}</p>
              </td>
              <td className="p-2.5 font-mono text-neutral-500 font-bold">{log.ip}</td>
              <td className="p-2.5 font-bold text-neutral-600">{log.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AuditProps {
  activityTrail: any[];
  studentName: string;
}

export function AuditTrailTable({ activityTrail, studentName }: AuditProps) {
  return (
    <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white" id="audit-trail-table">
      <div className="bg-neutral-50 border-b border-neutral-100 px-3 py-2.5 flex items-center justify-between">
        <span className="text-[#1E293B] font-extrabold text-[11px] uppercase tracking-wider">Traçabilité complète des actions</span>
        <button
          onClick={() => exportToCSV(activityTrail, `AuditTrail_${studentName}`)}
          className="px-2 py-1 border border-neutral-200 hover:bg-white text-neutral-700 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-xs">download</span>
          <span>Exporter Journal</span>
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-neutral-50/50 text-[9px] text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
            <th className="p-2.5">Horodatage</th>
            <th className="p-2.5">Module</th>
            <th className="p-2.5">Action réalisée</th>
            <th className="p-2.5 text-center">Statut</th>
          </tr>
        </thead>
        <tbody>
          {activityTrail.map((act: any, idx: number) => (
            <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 text-[11px]">
              <td className="p-2.5 font-bold text-neutral-800">{act.timestamp}</td>
              <td className="p-2.5 text-[#B3181C] font-black uppercase tracking-wider text-[10px]">{act.module}</td>
              <td className="p-2.5 font-bold text-neutral-700">{act.action}</td>
              <td className="p-2.5 text-center">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${act.result === 'SUCCÈS' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{act.result}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
