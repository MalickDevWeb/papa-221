import { useState, useEffect, useCallback } from 'react';
import { useVigil } from './useVigil';
import { audioService } from '../infrastructure/config/dependencies';
import { APP_CONFIG } from '@/core/config/app.config';
import { DEFAULT_LOGS, DEFAULT_CHECKPOINTS } from '../ui/pages/vigilData';

export function useVigilLocalState() {
  const { executeScan } = useVigil();
  const [manualId, setManualId] = useState(APP_CONFIG.scanner.defaultSimulatedBadge);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
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

  const handleScanSuccess = useCallback(async (badgeId: string, isManual = false) => {
    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    try {
      await executeScan(badgeId);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(100);
      audioService.playSuccessBeep();
      setScanLogs((p: any) => [
        {
          id: Date.now().toString(),
          name: badgeId === APP_CONFIG.scanner.defaultSimulatedBadge ? 'Mamadou Ndiaye' : 'Étudiant Validé',
          studentId: badgeId === APP_CONFIG.scanner.defaultSimulatedBadge ? 'Master 2 Big Data' : badgeId,
          status: 'Autorisé', time: nowStr, type: isManual ? 'Manuel' : 'Scanner', date: "Aujourd'hui",
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        },
        ...p,
      ]);
      setFeedback({ success: true, message: `Badge validé - ${badgeId}` });
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
      audioService.playFailureBeep();
      setScanLogs((p: any) => [
        { id: Date.now().toString(), name: 'Inconnu', studentId: badgeId || 'Badge non reconnu', status: 'Refusé', time: nowStr, type: isManual ? 'Manuel' : 'Scanner', date: "Aujourd'hui", avatar: null },
        ...p,
      ]);
      setFeedback({ success: false, message: APP_CONFIG.texts.errorBadgeUnknown });
    }
    setTimeout(() => setFeedback(null), 2000);
  }, [executeScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) void handleScanSuccess(manualId.trim(), true);
  };

  const checkCheckpoint = (id: string) => {
    audioService.playSuccessBeep();
    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setCheckpoints((prev: any) => prev.map((cp: any) => cp.id === id ? { ...cp, status: 'Sécurisé', lastCheck: nowStr, guard: 'Diallo A.' } : cp));
  };

  const resetCheckpoints = () => { audioService.playSuccessBeep(); setCheckpoints(DEFAULT_CHECKPOINTS); };
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

  return {
    manualId, setManualId, feedback, scanLogs, checkpoints, searchQuery, setSearchQuery, showBadge, setShowBadge,
    scanMode, setScanMode, dateFilter, setDateFilter, showDateDropdown, setShowDateDropdown, currentPage, setCurrentPage,
    progressPercent, completedCheckpoints, paginatedLogs, totalPages, handleScanSuccess, handleManualSubmit,
    checkCheckpoint, resetCheckpoints, clearScanLogs,
  };
}
