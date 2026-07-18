import React, { useState } from 'react';
import { Expense } from '../../../domain/FinancesModels';

interface Props {
  expenses: Expense[];
  onAddExpense: (exp: Omit<Expense, 'id'>) => void;
}

export function DepensesTab({ expenses, onAddExpense }: Props) {
  const [form, setForm] = useState({ label: '', category: 'RH', amount: '', date: '' });
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.amount || !form.date) return;
    onAddExpense({
      label: form.label,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
    });
    setForm({ label: '', category: 'RH', amount: '', date: '' });
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'amount') return b.amount - a.amount;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="depenses-tab-root">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center bg-[#FAF8F6] p-3 border border-neutral-200 rounded-xl">
          <span className="text-[10px] font-black uppercase text-neutral-400">Trier le Journal</span>
          <div className="flex gap-2 text-xs font-bold">
            <button onClick={() => setSortBy('date')} className={`px-2.5 py-1 rounded ${sortBy === 'date' ? 'bg-[#1E293B] text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}>Par Date</button>
            <button onClick={() => setSortBy('amount')} className={`px-2.5 py-1 rounded ${sortBy === 'amount' ? 'bg-[#1E293B] text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}>Par Montant</button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F6] text-[9px] font-black text-neutral-400 uppercase border-b border-neutral-200">
                <th className="px-4 py-2.5">Libellé</th>
                <th className="px-4 py-2.5">Catégorie</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
              {sortedExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 text-[#1E293B] font-extrabold">{exp.label}</td>
                  <td className="px-4 py-3">
                    <span className="bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded text-[9px] uppercase font-black">{exp.category}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 font-semibold">{exp.date}</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600 font-black">- {exp.amount.toLocaleString()} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#FAF8F6] border border-neutral-200 rounded-2xl p-4 shadow-sm h-fit space-y-4">
        <div>
          <h4 className="text-[11px] font-black text-[#1E293B] uppercase tracking-wider">📉 Saisir une Dépense</h4>
          <p className="text-[9px] text-neutral-400 font-semibold">Toutes les sorties de caisse sont enregistrées.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-bold text-neutral-600">
          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 font-black uppercase">Libellé de la Dépense</label>
            <input type="text" placeholder="Ex: Achat craies..." value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 font-black uppercase">Catégorie</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none">
              <option value="RH">Salaires / RH</option>
              <option value="Loyer/Charges">Loyer / Charges</option>
              <option value="Matériel">Matériel & Equipement</option>
              <option value="Autre">Autre dépense</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 font-black uppercase">Montant (FCFA)</label>
            <input type="number" placeholder="FCFA" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-neutral-400 font-black uppercase">Date de Décaissement</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none" required />
          </div>
          <button type="submit" className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs">Enregistrer</button>
        </form>
      </div>
    </div>
  );
}
