import React from 'react';
import { Eye, ShieldCheck, ShieldAlert, Award, Clock } from 'lucide-react';
import { MeetAttendance } from '../../domain/CollaborationModels';

interface Props {
  readonly attendances: readonly MeetAttendance[];
  readonly meetId: string;
}

export function MeetSessionTracker({ attendances, meetId }: Props) {
  const filtered = attendances.filter((a) => a.meetId === meetId);

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <Eye className="w-5 h-5 text-brand-red-deep" />
        <div>
          <h3 className="font-bold text-sm text-gray-900">Suivi des Présences & Participation (Audité)</h3>
          <p className="text-[10px] text-neutral-500 font-semibold">Registre de connexion des étudiants en direct de la réunion Google Meet</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[10px]">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
              <th className="pb-2">Étudiant</th>
              <th className="pb-2">E-mail de connexion</th>
              <th className="pb-2">Durée (min)</th>
              <th className="pb-2">Participation</th>
              <th className="pb-2 text-right">Statut Compte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-neutral-400 font-semibold">Aucun étudiant connecté pour le moment. Le rapport se mettra à jour en direct.</td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-gray-50/50">
                  <td className="py-3 font-bold text-gray-800">{a.studentName}</td>
                  <td className="py-3 font-mono font-semibold text-neutral-500">{a.emailUsed}</td>
                  <td className="py-3 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" /> {a.durationMinutes} min
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 font-bold text-brand-red-deep">
                      <Award className="w-3.5 h-3.5" /> Score {a.participationScore}/5
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    {a.isAuthorizedAccount ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Conforme
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-black animate-pulse">
                        <ShieldAlert className="w-3.5 h-3.5" /> Non-Autorisé
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default MeetSessionTracker;
