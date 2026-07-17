import React, { useState, useEffect } from 'react';
import { adminService } from '@/shared/lib/apiService';
import { RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ScanLog {
  id: string;
  badgeOwner: string;
  studentId: string;
  statut: string;
  message: string;
  time: string;
}

export function VigilRealtimeLogs() {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLogs = async () => {
    try {
      setError(false);
      const data = await adminService.getRealtimeLogs();
      setLogs(data);
    } catch (e) {
      console.error('Error fetching realtime logs:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Aggressive polling every 2 seconds
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 font-sans text-xs" id="vigil-realtime-logs">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Flux de Sécurité en Temps Réel (Polling Actif)
          </h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Suivez instantanément les scans de badges effectués par les vigiles aux portails.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 cursor-pointer transition-colors"
          title="Actualiser manuellement"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading && logs.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 font-bold">Chargement du flux...</div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
          <p className="text-rose-800 font-extrabold mb-3">Impossible de se connecter au flux de sécurité</p>
          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer"
          >
            Réessayer l'appel API
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-2 border-dashed border-neutral-200 rounded-2xl bg-[#FAF8F6]">
          Aucun scan enregistré pour le moment. En attente de détections...
        </div>
      ) : (
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {logs.map((log) => {
            const isRefused = log.statut === 'Refusé';
            return (
              <div
                key={log.id}
                className={`p-3 border rounded-xl flex items-center justify-between gap-3 shadow-2xs transition-all ${
                  isRefused ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/30 border-emerald-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isRefused ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {isRefused ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-extrabold text-[#1E293B] text-xs">{log.badgeOwner}</div>
                    <div className="text-[10px] text-neutral-500 font-semibold">{log.message}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block mb-1 ${
                    isRefused ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {log.statut}
                  </span>
                  <div className="text-[9px] font-mono font-bold text-neutral-400">{log.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
