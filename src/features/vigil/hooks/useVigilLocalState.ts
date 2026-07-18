import { useState, useEffect, useCallback } from 'react';
import { audioService } from '../infrastructure/config/dependencies';
import { securityService } from '@/shared/lib/apiService';
import { DEFAULT_LOGS, DEFAULT_CHECKPOINTS } from '../ui/pages/vigilData';

export function useVigilLocalState() {
  const [manualId, setManualId] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [scanLogs, setScanLogs] = useState(() => JSON.parse(localStorage.getItem('v_scan_logs') || 'null') || DEFAULT_LOGS);
  const [checkpoints, setCheckpoints] = useState(() => JSON.parse(localStorage.getItem('v_checkpoints') || 'null') || DEFAULT_CHECKPOINTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [scanMode, setScanMode] = useState<'scan' | 'showQR'>('scan');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday'>('all');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCheckpoint, setActiveCheckpoint] = useState<any>(null);
  const itemsPerPage = 3;

  useEffect(() => {
    const loadCheckpoint = async () => {
      try {
        const res = await securityService.getCheckpointStatus();
        setActiveCheckpoint(res);
      } catch (e) {
        console.error('Error fetching checkpoint-status:', e);
      }
    };
    loadCheckpoint();
    const interval = setInterval(loadCheckpoint, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, dateFilter]);
  useEffect(() => {
    localStorage.setItem('v_scan_logs', JSON.stringify(scanLogs));
    localStorage.setItem('v_checkpoints', JSON.stringify(checkpoints));
  }, [scanLogs, checkpoints]);

  const handleScanSuccess = useCallback(async (badgeId: string, isManual = false) => {
    const resolvedId = badgeId.trim().toUpperCase();
    try {
      const apiResult = await securityService.submitScanLog(resolvedId);
      const isAuth = apiResult.statut === 'Autorisé';

      if (isAuth) {
        audioService.playSuccessBeep();
        setFeedback({ success: true, message: apiResult.message });
      } else {
        audioService.playFailureBeep();
        setFeedback({ success: false, message: apiResult.message });
      }

      const newLog = {
        id: apiResult.id,
        name: apiResult.badgeOwner,
        studentId: apiResult.studentId,
        status: apiResult.statut,
        time: apiResult.time,
        type: isManual ? 'Manuel' : 'Scanner',
        date: "Aujourd'hui",
        avatar: null
      };
      setScanLogs((prev: any) => [newLog, ...prev]);
    } catch (err: any) {
      audioService.playFailureBeep();
      setFeedback({ success: false, message: "Échec du scan de badge" });
    }
    setTimeout(() => setFeedback(null), 4000);
    setResetKey(k => k + 1);
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      void handleScanSuccess(manualId.trim(), true);
      setManualId('');
    }
  };

  const checkCheckpoint = (id: string) => {
    audioService.playSuccessBeep();
    const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setCheckpoints((p: any) => p.map((cp: any) => cp.id === id ? { ...cp, status: 'Sécurisé', lastCheck: nowStr, guard: 'Diallo A.' } : cp));
  };

  const resetCheckpoints = () => { audioService.playSuccessBeep(); setCheckpoints(DEFAULT_CHECKPOINTS); };
  const clearScanLogs = () => setScanLogs([]);
  const completedCheckpoints = checkpoints.filter((cp: any) => cp.status === 'Sécurisé').length;
  const progressPercent = Math.round((completedCheckpoints / checkpoints.length) * 100);
  
  const filteredLogs = scanLogs.filter((log: any) => {
    const m = (log.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || (log.studentId || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    return m && (dateFilter === 'today' ? (log.date === "Aujourd'hui" || !log.date) : dateFilter === 'yesterday' ? log.date === 'Hier' : true);
  });
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return {
    manualId, setManualId, resetKey, feedback, scanLogs, checkpoints, searchQuery, setSearchQuery, showBadge, setShowBadge,
    scanMode, setScanMode, dateFilter, setDateFilter, showDateDropdown, setShowDateDropdown, currentPage, setCurrentPage,
    progressPercent, completedCheckpoints, paginatedLogs, totalPages, handleScanSuccess, handleManualSubmit,
    checkCheckpoint, resetCheckpoints, clearScanLogs, activeCheckpoint
  };
}
