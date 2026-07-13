import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  showSupportModal: boolean; setShowSupportModal: (v: boolean) => void;
  ticketCategory: string; setTicketCategory: (v: string) => void;
  ticketSubject: string; setTicketSubject: (v: string) => void;
  ticketDescription: string; setTicketDescription: (v: string) => void;
  isSendingTicket: boolean;
  onSendTicket: (e: React.FormEvent) => void;
}

export function SupportModal({
  showSupportModal, setShowSupportModal, ticketCategory, setTicketCategory,
  ticketSubject, setTicketSubject, ticketDescription, setTicketDescription,
  isSendingTicket, onSendTicket
}: Props) {
  if (!showSupportModal) return null;
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[260] flex items-center justify-center p-4 animate-fade-in select-none"
      onClick={() => setShowSupportModal(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-md border border-neutral-gray-200/50 shadow-2xl overflow-hidden flex flex-col max-h-[min(90vh,40rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-brand-red-deep to-[#8C1014] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2"><span className="material-symbols-outlined text-base">support_agent</span><h4 className="font-extrabold text-xs">Support</h4></div>
          <button onClick={() => setShowSupportModal(false)} className="text-white/85 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"><span translate="no" className="material-symbols-outlined text-xs">close</span></button>
        </div>
        <form onSubmit={onSendTicket} className="flex-grow flex flex-col overflow-hidden">
          <div className="p-5 space-y-3.5 flex-grow">
            <p className="text-[10.5px] text-secondary leading-relaxed font-semibold">Un souci pédagogique, technique ou d'accès ? Soumettez un ticket à l'administration de l'École 221.</p>
            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase tracking-wider text-neutral-gray-400">Catégorie du ticket</label>
              <div className="grid grid-cols-3 gap-2">
                {['Technique', 'Pédagogique', 'Notes/Examens'].map((cat) => (
                  <button key={cat} type="button" onClick={() => setTicketCategory(cat)} className={`py-1.5 px-1 text-center text-[10.5px] rounded-xl border font-bold transition-all ${ticketCategory === cat ? 'border-brand-red-deep bg-brand-red-light text-brand-red-deep font-black shadow-2xs' : 'border-neutral-gray-200 text-secondary hover:bg-neutral-gray-50'}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase tracking-wider text-neutral-gray-400">Sujet / Intitulé</label>
              <input type="text" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="Ex : Question sur les coefficients" className="w-full text-xs font-bold text-on-surface bg-neutral-gray-50 border border-neutral-gray-250 p-2.5 rounded-xl outline-none focus:border-brand-red-deep" />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase tracking-wider text-neutral-gray-400">Description détaillée</label>
              <textarea value={ticketDescription} onChange={(e) => setTicketDescription(e.target.value)} placeholder="Mentionnez votre matière et classe..." rows={3} className="w-full text-xs font-medium text-on-surface bg-neutral-gray-50 border border-neutral-gray-250 p-2.5 rounded-xl outline-none focus:border-brand-red-deep resize-none leading-relaxed" />
            </div>
          </div>
          <div className="p-4 bg-neutral-gray-50 border-t border-neutral-gray-150 flex justify-end gap-2.5 shrink-0">
            <button type="button" onClick={() => setShowSupportModal(false)} className="px-4 py-2 bg-neutral-gray-200 hover:bg-neutral-gray-300 text-secondary text-xs rounded-xl font-bold transition-all cursor-pointer">Annuler</button>
            <button type="submit" disabled={isSendingTicket} className="px-5 py-2 bg-brand-red-deep hover:bg-brand-red-deep/90 text-white text-xs rounded-xl font-bold disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
              {isSendingTicket ? (<><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />Envoi...</>) : (<><span className="material-symbols-outlined text-[14px]">send</span>Créer le Ticket</>)}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
