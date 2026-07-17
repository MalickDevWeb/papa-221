import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Laptop, AlertTriangle, Smartphone, Tablet } from 'lucide-react';
import { useDeviceStore } from '../../hooks/useDeviceStore';
import { useAuthStore } from '@/core/store/authStore';

export function GatekeeperModal() {
  const { isDesktop, hasBypassed, setBypassed, deviceType } = useDeviceStore();
  const { utilisateur } = useAuthStore();

  const isAdmin = utilisateur?.role === 'ADMIN' || utilisateur?.role === 'SUPER_ADMIN';
  const isRestricted = !isDesktop && !hasBypassed && isAdmin;

  return (
    <AnimatePresence>
      {isRestricted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none"
          id="gatekeeper-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="bg-white/95 border border-neutral-200/50 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative overflow-hidden backdrop-blur-xs"
          >
            {/* Design Ornaments */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#B3181C]" />

            <div className="flex justify-center gap-3.5 mb-5">
              <div className="p-3 bg-neutral-100 rounded-2xl relative">
                {deviceType === 'mobile' ? (
                  <Smartphone className="h-7 w-7 text-neutral-500" />
                ) : (
                  <Tablet className="h-7 w-7 text-neutral-500" />
                )}
                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border border-white">
                  <AlertTriangle className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                </div>
              </div>
              <div className="p-3 bg-red-50 text-[#B3181C] rounded-2xl flex items-center justify-center">
                <Laptop className="h-7 w-7" />
              </div>
            </div>

            <h2 className="text-[#1E293B] text-xl font-black tracking-tight mb-3">
              💻 Expérience Optimisée sur Ordinateur
            </h2>

            <p className="text-neutral-500 text-xs leading-relaxed font-semibold mb-4">
              Les modules de gestion complexes tels que la planification globale des cours, les logs de sécurité en temps réel et l'importation de fichiers académiques requièrent un écran d'ordinateur pour une ergonomie optimale.
            </p>

            <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 text-left mb-6">
              <div className="flex gap-2.5 items-start">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 font-extrabold uppercase leading-snug tracking-wide">
                  Attention : Continuer sur cet appareil restreindra les fonctionnalités d'administration ou de gestion selon votre rôle actuel.
                </p>
              </div>
            </div>

            <button
              onClick={() => setBypassed(true)}
              className="w-full bg-[#B3181C] hover:bg-[#ba0013] active:scale-[0.98] text-white text-xs font-extrabold uppercase py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Continuer sur cet appareil
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
