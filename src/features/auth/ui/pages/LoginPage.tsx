import React, { useState } from 'react';
import { LoginMobileView } from '../components/LoginMobileView';
import { LoginTabletView } from '../components/LoginTabletView';
import { LoginDesktopView } from '../components/LoginDesktopView';
import { MobileCalendarModal } from '../components/MobileCalendarModal';

export function LoginPage() {
  const [tabletActiveTab, setTabletActiveTab] = useState<'login' | 'calendar'>('login');
  const [desktopShowCalendar, setDesktopShowCalendar] = useState(false);
  const [showMobileCalendarModal, setShowMobileCalendarModal] = useState(false);
  const bgImageUrl = "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvQL9_EMnd-N8W7X6w_OplACkDHFQ2l5MtwjdkpWqC-SiZYTIVwNT70mNifCg4W_qtdT8LM-fj6hrYsRn-p0vAcHgRtJ-5KwQetUaRxPKNb19rYinpegcRSyxMOkdU35KewlOk9C58WlFL9Pie8-oEUlyz_lJmZkHAO4ft4lTH_4SRIl0uzFcqVGXxmVElfIsXtoHED3Bz62V7f8msM_49hz5NI0WPQ9YT5eLhy5NpxI7T_NuLoEx9XaSvQLgUTcjnqiTVsuiKD7o')";

  return (
    <main className="h-screen w-full max-w-full bg-[#FAF8F6] flex items-stretch overflow-hidden select-none">
      <LoginMobileView bgImageUrl={bgImageUrl} setShowMobileCalendarModal={setShowMobileCalendarModal} />
      <LoginTabletView bgImageUrl={bgImageUrl} tabletActiveTab={tabletActiveTab} setTabletActiveTab={setTabletActiveTab} />
      <LoginDesktopView bgImageUrl={bgImageUrl} desktopShowCalendar={desktopShowCalendar} setDesktopShowCalendar={setDesktopShowCalendar} />
      {showMobileCalendarModal && <MobileCalendarModal setShowMobileCalendarModal={setShowMobileCalendarModal} />}
    </main>
  );
}
