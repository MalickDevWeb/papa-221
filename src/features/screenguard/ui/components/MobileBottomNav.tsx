import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, CreditCard, Mail, Menu, X, LogOut, Award, Shield, Cpu, Calendar, Building2 } from 'lucide-react';
import { useDeviceStore } from '../../hooks/useDeviceStore';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

const MAIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Élèves', icon: Users },
  { id: 'finances', label: 'Finances', icon: CreditCard },
  { id: 'notifications', label: 'Notifs', icon: Mail },
];

const SEC_TABS = [
  { id: 'school', label: 'Gestion École', icon: Building2 },
  { id: 'schedule', label: 'Emploi du Temps', icon: Calendar },
  { id: 'personnel', label: 'Gestion Personnel', icon: Award },
  { id: 'admissions', label: 'Admissions', icon: Users },
  { id: 'ai', label: 'Assistant IA', icon: Cpu },
  { id: 'security', label: 'Sécurité & Audit', icon: Shield },
];

export function MobileBottomNav({ activeTab, onSelectTab, onLogout }: Props) {
  const { isMobile } = useDeviceStore();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <>
      <div id="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200/60 shadow-2xl z-50 px-3 flex items-center justify-between">
        {MAIN_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id && !menuOpen;
          return (
            <button
              key={id}
              onClick={() => { onSelectTab(id); setMenuOpen(false); }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-2.5 gap-1 transition-colors cursor-pointer ${
                isActive ? 'text-[#B3181C]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 left-3 right-3 h-[3px] bg-[#B3181C] rounded-b-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
              </motion.div>
            </button>
          );
        })}

        <button
          onClick={() => setMenuOpen(true)}
          className={`relative flex flex-col items-center justify-center flex-1 h-full py-2.5 gap-1 transition-colors cursor-pointer ${
            menuOpen ? 'text-[#B3181C]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {menuOpen && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute top-0 left-3 right-3 h-[3px] bg-[#B3181C] rounded-b-full"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <motion.div
            animate={{ scale: menuOpen ? 1.08 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex flex-col items-center justify-center gap-0.5"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Plus</span>
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-plus-menu"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-slate-950 z-[999] flex flex-col p-6 text-white"
          >
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <h3 className="font-black text-lg">Menu Principal</h3>
                <p className="text-[10px] text-[#B3181C] font-extrabold uppercase tracking-widest">ÉCOLE 221 • ERP MOBILE</p>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-grow overflow-y-auto py-6">
              {SEC_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { onSelectTab(id); setMenuOpen(false); }}
                  className={`flex flex-col items-start p-4 rounded-2xl gap-3 text-left transition-all cursor-pointer ${
                    activeTab === id ? 'bg-[#B3181C] text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-wider leading-tight">{label}</span>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex gap-4">
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="flex-1 py-3 bg-[#B3181C] hover:bg-[#B3181C]/90 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
