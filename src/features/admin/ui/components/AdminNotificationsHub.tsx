import React, { useState } from 'react';
import { NotificationsSubSidebar } from './notifications/NotificationsSubSidebar';
import { MassSendTab } from './notifications/MassSendTab';
import { EmergencyTab } from './notifications/EmergencyTab';
import { HistoryAnalyticsTab } from './notifications/HistoryAnalyticsTab';
import { NotificationCampaign, INITIAL_CAMPAIGNS } from '../../domain/NotificationsModels';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminNotificationsHub() {
  const [activeTab, setActiveTab] = useState('mass-send');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>(INITIAL_CAMPAIGNS);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const showToast = (message: string, success: boolean) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSendCampaign = (title: string, target: string, channels: string[]) => {
    const newCamp: NotificationCampaign = {
      id: `camp-${Math.floor(100 + Math.random() * 899)}`,
      title,
      target,
      channels,
      date: new Date().toISOString().split('T')[0],
      openRate: 88 + Math.floor(Math.random() * 10),
      deliveryRate: 98 + Math.floor(Math.random() * 2),
    };
    setCampaigns([newCamp, ...campaigns]);
    showToast(`Campagne "${title}" diffusée avec succès !`, true);
  };

  const handleTriggerEmergency = (type: string) => {
    showToast(`ALERTE CRITIQUE DE TYPE [${type}] DIFFUSÉE ! Tous les terminaux mobiles ont vibré.`, false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full" id="admin-notifications-hub-root">
      <TabletDrawerWrapper>
        <NotificationsSubSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </TabletDrawerWrapper>

      <div className="flex-grow min-w-0 w-full bg-white border border-[#E2DCDA] rounded-2xl p-3 sm:p-6 shadow-sm min-h-[550px] relative">
        {toast && (
          <div
            className={`absolute top-4 right-4 z-50 px-4 py-2.5 rounded-xl border text-xs font-black shadow-md flex items-center gap-2 ${
              toast.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span translate="no" className="material-symbols-outlined text-sm">
              {toast.success ? 'check_circle' : 'campaign'}
            </span>
            <span>{toast.message}</span>
          </div>
        )}

        {activeTab === 'mass-send' && <MassSendTab onSendCampaign={handleSendCampaign} />}

        {activeTab === 'emergency' && <EmergencyTab onTriggerEmergency={handleTriggerEmergency} />}

        {activeTab === 'history' && <HistoryAnalyticsTab campaigns={campaigns} />}
      </div>
    </div>
  );
}
