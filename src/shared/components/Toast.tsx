import React from 'react';

interface ToastProps {
  message: string;
  icon?: string;
}

/** Toast notification réutilisable — même rendu visuel que dans toutes les pages */
export function Toast({ message, icon = 'check_circle' }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-neutral-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in border border-white/10">
      <span translate="no" className="material-symbols-outlined text-success-green">
        {icon}
      </span>
      <span className="text-xs font-bold">{message}</span>
    </div>
  );
}
