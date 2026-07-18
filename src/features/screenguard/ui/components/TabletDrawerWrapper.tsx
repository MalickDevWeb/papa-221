import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useDeviceStore } from '../../hooks/useDeviceStore';

interface Props {
  children: React.ReactNode;
}

export function TabletDrawerWrapper({ children }: Props) {
  const { isTablet, isMobile } = useDeviceStore();
  const [isOpen, setIsOpen] = useState(false);

  const isDegraded = isTablet || isMobile;

  if (!isDegraded) {
    return <div className="shrink-0">{children}</div>;
  }

  return (
    <div id="tablet-drawer-container" className="relative">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 bottom-20 z-40 bg-[#B3181C] hover:bg-[#B3181C]/90 text-white p-3 sm:p-3.5 rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#B3181C]/20"
        title="Ouvrir le menu latéral"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-wider">Filtres & Options</span>
      </button>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white shadow-2xl z-[51] p-5 flex flex-col border-r border-slate-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
                <span className="text-xs font-black uppercase tracking-widest text-[#B3181C]">Configuration</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto" onClick={() => setIsOpen(false)}>
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
