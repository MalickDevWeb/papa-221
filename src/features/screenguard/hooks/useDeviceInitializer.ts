import { useEffect } from 'react';
import { useDeviceStore } from './useDeviceStore';

export function useDeviceInitializer() {
  const updateWidth = useDeviceStore((state) => state.updateWidth);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial size on load
    updateWidth(window.innerWidth);

    const handleResize = () => {
      updateWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateWidth]);
}
