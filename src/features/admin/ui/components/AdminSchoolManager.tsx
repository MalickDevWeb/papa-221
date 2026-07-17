import React, { useState } from 'react';
import { SchoolSubSidebar } from './school/SchoolSubSidebar';
import { RoomsTab } from './school/RoomsTab';
import { FilieresTab } from './school/FilieresTab';
import { ClassesTab } from './school/ClassesTab';
import { PlanningTab } from './school/PlanningTab';
import { useAdminSchoolState } from '../../hooks/useAdminSchoolState';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminSchoolManager() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    rooms,
    updateRooms,
    filieres,
    updateFilieres,
    classes,
    updateClasses,
    slots,
    updateSlots,
    loading,
  } = useAdminSchoolState();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" id="school-manager-loading">
        <span translate="no" className="material-symbols-outlined text-3xl text-[#B3181C] animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full" id="school-manager-root">
      <TabletDrawerWrapper>
        <SchoolSubSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </TabletDrawerWrapper>
      <div className="flex-grow min-w-0 w-full bg-white border border-[#E2DCDA] rounded-2xl p-3 sm:p-6 shadow-sm min-h-[550px] overflow-hidden">
        {activeTab === 'rooms' && (
          <RoomsTab rooms={rooms} onUpdateRooms={updateRooms} slots={slots} onUpdateSlots={updateSlots} />
        )}
        {activeTab === 'filieres' && (
          <FilieresTab filieres={filieres} onUpdateFilieres={updateFilieres} />
        )}
        {activeTab === 'classes' && (
          <ClassesTab classes={classes} filieres={filieres} onUpdateClasses={updateClasses} />
        )}
        {activeTab === 'planning' && (
          <PlanningTab rooms={rooms} classes={classes} slots={slots} onUpdateSlots={updateSlots} />
        )}
      </div>
    </div>
  );
}
