import React from 'react';
import { Room } from '../../../domain/SchoolModels';
import { TEACHERS, SUBJECTS } from './PlanningConstants';

interface Props {
  subject: string;
  setSubject: (v: string) => void;
  prof: string;
  setProf: (v: string) => void;
  roomName: string;
  setRoomName: (v: string) => void;
  isLive: boolean;
  rooms: Room[];
}

export function SlotEditFields({
  subject,
  setSubject,
  prof,
  setProf,
  roomName,
  setRoomName,
  isLive,
  rooms,
}: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] uppercase font-black text-neutral-400">Matière / Sujet</label>
        <input
          type="text"
          list="subjects-list"
          value={subject}
          disabled={isLive}
          onChange={e => setSubject(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#B3181C] disabled:bg-neutral-100 disabled:text-neutral-500 font-bold"
          placeholder="ex: Intelligence Artificielle"
        />
        <datalist id="subjects-list">
          {SUBJECTS.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>

      <div>
        <label className="text-[10px] uppercase font-black text-neutral-400">Enseignant</label>
        <select
          value={prof}
          disabled={isLive}
          onChange={e => setProf(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-[#B3181C] disabled:bg-neutral-100 disabled:text-neutral-500"
        >
          <option value="">Sélectionner</option>
          {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="text-[10px] uppercase font-black text-neutral-400">Salle</label>
        <select
          value={roomName}
          disabled={isLive}
          onChange={e => setRoomName(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-[#B3181C] disabled:bg-neutral-100 disabled:text-neutral-500"
        >
          <option value="">Sans salle</option>
          {rooms.map(r => <option key={r.id} value={r.name}>{r.name} ({r.capacity} pl)</option>)}
        </select>
      </div>
    </div>
  );
}
