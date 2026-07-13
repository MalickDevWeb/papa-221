import React, { useState } from 'react';
import { SchoolSubSidebar } from './school/SchoolSubSidebar';
import { RoomsTab } from './school/RoomsTab';
import { FilieresTab } from './school/FilieresTab';
import { ClassesTab } from './school/ClassesTab';
import { PlanningTab } from './school/PlanningTab';
import {
  INITIAL_ROOMS,
  INITIAL_FILIERES,
  INITIAL_CLASSES,
  INITIAL_PLANNING,
  Room,
  Filiere,
  Classe,
  PlanningSlot,
} from '../../domain/SchoolModels';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminSchoolManager() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [filieres, setFilieres] = useState<Filiere[]>(INITIAL_FILIERES);
  const [classes, setClasses] = useState<Classe[]>(INITIAL_CLASSES);
  const [slots, setSlots] = useState<PlanningSlot[]>(INITIAL_PLANNING);

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
          <RoomsTab rooms={rooms} onUpdateRooms={setRooms} slots={slots} />
        )}
        {activeTab === 'filieres' && (
          <FilieresTab filieres={filieres} onAddFiliere={(f) => setFilieres([...filieres, f])} />
        )}
        {activeTab === 'classes' && (
          <ClassesTab classes={classes} filieres={filieres} onAddClasse={(c) => setClasses([...classes, c])} />
        )}
        {activeTab === 'planning' && (
          <PlanningTab rooms={rooms} classes={classes} slots={slots} onUpdateSlots={setSlots} />
        )}
      </div>
    </div>
  );
}
