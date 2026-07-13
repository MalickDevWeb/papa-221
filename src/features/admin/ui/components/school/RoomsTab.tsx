import React, { useState } from 'react';
import { Room } from '../../../domain/SchoolModels';
import { RoomCard } from './RoomCard';
import { RoomFormModal } from './RoomFormModal';
import { RoomDetailView } from './RoomDetailView';

interface Props {
  rooms: Room[];
  onUpdateRooms: (rooms: Room[]) => void;
  slots: any[];
}

export function RoomsTab({ rooms, onUpdateRooms, slots }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleAddRoom = (roomData: { name: string; capacity: number; equipment: string[] }) => {
    const newRoom: Room = {
      id: `r-${Date.now()}`,
      name: roomData.name,
      capacity: roomData.capacity,
      equipment: roomData.equipment,
      status: 'Disponible',
    };
    onUpdateRooms([...rooms, newRoom]);
    setShowAddModal(false);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    onUpdateRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    setSelectedRoom(updatedRoom);
  };

  const handleDeleteRoom = (roomId: string) => {
    onUpdateRooms(rooms.filter(r => r.id !== roomId));
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-4" id="rooms-tab-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1E293B] text-sm">Gestion des Salles d'Établissement</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Gérer les capacités physiques et équipements.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#B3181C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#921316] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span translate="no" className="material-symbols-outlined text-sm font-black">add</span>
          <span>Nouvelle Salle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="min-h-[160px]">
            <RoomCard room={room} onSelect={setSelectedRoom} />
          </div>
        ))}
      </div>

      {showAddModal && (
        <RoomFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddRoom}
        />
      )}

      {selectedRoom && (
        <RoomDetailView
          room={selectedRoom}
          slots={slots}
          onClose={() => setSelectedRoom(null)}
          onUpdate={handleUpdateRoom}
          onDelete={handleDeleteRoom}
        />
      )}
    </div>
  );
}
