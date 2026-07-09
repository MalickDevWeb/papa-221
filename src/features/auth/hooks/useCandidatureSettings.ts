import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase';

export interface CandidatureSettings {
  ouvert: boolean;
  dateOuverture: string;
  dateFermeture: string;
  messageAvis: string;
  docsRequis?: {
    cni: boolean;
    bulletin: boolean;
    diplome: boolean;
    motivation: boolean;
  };
}

export function useCandidatureSettings() {
  const [settings, setSettings] = useState<CandidatureSettings>({
    ouvert: true,
    dateOuverture: '2026-06-01',
    dateFermeture: '2026-09-30',
    messageAvis: 'La campagne d\'inscription officielle pour l\'année universitaire 2026/2027 est active.'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const snap = await getDoc(doc(db, 'admission_config', 'settings'));
      if (snap.exists()) {
        setSettings(snap.data() as CandidatureSettings);
        setLoading(false);
        return;
      }
      
      const res = await fetch('/api/candidatures/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Erreur de chargement des paramètres de candidature:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const isPeriodStarted = !settings.dateOuverture || todayStr >= settings.dateOuverture;
  const isPeriodEnded = settings.dateFermeture && todayStr > settings.dateFermeture;
  const isCampaignActive = settings.ouvert && isPeriodStarted && !isPeriodEnded;

  return {
    settings,
    loading,
    isCampaignActive,
    isPeriodStarted,
    isPeriodEnded,
    fetchSettings
  };
}
