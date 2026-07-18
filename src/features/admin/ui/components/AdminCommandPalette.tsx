import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

const COMMANDS = [
  { id: 'dashboard', label: 'Aller au Tableau de Bord CEO', shortcut: 'G + D', icon: 'dashboard', cat: 'Navigation' },
  { id: 'school', label: 'Aller à Gestion École (Filières/Classes)', shortcut: 'G + S', icon: 'school', cat: 'Navigation' },
  { id: 'schedule', label: 'Aller à Emploi du Temps / Planning', shortcut: 'G + P', icon: 'calendar_today', cat: 'Navigation' },
  { id: 'personnel', label: 'Aller à Gestion Personnel / RH', shortcut: 'G + H', icon: 'badge', cat: 'Navigation' },
  { id: 'students', label: 'Aller à Gestion Étudiants / Profils', shortcut: 'G + E', icon: 'group', cat: 'Navigation' },
  { id: 'admissions', label: 'Aller aux Demandes Admissions', shortcut: 'G + A', icon: 'person_add', cat: 'Navigation' },
  { id: 'finances', label: 'Aller à Finances & Recouvrement', shortcut: 'G + F', icon: 'payments', cat: 'Navigation' },
  { id: 'notifications', label: 'Aller au Centre Notifications', shortcut: 'G + N', icon: 'mail', cat: 'Navigation' },
  { id: 'new-student', label: 'Créer un nouvel étudiant', shortcut: 'Ctrl + Alt + N', icon: 'add_circle', cat: 'Actions Rapides' },
  { id: 'run-relance', label: 'Lancer les relances financières', shortcut: 'Ctrl + Alt + R', icon: 'send', cat: 'Actions Rapides' },
];

export function AdminCommandPalette({ isOpen, onClose, onSelectTab }: Props) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) || cmd.cat.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[999] flex items-start justify-center pt-24 px-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-100">
            <span translate="no" className="material-symbols-outlined text-neutral-400">search</span>
            <input
              type="text"
              placeholder="Rechercher une page ou lancer une action rapide... (Esc pour quitter)"
              className="w-full text-sm text-[#1E293B] placeholder-neutral-400 focus:outline-none font-medium"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400 font-bold">Aucun résultat trouvé</div>
            ) : (
              filtered.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    if (cmd.cat === 'Navigation') onSelectTab(cmd.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FAF8F6] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span translate="no" className="material-symbols-outlined text-neutral-400 group-hover:text-[#B3181C] text-[18px]">{cmd.icon}</span>
                    <span className="text-xs font-bold text-[#1E293B]">{cmd.label}</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{cmd.cat}</span>
                  </div>
                  <kbd className="text-[9px] font-mono bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md border border-neutral-200">{cmd.shortcut}</kbd>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
