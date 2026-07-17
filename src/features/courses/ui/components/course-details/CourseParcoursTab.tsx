import React from 'react';

interface Props {
  readonly course: any;
  readonly details: any;
}

export function CourseParcoursTab({ course, details }: Props) {
  // Structured learning sequences tailored for the student's active path
  const sequences = [
    {
      id: 'seq1',
      title: 'Séquence 1 : Fondements & Équilibre élastique',
      status: 'complete',
      icon: 'check_circle',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      desc: 'Calcul des contraintes normales et tangentielles.',
      nextStep: 'Complété avec brio. Accédez à la Séquence 2.'
    },
    {
      id: 'seq2',
      title: 'Séquence 2 : Traction, Compression & Sollicitations',
      status: 'active',
      icon: 'sync',
      color: 'text-brand-red-deep bg-[#FFF5F5] border-brand-red-deep/15',
      desc: 'Dimensionnement des barres soumises à la traction.',
      nextStep: 'En cours. Prochaine étape : Soumettre le Devoir Pratique 2.'
    },
    {
      id: 'seq3',
      title: 'Séquence 3 : Théorie des Poutres & Flexion Simple',
      status: 'locked',
      icon: 'lock',
      color: 'text-neutral-400 bg-neutral-50 border-neutral-200',
      desc: 'Équations d\'équilibre et diagrammes de moments.',
      nextStep: 'Verrouillé. Débloqué automatiquement après validation du Quiz 2.'
    }
  ];

  return (
    <div className="space-y-5 text-xs font-semibold" id="course-parcours-tab">
      {/* Target & ECTS stats banner */}
      <div className="bg-neutral-50/50 border border-neutral-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Objectif du Diplôme & Certification</p>
          <h4 className="text-[#1E293B] font-extrabold text-[12px]">Crédits ECTS associés : <span className="text-[#B3181C]">6 Crédits</span></h4>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-emerald-800 text-[10px]">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Règle : Note supérieure ou égale à 12/20 requise</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline Parcours */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-extrabold text-neutral-400 uppercase tracking-wider text-[10px]">Séquences du Parcours</h4>
          <div className="space-y-4 relative pl-4 before:content-[''] before:absolute before:left-7 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
            {sequences.map((s, idx) => (
              <div key={s.id} className="relative flex gap-4 bg-white border border-neutral-150 p-4 rounded-2xl hover:shadow-xs transition-all">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border z-10 ${s.color}`}>
                  <span translate="no" className="material-symbols-outlined text-base font-black">{s.icon}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono font-black uppercase text-neutral-400">Étape {idx + 1}</span>
                    <h5 className="font-extrabold text-[#1E293B] text-[12px]">{s.title}</h5>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">{s.desc}</p>
                  <div className="mt-2 text-[9px] font-bold text-[#B3181C] bg-neutral-50 px-2 py-1 rounded-md inline-block">
                    {s.nextStep}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Sidebar: Next Live / Meets / Advising */}
        <div className="space-y-4">
          <div className="bg-[#FFF5F5] border border-brand-red-deep/10 p-4 rounded-2xl space-y-3">
            <h4 className="font-extrabold text-[#B3181C] uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">videocam</span> Prochaine Classe Virtuelle
            </h4>
            <div className="bg-white p-3 rounded-xl border border-brand-red-deep/5 space-y-1.5">
              <p className="font-extrabold text-[#291715] text-[11px]">Atelier Pratique & Correction RDM</p>
              <p className="text-[9px] text-neutral-400 font-bold">Aujourd'hui à 15h30 (Heure locale)</p>
              <a href="https://meet.google.com/abc-defg-hij" target="_blank" rel="noopener noreferrer" className="mt-1 w-full py-1.5 bg-[#B3181C] text-white font-extrabold uppercase text-[9px] tracking-wider rounded-lg flex items-center justify-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-xs">videocam</span> Rejoindre sur Google Meet
              </a>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-150 p-4 rounded-2xl space-y-2.5">
            <h4 className="font-extrabold text-neutral-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">campaign</span> Annonce de l'Enseignant
            </h4>
            <div className="bg-white p-3 rounded-xl border border-neutral-100 space-y-1">
              <p className="text-neutral-700 leading-normal text-[10px] font-medium">
                "N'oubliez pas d'analyser le notebook GitHub fourni dans la Séquence 2 avant la session Meet de cet après-midi."
              </p>
              <p className="text-[8px] text-neutral-400 font-bold text-right">- Prof. Malick Ndiaye</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CourseParcoursTab;
