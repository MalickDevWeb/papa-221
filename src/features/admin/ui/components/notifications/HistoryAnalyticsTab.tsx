import React from 'react';
import { NotificationCampaign } from '../../../domain/NotificationsModels';

interface Props {
  campaigns: NotificationCampaign[];
}

export function HistoryAnalyticsTab({ campaigns }: Props) {
  return (
    <div className="space-y-4 text-xs font-bold text-[#4A5568]" id="history-analytics-tab">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-sm text-[#1E293B]">Historique des Diffusions & Analytics</h3>
        <p className="text-[10px] text-neutral-400 font-semibold">Consultez l'historique de distribution et le taux de réception de vos messages.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F6] text-[9px] font-black text-neutral-400 uppercase border-b border-neutral-200">
              <th className="px-5 py-3">Sujet de la Diffusion</th>
              <th className="px-5 py-3">Audience Cible</th>
              <th className="px-5 py-3">Canaux Utilisés</th>
              <th className="px-5 py-3">Date d'envoi</th>
              <th className="px-5 py-3">Taux Délivré</th>
              <th className="px-5 py-3">Taux d'ouverture</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
            {campaigns.map(camp => (
              <tr key={camp.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-5 py-3.5 text-[#1E293B] font-extrabold">{camp.title}</td>
                <td className="px-5 py-3.5 font-semibold">{camp.target}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {camp.channels.map(ch => (
                      <span key={ch} className="bg-slate-100 text-slate-800 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">{ch}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-neutral-400">{camp.date}</td>
                <td className="px-5 py-3.5 text-emerald-600 font-extrabold">{camp.deliveryRate}%</td>
                <td className="px-5 py-3.5 text-[#B3181C] font-extrabold">{camp.openRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
