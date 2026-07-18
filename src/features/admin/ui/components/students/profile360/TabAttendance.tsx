import React from 'react';
import { Student } from '../../../../domain/StudentModels';
import { AttendanceHeatmap } from './AttendanceHeatmap';

interface Props {
  selectedStudent: Student;
  erpData?: any;
}

const STATIC_ATTENDANCE = [
  { date: '16/07/2026', time: '08:05', course: 'Résistance des Matériaux (RDM)', status: 'PRÉSENT', info: 'Excellent', comment: '-' },
  { date: '15/07/2026', time: '10:00', course: 'Ingénierie & Planification', status: 'PRÉSENT', info: 'Actif', comment: '-' },
  { date: '14/07/2026', time: '14:15', course: 'Physique des Matériaux', status: 'RETARD', info: 'Retard de 15m', comment: 'Retard de transport' },
  { date: '13/07/2026', time: '08:00', course: 'Mathématiques & Analyse', status: 'ABSENT', info: 'Justifié', comment: 'Certificat Médical validé' },
  { date: '12/07/2026', time: '11:00', course: 'Anglais Technique', status: 'PRÉSENT', info: 'Excellent', comment: '-' }
];

export function TabAttendance({ selectedStudent, erpData }: Props) {
  // Convert backend activity logs to attendance list items if available
  const history = erpData?.activityTrail?.length > 0
    ? erpData.activityTrail.map((log: any) => {
        const parts = log.timestamp.split(' ');
        const date = parts[0] ? parts[0].split('-').reverse().join('/') : 'Aujourd\'hui';
        const time = parts[1] || '08:00';
        return {
          date,
          time,
          course: log.action.split('(')[1]?.replace(')', '') || 'Portail Principal',
          status: log.result === 'SUCCÈS' ? 'PRÉSENT' : 'ABSENT',
          info: log.module,
          comment: log.action.split(' - ')[0]
        };
      })
    : STATIC_ATTENDANCE;

  const total = history.length;
  const present = history.filter((h: any) => h.status === 'PRÉSENT').length;
  const presenceRate = total > 0 ? Math.round((present / total) * 100) : 92;
  const absenceRate = 100 - presenceRate;

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-attendance">
      <AttendanceHeatmap
        presenceRate={presenceRate}
        absenceRate={absenceRate}
        punctuality={95}
      />

      <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white">
        <div className="bg-neutral-50 border-b border-neutral-100 px-3 py-2 flex items-center gap-1">
          <span translate="no" className="material-symbols-outlined text-neutral-400 text-sm">list_alt</span>
          <span className="text-neutral-800 font-extrabold text-[11px] uppercase tracking-wider">Registre d'Assiduité Tracé</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50/50 text-[9px] text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
              <th className="p-2.5">Date / Heure</th>
              <th className="p-2.5">Cours / Salle</th>
              <th className="p-2.5">Statut</th>
              <th className="p-2.5">Détails / Module</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row: any, idx: number) => (
              <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 text-[11px]">
                <td className="p-2.5">
                  <p className="font-extrabold text-neutral-800">{row.date}</p>
                  <p className="text-[10px] text-neutral-400 font-bold">{row.time}</p>
                </td>
                <td className="p-2.5 font-extrabold text-neutral-700">{row.course}</td>
                <td className="p-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${row.status === 'PRÉSENT' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-2.5">
                  <p className="font-bold text-neutral-600">{row.info}</p>
                  <p className="text-[10px] text-neutral-400 font-bold">{row.comment}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
