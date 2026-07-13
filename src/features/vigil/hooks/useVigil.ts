import { useCallback, useEffect, useState } from 'react';
import { getLastScanUseCase, getVigilProfileUseCase, scanBadgeUseCase } from '../infrastructure/config/dependencies';
import type { VigilProfile } from '../domain/VigilProfile';
import type { VigilScanResult } from '../domain/VigilScan';

export function useVigil() {
  const [profile, setProfile] = useState<VigilProfile | null>(null);
  const [lastScan, setLastScan] = useState<VigilScanResult | null>(null);
  const [mode, setMode] = useState<'scanner' | 'myqr'>('scanner');
  const [isLoading, setIsLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getVigilProfileUseCase();
      setProfile(result);
    } catch (error) {
      setScanError((error as Error).message || 'Impossible de charger le profil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeScan = useCallback(async (badgeId: string) => {
    setIsLoading(true);
    setScanError(null);
    try {
      const result = await scanBadgeUseCase(badgeId);
      setLastScan(result);
      return result;
    } catch (error) {
      setScanError((error as Error).message || 'Échec du scan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadLastScan = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getLastScanUseCase();
      setLastScan(result);
    } catch (error) {
      setScanError((error as Error).message || 'Impossible de récupérer le dernier scan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
    void loadLastScan();
  }, [loadProfile, loadLastScan]);

  return {
    profile,
    lastScan,
    mode,
    isLoading,
    scanError,
    loadProfile,
    executeScan,
    setMode,
  };
}
