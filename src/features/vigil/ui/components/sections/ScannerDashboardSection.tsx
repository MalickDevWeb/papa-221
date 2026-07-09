import React from 'react';
import { QrCode, User, Keyboard, Search, Maximize2 } from 'lucide-react';
import { QRCameraScanner } from '@/shared/components';
import { RenderQRCode } from '../qr/RenderQRCode';

interface ScannerDashboardSectionProps {
  readonly scanMode: 'scan' | 'showQR';
  readonly setScanMode: (value: 'scan' | 'showQR') => void;
  readonly showBadge: boolean;
  readonly setShowBadge: (value: boolean) => void;
  readonly manualId: string;
  readonly setManualId: (value: string) => void;
  readonly onManualSubmit: (e: React.FormEvent) => void;
  readonly onScanComplete: () => void;
}

export function ScannerDashboardSection({
  scanMode,
  setScanMode,
  showBadge,
  setShowBadge,
  manualId,
  setManualId,
  onManualSubmit,
  onScanComplete,
}: ScannerDashboardSectionProps) {
  return (
    <div className="space-y-4" id="vigil-scanner-dashboard-section">
      <div className="flex bg-neutral-100/80 p-1 rounded-2xl w-full border border-neutral-200/40">
        <button
          type="button"
          onClick={() => setScanMode('scan')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${scanMode === 'scan' ? 'bg-white text-[#ba0013] shadow-[0_4px_12px_rgba(0,0,0,0.05)]' : 'text-neutral-500 hover:text-neutral-800'}`}
        >
          <QrCode className="h-4 w-4 stroke-[2.5]" />Scanner l'étudiant
        </button>
        <button
          type="button"
          onClick={() => setScanMode('showQR')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${scanMode === 'showQR' ? 'bg-white text-[#ba0013] shadow-[0_4px_12px_rgba(0,0,0,0.05)]' : 'text-neutral-500 hover:text-neutral-800'}`}
        >
          <User className="h-4 w-4 stroke-[2.5]" />Faire scanner l'étudiant
        </button>
      </div>

      {scanMode === 'showQR' ? (
        <div className="flex flex-col items-center justify-center bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-fade-in text-center gap-5">
          <div
            onClick={() => setShowBadge(true)}
            className="p-4 bg-white border-2 border-neutral-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center justify-center relative overflow-hidden group w-64 h-64 cursor-pointer hover:border-red-200 hover:shadow-md transition-all duration-300"
          >
            <div className="absolute inset-0 bg-neutral-500/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <RenderQRCode className="w-full h-full select-none" />
            <div className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-xl border border-neutral-200/80 shadow-xs text-neutral-600 group-hover:text-[#ba0013] group-hover:scale-105 group-hover:bg-white transition-all">
              <Maximize2 className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <p className="text-neutral-700 font-extrabold flex items-center gap-1.5 justify-center">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              Portail Principal
            </p>
            <p className="text-[9px] text-neutral-400">ID Borne: PRT-MAIN-01</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/60 p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-5 animate-fade-in">
          <div className="flex justify-center py-2">
            <QRCameraScanner onScanComplete={onScanComplete} />
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-200/60" />
            <span className="flex-shrink mx-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              OU SAISIR MANUELLEMENT
            </span>
            <div className="flex-grow border-t border-neutral-200/60" />
          </div>

          <form onSubmit={onManualSubmit} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Keyboard className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="Entrez le matricule (ex: 221-5092-B)"
                className="w-full bg-[#F8F9FA] border border-neutral-200/80 rounded-xl pl-10 pr-12 py-3 text-xs font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ba0013]/30 focus:border-[#ba0013] transition-all uppercase"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#ba0013]/10 text-[#ba0013] rounded-lg hover:bg-[#ba0013] hover:text-white transition-colors duration-200 cursor-pointer"
                title="Valider le matricule"
              >
                <Search className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
