import React, { useState } from 'react';
import { Campaign } from './admissionsDb';

interface Props {
  campaign: Campaign;
  onClose: () => void;
}

export function CampaignShareModal({ campaign, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://ecole221.sn/admissions/${campaign.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareSuccess = (platform: string) => {
    alert(`Simulation de partage sur ${platform} avec l'aperçu officiel de la campagne !`);
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[2000] flex items-center justify-center p-4 text-xs font-bold text-neutral-600">
      <div className="bg-white rounded-2xl shadow-2xl p-5 border border-neutral-200 w-full max-w-lg space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
          <div>
            <h4 className="font-extrabold text-sm text-[#1E293B]">Partager la Campagne</h4>
            <p className="text-[10px] text-neutral-400">Générez un engouement public autour de cette offre académique.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 cursor-pointer">
            <span translate="no" className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Campaign Visual Card Preview */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-xs bg-[#FAF8F6]">
          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-24 object-cover" />
          <div className="p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase text-[#B3181C] tracking-wider">École 221 · ISM Dakar</span>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-black border border-emerald-100">Admissions Ouvertes</span>
            </div>
            <h5 className="font-black text-[#1E293B] text-xs leading-snug">{campaign.title}</h5>
            <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
              Date de clôture : <strong className="text-neutral-600">{campaign.deadline}</strong>. Frais : <strong className="text-neutral-600">{campaign.fees.toLocaleString()} FCFA</strong>. Conditions requises : {campaign.requirements.join(', ')}.
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2">
          <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Canaux de diffusion</span>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => shareSuccess('WhatsApp')} className="p-2.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/50 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-[#1E5E3A]">
              <span className="font-semibold text-[10px]">WhatsApp</span>
            </button>
            <button onClick={() => shareSuccess('Facebook')} className="p-2.5 bg-blue-50 border border-blue-100 hover:bg-blue-100/50 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-[#1E3A8A]">
              <span className="font-semibold text-[10px]">Facebook</span>
            </button>
            <button onClick={() => shareSuccess('LinkedIn')} className="p-2.5 bg-cyan-50 border border-cyan-100 hover:bg-cyan-100/50 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-cyan-800">
              <span className="font-semibold text-[10px]">LinkedIn</span>
            </button>
            <button onClick={() => shareSuccess('Telegram')} className="p-2.5 bg-sky-50 border border-sky-100 hover:bg-sky-100/50 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-sky-800">
              <span className="font-semibold text-[10px]">Telegram</span>
            </button>
          </div>
        </div>

        {/* Link copying & QR */}
        <div className="flex gap-2 items-center bg-[#FAF8F6] border border-neutral-200 rounded-xl p-2.5">
          <input readOnly value={shareUrl} className="flex-1 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 outline-none font-mono text-[9px] text-[#1E293B]" />
          <button onClick={copyToClipboard} className="px-3 py-1.5 bg-[#B3181C] hover:bg-[#8F1316] text-white rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer">
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>
    </div>
  );
}
