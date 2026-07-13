export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceState {
  width: number;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasBypassed: boolean;
}
