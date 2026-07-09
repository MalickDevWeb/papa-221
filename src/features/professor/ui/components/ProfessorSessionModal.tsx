import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, RefreshCw, LogIn, Trash2 } from 'lucide-react';
import type { ProfessorSchedule } from '../../domain/ProfessorModels';

interface Props {
  readonly session: ProfessorSchedule | null; readonly onClose: () => void;
  readonly onCancel: (id: string, reason: string) => Promise<void>;
  readonly onReschedule: (id: string, day: string, time: string, room: string) => Promise<void>;
  readonly onEnter: (courseId: string) => void;
}

export function ProfessorSessionModal({ session, onClose, onCancel, onReschedule, onEnter }: Props) {
  const [reason, setReason] = useState('Empêchement pédagogique');
  const [day, setDay] = useState(''); const [time, setTime] = useState(''); const [room, setRoom] = useState('');
  const [action, setAction] = useState<'none' | 'cancel' | 'reschedule'>('none');

  useEffect(() => {
    if (session) {
      setDay(session.day);
      setTime(session.time);
      setRoom(session.room);
      setAction('none');
    }
  }, [session]);

  if (!session) return null;

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCancel(session.id, reason);
    onClose();
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onReschedule(session.id, day, time, room);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-gray-200 p-6 shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 border-0 bg-transparent cursor-pointer"><X className="w-5 h-5" /></button>
        
        <div className="mb-4">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#B3181C] bg-[#FFF5F5] px-2.5 py-1 rounded-full">{session.type} · {session.room}</span>
          <h3 className="mt-2 text-base font-black text-[#1E293B] leading-snug">{session.courseTitle}</h3>
          <p className="text-xs text-neutral-500 font-bold mt-1">Planifié le {session.day} à {session.time}</p>
        </div>

        {session.status === 'annule' ? (
          <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#B3181C]/15 text-center text-xs font-black text-brand-red-deep">
            Cette séance a été annulée. Motif : "{session.cancellationReason || 'Non spécifié'}"
          </div>
        ) : (
          <div className="space-y-3.5">
            {session.courseId && action === 'none' && (
              <button onClick={() => { onEnter(session.courseId!); onClose(); }} className="w-full flex items-center justify-center gap-2 py-3 bg-brand-red-deep hover:bg-[#6B0E10] text-white rounded-2xl text-xs font-black cursor-pointer transition-colors border-0">
                <LogIn className="w-4 h-4" /> Entrer dans le cours interactif
              </button>
            )}

            {action === 'none' && (
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setAction('reschedule')} className="flex items-center justify-center gap-2 py-3 bg-neutral-gray-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl text-xs font-black cursor-pointer border-0"><RefreshCw className="w-4 h-4" /> Reprogrammer</button>
                <button type="button" onClick={() => setAction('cancel')} className="flex items-center justify-center gap-2 py-3 bg-brand-red-light hover:bg-[#ffebeb] text-brand-red-deep rounded-2xl text-xs font-black cursor-pointer border-0"><Trash2 className="w-4 h-4" /> Annuler cours</button>
              </div>
            )}

            {action === 'cancel' && (
              <form onSubmit={handleCancelSubmit} className="space-y-3 animate-fade-in">
                <label className="block text-xs font-black text-neutral-650">Motif de l'annulation :</label>
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} required className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none focus:border-brand-red-deep" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAction('none')} className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-black border-0 cursor-pointer">Retour</button>
                  <button type="submit" className="flex-1 py-2.5 bg-brand-red-deep text-white rounded-xl text-xs font-black border-0 cursor-pointer">Confirmer l'annulation</button>
                </div>
              </form>
            )}

            {action === 'reschedule' && (
              <form onSubmit={handleRescheduleSubmit} className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Jour</label>
                    <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold">
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Salle</label>
                    <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} required className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Heure (ex: 08:00 - 11:00)</label>
                  <input type="text" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAction('none')} className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-black border-0 cursor-pointer">Retour</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#10B981] text-white rounded-xl text-xs font-black border-0 cursor-pointer">Enregistrer</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
