"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeInfo, Sparkles, Type, Wand2 } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import TableOverview from "@/components/shared/table/TableOverview";
import SharedModal from "@/components/shared/modal/SharedModal";
import { roomAmenityColumns, roomAmenityFilters } from "@/config/tablePresets/roomAmenityColumns";
import {
  createRoomAmenity,
  deleteRoomAmenity,
  fetchRoomAmenities,
  updateRoomAmenity,
} from "@/lib/room-amenities";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { queryKeys } from "@/lib/queryKeys";
import type { RoomAmenity } from "@/types/room-amenity";
import { createEmptyRoomAmenityDraft } from "./data";
import RoomAmenityForm from "./RoomAmenityForm";

export default function RoomAmenitiesTableClient() {
  const queryClient = useQueryClient();
  const { data: amenities = [], isLoading } = useQuery({
    queryKey: queryKeys.roomAmenities.list,
    queryFn: fetchRoomAmenities,
    staleTime: 45_000,
  });
  const [creatingDraft, setCreatingDraft] = useState<RoomAmenity | null>(null);
  const [editingDraft, setEditingDraft] = useState<RoomAmenity | null>(null);
  const [deletingAmenityId, setDeletingAmenityId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const openAddModal = () => {
      setCreatingDraft((current) => current ?? createEmptyRoomAmenityDraft());
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.roomAmenitiesAdd, openAddModal);
    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.roomAmenitiesAdd, openAddModal);
    };
  }, []);

  const deletingAmenity = useMemo(
    () => amenities.find((amenity) => amenity._id === deletingAmenityId) ?? null,
    [amenities, deletingAmenityId]
  );

  const overviewItems = useMemo(() => {
    const totalAmenities = amenities.length;
    const withIcons = amenities.filter((amenity) => Boolean(amenity.icon)).length;
    const withDescriptions = amenities.filter((amenity) => amenity.description.trim().length > 0).length;
    const averageNameLength = totalAmenities > 0
      ? Math.round(amenities.reduce((sum, amenity) => sum + amenity.name.trim().length, 0) / totalAmenities)
      : 0;

    return [
      {
        key: "amenities",
        label: "Amenities listed",
        value: totalAmenities,
        helper: "Room features currently available for tagging",
        icon: Sparkles,
      },
      {
        key: "icons",
        label: "Icons assigned",
        value: withIcons,
        helper: "Amenities already using a visual icon",
        icon: Wand2,
      },
      {
        key: "descriptions",
        label: "Described items",
        value: withDescriptions,
        helper: "Amenities with supporting description text",
        icon: BadgeInfo,
        tone: "secondary" as const,
      },
      {
        key: "nameLength",
        label: "Avg. name length",
        value: averageNameLength,
        helper: "Useful for keeping labels compact in room cards",
        icon: Type,
        tone: "secondary" as const,
      },
    ];
  }, [amenities]);

  const handleConfirmCreate = async () => {
    if (!creatingDraft) return;
    setIsSaving(true);
    try {
      await createRoomAmenity(creatingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.roomAmenities.all });
      toast.success("Room amenity created successfully.");
      setCreatingDraft(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create room amenity");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmEdit = async () => {
    if (!editingDraft) return;
    setIsSaving(true);
    try {
      await updateRoomAmenity(editingDraft._id, editingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.roomAmenities.all });
      toast.success("Room amenity updated successfully.");
      setEditingDraft(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update room amenity");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAmenity) return;
    setIsSaving(true);
    try {
      await deleteRoomAmenity(deletingAmenity._id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.roomAmenities.all });
      toast.success("Room amenity deleted successfully.");
      setDeletingAmenityId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete room amenity");
    } finally {
      setIsSaving(false);
    }
  };

  const actions = [
    {
      key: "edit" as const,
      onClick: (amenity: RoomAmenity) => setEditingDraft({ ...amenity }),
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (amenity: RoomAmenity) => setDeletingAmenityId(amenity._id),
    },
  ];

  return (
    <>
      <div className="mb-5 md:mb-6">
        <TableOverview items={overviewItems} isLoading={isLoading} />
      </div>

      <DashboardSectionCard>
        <DynamicTable<RoomAmenity>
          columns={roomAmenityColumns}
          data={amenities}
          isLoading={isLoading}
          filtersConfig={roomAmenityFilters}
          pageSize={6}
          searchPlaceholder="Search room amenities..."
          actions={actions}
        />
      </DashboardSectionCard>

      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={() => setCreatingDraft(null)}
        title="Add Room Amenity"
        onSave={handleConfirmCreate}
        saveLabel="Create Amenity"
        isSaving={isSaving}
      >
        {creatingDraft ? (
          <div className="p-4">
            <RoomAmenityForm amenity={creatingDraft} onChange={setCreatingDraft} />
          </div>
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingDraft)}
        onClose={() => setEditingDraft(null)}
        title={editingDraft ? `Edit ${editingDraft.name}` : "Edit Room Amenity"}
        onSave={handleConfirmEdit}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingDraft ? (
          <div className="p-4">
            <RoomAmenityForm amenity={editingDraft} onChange={setEditingDraft} />
          </div>
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(deletingAmenity)}
        onClose={() => setDeletingAmenityId(null)}
        title={deletingAmenity ? `Delete ${deletingAmenity.name}` : "Delete Room Amenity"}
        onSave={handleConfirmDelete}
        saveLabel="Delete Amenity"
        saveVariant="danger"
        isSaving={isSaving}
      >
        {deletingAmenity ? (
          <div className="p-4 text-center">
            Are you sure you want to delete <strong>{deletingAmenity.name}</strong>? This action
            cannot be undone.
          </div>
        ) : null}
      </SharedModal>
    </>
  );
}
