import React from 'react';

interface UeItem {
  label: string;
  note: number;
  myWidth: string;
  promoWidth: string;
}

interface GradesPerformanceChartProps {
  ues: UeItem[];
}

export function GradesPerformanceChart({ ues }: GradesPerformanceChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Comparative Chart */}
      <div className="md:col-span-2 bg-white border border-neutral-gray-200 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-title-lg text-lg font-bold text-on-surface">Performance par Unité d'Enseignement</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
              <span className="text-label-md text-secondary font-bold">Votre note</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary-container rounded-sm"></div>
              <span className="text-label-md text-secondary font-bold">Moy. promo</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {ues.map((ue) => (
            <div key={ue.label}>
              <div className="flex justify-between text-body-md mb-2">
                <span className="font-bold">{ue.label}</span>
                <span className="font-bold text-primary">{ue.note}</span>
              </div>
              <div className="relative h-4 w-full bg-surface-container rounded-lg overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-secondary-container opacity-50" style={{ width: ue.promoWidth }}></div>
                <div className="absolute left-0 top-0 h-full bg-primary rounded-lg" style={{ width: ue.myWidth }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dean's List / Recognition Card */}
      <div className="md:col-span-1 bg-brand-red-deep text-white p-8 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h3 className="font-headline-md text-2xl font-bold leading-tight">Tableau d'Excellence Académique</h3>
          <p className="text-white/80 font-body-md mt-4">Félicitations ! Vos performances vous placent parmi les meilleurs étudiants de votre promotion ce semestre.</p>
          <div className="mt-8 flex items-center gap-4">
            <span translate="no" className="material-symbols-outlined text-4xl text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <div>
              <p className="text-on-primary font-bold">Mention Très Bien</p>
              <p className="text-white/70 text-label-md font-bold">Délivré par le Conseil de Direction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
