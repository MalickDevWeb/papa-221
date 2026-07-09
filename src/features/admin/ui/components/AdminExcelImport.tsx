import React, { useState } from 'react';

export function AdminExcelImport({ promotions, onImportSuccess }: { promotions: any[]; onImportSuccess: () => void }) {
  const [csvText, setCsvText] = useState("Nom;Matricule;Classe\nAssane Diallo;221-M901;221-GL\nMariama Fall;221-M902;221-MOBI");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const parseCsv = () => {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const separator = lines[0].includes(';') ? ';' : lines[0].includes(',') ? ',' : '\t';
    const parsedHeaders = lines[0].split(separator).map(h => h.trim());
    const parsedRows = lines.slice(1).map(line => line.split(separator).map(cell => cell.trim()));
    setHeaders(parsedHeaders);
    setRows(parsedRows);
    
    // Auto map
    const initialMapping: Record<string, string> = {};
    parsedHeaders.forEach(h => {
      const lower = h.toLowerCase();
      if (lower.includes('nom') || lower.includes('name')) initialMapping[h] = 'name';
      else if (lower.includes('matr') || lower.includes('id')) initialMapping[h] = 'matricule';
      else if (lower.includes('class') || lower.includes('prom') || lower.includes('fili')) initialMapping[h] = 'promotion_id';
    });
    setMapping(initialMapping);
    setStep(2);
  };

  const handleImport = async () => {
    setLoading(true);
    const finalStudents = rows.map(row => {
      const student: any = {};
      headers.forEach((h, idx) => {
        const field = mapping[h];
        if (field) {
          if (field === 'promotion_id') {
            const matched = promotions.find(p => p.name.toLowerCase() === row[idx]?.toLowerCase() || p.id === row[idx]);
            student[field] = matched ? matched.id : 'p-1';
          } else {
            student[field] = row[idx];
          }
        }
      });
      return student;
    }).filter(s => s.name);

    try {
      const res = await fetch('/api/admin/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: finalStudents })
      });
      if (res.ok) {
        onImportSuccess();
        setStep(1);
        setCsvText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-3.5 border border-[#E2DCDA] rounded-xl text-xs space-y-3" id="admin-excel-import">
      <div className="flex justify-between items-center pb-1.5 border-b border-[#E2DCDA]/60">
        <h5 className="font-extrabold text-[#B3181C] uppercase tracking-wider text-[10.5px]">Importateur d'Étudiants Excel / CSV</h5>
        <span className="text-[9px] text-[#8E7977] font-bold">Mappage intelligent des colonnes</span>
      </div>

      {step === 1 ? (
        <div className="space-y-2">
          <p className="text-[10px] text-[#8E7977] leading-relaxed">Collez vos données tabulaires (séparées par des points-virgules, virgules ou tabulations) ci-dessous avec la ligne d'en-tête.</p>
          <textarea rows={4} className="w-full font-mono text-[10px] bg-[#FAF8F6] border border-[#E2DCDA] rounded-xl p-2 outline-none" value={csvText} onChange={e => setCsvText(e.target.value)} />
          <button type="button" onClick={parseCsv} className="w-full h-9 bg-[#B3181C] hover:bg-[#8F1316] text-white font-black uppercase rounded-lg tracking-wider transition-all">Analyse des Colonnes</button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-bold text-[#3E2927]">Associez les colonnes de votre fichier aux champs système :</p>
          <div className="space-y-1.5">
            {headers.map(h => (
              <div key={h} className="flex justify-between items-center bg-[#FAF8F6] p-2 rounded-lg border border-[#E2DCDA]/60">
                <span className="font-bold text-[#291715]">{h}</span>
                <select value={mapping[h] || ''} onChange={e => setMapping(p => ({ ...p, [h]: e.target.value }))} className="bg-white border border-[#E2DCDA] rounded-md px-1.5 py-0.5 font-semibold text-[#B3181C]">
                  <option value="">Ignorer</option>
                  <option value="name">Nom Complet</option>
                  <option value="matricule">Matricule</option>
                  <option value="promotion_id">Classe / Promotion</option>
                </select>
              </div>
            ))}
          </div>
          <div className="p-2 bg-[#EAF7EE] text-[#1E5E3A] border border-[#D0EBD9] rounded-lg text-[10px] font-semibold">{rows.length} lignes prêtes à être importées.</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="flex-1 h-9 border border-[#E2DCDA] rounded-lg text-[#8E7977] font-bold uppercase hover:bg-[#FAF8F6]">Retour</button>
            <button type="button" onClick={handleImport} disabled={loading} className="flex-[2] h-9 bg-[#B3181C] text-white font-black uppercase rounded-lg hover:bg-[#8F1316]">{loading ? 'Importation...' : 'Valider & Importer'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
