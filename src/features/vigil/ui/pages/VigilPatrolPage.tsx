import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useVigil } from '../../hooks/useVigil';
import { qrScannerService, audioService } from '../../infrastructure/config/dependencies';
import { APP_CONFIG } from '@/core/config/app.config';
import { ROUTES } from '@/shared/constants';
import { CheckCircle2, Keyboard, XCircle } from 'lucide-react';
import { ScannerDashboardSection } from '../components/sections/ScannerDashboardSection';
import { PatrolRoundsSection } from '../components/sections/PatrolRoundsSection';
import { ScanReportsSection } from '../components/sections/ScanReportsSection';
import { ProfileSection } from '../components/sections/ProfileSection';
import { RenderQRCode } from '../components/qr/RenderQRCode';

const DEFAULT_LOGS = [
  { id: '1', name: 'Moussa Gueye', studentId: 'Master 2 Big Data', status: 'Autorisé', time: '14:23', type: 'Scanner', date: "Aujourd'hui", avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: '2', name: 'Fatou Sow', studentId: 'Licence 3 Marketing', status: 'Paiement', time: '13:45', type: 'Scanner', date: "Aujourd'hui", avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: '3', name: 'Abdoulaye Diop', studentId: 'Master 1 Cybersécurité', status: 'Autorisé', time: '11:12', type: 'Scanner', date: "Aujourd'hui", avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: '4', name: 'Inconnu', studentId: 'Badge non reconnu', status: 'Refusé', time: '17:55', type: 'Scanner', date: 'Hier', avatar: null },
  { id: '5', name: 'Awa Ndiaye', studentId: 'Licence 2 Com', status: 'Autorisé', time: '16:40', type: 'Scanner', date: 'Hier', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80' },
];

const DEFAULT_CHECKPOINTS = [
  { id: 'cp1', name: 'Portail Entrée Principale', status: 'Sécurisé', lastCheck: '08:30', guard: 'Diallo A.' },
  { id: 'cp2', name: 'Bâtiment Administration', status: 'Sécurisé', lastCheck: '09:15', guard: 'Diallo A.' },
  { id: 'cp3', name: 'Bibliothèque & Archives', status: 'En attente', lastCheck: '-', guard: '-' },
  { id: 'cp4', name: 'Laboratoires & Salles GL', status: 'En attente', lastCheck: '-', guard: '-' },
  { id: 'cp5', name: 'Complexe Omnisports', status: 'En attente', lastCheck: '-', guard: '-' },
];

export function VigilPatrolPage() {
  const { executeScan } = useVigil();
  const location = useLocation();
  const currentPath = location.pathname;

  const [showManualInput, setShowManualInput] = useState(false);
  const [manualId, setManualId] = useState(APP_CONFIG.scanner.defaultSimulatedBadge);
  const [flashOn, setFlashOn] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [, setCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showShutterFlash, setShowShutterFlash] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [scanState, setScanState] = useState<'idle' | 'success' | 'failure'>('idle');
  const [scanLogs, setScanLogs] = useState(() => {
    const saved = localStorage.getItem('v_scan_logs');
    return saved ? JSON.parse(saved) : DEFAULT_LOGS;
  });
  const [checkpoints, setCheckpoints] = useState(() => {
    const saved = localStorage.getItem('v_checkpoints');
    return saved ? JSON.parse(saved) : DEFAULT_CHECKPOINTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [scanMode, setScanMode] = useState<'scan' | 'showQR'>('scan');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday'>('all');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, dateFilter]);
  useEffect(() => { localStorage.setItem('v_scan_logs', JSON.stringify(scanLogs)); }, [scanLogs]);
  useEffect(() => { localStorage.setItem('v_checkpoints', JSON.stringify(checkpoints)); }, [checkpoints]);

  const handleScanSuccess = useCallback(async (badgeId: string) => {
    setShowShutterFlash(true);
    setTimeout(() => setShowShutterFlash(false), 200);

    if (qrScannerService.isScanning()) {
      try {
        await qrScannerService.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop scanner on success:', err);
      }
    }

    try {
      await executeScan(badgeId);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(100);
      setScanState('success');
      audioService.playSuccessBeep();
      const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      setScanLogs((prev: any) => [{ id: Date.now().toString(), name: badgeId === APP_CONFIG.scanner.defaultSimulatedBadge ? 'Mamadou Ndiaye' : 'Étudiant Validé', studentId: badgeId === APP_CONFIG.scanner.defaultSimulatedBadge ? 'Master 2 Big Data' : 'Licence 1 Informatique', status: 'Autorisé', time: nowStr, type: showManualInput ? 'Manuel' : 'Scanner', date: "Aujourd'hui", avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' }, ...prev]);
      setFeedback({ success: true, message: `Badge validé - ${badgeId}` });
      setTimeout(() => { setFeedback(null); setScanState('idle'); }, 2000);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setScanState('failure');
      audioService.playFailureBeep();
      const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      setScanLogs((prev: any) => [{ id: Date.now().toString(), name: 'Inconnu', studentId: 'Badge non reconnu', status: 'Refusé', time: nowStr, type: showManualInput ? 'Manuel' : 'Scanner', date: "Aujourd'hui", avatar: null }, ...prev]);
      setFeedback({ success: false, message: APP_CONFIG.texts.errorBadgeUnknown });
      setTimeout(() => { setFeedback(null); setScanState('idle'); }, 2000);
    }
  }, [executeScan, showManualInput]);

  useEffect(() => {
    let isCurrent = true;
    if (currentPath === ROUTES.vigil.dashboard && !showManualInput && !feedback && scanMode === 'scan') {
      const qrCodeId = 'reader-container';
      const startScanner = async () => {
        try {
          await qrScannerService.start(qrCodeId, (decodedText) => { void handleScanSuccess(decodedText); }, undefined, cameraFacingMode);
          if (isCurrent) { setCameraPermission(true); setIsScanning(true); }
        } catch (err) {
          console.warn('Camera start failed or blocked in iframe:', err);
          if (isCurrent) { setCameraPermission(false); setIsScanning(false); }
        }
      };
      const timer = setTimeout(() => { if (isCurrent) void startScanner(); }, 300);
      return () => { isCurrent = false; clearTimeout(timer); qrScannerService.stop().catch((err) => console.error('Error stopping scanner:', err)); };
    }
    setIsScanning(false);
  }, [currentPath, showManualInput, feedback, handleScanSuccess, cameraFacingMode, scanMode]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    setShowManualInput(false);
    void handleScanSuccess(manualId.trim());
  };

  const checkCheckpoint = (id: string) => {
    audioService.playSuccessBeep();
    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setCheckpoints((prev: any) => prev.map((cp: any) => cp.id === id ? { ...cp, status: 'Sécurisé', lastCheck: nowStr, guard: 'Diallo A.' } : cp));
  };

  const resetCheckpoints = () => {
    audioService.playSuccessBeep();
    setCheckpoints(DEFAULT_CHECKPOINTS);
  };

  const clearScanLogs = () => setScanLogs([]);
  const completedCheckpoints = checkpoints.filter((cp: any) => cp.status === 'Sécurisé').length;
  const progressPercent = Math.round((completedCheckpoints / checkpoints.length) * 100);
  const filteredLogs = scanLogs.filter((log: any) => {
    const matchesSearch = (log.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                          (log.studentId || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    if (!matchesSearch) return false;
    if (dateFilter === 'today') return log.date === "Aujourd'hui" || !log.date;
    if (dateFilter === 'yesterday') return log.date === 'Hier';
    return true;
  });
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={APP_CONFIG.theme.classes.pageWrapper}>
      {currentPath === ROUTES.vigil.dashboard && (
        <ScannerDashboardSection scanMode={scanMode} setScanMode={setScanMode} showBadge={showBadge} setShowBadge={setShowBadge} isScanning={isScanning} flashOn={flashOn} setFlashOn={setFlashOn} cameraFacingMode={cameraFacingMode} setCameraFacingMode={setCameraFacingMode} scanState={scanState} manualId={manualId} onSimulateScan={() => void handleScanSuccess(APP_CONFIG.scanner.defaultSimulatedBadge)} onOpenManualInput={() => setShowManualInput(true)} onScanAreaClick={() => { if (!isScanning) void handleScanSuccess(manualId); }} />
      )}

      {currentPath === ROUTES.vigil.rondes && (
        <PatrolRoundsSection checkpoints={checkpoints} onCheckCheckpoint={checkCheckpoint} onResetCheckpoints={resetCheckpoints} progressPercent={progressPercent} completedCheckpoints={completedCheckpoints} />
      )}

      {currentPath === ROUTES.vigil.rapports && (
        <ScanReportsSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} showDateDropdown={showDateDropdown} setShowDateDropdown={setShowDateDropdown} dateFilter={dateFilter} setDateFilter={setDateFilter} scanLogs={scanLogs} onClearScanLogs={clearScanLogs} paginatedLogs={paginatedLogs} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {currentPath === '/vigile/profil' && <ProfileSection />}

      {showManualInput && (
        <div className={APP_CONFIG.theme.classes.dialogOverlay}>
          <div className={APP_CONFIG.theme.classes.dialogContent}>
            <h3 className="font-extrabold text-lg text-on-surface flex items-center gap-2"><Keyboard className="h-5 w-5 text-[#ba0013]" />{APP_CONFIG.texts.manualDialogTitle}</h3>
            <p className="text-xs text-secondary mt-1.5">{APP_CONFIG.texts.manualDialogDescription}</p>
            <form onSubmit={handleManualSubmit} className="mt-4 space-y-4">
              <div className="relative"><input type="text" required value={manualId} onChange={(e) => setManualId(e.target.value)} placeholder={APP_CONFIG.texts.manualDialogPlaceholder} className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-[#ba0013]/40 focus:border-[#ba0013] uppercase" /></div>
              <div className="flex gap-2.5 pt-2"><button type="button" onClick={() => setShowManualInput(false)} className="flex-1 bg-[#F1F3F5] text-neutral-600 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-[#E9ECEF]">{APP_CONFIG.texts.btnCancel}</button><button type="submit" className="flex-1 bg-[#E31E24] text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-[#8C1012] shadow-sm">{APP_CONFIG.texts.btnValidate}</button></div>
            </form>
          </div>
        </div>
      )}

      {feedback && (
        <div className={APP_CONFIG.theme.classes.feedbackOverlay}>
          <div className={`rounded-3xl p-6 text-white text-center shadow-2xl flex flex-col items-center gap-3 transition-all transform scale-100 opacity-100 max-w-xs w-full backdrop-blur-md ${feedback.success ? 'bg-[#28A745]/95' : 'bg-[#ba0013]/95'}`}>
            {feedback.success ? <CheckCircle2 className="h-14 w-14 animate-[bounce_1s_infinite]" /> : <XCircle className="h-14 w-14 animate-pulse" />}
            <p className="font-extrabold tracking-wide uppercase text-sm">{feedback.message}</p>
          </div>
        </div>
      )}

      {showBadge && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-[400px] bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-6">
            <button onClick={() => setShowBadge(false)} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-[#ba0013] flex items-center justify-center transition-colors active:scale-90"><span className="text-lg">×</span></button>
            <div className="flex flex-col gap-1 mt-2"><span className="text-xs text-[#ba0013] font-black uppercase tracking-widest">GROUPE SCOLAIRE</span><h3 className="text-lg font-black text-neutral-800">Badge Borne d'Accès</h3></div>
            <div className="p-8 bg-white border-2 border-neutral-100 rounded-3xl shadow-xs flex items-center justify-center w-72 h-72"><RenderQRCode className="w-full h-full select-none" /></div>
            <div className="flex flex-col gap-1 text-xs text-neutral-400 font-bold uppercase tracking-wider"><p className="text-neutral-700 font-extrabold flex items-center gap-1.5 justify-center"><span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />Portail Principal • Borne active</p><p className="text-[10px] text-neutral-400 mt-1">Scanner ce code pour enregistrer l'entrée</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
