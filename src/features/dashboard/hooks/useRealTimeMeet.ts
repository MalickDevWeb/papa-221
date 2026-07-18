import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from '@/shared/lib/firebaseRealtime';
import { LiveSession } from '@/features/student/types';

export function useRealTimeMeet() {
  const [activeMeet, setActiveMeet] = useState<LiveSession | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const meetRef = ref(db, 'meet/active');
    
    const unsubscribe = onValue(meetRef, (snapshot) => {
      const val = snapshot.val();
      setActiveMeet(val);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return activeMeet;
}
