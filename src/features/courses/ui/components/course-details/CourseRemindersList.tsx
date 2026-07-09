import React from 'react';

interface Reminder {
  id: string;
  isUrgent?: boolean;
  dateStr?: string;
  content: string;
}

export function CourseRemindersList({
  reminders,
  salle
}: {
  reminders: Reminder[];
  salle: string | undefined;
}) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-brand-red-deep/20 p-5 rounded-3xl space-y-3.5">
      <div className="flex items-center justify-between">
        <h5 className="font-black text-xs text-brand-red-deep uppercase tracking-wider flex items-center gap-1.5">
          <span translate="no" className="material-symbols-outlined text-base animate-pulse">campaign</span>
          Rappels & Annonces : {salle || 'Amphi A'}
        </h5>
        <span className="bg-brand-red-deep text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-lg">
          IMPORTANT
        </span>
      </div>
      <div className="space-y-2.5">
        {reminders.map((rem) => (
          <div 
            key={rem.id} 
            className={`p-3.5 rounded-2xl border text-xs font-semibold ${
              rem.isUrgent ? 'bg-red-50/70 border-red-200 text-[#7F1D1D]' : 'bg-white border-neutral-gray-200 text-neutral-800'
            }`}
          >
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider mb-1.5 opacity-80 font-mono">
              <span className={rem.isUrgent ? 'text-brand-red-deep font-black' : 'text-neutral-500'}>
                {rem.isUrgent ? '🚨 URGENT • RAPPEL EN SALLE' : '📢 CONSIGNES'}
              </span>
              <span>{rem.dateStr || "À l'instant"}</span>
            </div>
            <p className="leading-relaxed whitespace-pre-line text-xs font-bold text-neutral-800">{rem.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
