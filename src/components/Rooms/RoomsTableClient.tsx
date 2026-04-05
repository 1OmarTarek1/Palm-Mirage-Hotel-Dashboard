"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgePercent, BedDouble, CircleDollarSign, DoorOpen } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import TableOverview from "@/components/shared/table/TableOverview";
import SharedModal from "@/components/shared/modal/SharedModal";
import { roomColumns, roomFilters } from "@/config/tablePresets/roomColumns";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "@/lib/rooms";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { queryKeys } from "@/lib/queryKeys";
import { createEmptyRoomDraft, type Room, type RoomDraft } from "./data";
import RoomAddForm from "./RoomAddForm";
import RoomEditForm from "./RoomEditForm";
import RoomDetailsView from "./RoomDetailsView";
import RoomDeleteConfirm from "./RoomDeleteConfirm";

function RoomsTableClient() {
  const queryClient = useQueryClient();
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: queryKeys.rooms.list,
    queryFn: fetchRooms,
    staleTime: 45_000,
  });
  const [creatingDraft, setCreatingDraft] = useState<RoomDraft | null>(null);
  const [viewingRoomId, setViewingRoomId] = useState<string | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<RoomDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const openAddModal = () => {
      setCreatingDraft((current) => current ?? createEmptyRoomDraft());
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.roomsAdd, openAddModal);

    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.roomsAdd, openAddModal);
    };
  }, []);

  const viewingRoom = useMemo(
    () => rooms.find((r) => r.id === viewingRoomId) ?? null,
    [rooms, viewingRoomId]
  );

  const editingRoom = useMemo(
    () => rooms.find((r) => r.id === editingRoomId) ?? null,
    [rooms, editingRoomId]
  );

  const deletingRoom = useMemo(
    () => rooms.find((r) => r.id === deletingRoomId) ?? null,
    [rooms, deletingRoomId]
  );

  const overviewItems = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((room) => room.isAvailable).length;
    const offerRooms = rooms.filter((room) => room.hasOffer).length;
    const averageRate = totalRooms > 0
      ? Math.round(rooms.reduce((sum, room) => sum + (room.finalPrice ?? room.price), 0) / totalRooms)
      : 0;

    return [
      {
        key: "rooms",
        label: "Rooms listed",
        value: totalRooms,
        helper: "Inventory currently visible in this table",
        icon: BedDouble,
      },
      {
        key: "available",
        label: "Available now",
        value: availableRooms,
        helper: "Rooms ready for the next reservation",
        icon: DoorOpen,
      },
      {
        key: "offers",
        label: "Offers running",
        value: offerRooms,
        helper: "Rooms currently showing promotional pricing",
        icon: BadgePercent,
        tone: "secondary" as const,
      },
      {
        key: "rate",
        label: "Average nightly rate",
        value: `$${averageRate.toLocaleString()}`,
        helper: "Average visible sell price across rooms",
        icon: CircleDollarSign,
      },
    ];
  }, [rooms]);

  const handleCloseViewModal = () => setViewingRoomId(null);
  const handleCloseAddModal = () => {
    setCreatingDraft(null);
  };
  const handleCloseEditModal = () => {
    setEditingRoomId(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingRoomId(null);

  const handleConfirmDelete = async () => {
    if (!deletingRoom) return;
    setIsSaving(true);
    try {
      await deleteRoom(deletingRoom.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      toast.success("Room deleted successfully.");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete room");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!creatingDraft) return;
    setIsSaving(true);
    try {
      await createRoom(creatingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      toast.success("Room created successfully.");
      handleCloseAddModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create room");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoomId || !editingDraft) return;
    setIsSaving(true);
    try {
      await updateRoom(editingRoomId, editingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      toast.success("Room updated successfully.");
      handleCloseEditModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update room");
    } finally {
      setIsSaving(false);
    }
  };

  const actions = [
    {
      key: "view" as const,
      onClick: (room: Room) => setViewingRoomId(room.id),
    },
    {
      key: "edit" as const,
      onClick: (room: Room) => {
        setEditingDraft({
          roomName: room.roomName,
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          price: room.price,
          capacity: room.capacity,
          discount: room.discount,
          description: room.description,
          amenities: room.amenities,
          roomImages: room.roomImages,
          hasOffer: room.hasOffer,
          isAvailable: room.isAvailable,
          floor: room.floor,
          checkInTime: room.checkInTime,
          checkOutTime: room.checkOutTime,
          cancellationPolicy: room.cancellationPolicy,
        });
        setEditingRoomId(room.id);
      },
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (room: Room) => setDeletingRoomId(room.id),
    },
  ];

  return (
    <>
      <div className="mb-5 md:mb-6">
        <TableOverview items={overviewItems} isLoading={isLoading} />
      </div>

      <DashboardSectionCard>
        <DynamicTable<Room>
          columns={roomColumns}
          data={rooms}
          isLoading={isLoading}
          filtersConfig={roomFilters}
          pageSize={5}
          searchPlaceholder="Search rooms..."
          actions={actions}
        />
      </DashboardSectionCard>

      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add Room"
        onSave={handleCreateRoom}
        saveLabel="Create Room"
        isSaving={isSaving}
      >
        {creatingDraft ? <RoomAddForm draft={creatingDraft} onChange={setCreatingDraft} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(viewingRoom)}
        onClose={handleCloseViewModal}
        title={viewingRoom ? `Room ${viewingRoom.roomNumber} - ${viewingRoom.roomName}` : "Room Details"}
      >
        {viewingRoom ? <RoomDetailsView room={viewingRoom} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingRoom)}
        onClose={handleCloseEditModal}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : "Edit Room"}
        onSave={handleUpdateRoom}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingDraft ? <RoomEditForm draft={editingDraft} onChange={setEditingDraft} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(deletingRoom)}
        onClose={handleCloseDeleteModal}
        title={deletingRoom ? `Delete Room ${deletingRoom.roomNumber}` : "Delete Room"}
        onSave={handleConfirmDelete}
        saveLabel="Delete Room"
        saveVariant="danger"
        isSaving={isSaving}
      >
         {deletingRoom ? <RoomDeleteConfirm room={deletingRoom} /> : null}
      </SharedModal>
    </>
  );
}

export default RoomsTableClient;
