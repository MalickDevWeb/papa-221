import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/core/store/authStore';
import { LogOut, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function VisitorDashboard() {
  const { utilisateur, deconnexion, connexionReussie, token } = useAuthStore();
  const [statut, setStatut] = useState<'En attente' | 'Accepté' | 'Refusé'>('En attente');

  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      if (!utilisateur?.email) return;
      try {
        const r = await fetch(`/api/student/admission-status?email=${encodeURIComponent(utilisateur.email)}`);
        if (r.ok) {
          const d = await r.json();
          if (!active) return;
          setStatut(d.statut);
          if (d.role === 'ETUDIANT') {
            connexionReussie({
              utilisateur: { ...utilisateur, role: 'ETUDIANT' },
              token: token || 'active'
            });
            window.location.reload();
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => { active = false; clearInterval(interval); };
  }, [utilisateur, token, connexionReussie]);

  const steps = [
    { title: "Dossier Déposé", desc: "Candidature enregistrée avec succès", status: "complete", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Vérification Académique", desc: "Dossier en cours d'examen par le jury", status: statut === "En attente" ? "active" : "complete", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
    { title: "Décision Finale", desc: statut === "Accepté" ? "Félicitations, vous êtes admis !" : statut === "Refusé" ? "Dossier refusé" : "En attente de décision", status: statut === "Accepté" ? "complete" : "pending", icon: Sparkles, color: "text-indigo-400 bg-indigo-500/10" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white" id="visitor-dashboard">
      <header className="border-b border-white/5 py-4 px-6 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#B3181C] rounded-full animate-ping" />
          <h1 className="font-extrabold text-sm tracking-tight uppercase text-white">École 221 Admissions</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-400 font-mono">Cand. {utilisateur?.nom}</span>
          <button onClick={deconnexion} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"><LogOut className="h-4 w-4" /></button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <h2 className="text-lg font-black tracking-tight text-white mb-2 text-center">Suivi de votre Candidature</h2>
          <p className="text-xs text-slate-400 font-semibold mb-8 text-center">Votre dossier est en cours de traitement en temps réel</p>

          <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
            {steps.map((s, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }} className="flex gap-4 items-start relative z-10">
                <div className={`p-2 rounded-xl shrink-0 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="py-4 text-center border-t border-white/5 bg-slate-900/30">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">École 221 • Espace Candidat Unifié</p>
      </footer>
    </div>
  );
}
