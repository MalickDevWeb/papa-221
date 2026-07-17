import React from 'react';
import type { AdminStats } from '../../domain/AdminModels';

interface AdminStatsGridProps {
  stats: AdminStats | null;
  loading: boolean;
}

export function AdminStatsGrid({ stats, loading }: AdminStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E2DCDA] rounded-xl p-5 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="col-span-2 md:col-span-2 bg-white border border-[#E2DCDA] p-5 rounded-xl shadow-sm flex flex-col justify-between">
        <div>
          <span translate="no" className="material-symbols-outlined text-[#B3181C] mb-2 font-bold">
            group
          </span>
          <h3 className="text-[#3E2927] font-bold text-sm">Effectif Étudiants</h3>
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-4xl font-black text-[#B3181C]">{stats?.studentsCount ?? 3}</span>
          <span className="text-[#1E5E3A] text-xs font-bold flex items-center bg-[#EAF7EE] px-2 py-0.5 rounded-full">
            Actifs
          </span>
        </div>
      </div>

      <div className="col-span-1 bg-white border border-[#E2DCDA] p-4 rounded-xl shadow-sm flex flex-col justify-between">
        <span translate="no" className="material-symbols-outlined text-[#B3181C] mb-1 font-bold">school</span>
        <h3 className="text-[11px] font-bold text-[#8E7977] uppercase tracking-tight">Classes</h3>
        <p className="text-2xl font-black text-[#291715] mt-1">{stats?.classesCount ?? 2}</p>
      </div>

      <div className="col-span-1 bg-white border border-[#E2DCDA] p-4 rounded-xl shadow-sm flex flex-col justify-between">
        <span translate="no" className="material-symbols-outlined text-[#B3181C] mb-1 font-bold">person_check</span>
        <h3 className="text-[11px] font-bold text-[#8E7977] uppercase tracking-tight">Professeurs</h3>
        <p className="text-2xl font-black text-[#291715] mt-1">{stats?.professorsCount ?? 4}</p>
      </div>
    </section>
  );
}
