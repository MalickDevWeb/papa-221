import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { ProfessorCourse } from '../../../domain/ProfessorModels';
import { ProfessorActiveMeetView } from './ProfessorActiveMeetView';
import { useProfessorLiveSessions } from './useProfessorLiveSessions';
import { getAccessToken, googleSignIn } from '@/shared/lib/googleAuth';

interface Props {
  readonly selectedCourse: ProfessorCourse;
  readonly triggerToast: (msg: string) => void;
  readonly profName: string;
}

export function ProfessorLiveMeetPanel({ selectedCourse, triggerToast, profName }: Props) {
  const { active, startMeet, stopMeet } = useProfessorLiveSessions(selectedCourse.titre, triggerToast);
  const [sessionTitle, setSessionTitle] = useState('');
  const [meetUrl, setMeetUrl] = useState('');
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    getAccessToken().then(tok => setHasToken(!!tok));
  }, []);

  const handleGoogleLogin = async () => {
    try {
      if (await googleSignIn()) {
        setHasToken(true);
        triggerToast("Connexion Google réussie !");
      }
    } catch {
      triggerToast("Échec de la connexion Google.");
    }
  };

  const handleStart = async () => {
    if (await startMeet(sessionTitle, meetUrl, profName)) {
      setSessionTitle('');
      setMeetUrl('');
    }
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-xl shrink-0 ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#1a73e8]'}`}>
          <Icon icon="logos:google-meet" className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-[#291715] flex items-center gap-1.5">
            Classe Virtuelle Google Meet
            {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
          </h4>
          <p className="text-[10px] text-neutral-400 font-semibold leading-none mt-1">
            {active ? 'Le cours interactif Google Meet est en cours.' : 'Lancez un cours interactif avec Google Meet.'}
          </p>
        </div>
      </div>

      {active ? (
        <ProfessorActiveMeetView active={active} stopMeet={stopMeet} profName={profName} />
      ) : !hasToken ? (
        <div className="pt-3 border-t border-neutral-100 flex flex-col items-center justify-center py-3 space-y-3">
          <p className="text-[10px] font-bold text-neutral-500 text-center">
            Connectez votre compte Google pour créer automatiquement vos salons Google Meet.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 border border-neutral-200 hover:bg-neutral-50 px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 cursor-pointer transition-all"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Se connecter avec Google</span>
          </button>
        </div>
      ) : (
        <div className="pt-2 border-t border-neutral-100 space-y-3 animate-fade-in">
          <input
            type="text"
            placeholder="Sujet du cours (ex: TP Graphes)"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            className="w-full bg-[#FAF8F6] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#291715] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Optionnel: Coller un lien Google Meet existant..."
            value={meetUrl}
            onChange={(e) => setMeetUrl(e.target.value)}
            className="w-full bg-[#FAF8F6] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#291715] focus:outline-none"
          />
          <button
            onClick={handleStart}
            className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102"
          >
            <Icon icon="lucide:video" className="h-4 w-4" /> Lancer le cours Google Meet
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfessorLiveMeetPanel;
