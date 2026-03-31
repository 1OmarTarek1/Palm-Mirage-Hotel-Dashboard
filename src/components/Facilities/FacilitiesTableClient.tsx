"use client";

import React, { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { facilityColumns, facilityFilters } from "@/config/tablePresets/facilityColumns";
import { facilityService } from "@/services/facility.service";
import { createEmptyFacilityDraft } from "./data";
import { Facility } from "@/types/facility";
import FacilityForm from "./FacilityForm";

export interface FacilitiesTableClientHandle {
  openAddModal: () => void;
}

const FacilitiesTableClient = forwardRef<FacilitiesTableClientHandle>(function FacilitiesTableClient(_, ref) {
  const [facilities, setFacilities] = React.useState<Facility[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [creatingDraft, setCreatingDraft] = useState<Facility | null>(null);
  const [viewingFacilityId, setViewingFacilityId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Facility | null>(null);
  const [deletingFacilityId, setDeletingFacilityId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setCreatingDraft(createEmptyFacilityDraft());
    },
  }));

  React.useEffect(() => {
    let isMounted = true;

    const loadFacilities = async () => {
      try {
        setIsLoading(true);
        const data = await facilityService.fetchFacilities();
        if (isMounted) {
          setFacilities(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : "Failed to load facilities");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFacilities();

    return () => {
      isMounted = false;
    };
  }, []);

  const viewingFacility = useMemo(
    () => facilities.find((f) => f._id === viewingFacilityId) ?? null,
    [facilities, viewingFacilityId]
  );

  const editingFacility = editingDraft;

  const deletingFacility = useMemo(
    () => facilities.find((f) => f._id === deletingFacilityId) ?? null,
    [facilities, deletingFacilityId]
  );

  const handleCloseViewModal = () => setViewingFacilityId(null);
  const handleCloseAddModal = () => setCreatingDraft(null);
  const handleCloseEditModal = () => setEditingDraft(null);
  const handleCloseDeleteModal = () => setDeletingFacilityId(null);

  const handleConfirmAddFacility = async () => {
    if (!creatingDraft) return;
    setIsSaving(true);
    try {
      const newFacility = await facilityService.createFacility(creatingDraft);
      setFacilities((current) => [...current, newFacility]);
      toast.success("Facility added successfully.");
      handleCloseAddModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add facility");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmEditFacility = async () => {
    if (!editingFacility) return;
    setIsSaving(true);
    try {
      const updated = await facilityService.updateFacility(editingFacility._id, editingFacility);
      setFacilities((current) =>
        current.map((f) => (f._id === updated._id ? updated : f))
      );
      toast.success("Facility updated successfully.");
      handleCloseEditModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update facility");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteFacility = () => {
    if (!deletingFacility) return;

    void (async () => {
      setIsSaving(true);
      try {
        await facilityService.deleteFacility(deletingFacility._id);
        setFacilities((current) => current.filter((f) => f._id !== deletingFacility._id));
        toast.success("Facility deleted successfully.");
        handleCloseDeleteModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete facility");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const actions = [
    {
      key: "view" as const,
      onClick: (facility: Facility) => setViewingFacilityId(facility._id),
    },
    {
      key: "edit" as const,
      onClick: (facility: Facility) => setEditingDraft({ ...facility }),
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (facility: Facility) => setDeletingFacilityId(facility._id),
    },
  ];

  return (
    <>
      <DynamicTable<Facility>
        columns={facilityColumns}
        data={facilities}
        isLoading={isLoading}
        filtersConfig={facilityFilters}
        pageSize={5}
        searchPlaceholder="Search facilities..."
        actions={actions}
      />

      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add Facility"
        onSave={handleConfirmAddFacility}
        saveLabel="Create Facility"
        isSaving={isSaving}
      >
        {creatingDraft && (
          <div className="p-4">
            <FacilityForm
              facility={creatingDraft}
              onChange={(updated) => setCreatingDraft(updated)}
            />
          </div>
        )}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(viewingFacility)}
        onClose={handleCloseViewModal}
        title={viewingFacility ? `Facility: ${viewingFacility.name}` : "Facility Details"}
      >
        {viewingFacility ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-lg overflow-hidden border-2 border-palmPrimary bg-muted flex items-center justify-center text-3xl font-bold">
                {viewingFacility.image ? <img src={viewingFacility.image} alt={viewingFacility.name} className="h-full w-full object-cover" /> : viewingFacility.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
                <div>{viewingFacility.name}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
                <div>{viewingFacility.category}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Location</label>
                <div>{viewingFacility.location}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Capacity</label>
                <div>{viewingFacility.capacity || "N/A"}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                <div>{viewingFacility.status}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Operating Hours</label>
                <div>{viewingFacility.operatingHours || "N/A"}</div>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
              <div className="text-sm">{viewingFacility.description}</div>
            </div>
          </div>
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingFacility)}
        onClose={handleCloseEditModal}
        title={editingFacility ? `Edit ${editingFacility.name}` : "Edit Facility"}
        onSave={handleConfirmEditFacility}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingFacility && (
          <div className="p-4">
            <FacilityForm
              facility={editingDraft}
              onChange={(updated) => setEditingDraft(updated)}
            />
          </div>
        )}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(deletingFacility)}
        onClose={handleCloseDeleteModal}
        title={deletingFacility ? `Delete ${deletingFacility.name}` : "Delete Facility"}
        onSave={handleConfirmDeleteFacility}
        saveLabel="Delete Facility"
        saveVariant="danger"
        isSaving={isSaving}
      >
        {deletingFacility ? (
          <div className="p-4 text-center">
            Are you sure you want to delete <strong>{deletingFacility.name}</strong>? This action cannot be undone.
          </div>
        ) : null}
      </SharedModal>
    </>
  );
});

export default FacilitiesTableClient;
