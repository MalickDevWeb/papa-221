import { QrCode, User, Zap, Keyboard, RefreshCw, Maximize2 } from 'lucide-react';
import { APP_CONFIG } from '@/core/config/app.config';
import { RenderQRCode } from '../qr/RenderQRCode';

interface ScannerDashboardSectionProps {
  scanMode: 'scan' | 'showQR';
  setScanMode: (value: 'scan' | 'showQR') => void;
  showBadge: boolean;
  setShowBadge: (value: boolean) => void;
  isScanning: boolean;
  flashOn: boolean;
  setFlashOn: (value: boolean) => void;
  cameraFacingMode: 'user' | 'environment';
  setCameraFacingMode: (value: 'user' | 'environment') => void;
  scanState: 'idle' | 'success' | 'failure';
  manualId: string;
  onSimulateScan: () => void;
  onOpenManualInput: () => void;
  onScanAreaClick: () => void;
}

export function ScannerDashboardSection({
  scanMode,
  setScanMode,
  showBadge,
  setShowBadge,
  isScanning,
  flashOn,
  setFlashOn,
  cameraFacingMode,
  setCameraFacingMode,
  scanState,
  manualId,
  onSimulateScan,
  onOpenManualInput,
  onScanAreaClick,
}: ScannerDashboardSectionProps) {
  return (
    <>
      <div className="flex bg-neutral-100/80 p-1 rounded-2xl w-full border border-neutral-200/40 mb-3">
        <button onClick={() => setScanMode('scan')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${scanMode === 'scan' ? 'bg-white text-[#ba0013] shadow-[0_4px_12px_rgba(0,0,0,0.05)]' : 'text-neutral-500 hover:text-neutral-800'}`}>
          <QrCode className="h-4 w-4 stroke-[2.5]" />Scanner l'étudiant
        </button>
        <button onClick={() => setScanMode('showQR')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${scanMode === 'showQR' ? 'bg-white text-[#ba0013] shadow-[0_4px_12px_rgba(0,0,0,0.05)]' : 'text-neutral-500 hover:text-neutral-800'}`}>
          <User className="h-4 w-4 stroke-[2.5]" />Faire scanner l'étudiant
        </button>
      </div>

      {scanMode === 'showQR' ? (
        <div className="flex flex-col items-center justify-center bg-white border border-neutral-200/60 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-fade-in text-center gap-6">
          <div onClick={() => setShowBadge(true)} className="p-6 bg-white border-2 border-neutral-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center justify-center relative overflow-hidden group w-80 h-80 max-w-full cursor-pointer hover:border-red-200 hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-neutral-500/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <RenderQRCode className="w-full h-full select-none" />
            <div className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-xl border border-neutral-200/80 shadow-xs text-neutral-600 group-hover:text-[#ba0013] group-hover:scale-105 group-hover:bg-white transition-all">
              <Maximize2 className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <p className="text-neutral-700 font-extrabold flex items-center gap-1.5 justify-center"><span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />Portail Principal • Groupe Scolaire</p>
            <p className="text-[10px] text-neutral-400 mt-1">ID Borne: PRT-MAIN-01</p>
          </div>
        </div>
      ) : (
        <>
          <div className={APP_CONFIG.theme.classes.scannerFrame}>
            <div id="reader-container" className="absolute inset-0 w-full h-full object-cover z-0" style={{ display: isScanning ? 'block' : 'none' }} />
            {!isScanning && <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80')`, filter: 'brightness(0.7)' }} />}
            <div className="absolute inset-0 bg-black/30 z-5 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {scanState === 'success' && <div className="absolute w-56 h-56 border-4 border-green-500 rounded-[28px] animate-[ping_1s_ease-out_infinite] opacity-75 pointer-events-none" />}
              {scanState === 'failure' && <div className="absolute w-56 h-56 border-4 border-[#E31E24] rounded-[28px] animate-[ping_1s_ease-out_infinite] opacity-75 pointer-events-none" />}
              <div onClick={onScanAreaClick} className={`${APP_CONFIG.theme.classes.targetBox} ${!isScanning ? 'cursor-pointer active:scale-95 duration-100' : ''} transition-all duration-300 ${scanState === 'success' ? 'border-green-500/80 shadow-[0_0_30px_rgba(40,167,69,0.5)]' : scanState === 'failure' ? 'border-red-500/80 shadow-[0_0_30px_rgba(227,30,36,0.5)]' : ''}`}>
                <div className={`absolute top-0 left-0 w-8 h-8 rounded-tl-2xl border-t-4 border-l-4 transition-colors duration-300 ${scanState === 'success' ? 'border-green-500' : scanState === 'failure' ? 'border-red-600' : 'border-[#E31E24]'}`} />
                <div className={`absolute top-0 right-0 w-8 h-8 rounded-tr-2xl border-t-4 border-r-4 transition-colors duration-300 ${scanState === 'success' ? 'border-green-500' : scanState === 'failure' ? 'border-red-600' : 'border-[#E31E24]'}`} />
                <div className={`absolute bottom-0 left-0 w-8 h-8 rounded-bl-2xl border-b-4 border-l-4 transition-colors duration-300 ${scanState === 'success' ? 'border-green-500' : scanState === 'failure' ? 'border-red-600' : 'border-[#E31E24]'}`} />
                <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-br-2xl border-b-4 border-r-4 transition-colors duration-300 ${scanState === 'success' ? 'border-green-500' : scanState === 'failure' ? 'border-red-600' : 'border-[#E31E24]'}`} />
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E31E24] to-transparent shadow-[0_0_12px_rgba(227,30,36,0.9)] animate-[bounce_2.5s_infinite]" />
                <div className="absolute inset-x-8 h-28 bg-gradient-to-b from-[#E31E24]/10 to-transparent top-1/4 rounded-lg filter blur-md opacity-35 animate-pulse pointer-events-none" />
                {!isScanning && <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/40 backdrop-blur-xs select-none"><QrCode className="h-10 w-10 text-white opacity-80 animate-pulse mb-2" /><span className="text-[11px] text-white font-extrabold uppercase tracking-widest leading-relaxed">{APP_CONFIG.texts.simulatorActive}</span><span className="text-[9px] text-white/70 mt-1">{APP_CONFIG.texts.simulatorClickHint}</span></div>}
              </div>
            </div>
            <button onClick={() => setCameraFacingMode(cameraFacingMode === 'environment' ? 'user' : 'environment')} className="absolute top-4 left-4 h-11 px-3.5 rounded-2xl backdrop-blur-md flex items-center justify-center gap-2 bg-black/40 text-white hover:bg-black/60 active:scale-95 transition-all z-20" title="Changer de caméra"><RefreshCw className="h-4 w-4 transition-transform duration-300 active:rotate-180" /><span className="text-xs font-bold tracking-wide">{cameraFacingMode === 'environment' ? APP_CONFIG.texts.cameraBack : APP_CONFIG.texts.cameraFront}</span></button>
            <button onClick={() => setFlashOn(!flashOn)} className={`absolute top-4 right-4 h-11 w-11 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all ${flashOn ? 'bg-[#ba0013] text-white shadow-lg' : 'bg-black/40 text-white hover:bg-black/60'} z-20`} title="Activer la torche"><Zap className={`h-5 w-5 ${flashOn ? 'fill-current' : ''}`} /></button>
          </div>
          <div className="text-center mt-1"><button onClick={onSimulateScan} className="text-xs text-[#ba0013]/80 hover:text-[#ba0013] font-semibold underline decoration-dashed text-center">{APP_CONFIG.texts.simulationBanner}</button></div>
          <button onClick={onOpenManualInput} className={APP_CONFIG.theme.classes.manualButton}><Keyboard className="h-5 w-5 text-[#ba0013] group-hover:scale-105 transition-transform" /><span className="font-bold text-neutral-600 group-hover:text-[#ba0013] transition-colors">{APP_CONFIG.texts.manualInputTrigger}</span></button>
        </>
      )}
    </>
  );
}
