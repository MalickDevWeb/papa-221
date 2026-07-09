import React from 'react';

interface StudentNotificationToastProps {
  message: string;
}

export function StudentNotificationToast({ message }: StudentNotificationToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#291715] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-slide-up border border-white/10 text-xs font-black">
      <span translate="no" className="material-symbols-outlined text-success-green">check_circle</span>
      <span>{message}</span>
    </div>
  );
}
