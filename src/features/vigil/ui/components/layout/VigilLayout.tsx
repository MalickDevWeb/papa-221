import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/core/store/authStore';
import { 
  Shield
} from 'lucide-react';
import { VigilMobileNav } from './nav/VigilMobileNav';

export function VigilLayout() {
  const navigate = useNavigate();
  const { deconnexion } = useAuthStore();
  const guardAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBalAsEwOTbalR3A-6YVuXiP7tSYNWUVYrQDTls4bmL023hSvINimzRQbERoojJmJ9f-aQI9E8huOTuncwR0Uo7ymARwAL4Y5N9OBJGGTNGSeK5WvSb323n3Wf0oDn66J9E9OzN_4DDfR4BKGq3SDG-g7334Y1UY3y0AwrbCI7m-QkzRqFfEyWolXGA1nDIiqsrkB9Ws0vFBIAQ4SB3t-QuTeidYwMiFIeTa2n_vVhIiJS51465Edqe";

  return (
    <div className="h-screen overflow-hidden bg-neutral-50/50 flex flex-col antialiased">
      {/* Centered Mobile Shell Frame Container */}
      <div className="w-full max-w-md mx-auto bg-[#FAF8F6] h-screen shadow-2xl border-x border-neutral-200/50 flex flex-col relative overflow-hidden">
        
        {/* Top Header of the Portal */}
        <header className="sticky top-0 z-[110] bg-white border-b border-neutral-100 flex items-center justify-between px-6 py-4.5 shadow-xs">
          <div 
            onClick={() => navigate(ROUTES.vigil.dashboard)}
            className="flex items-center gap-3 cursor-pointer select-none active:opacity-80"
          >
            <Shield className="h-6 w-6 text-[#ba0013] stroke-[2.5]" />
            <h1 className="font-extrabold text-xl text-[#ba0013] tracking-tight">
              École 221 Portal
            </h1>
          </div>
          
          {/* Right actions: Avatar */}
          <div className="flex items-center gap-3.5">
            {/* Active Guard Avatar Profile Badge */}
            <button 
              onClick={() => navigate('/vigile/profil')}
              className="h-9 w-9 rounded-full overflow-hidden border border-[#ba0013]/20 cursor-pointer hover:opacity-80 active:scale-95 transition-transform duration-150 flex items-center justify-center p-0 focus:outline-none focus:ring-2 focus:ring-[#ba0013]/50 shadow-sm"
              title="Voir mon profil"
            >
              <img 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover" 
                src={guardAvatar} 
                alt="Profil du gardien" 
              />
            </button>
          </div>
        </header>

        {/* Dynamic Main Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 pt-4">
          <Outlet />
        </main>

        {/* Persistent Bottom Mobile Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-[120] bg-white/95 backdrop-blur-sm border-t border-neutral-200">
          <VigilMobileNav />
        </div>

      </div>
    </div>
  );
}
