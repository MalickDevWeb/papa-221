import React, { useState } from 'react';
import { Student } from '../../../../domain/StudentModels';
import { getStudentERPData } from './utils/StudentMockData';
import { printTable } from './utils/ExportUtils';

interface Props {
  selectedStudent: Student;
  erpData?: any;
}

export function TabCommunication({ selectedStudent, erpData }: Props) {
  const finalErpData = erpData || getStudentERPData(selectedStudent.id, selectedStudent.name);
  const [commMode, setCommMode] = useState<'timeline' | 'chat'>('timeline');

  const handlePrintChat = () => {
    const headers = ['Expéditeur', 'Message', 'Date'];
    const rows = finalErpData.extra.messages.map(msg => [msg.sender, msg.text, msg.date]);
    printTable(`Journal de Communication - ${selectedStudent.name}`, headers, rows);
  };

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-comm">
      <div className="flex border-b border-neutral-100 gap-2 pb-2">
        <button
          onClick={() => setCommMode('timeline')}
          className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
            commMode === 'timeline' ? 'bg-[#B3181C] text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          Timeline du Parcours
        </button>
        <button
          onClick={() => setCommMode('chat')}
          className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
            commMode === 'chat' ? 'bg-[#B3181C] text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          Messagerie administrative
        </button>
      </div>

      {commMode === 'timeline' && (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-neutral-200">
          {finalErpData.timeline.map((evt, idx) => (
            <div key={idx} className="relative space-y-1">
              <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${idx === finalErpData.timeline.length - 1 ? 'bg-[#B3181C] ring-4 ring-[#B3181C]/25 animate-ping' : 'bg-neutral-400'}`} />
              <p className="text-[10px] text-neutral-400 font-bold">{evt.year}</p>
              <h5 className="font-extrabold text-[#1E293B] text-[11px] uppercase tracking-wide flex items-center gap-2">
                {evt.title}
                {evt.status === 'COMPLETED' && (
                  <span className="text-[8px] bg-emerald-50 text-emerald-800 px-1 py-0.5 rounded font-black uppercase">Terminé</span>
                )}
                {evt.status === 'IN_PROGRESS' && (
                  <span className="text-[8px] bg-amber-50 text-amber-800 px-1 py-0.5 rounded font-black uppercase animate-pulse">En cours</span>
                )}
              </h5>
              <p className="text-neutral-500 text-[11px] font-bold">{evt.desc}</p>
            </div>
          ))}
        </div>
      )}

      {commMode === 'chat' && (
        <div className="space-y-4 bg-neutral-50/50 p-3 rounded-2xl border border-neutral-150">
          <div className="flex items-center justify-between border-b border-neutral-150 pb-2">
            <h4 className="font-extrabold text-[#1E293B] text-xs uppercase tracking-wider text-[#B3181C] flex items-center gap-1">
              <span translate="no" className="material-symbols-outlined text-sm">mail</span>
              Échanges Administrateurs / Enseignants
            </h4>
            <button onClick={handlePrintChat} className="px-2 py-1 border border-neutral-200 hover:bg-white text-neutral-700 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer">
              <span translate="no" className="material-symbols-outlined text-xs">print</span>
              <span>Imprimer Fil</span>
            </button>
          </div>
          <div className="space-y-3">
            {finalErpData.extra.messages.map((msg, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-neutral-100 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#1E293B] text-[10px] uppercase text-[#B3181C]">{msg.sender}</span>
                  <span className="text-[9px] text-neutral-400 font-bold">{msg.date}</span>
                </div>
                <p className="text-neutral-700 font-bold text-[11px] leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
