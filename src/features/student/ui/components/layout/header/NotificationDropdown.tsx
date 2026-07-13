import React from 'react';

interface NotificationItem {
  id: number; title: string; desc: string; time: string; read: boolean; icon: string; color: string;
}


interface Props {
  notifications: NotificationItem[];
  unreadCount: number;
  notifFilter: 'all' | 'unread';
  setNotifFilter: (f: 'all' | 'unread') => void;
  showNotifications: boolean; setShowNotifications: (v: boolean) => void;
  setShowProfile: (v: boolean) => void;
  setShowCalendar: (v: boolean) => void;
  onMarkAllRead: () => void;
  onNotifClick: (id: number) => void;
  notifRef: React.RefObject<HTMLDivElement | null>;
}

export function NotificationDropdown({
  notifications, unreadCount, notifFilter, setNotifFilter,
  showNotifications, setShowNotifications, setShowProfile, setShowCalendar,
  onMarkAllRead, onNotifClick, notifRef
}: Props) {
  return (
    <div className="relative" ref={notifRef}>
      <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowCalendar(false); }} className={`relative w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-gray-50 hover:bg-brand-red-light text-secondary hover:text-brand-red-deep transition-all cursor-pointer group ${showNotifications ? 'bg-brand-red-light text-brand-red-deep' : ''}`}>
        <span translate="no" className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">notifications</span>
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-brand-red-deep border-2 border-white px-1.5 py-0.5 rounded-full text-[8px] font-black text-white min-w-[18px] text-center animate-bounce-slow shadow-xs">{unreadCount}</span>}
      </button>
      {showNotifications && (
        <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-3 sm:w-[390px] bg-white border border-neutral-gray-200 rounded-3xl shadow-2xl overflow-hidden z-[200] animate-slide-up">
          <div className="p-4 border-b border-neutral-gray-100 flex items-center justify-between bg-gradient-to-r from-neutral-50 to-white select-none">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-xs text-[#291715] uppercase tracking-wider">Notifications</h4>
                <span className="flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/50 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Temps Réel (Firestore)
                </span>
              </div>
              <p className="text-[10px] text-neutral-gray-400 font-bold mt-0.5">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onMarkAllRead} className="text-[9.5px] font-extrabold text-brand-red-deep hover:bg-brand-red-light/60 transition-colors cursor-pointer bg-brand-red-light px-2.5 py-1 rounded-lg">Tout marquer lu</button>
              <button aria-label="Fermer" onClick={() => setShowNotifications(false)} className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0">
                <span translate="no" className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 px-4 py-2 border-b border-neutral-gray-100 bg-neutral-50/50 overflow-x-auto no-scrollbar shrink-0 select-none">
            {(['all', 'unread'] as const).map((f) => (
              <button key={f} type="button" onClick={() => setNotifFilter(f)} className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all whitespace-nowrap ${notifFilter === f ? 'bg-brand-red-deep text-white shadow-sm' : 'bg-white border border-neutral-200 text-secondary hover:bg-neutral-100'}`}>
                {f === 'all' ? `Toutes (${notifications.length})` : `Non lues (${unreadCount})`}
              </button>
            ))}
          </div>
          <div className="divide-y divide-neutral-gray-100 max-h-[320px] overflow-y-auto no-scrollbar">
            {(notifFilter === 'all' ? notifications : notifications.filter(n => !n.read)).length === 0 ? (
              <div className="py-10 text-center text-neutral-450 select-none">
                <span translate="no" className="material-symbols-outlined text-[32px] text-neutral-300">notifications_off</span>
                <p className="text-xs font-bold mt-2">Aucune notification à afficher</p>
              </div>
            ) : (
              (notifFilter === 'all' ? notifications : notifications.filter(n => !n.read)).map((notif) => (
                <div key={notif.id} onClick={() => onNotifClick(notif.id)} className={`p-4 flex gap-3 hover:bg-neutral-gray-50/70 transition-colors cursor-pointer items-start ${!notif.read ? 'bg-brand-red-light/15' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.color}`}>
                    <span translate="no" className="material-symbols-outlined text-base font-bold">{notif.icon}</span>
                  </div>
                  <div className="flex-grow space-y-0.5">
                    <div className="flex justify-between items-start gap-1">
                      <h5 className={`text-xs font-bold leading-tight ${!notif.read ? 'text-[#291715]' : 'text-neutral-550'}`}>{notif.title}</h5>
                      <span className="text-[9px] text-neutral-gray-400 font-medium whitespace-nowrap shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-normal">{notif.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
