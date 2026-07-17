import React, { useState } from 'react';

interface Props {
  initialDay: string;
  initialRoom: string;
  initialTime: string;
  onSubmit: (day: string, time: string, room: string) => Promise<void>;
  onCancel: () => void;
}

export function RescheduleForm({ initialDay, initialRoom, initialTime, onSubmit, onCancel }: Props) {
  const [day, setDay] = useState(initialDay);
  const [room, setRoom] = useState(initialRoom);
  const [time, setTime] = useState(initialTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(day, time, room);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 animate-fade-in text-left">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">
            Jour
          </label>
          <select
            value={day}
            onChange={e => setDay(e.target.value)}
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold"
          >
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">
            Salle
          </label>
          <input
            type="text"
            value={room}
            onChange={e => setRoom(e.target.value)}
            required
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">
          Heure (ex: 08:00 - 11:00)
        </label>
        <input
          type="text"
          value={time}
          onChange={e => setTime(e.target.value)}
          required
          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-black border-0 cursor-pointer"
        >
          Retour
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-[#10B981] text-white rounded-xl text-xs font-black border-0 cursor-pointer"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
