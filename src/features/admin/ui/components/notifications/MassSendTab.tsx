import React, { useState } from 'react';

interface Props {
  onSendCampaign: (title: string, target: string, channels: string[]) => void;
}

export function MassSendTab({ onSendCampaign }: Props) {
  const [target, setTarget] = useState('Toute l\'école');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [channels, setChannels] = useState<string[]>(['WhatsApp']);
  const [previewChannel, setPreviewChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [sending, setSending] = useState(false);

  const toggleChannel = (ch: string) => {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setSending(true);
    setTimeout(() => {
      onSendCampaign(title, target, channels);
      setTitle('');
      setContent('');
      setSending(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-bold text-[#4A5568]" id="mass-send-tab">
      {/* Editor Panel */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#FAF8F6] p-5 border border-neutral-200 rounded-2xl shadow-xs">
        <div>
          <h3 className="font-extrabold text-sm text-[#1E293B]">Créer une Campagne Omnicanale</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Ciblez et diffusez vos annonces en temps réel.</p>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-neutral-400 font-black uppercase">Segment Cible</label>
          <select value={target} onChange={e => setTarget(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none">
            <option value="Toute l'école">Toute l'école (Élèves & Personnels)</option>
            <option value="Tuteurs & Parents">Tuteurs & Parents d'élèves uniquement</option>
            <option value="Enseignants">Corps Enseignant uniquement</option>
            <option value="Master 1 Spécialité IA">Classe : Master 1 Spécialité IA</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-neutral-400 font-black uppercase">Titre / Objet du message</label>
          <input type="text" placeholder="Ex: Rattrapages de Génie Civil" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none" required />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-neutral-400 font-black uppercase">Contenu du Message</label>
          <textarea rows={3} placeholder="Saisissez le corps du message..." value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2.5 border border-neutral-200 bg-white rounded-xl focus:outline-none font-semibold" required />
        </div>

        <div className="space-y-1.5">
          <span className="text-[9px] text-neutral-400 font-black uppercase block">Canaux de Diffusion</span>
          <div className="flex flex-wrap gap-3">
            {['WhatsApp', 'SMS', 'Email', 'Push App'].map(ch => (
              <label key={ch} className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={channels.includes(ch)} onChange={() => toggleChannel(ch)} className="w-4 h-4 rounded border-neutral-200 text-[#B3181C] focus:ring-[#B3181C] cursor-pointer" />
                <span>{ch}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={sending} className="w-full py-2.5 bg-[#B3181C] hover:bg-[#921316] disabled:opacity-50 text-white rounded-xl uppercase tracking-wider text-[10px] font-black transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1">
          <span translate="no" className="material-symbols-outlined text-sm">{sending ? 'sync' : 'send'}</span>
          <span>{sending ? 'Diffusion...' : 'Lancer la diffusion'}</span>
        </button>
      </form>

      {/* Interactive Preview Panel */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
            <span className="text-[10px] font-black uppercase text-[#1E293B] tracking-wider">Aperçu Dynamique du Message</span>
            <div className="flex gap-1">
              {(['WhatsApp', 'SMS', 'Email'] as const).map(ch => (
                <button key={ch} type="button" onClick={() => setPreviewChannel(ch)} className={`px-2 py-1 text-[9px] uppercase font-black rounded-lg border ${previewChannel === ch ? 'bg-[#1E293B] text-white' : 'bg-white text-neutral-600'}`}>{ch}</button>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 p-4 rounded-2xl min-h-[180px] flex items-center justify-center">
            {previewChannel === 'WhatsApp' && (
              <div className="bg-emerald-100 border border-emerald-200 text-neutral-800 p-3 rounded-2xl max-w-xs shadow-sm space-y-1.5 text-[11px] font-semibold">
                <div className="text-emerald-700 font-extrabold text-[10px]">🟢 École 221 (WhatsApp Officiel)</div>
                <div className="font-bold text-[#1E293B]">{title || "Sujet du message..."}</div>
                <p>{content || "Le contenu de votre annonce WhatsApp apparaîtra ici."}</p>
                <div className="text-right text-[8px] text-neutral-400 font-bold">Aujourd'hui, 14:15</div>
              </div>
            )}

            {previewChannel === 'SMS' && (
              <div className="bg-white text-neutral-800 p-3 rounded-2xl max-w-xs shadow-sm border border-neutral-200 space-y-1 text-[11px] font-medium font-mono">
                <span className="text-neutral-400 font-bold text-[9px] block">ECOLE221 (SMS)</span>
                <p>{content ? `${title}: ${content}` : "Le contenu de votre SMS apparaîtra ici."}</p>
              </div>
            )}

            {previewChannel === 'Email' && (
              <div className="bg-white border border-neutral-200 rounded-xl p-4 w-full shadow-sm text-[11px] font-medium space-y-2 text-[#4A5568]">
                <div className="pb-1 border-b border-neutral-100 space-y-0.5">
                  <div>De : <span className="text-[#1E293B] font-extrabold">admissions@ecole221.sn</span></div>
                  <div>Objet : <span className="text-[#1E293B] font-extrabold">{title || "Objet du courriel..."}</span></div>
                </div>
                <p className="whitespace-pre-wrap">{content || "Le contenu de votre courriel apparaîtra ici."}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-[9px] text-neutral-400 font-semibold leading-normal">
          💡 La communication omnicanale garantit un taux de lecture de 98% en doublant les emails d'un SMS ou message WhatsApp instantané.
        </p>
      </div>
    </div>
  );
}
