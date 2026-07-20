import React, { useState } from 'react';
import { ShieldAlert, Video } from 'lucide-react';
import { AdminMeeting } from '../../domain/CollaborationModels';

interface Props {
  readonly meetings: readonly AdminMeeting[];
  readonly onCreate: (
    title: string,
    organizer: string,
    scope: AdminMeeting['targetScope'],
    details: string,
    type: AdminMeeting['type'],
    link: string
  ) => void;
}

export function AdminGlobalMeetings({ meetings, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<AdminMeeting['targetScope']>('ALL');
  const [type, setType] = useState<AdminMeeting['type']>('conférence');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/xyz-work-shp');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title, 'Direction Académique', scope, 'Tous les départements', type, meetLink);
    setTitle('');
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-neutral-900 text-white"><ShieldAlert className="w-5 h-5" /></div>
        <div>
          <h3 className="font-bold text-base text-gray-900 font-sans">Réunions Institutionnelles & Événements (Administration)</h3>
          <p className="text-xs text-neutral-500 font-semibold">Créez des webinaires, séminaires ou réunions générales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-gray-50/50 p-4 rounded-xl border border-neutral-100">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Titre de l&apos;Événement</label>
            <input
              type="text"
              placeholder="Ex: Conférence d'ouverture 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Audience Cible</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as AdminMeeting['targetScope'])}
                className="w-full text-xs font-semibold px-2 py-2 border border-neutral-gray-200 rounded-xl bg-white"
              >
                <option value="ALL">Tout l&apos;établissement</option>
                <option value="TEACHERS">Enseignants</option>
                <option value="ADMINS">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Type d&apos;Événement</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AdminMeeting['type'])}
                className="w-full text-xs font-semibold px-2 py-2 border border-neutral-gray-200 rounded-xl bg-white"
              >
                <option value="conférence">Conférence</option>
                <option value="panel">Panel</option>
                <option value="soutenance">Soutenance</option>
                <option value="webinaire">Webinaire</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-850 transition-all flex items-center justify-center gap-1.5"
          >
            <Video className="w-4 h-4" /> Publier l&apos;Événement
          </button>
        </form>

        <div className="space-y-3 overflow-y-auto max-h-[220px] no-scrollbar">
          <span className="text-[10px] font-bold text-neutral-600 block">Événements publiés</span>
          {meetings.map((m) => (
            <div key={m.id} className="p-3 rounded-xl border border-neutral-200 flex justify-between items-center bg-white shadow-3xs">
              <div>
                <span className="font-bold text-xs text-gray-800 block">{m.title}</span>
                <span className="text-[9px] bg-brand-red-light text-brand-red-deep px-1.5 py-0.5 rounded-full font-bold uppercase mr-1">{m.type}</span>
                <span className="text-[10px] text-neutral-500 font-semibold">{m.targetScope}</span>
              </div>
              <a href={m.meetLink} target="_blank" rel="noreferrer" className="px-2.5 py-1.5 bg-[#4285F4] text-white font-bold text-[9px] rounded-xl flex items-center gap-1">
                <Video className="w-3 h-3" /> Rejoindre
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AdminGlobalMeetings;
