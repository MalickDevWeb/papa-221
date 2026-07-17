import React from 'react';
import { Room, Classe, PlanningSlot } from '../../../domain/SchoolModels';
import { PlanningSidebar } from './PlanningSidebar';
import { PlanningGrid } from './PlanningGrid';
import { SlotEditModal } from './SlotEditModal';
import { ConflictModal } from './ConflictModal';
import { DeleteConfirmInput } from './DeleteConfirmInput';
import { usePlanningTabState } from './usePlanningTabState';

interface Props {
  rooms: Room[];
  classes: Classe[];
  slots: PlanningSlot[];
  onUpdateSlots: (slots: PlanningSlot[]) => void;
}

export function PlanningTab({ rooms, classes, slots, onUpdateSlots }: Props) {
  const {
    selectedClassId,
    setSelectedClassId,
    errorToast,
    successToast,
    editingSlot,
    setEditingSlot,
    pendingConflict,
    setPendingConflict,
    clearingCell,
    setClearingCell,
    executeClearCell,
    handleDropItem,
    handleClearCell,
    handleSaveSlot,
    handleDeleteSlot,
  } = usePlanningTabState(classes, slots, onUpdateSlots);

  return (
    <div className="space-y-4" id="planning-tab-root">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Gestion des Emplois du Temps</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérer le planning sans conflits en glissant/déposant profs, salles & classes.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase font-black text-neutral-400 font-bold">Classe :</label>
          <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs font-bold focus:outline-none">
            {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
          </select>
        </div>
      </div>

      {errorToast && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
          <span translate="no" className="material-symbols-outlined text-lg">error</span>
          <span>{errorToast}</span>
        </div>
      )}

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
          <span translate="no" className="material-symbols-outlined text-lg">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex gap-4 items-start">
        <PlanningGrid
          slots={slots}
          viewMode="class"
          selectedId={selectedClassId}
          onDropItem={handleDropItem}
          onClearCell={handleClearCell}
          onSelectSlot={setEditingSlot}
        />
        <PlanningSidebar rooms={rooms} classes={classes} />
      </div>

      {editingSlot && (
        <SlotEditModal
          slot={editingSlot}
          rooms={rooms}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlot}
          onDelete={handleDeleteSlot}
        />
      )}

      {pendingConflict && (
        <ConflictModal
          conflict={pendingConflict}
          onClose={() => setPendingConflict(null)}
          onForce={pendingConflict.onResolve}
        />
      )}

      {clearingCell && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 w-full max-w-md space-y-4">
            <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-1.5 border-b border-neutral-100 pb-2">
              <span translate="no" className="material-symbols-outlined text-[#B3181C]">security</span>
              <span>Confirmer la suppression du cours</span>
            </h3>
            <DeleteConfirmInput
              onConfirm={executeClearCell}
              onCancel={() => setClearingCell(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
