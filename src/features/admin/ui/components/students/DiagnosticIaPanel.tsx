import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormattedText } from './FormattedText';

interface Props {
  studentId: string;
  studentName: string;
}

export function DiagnosticIaPanel({ studentId, studentName }: Props) {
  const [loading, setLoading] = useState(false);
  const [diagnostic, setDiagnostic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/admin/student-diagnostic', { studentId });
      if (response.data && response.data.text) {
        setDiagnostic(response.data.text);
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (err: any) {
      console.error("Error generating student diagnostic:", err);
      setError("Impossible de générer le rapport. Veuillez vérifier votre connexion ou clé API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDiagnostic(null);
    setError(null);
  }, [studentId]);

  return (
    <div id="diagnostic-ia-panel" className="bg-[#FAF8F6] border border-neutral-200/60 rounded-2xl p-4 space-y-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="w-8 h-8 border-4 border-[#B3181C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-wider animate-pulse">
            Analyse cognitive de {studentName.split(' ')[0]} en cours...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-6 space-y-3">
          <span translate="no" className="material-symbols-outlined text-rose-500 text-3xl">error</span>
          <p className="text-xs text-rose-600 font-bold">{error}</p>
          <button onClick={fetchDiagnostic} className="px-3 py-1.5 bg-[#B3181C] hover:bg-[#921316] text-white font-extrabold text-[10px] uppercase rounded-lg">
            Réessayer
          </button>
        </div>
      ) : diagnostic ? (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <FormattedText text={diagnostic} />
          </div>
          <div className="flex justify-end border-t border-neutral-100 pt-3">
            <button onClick={fetchDiagnostic} className="px-3 py-1.5 border border-neutral-200 hover:bg-white text-neutral-700 font-extrabold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1">
              <span translate="no" className="material-symbols-outlined text-xs">refresh</span>
              <span>Relancer l'audit IA</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4 flex flex-col items-center">
          <div className="w-12 h-12 bg-[#B3181C]/5 text-[#B3181C] border border-[#B3181C]/15 rounded-2xl flex items-center justify-center">
            <span translate="no" className="material-symbols-outlined text-2xl">psychology</span>
          </div>
          <div className="space-y-1 max-w-xs">
            <h4 className="font-extrabold text-[#1E293B] text-xs">Diagnostic de réussite assisté par IA</h4>
            <p className="text-[10px] text-neutral-400 font-bold leading-relaxed">
              Générez un rapport d'évaluation pédagogique de {studentName} basé sur ses notes réelles, son assiduité et son comportement.
            </p>
          </div>
          <button onClick={fetchDiagnostic} className="px-4 py-2 bg-[#B3181C] hover:bg-[#921316] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-sm shadow-[#B3181C]/10 hover:scale-105 transition-transform duration-200">
            <span translate="no" className="material-symbols-outlined text-sm">science</span>
            <span>Générer le diagnostic IA</span>
          </button>
        </div>
      )}
    </div>
  );
}
