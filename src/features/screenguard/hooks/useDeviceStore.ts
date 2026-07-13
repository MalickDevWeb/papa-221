import { create } from 'zustand';
import { DeviceState, DeviceType } from '../domain/DeviceModels';

interface DeviceStoreState extends DeviceState {
  setBypassed: (bypassed: boolean) => void;
  updateWidth: (width: number) => void;
}

const getDeviceType = (w: number): DeviceType => {
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
};

const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

export const useDeviceStore = create<DeviceStoreState>((set) => ({
  width: initialWidth,
  deviceType: getDeviceType(initialWidth),
  isMobile: initialWidth < 768,
  isTablet: initialWidth >= 768 && initialWidth < 1024,
  isDesktop: initialWidth >= 1024,
  hasBypassed: false,

  setBypassed: (bypassed) => set({ hasBypassed: bypassed }),

  updateWidth: (w) => {
    const dType = getDeviceType(w);
    set({
      width: w,
      deviceType: dType,
      isMobile: dType === 'mobile',
      isTablet: dType === 'tablet',
      isDesktop: dType === 'desktop',
    });
  },
}));
