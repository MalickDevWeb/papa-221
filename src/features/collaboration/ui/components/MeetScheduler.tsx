import React, { useState } from 'react';
import { Video, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  readonly onSchedule: (
    classIds: readonly string[],
    classNames: readonly string[],
    subject: string,
    teacher: string,
    link: string,
    autoGen: boolean,
    restrict: boolean
  ) => void;
  readonly teacherName: string;
}

export function MeetScheduler({ onSchedule, teacherName }: Props) {
  const [selectedClass, setSelectedClass] = useState<string>('L3-INFO');
  const [subject, setSubject] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [autoGen, setAutoGen] = useState(false);
  const [restrict, setRestrict] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const className = selectedClass === 'L3-INFO' ? 'L3 Informatique' : 'M1 Spécialité IA';
    onSchedule([selectedClass], [className], subject || 'Cours Général', teacherName, meetLink, autoGen, restrict);
    setSubject('');
    setMeetLink('');
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-brand-red-light text-brand-red-deep">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-gray-900">Planifier une Classe Virtuelle</h3>
          <p className="text-xs text-neutral-500">Créez et publiez un cours en ligne Google Meet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Classe ciblée</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
          >
            <option value="L3-INFO">L3 Informatique</option>
            <option value="M1-IA">M1 Spécialité IA (Assigné)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Matière / Sujet du Cours</label>
          <input
            type="text"
            placeholder="Ex: Architecture logicielle"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
            required
          />
        </div>

        <div className="flex items-center justify-between bg-neutral-gray-50 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-red-deep" />
            <span className="text-xs font-bold text-gray-800">Générer via Google Workspace API</span>
          </div>
          <input
            type="checkbox"
            checked={autoGen}
            onChange={(e) => setAutoGen(e.target.checked)}
            className="h-4 w-4 text-brand-red-deep border-gray-300 rounded focus:ring-brand-red-deep"
          />
        </div>

        {!autoGen && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Lien Google Meet</label>
            <input
              type="text"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red-deep"
              required={!autoGen}
            />
          </div>
        )}

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 p-3 rounded-xl text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-[10px] leading-normal font-semibold">
            <span className="font-bold">Sécurité Google :</span> Restreindre l&apos;accès uniquement aux comptes de l&apos;université (@ecole221.sn).
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-brand-red-deep text-white font-bold text-xs rounded-xl hover:bg-brand-red-deep/90 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Video className="w-4 h-4" />
          <span>Publier la Classe Virtuelle</span>
        </button>
      </form>
    </div>
  );
}
export default MeetScheduler;
