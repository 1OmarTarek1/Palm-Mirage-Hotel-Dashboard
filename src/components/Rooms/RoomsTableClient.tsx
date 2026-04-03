"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { roomColumns, roomFilters } from "@/config/tablePresets/roomColumns";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "@/lib/rooms";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { createEmptyRoomDraft, type Room, type RoomDraft } from "./data";
import RoomAddForm from "./RoomAddForm";
import RoomEditForm from "./RoomEditForm";
import RoomDetailsView from "./RoomDetailsView";
import RoomDeleteConfirm from "./RoomDeleteConfirm";

function RoomsTableClient() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creatingDraft, setCreatingDraft] = useState<RoomDraft | null>(null);
  const [viewingRoomId, setViewingRoomId] = useState<string | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<RoomDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRooms();
      setRooms(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRooms();
  }, []);

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
      setRooms((current) => current.filter((r) => r.id !== deletingRoom.id));
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
      const refreshedRooms = await createRoom(creatingDraft);
      setRooms(refreshedRooms);
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
      const refreshedRooms = await updateRoom(editingRoomId, editingDraft);
      setRooms(refreshedRooms);
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
        const { id, createdAt, reviewsCount, viewsCount, rating, finalPrice, image, ...rest } = room;
        setEditingDraft({ ...rest });
        setEditingRoomId(id);
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
      <DynamicTable<Room>
        columns={roomColumns}
        data={rooms}
        isLoading={isLoading}
        filtersConfig={roomFilters}
        pageSize={5}
        searchPlaceholder="Search rooms..."
        actions={actions}
      />

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
