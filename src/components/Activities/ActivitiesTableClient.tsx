"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleDollarSign, Compass, ListChecks, Users } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import type { TableQueryState } from "@/components/shared/table/types";
import TableOverview from "@/components/shared/table/TableOverview";
import SharedModal from "@/components/shared/modal/SharedModal";
import { activityColumns, activityFilters } from "@/config/tablePresets/activityColumns";
import { createActivity, deleteActivity, fetchActivities, fetchActivitiesPage, updateActivity } from "@/lib/activities";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { queryKeys } from "@/lib/queryKeys";
import ActivityAddForm from "./ActivityAddForm";
import { createEmptyActivityDraft, type Activity } from "./data";
import ActivityDeleteConfirm from "./ActivityDeleteConfirm";
import ActivityDetailsView from "./ActivityDetailsView";
import ActivityEditForm from "./ActivityEditForm";

function ActivitiesTableClient() {
  const queryClient = useQueryClient();
  const [tableQuery, setTableQuery] = useState<TableQueryState<Activity>>({
    page: 1,
    pageSize: 5,
    search: "",
    filters: {},
    sort: null,
  });
  const { data: activitiesResponse, isLoading } = useQuery({
    queryKey: [...queryKeys.activities.list, tableQuery],
    queryFn: () =>
      fetchActivitiesPage({
        page: tableQuery.page,
        limit: tableQuery.pageSize,
        search: tableQuery.search || undefined,
        category: typeof tableQuery.filters.category === "string" ? tableQuery.filters.category : undefined,
        sort:
          tableQuery.sort?.key === "title"
            ? tableQuery.sort.direction === "asc"
              ? "title_asc"
              : "title_desc"
            : tableQuery.sort?.key === "createdAt"
              ? tableQuery.sort.direction === "asc"
                ? "oldest"
                : "newest"
              : undefined,
      }),
    staleTime: 45_000,
  });
  const { data: allActivities = [] } = useQuery({
    queryKey: [...queryKeys.activities.all, "overview"],
    queryFn: fetchActivities,
    staleTime: 45_000,
  });
  const activities = activitiesResponse?.items ?? [];
  const totalActivities = activitiesResponse?.pagination.total ?? 0;
  const [creatingDraft, setCreatingDraft] = useState<Activity | null>(null);
  const [viewingActivityId, setViewingActivityId] = useState<string | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Activity | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const openAddModal = () => {
      setCreatingDraft((current) => current ?? createEmptyActivityDraft());
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.activitiesAdd, openAddModal);

    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.activitiesAdd, openAddModal);
    };
  }, []);

  const viewingActivity = useMemo(
    () => activities.find((activity) => activity.id === viewingActivityId) ?? null,
    [activities, viewingActivityId]
  );

  const editingActivity = useMemo(
    () => activities.find((activity) => activity.id === editingActivityId) ?? null,
    [activities, editingActivityId]
  );

  const deletingActivity = useMemo(
    () => activities.find((activity) => activity.id === deletingActivityId) ?? null,
    [activities, deletingActivityId]
  );

  const overviewItems = useMemo(() => {
    const activeActivities = allActivities.filter((activity) => activity.isActive).length;
    const averageCapacity = totalActivities > 0
      ? Math.round(allActivities.reduce((sum, activity) => sum + activity.defaultCapacity, 0) / totalActivities)
      : 0;
    const averagePrice = totalActivities > 0
      ? Math.round(allActivities.reduce((sum, activity) => sum + activity.basePrice, 0) / totalActivities)
      : 0;

    return [
      {
        key: "activities",
        label: "Experiences listed",
        value: totalActivities,
        helper: "Activities currently managed here",
        icon: Compass,
      },
      {
        key: "active",
        label: "Active now",
        value: activeActivities,
        helper: "Experiences open for selling and scheduling",
        icon: ListChecks,
      },
      {
        key: "capacity",
        label: "Avg. capacity",
        value: averageCapacity,
        helper: "Typical seats configured per session",
        icon: Users,
        tone: "secondary" as const,
      },
      {
        key: "price",
        label: "Avg. base price",
        value: `$${averagePrice.toLocaleString()}`,
        helper: "Average visible starting price across experiences",
        icon: CircleDollarSign,
      },
    ];
  }, [allActivities, totalActivities]);

  const handleCloseViewModal = () => setViewingActivityId(null);
  const handleCloseAddModal = () => {
    setCreatingDraft(null);
  };
  const handleCloseEditModal = () => {
    setEditingActivityId(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingActivityId(null);

  const handleConfirmDeleteActivity = () => {
    if (!deletingActivity) return;

    void (async () => {
      setIsSaving(true);
      try {
        await deleteActivity(deletingActivity.id);
        await queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.activitySchedules.all });
        toast.success("Activity deleted successfully.");

        if (viewingActivityId === deletingActivity.id) {
          handleCloseViewModal();
        }

        if (editingActivityId === deletingActivity.id) {
          handleCloseEditModal();
        }

        handleCloseDeleteModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete activity");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const actions = [
    {
      key: "view" as const,
      onClick: (activity: Activity) => setViewingActivityId(activity.id),
    },
    {
      key: "edit" as const,
      onClick: (activity: Activity) => {
        setEditingActivityId(activity.id);
        setEditingDraft(activity);
      },
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (activity: Activity) => setDeletingActivityId(activity.id),
    },
  ];

  const handleSaveActivity = () => {
    if (!editingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        await updateActivity(editingDraft);
        await queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.activitySchedules.all });
        toast.success("Activity updated successfully.");
        handleCloseEditModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save activity");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleCreateActivity = () => {
    if (!creatingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        await createActivity(creatingDraft);
        await queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.activitySchedules.all });
        toast.success("Activity created successfully.");
        handleCloseAddModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create activity");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <>
      <div className="mb-5 md:mb-6">
        <TableOverview items={overviewItems} isLoading={isLoading} />
      </div>

      <DashboardSectionCard>
        <DynamicTable<Activity>
          columns={activityColumns}
          data={activities}
          isLoading={isLoading}
          filtersConfig={activityFilters}
          pageSize={5}
          mode="server"
          totalEntries={totalActivities}
          onQueryChange={setTableQuery}
          searchPlaceholder="Search experiences..."
          actions={actions}
        />
      </DashboardSectionCard>

      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add Activity"
        onSave={handleCreateActivity}
        saveLabel="Create Activity"
        isSaving={isSaving}
      >
        {creatingDraft ? (
          <ActivityAddForm
            activity={creatingDraft}
            onChange={setCreatingDraft}
          />
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(viewingActivity)}
        onClose={handleCloseViewModal}
        title={viewingActivity ? viewingActivity.title : "Activity Details"}
      >
        {viewingActivity ? <ActivityDetailsView activity={viewingActivity} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingActivity)}
        onClose={handleCloseEditModal}
        title={editingActivity ? `Edit ${editingActivity.title}` : "Edit Activity"}
        onSave={handleSaveActivity}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingActivity && editingDraft ? (
          <ActivityEditForm
            activity={editingDraft}
            onChange={setEditingDraft}
          />
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(deletingActivity)}
        onClose={handleCloseDeleteModal}
        title={deletingActivity ? `Delete ${deletingActivity.title}` : "Delete Activity"}
        onSave={handleConfirmDeleteActivity}
        saveLabel="Delete Activity"
        saveVariant="danger"
        isSaving={isSaving}
      >
        {deletingActivity ? <ActivityDeleteConfirm activity={deletingActivity} /> : null}
      </SharedModal>
    </>
  );
}

export default ActivitiesTableClient;
