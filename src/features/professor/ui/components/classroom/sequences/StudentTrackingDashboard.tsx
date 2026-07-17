import React from 'react';

interface Props {
  readonly students: readonly any[];
}

export function StudentTrackingDashboard({ students }: Props) {
  // Enhance student records with mock tracking stats for e-learning
  const cohort = students.map((s, idx) => {
    const progression = idx === 0 ? 95 : idx === 1 ? 42 : idx === 2 ? 88 : 35;
    const attendance = idx === 0 ? 98 : idx === 1 ? 75 : idx === 2 ? 95 : 60;
    const learningTime = idx === 0 ? '24h' : idx === 1 ? '10h' : idx === 2 ? '21h' : '6h';
    const quizzesPassed = idx === 0 ? '5/5' : idx === 1 ? '2/5' : idx === 2 ? '4/5' : '1/5';
    
    // Determine risk & recommendation
    const isAtRisk = progression < 50 || attendance < 80;
    const recommendation = isAtRisk 
      ? progression < 40 ? 'Alerte Décrochage - Tutorat d\'urgence' : 'Relance parent requise' 
      : 'Excellent parcours - RAS';

    return {
      ...s,
      progression,
      attendance,
      learningTime,
      quizzesPassed,
      isAtRisk,
      recommendation
    };
  });

  return (
    <div className="space-y-4 text-xs font-semibold" id="student-tracking-dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-neutral-100 p-3 bg-neutral-50/50 rounded-2xl">
          <p className="text-[9px] text-neutral-400 font-bold uppercase">Progression de classe</p>
          <p className="text-neutral-800 font-black text-sm mt-0.5">65% en moyenne</p>
        </div>
        <div className="border border-neutral-100 p-3 bg-neutral-50/50 rounded-2xl">
          <p className="text-[9px] text-neutral-400 font-bold uppercase">Taux de présence global</p>
          <p className="text-emerald-700 font-black text-sm mt-0.5">82% validé</p>
        </div>
        <div className="border border-neutral-100 p-3 bg-neutral-50/50 rounded-2xl">
          <p className="text-[9px] text-neutral-400 font-bold uppercase">Temps d'apprentissage moyen</p>
          <p className="text-[#B3181C] font-black text-sm mt-0.5">15.2 heures</p>
        </div>
        <div className="border border-neutral-100 p-3 bg-rose-50/40 rounded-2xl">
          <p className="text-[9px] text-rose-800 font-bold uppercase">Étudiants à risque détectés</p>
          <p className="text-rose-700 font-black text-sm mt-0.5">2 profils critiques</p>
        </div>
      </div>

      <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 text-[9px] text-neutral-400 uppercase tracking-wider border-b border-neutral-150">
              <th className="p-3">Étudiant</th>
              <th className="p-3 text-center">Progression</th>
              <th className="p-3 text-center">Présence</th>
              <th className="p-3 text-center">Tps d'apprentissage</th>
              <th className="p-3 text-center">Quiz Validés</th>
              <th className="p-3">Diagnostic & Recommandation</th>
            </tr>
          </thead>
          <tbody>
            {cohort.map((row) => (
              <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 text-[11px]">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#1E293B]">{row.name}</span>
                    {row.isAtRisk && (
                      <span className="inline-flex items-center text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase">
                        Soutien requis
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-center font-extrabold text-neutral-800">{row.progression}%</td>
                <td className="p-3 text-center font-extrabold text-neutral-700">{row.attendance}%</td>
                <td className="p-3 text-center text-neutral-600">{row.learningTime}</td>
                <td className="p-3 text-center font-bold text-neutral-700">{row.quizzesPassed}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${row.isAtRisk ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
                    {row.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
