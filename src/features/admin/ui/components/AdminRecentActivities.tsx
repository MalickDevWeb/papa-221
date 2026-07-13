import React, { useEffect, useState } from 'react';

interface ActivityLog {
  id: string;
  name: string;
  studentId: string;
  statut: string;
  time: string;
  date: string;
  type: string;
}

export function AdminRecentActivities() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  const chargerLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vigil/check-ins');
      if (res.ok) {
        const data = await res.json();
        // Keep the 3 most recent ones
        setLogs(data.slice(-3).reverse());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerLogs();
    const interval = setInterval(chargerLogs, 8000); // Poll for real-time updates
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-black text-[#291715]">Activités & Pointages Récents</h3>
        <button onClick={chargerLogs} className="text-xs text-[#B3181C] font-black uppercase hover:underline">
          [ Rafraîchir ]
        </button>
      </div>
      <div className="space-y-3">
        {loading && logs.length === 0 ? (
          <div className="text-xs text-[#8E7977] text-center py-4">Mise à jour...</div>
        ) : logs.length === 0 ? (
          <div className="p-4 bg-white border border-[#E2DCDA] rounded-xl text-center text-xs text-[#8E7977]">
            Aucune activité enregistrée aujourd'hui.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4 p-4 bg-white rounded-xl border border-[#E2DCDA] items-start shadow-sm hover:border-[#B3181C]/25 transition-all">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${log.statut === 'Refusé' ? 'bg-[#FFF5F5] text-[#B3181C]' : 'bg-[#EAF7EE] text-[#1E5E3A]'}`}>
                <span translate="no" className="material-symbols-outlined font-bold text-[18px]">
                  {log.statut === 'Refusé' ? 'block' : 'verified'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#291715] font-semibold">
                  <span className="font-bold text-[#B3181C]">{log.name}</span> ({log.studentId}) a été {log.statut.toLowerCase()} au portail.
                </p>
                <p className="text-[10px] text-[#8E7977] mt-1 font-bold">
                  {log.date} à {log.time} • Méthode: {log.type}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
