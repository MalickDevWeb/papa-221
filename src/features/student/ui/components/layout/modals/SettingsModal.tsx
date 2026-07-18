import React from 'react';
import { createPortal } from 'react-dom';

export interface SettingsPrefs {
  emailNotifs: boolean; proactiveAiTutor: boolean; smoothScroll: boolean;
  language: string; experimentalDark: boolean;
  paymentNotifs: boolean;
}

interface Props {
  showSettings: boolean; setShowSettings: (v: boolean) => void;
  settingsPrefs: SettingsPrefs; setSettingsPrefs: React.Dispatch<React.SetStateAction<SettingsPrefs>>;
  triggerToast: (msg: string, icon?: string) => void;
}

export function SettingsModal({ showSettings, setShowSettings, settingsPrefs, setSettingsPrefs, triggerToast }: Props) {
  if (!showSettings) return null;
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[260] flex items-center justify-center p-4 animate-fade-in select-none"
      onClick={() => setShowSettings(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-sm border border-neutral-gray-200/50 shadow-2xl overflow-hidden flex flex-col max-h-[min(90vh,38rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-brand-red-deep to-[#8C1014] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-base">settings</span><h4 className="font-extrabold text-xs">Paramètres</h4></div>
          <button onClick={() => setShowSettings(false)} className="text-white/85 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"><span translate="no" className="material-symbols-outlined text-xs">close</span></button>
        </div>
        <div className="p-5 space-y-4">
          <span className="block text-[9px] font-black uppercase tracking-widest text-brand-red-deep mb-1">Paramètres Personnalisés</span>
          {[
            { key: 'emailNotifs' as const, label: 'Rapports de Performance Hebdos', desc: "Bulletin d'analyse par e-mail", toastOn: 'Notifications e-mail activées', toastOff: 'Notifications e-mail désactivées', toastIcon: 'mail' },
            { key: 'paymentNotifs' as const, label: 'Notifications de Scolarité / Reçus', desc: 'Alertes par e-mail de validation de paiement', toastOn: 'Alerte paiement e-mail activée !', toastOff: 'Alerte paiement e-mail désactivée', toastIcon: 'payments' },
            { key: 'proactiveAiTutor' as const, label: 'Tuteur Proactif École 221', desc: 'Suggestions IA de révisions', toastOn: 'Analyse IA proactive enclenchée !', toastOff: 'Analyse IA proactive désactivée', toastIcon: 'bolt' },
            { key: 'experimentalDark' as const, label: 'Interface Contrastée Accentée', desc: 'Hautes couleurs (antifatigue oculaire)', toastOn: 'Hautes couleurs activées', toastOff: 'Mode classique rétabli', toastIcon: 'check_circle' },
          ].map(({ key, label, desc, toastOn, toastOff, toastIcon }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div><h5 className="text-xs font-bold text-[#1E293B]">{label}</h5><p className="text-[10px] text-neutral-gray-400">{desc}</p></div>
              <button aria-label={`Basculer ${label}`} onClick={() => { const next = !settingsPrefs[key]; setSettingsPrefs(p => ({ ...p, [key]: next })); triggerToast(next ? toastOn : toastOff, toastIcon); }} className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${settingsPrefs[key] ? 'bg-brand-red-deep' : 'bg-neutral-gray-200'}`}>
                <span className={`w-3.5 h-3.5 bg-white rounded-full absolute top-1 transition-all ${settingsPrefs[key] ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[10.5px] font-extrabold text-[#1E293B]">Langue de navigation</label>
            <div className="relative">
              <select value={settingsPrefs.language} onChange={(e) => { setSettingsPrefs(p => ({ ...p, language: e.target.value })); triggerToast(`Langue : ${e.target.value}`); }} className="w-full text-xs font-bold text-secondary bg-neutral-gray-50 border border-neutral-gray-250 py-2 pl-3 pr-8 rounded-xl appearance-none outline-none focus:border-brand-red-deep cursor-pointer">
                <option value="Français">Français ( Sénégal )</option>
                <option value="English">English ( US )</option>
                <option value="Wolof">Wolof ( Sénégal )</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-400 text-sm pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-neutral-gray-50 border-t border-neutral-gray-150 flex gap-2 shrink-0">
          <button onClick={() => { setShowSettings(false); triggerToast('Préférences synchronisées', 'save_as'); }} className="flex-1 py-2.5 bg-brand-red-deep hover:bg-brand-red-deep/90 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer">Sauvegarder</button>
          <button onClick={() => setShowSettings(false)} className="px-4 py-2.5 bg-neutral-gray-200 hover:bg-neutral-gray-300 text-secondary rounded-xl text-xs font-bold transition-all cursor-pointer">Annuler</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
