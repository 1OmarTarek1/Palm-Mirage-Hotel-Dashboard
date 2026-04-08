"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, Building2, Users, Wrench } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import TableOverview from "@/components/shared/table/TableOverview";
import SharedModal from "@/components/shared/modal/SharedModal";
import { facilityColumns, facilityFilters } from "@/config/tablePresets/facilityColumns";
import {
  createFacility,
  deleteFacility,
  fetchFacilities,
  fetchFacilitiesPage,
  updateFacility,
} from "@/lib/facilities";
import { useServerTableData } from "@/hooks/useServerTableData";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { queryKeys } from "@/lib/queryKeys";
import { createEmptyFacilityDraft } from "./data";
import { Facility } from "@/types/facility";
import FacilityForm from "./FacilityForm";

function FacilitiesTableClient() {
  const queryClient = useQueryClient();
  const {
    setTableQuery,
    pageItems: facilities,
    overviewItems: allFacilities,
    totalEntries: totalFacilitiesCount,
    isLoading,
  } = useServerTableData<Facility>({
    queryKeyBase: queryKeys.facilities.all,
    initialPageSize: 5,
    fetchPage: (query) =>
      fetchFacilitiesPage({
        page: query.page,
        limit: query.pageSize,
        search: query.search || undefined,
        status: typeof query.filters.status === "string" ? query.filters.status : undefined,
        category:
          typeof query.filters.category === "string" ? query.filters.category : undefined,
        sort:
          query.sort?.key === "name"
            ? query.sort.direction === "asc"
              ? "name_asc"
              : "name_desc"
            : query.sort?.key === "updatedAt"
              ? query.sort.direction === "asc"
                ? "oldest"
                : "newest"
              : "newest",
      }),
    fetchOverview: fetchFacilities,
    staleTime: 45_000,
  });
  const [creatingDraft, setCreatingDraft] = useState<Facility | null>(null);
  const [viewingFacilityId, setViewingFacilityId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Facility | null>(null);
  const [deletingFacilityId, setDeletingFacilityId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const openAddModal = () => {
      setCreatingDraft((current) => current ?? createEmptyFacilityDraft());
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.facilitiesAdd, openAddModal);

    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.facilitiesAdd, openAddModal);
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

  const overviewItems = useMemo(() => {
    const totalFacilities = totalFacilitiesCount;
    const activeFacilities = allFacilities.filter((facility) => facility.status === "Available").length;
    const maintenanceFacilities = allFacilities.filter((facility) => facility.status === "Maintenance").length;
    const totalCapacity = allFacilities.reduce((sum, facility) => sum + (facility.capacity ?? 0), 0);

    return [
      {
        key: "total",
        label: "Facilities listed",
        value: totalFacilities,
        helper: "Visible spaces managed from this table",
        icon: Building2,
      },
      {
        key: "available",
        label: "Available now",
        value: activeFacilities,
        helper: "Facilities ready for guest use",
        icon: Activity,
      },
      {
        key: "maintenance",
        label: "Need follow-up",
        value: maintenanceFacilities,
        helper: "Facilities currently in maintenance",
        icon: Wrench,
        tone: maintenanceFacilities > 0 ? "destructive" as const : "secondary" as const,
      },
      {
        key: "capacity",
        label: "Known capacity",
        value: totalCapacity,
        helper: "Combined guests across configured facilities",
        icon: Users,
        tone: "secondary" as const,
      },
    ];
  }, [allFacilities, totalFacilitiesCount]);

  const handleCloseViewModal = () => setViewingFacilityId(null);
  const handleCloseAddModal = () => {
    setCreatingDraft(null);
  };
  const handleCloseEditModal = () => setEditingDraft(null);
  const handleCloseDeleteModal = () => setDeletingFacilityId(null);

  const handleConfirmAddFacility = async () => {
    if (!creatingDraft) return;
    setIsSaving(true);
    try {
      await createFacility(creatingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all });
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
      await updateFacility(editingFacility._id, editingFacility);
      await queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all });
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
        await deleteFacility(deletingFacility._id);
        await queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all });
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
      <div className="mb-5 md:mb-6">
        <TableOverview items={overviewItems} isLoading={isLoading} />
      </div>

      <DashboardSectionCard>
        <DynamicTable<Facility>
          columns={facilityColumns}
          data={facilities}
          isLoading={isLoading}
          filtersConfig={facilityFilters}
          pageSize={5}
          mode="server"
          totalEntries={totalFacilitiesCount}
          onQueryChange={setTableQuery}
          searchPlaceholder="Search facilities..."
          actions={actions}
        />
      </DashboardSectionCard>

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
              usedIcons={facilities.map((f) => f.icon).filter(Boolean) as string[]}
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
                {viewingFacility.image ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={viewingFacility.image}
                      alt={viewingFacility.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : viewingFacility.name.charAt(0).toUpperCase()}
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
              usedIcons={facilities
                .filter((f) => f._id !== editingFacility._id)
                .map((f) => f.icon)
                .filter(Boolean) as string[]}
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
}

export default FacilitiesTableClient;
