import React, { useState } from 'react';
import { LoginMobileView } from '../components/LoginMobileView';
import { LoginTabletView } from '../components/LoginTabletView';
import { LoginDesktopView } from '../components/LoginDesktopView';
import { MobileCalendarModal } from '../components/MobileCalendarModal';
import loginBg from '../../../../assets/images/login_bg_clean_ecole221_1784306644151.jpg';

export function LoginPage() {
  const [tabletActiveTab, setTabletActiveTab] = useState<'login' | 'calendar'>('login');
  const [desktopShowCalendar, setDesktopShowCalendar] = useState(false);
  const [showMobileCalendarModal, setShowMobileCalendarModal] = useState(false);
  const bgImageUrl = `url('${loginBg}')`;

  return (
    <main className="h-screen w-full max-w-full bg-[#FAF8F6] flex items-stretch overflow-hidden select-none">
      <LoginMobileView bgImageUrl={bgImageUrl} setShowMobileCalendarModal={setShowMobileCalendarModal} />
      <LoginTabletView bgImageUrl={bgImageUrl} tabletActiveTab={tabletActiveTab} setTabletActiveTab={setTabletActiveTab} />
      <LoginDesktopView bgImageUrl={bgImageUrl} desktopShowCalendar={desktopShowCalendar} setDesktopShowCalendar={setDesktopShowCalendar} />
      {showMobileCalendarModal && <MobileCalendarModal setShowMobileCalendarModal={setShowMobileCalendarModal} />}
    </main>
  );
}
