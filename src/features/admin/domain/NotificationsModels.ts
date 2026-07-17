export interface NotificationCampaign {
  id: string;
  title: string;
  target: string;
  channels: string[];
  date: string;
  openRate: number;
  deliveryRate: number;
}

export const INITIAL_CAMPAIGNS: NotificationCampaign[] = [
  { id: 'camp-001', title: 'Réunion générale de rentrée parents-profs', target: 'Tous les Parents', channels: ['Email', 'WhatsApp'], date: '2026-07-01', openRate: 85, deliveryRate: 98 },
  { id: 'camp-002', title: 'Publication des plannings de rattrapages', target: 'L2 Génie Civil', channels: ['SMS', 'Push'], date: '2026-07-04', openRate: 94, deliveryRate: 100 },
  { id: 'camp-003', title: 'Alerte fermeture exceptionnelle - Intempéries', target: 'Toute l\'école', channels: ['SMS', 'Push', 'WhatsApp'], date: '2026-07-05', openRate: 99, deliveryRate: 99 },
];
