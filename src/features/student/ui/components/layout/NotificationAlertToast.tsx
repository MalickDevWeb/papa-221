import React, { useEffect } from 'react';

interface NotificationAlertToastProps {
  title: string;
  desc: string;
  icon?: string;
  onClose: () => void;
}

export function NotificationAlertToast({ title, desc, icon = 'notifications', onClose }: NotificationAlertToastProps) {
  useEffect(() => {
    // Elegant dual-tone notification chime (E5 -> A5)
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const playTone = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + duration);
        };
        const now = ctx.currentTime;
        playTone(659.25, now, 0.35); // E5
        playTone(880.00, now + 0.12, 0.45); // A5
      }
    } catch (e) {
      console.warn("Audio chime block:", e);
    }

    // Auto close after 6 seconds
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[110] max-w-sm sm:max-w-md w-full bg-white rounded-[20px] shadow-2xl border border-red-500/20 p-4 animate-slide-up flex gap-3.5 ring-4 ring-red-500/5">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
        <span translate="no" className="material-symbols-outlined text-red-600 text-[22px]">
          {icon === 'cancel' ? 'cancel' : icon === 'schedule' ? 'schedule' : 'notifications_active'}
        </span>
      </div>
      <div className="flex-grow flex flex-col justify-center pr-1.5">
        <h4 className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
          {title}
        </h4>
        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <button 
        onClick={onClose} 
        className="flex-shrink-0 h-6 w-6 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600 self-start"
      >
        <span translate="no" className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}
