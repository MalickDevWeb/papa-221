import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase';

export interface CandidatureSettings {
  ouvert: boolean;
  dateOuverture: string;
  dateFermeture: string;
  messageAvis: string;
  showRegisterButton?: boolean;
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
    messageAvis: 'La campagne d\'inscription officielle pour l\'année universitaire 2026/2027 est active.',
    showRegisterButton: true
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      try {
        const snap = await getDoc(doc(db, 'admission_config', 'settings'));
        if (snap.exists()) {
          const data = snap.data() as CandidatureSettings;
          setSettings({
            ...data,
            showRegisterButton: data.showRegisterButton !== false
          });
          setLoading(false);
          return;
        }
      } catch (fsErr) {
        console.warn('Firestore settings unavailable, falling back to API:', fsErr);
      }
      
      const res = await fetch('/api/candidatures/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          ...data,
          showRegisterButton: data.showRegisterButton !== false
        });
      }
    } catch (err) {
      console.error('Erreur de chargement des paramètres de candidature:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (next: Partial<CandidatureSettings>) => {
    const updated = { ...settings, ...next };
    setSettings(updated);
    try {
      try {
        await setDoc(doc(db, 'admission_config', 'settings'), updated, { merge: true });
      } catch (fsErr) {
        console.warn('Firestore write failed, updating backend API instead:', fsErr);
      }
      await fetch('/api/admin/candidatures/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Erreur de sauvegarde des paramètres:', err);
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
    fetchSettings,
    updateSettings
  };
}
