import React, { useState } from 'react';
import { AdmissionNotification } from '../../../domain/AdmissionsExtendedModels';

interface Props {
  notifications: AdmissionNotification[];
  onSendNotification: (type: string, message: string) => void;
}

const NOTIFICATION_TEMPLATES = [
  { type: 'dossier_incomplet', label: 'Dossier Incomplet', msg: 'Votre dossier est incomplet. Veuillez téléverser les pièces manquantes.' },
  { type: 'demande_pieces', label: 'Pièces Complémentaires', msg: 'Nous sollicitons des pièces justificatives supplémentaires pour l\'étude de vos équivalences.' },
  { type: 'convocation_entretien', label: 'Convocation Entretien', msg: 'Vous êtes convoqué à un entretien avec le jury le 25 Juillet à 10h.' },
  { type: 'decision_favorable', label: 'Décision Favorable', msg: 'Félicitations ! Votre demande d\'admission a reçu un avis favorable.' },
  { type: 'decision_defavorable', label: 'Décision Défavorable', msg: 'Nous regrettons de vous informer que votre dossier n\'a pas été retenu.' },
  { type: 'admission_conditionnelle', label: 'Admission Conditionnelle', msg: 'Votre admission est acceptée sous réserve de la validation des frais de tranche 1.' },
  { type: 'admission_definitive', label: 'Admission Définitive', msg: 'Votre admission est maintenant définitive ! Procédez au paiement de votre badge.' }
];

export function NotificationPanel({ notifications, onSendNotification }: Props) {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const handleSend = () => {
    const tpl = NOTIFICATION_TEMPLATES[selectedTemplateIndex];
    onSendNotification(tpl.type, tpl.msg);
  };

  return (
    <div className="border border-neutral-200 rounded-xl p-4 bg-white space-y-3 text-xs font-bold text-neutral-600" id="notification-panel">
      <div className="border-b border-neutral-100 pb-1.5 flex justify-between items-center">
        <span className="font-extrabold text-[#1E293B] uppercase text-[10px] tracking-wide">Notifications Automatiques (Email / SMS)</span>
        <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-black uppercase">Statut Logs</span>
      </div>

      <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar border-b border-neutral-100 pb-2">
        {notifications.length === 0 ? (
          <p className="text-neutral-400 italic font-semibold text-[10px] text-center py-2">Aucun historique de notification.</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="p-2 bg-neutral-50 rounded-lg flex flex-col gap-0.5 border border-neutral-100">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-black uppercase text-[#B3181C]">{n.type.replace('_', ' ')}</span>
                <span className="text-neutral-400">{new Date(n.sentAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-[10px] text-neutral-600 font-semibold leading-relaxed">{n.message}</p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2 pt-1">
        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Déclencher Alerte Candidat</span>
        <div className="flex gap-2">
          <select
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 outline-none text-xs text-[#1E293B]"
            value={selectedTemplateIndex}
            onChange={e => setSelectedTemplateIndex(Number(e.target.value))}
          >
            {NOTIFICATION_TEMPLATES.map((tpl, i) => (
              <option key={tpl.type} value={i}>{tpl.label}</option>
            ))}
          </select>
          <button
            onClick={handleSend}
            className="px-3 py-1.5 bg-[#B3181C] hover:bg-[#8F1316] text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer transition-all"
          >
            <span translate="no" className="material-symbols-outlined text-xs">send</span>
            <span>Notifier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
