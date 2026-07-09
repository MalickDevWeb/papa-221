import React from 'react';
import { useLocation } from 'react-router-dom';
import { useVigilLocalState } from '../../hooks/useVigilLocalState';
import { APP_CONFIG } from '@/core/config/app.config';
import { ROUTES } from '@/shared/constants';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ScannerDashboardSection } from '../components/sections/ScannerDashboardSection';
import { PatrolRoundsSection } from '../components/sections/PatrolRoundsSection';
import { ScanReportsSection } from '../components/sections/ScanReportsSection';
import { ProfileSection } from '../components/sections/ProfileSection';
import { RenderQRCode } from '../components/qr/RenderQRCode';

export function VigilPatrolPage() {
  const location = useLocation();
  const currentPath = location.pathname;
  const {
    manualId, setManualId, feedback, scanLogs, checkpoints, searchQuery, setSearchQuery, showBadge, setShowBadge,
    scanMode, setScanMode, dateFilter, setDateFilter, showDateDropdown, setShowDateDropdown, currentPage, setCurrentPage,
    progressPercent, completedCheckpoints, paginatedLogs, totalPages, handleScanSuccess, handleManualSubmit,
    checkCheckpoint, resetCheckpoints, clearScanLogs,
  } = useVigilLocalState();

  return (
    <div className={APP_CONFIG.theme.classes.pageWrapper}>
      {currentPath === ROUTES.vigil.dashboard && (
        <ScannerDashboardSection
          scanMode={scanMode}
          setScanMode={setScanMode}
          showBadge={showBadge}
          setShowBadge={setShowBadge}
          manualId={manualId}
          setManualId={setManualId}
          onManualSubmit={handleManualSubmit}
          onScanComplete={() => void handleScanSuccess(manualId, false)}
        />
      )}

      {currentPath === ROUTES.vigil.rondes && (
        <PatrolRoundsSection checkpoints={checkpoints} onCheckCheckpoint={checkCheckpoint} onResetCheckpoints={resetCheckpoints} progressPercent={progressPercent} completedCheckpoints={completedCheckpoints} />
      )}

      {currentPath === ROUTES.vigil.rapports && (
        <ScanReportsSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} showDateDropdown={showDateDropdown} setShowDateDropdown={setShowDateDropdown} dateFilter={dateFilter} setDateFilter={setDateFilter} scanLogs={scanLogs} onClearScanLogs={clearScanLogs} paginatedLogs={paginatedLogs} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {currentPath === '/vigile/profil' && <ProfileSection />}

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
            <button type="button" onClick={() => setShowBadge(false)} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-[#ba0013] flex items-center justify-center transition-colors active:scale-90"><span className="text-lg">×</span></button>
            <div className="flex flex-col gap-1 mt-2"><span className="text-xs text-[#ba0013] font-black uppercase tracking-widest">GROUPE SCOLAIRE</span><h3 className="text-lg font-black text-neutral-800">Badge Borne d'Accès</h3></div>
            <div className="p-8 bg-white border-2 border-neutral-100 rounded-3xl shadow-xs flex items-center justify-center w-72 h-72"><RenderQRCode className="w-full h-full select-none" /></div>
            <div className="flex flex-col gap-1 text-xs text-neutral-400 font-bold uppercase tracking-wider"><p className="text-neutral-700 font-extrabold flex items-center gap-1.5 justify-center"><span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />Portail Principal • Borne active</p><p className="text-[10px] text-neutral-400 mt-1">Scanner ce code pour enregistrer l'entrée</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
