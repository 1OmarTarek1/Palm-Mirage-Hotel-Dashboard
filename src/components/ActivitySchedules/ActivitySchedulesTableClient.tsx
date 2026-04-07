"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, CircleDollarSign, Clock3, Users } from "lucide-react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import TableOverview from "@/components/shared/table/TableOverview";
import SharedModal from "@/components/shared/modal/SharedModal";
import { activityScheduleColumns, activityScheduleFilters } from "@/config/tablePresets/activityScheduleColumns";
import { fetchActivities } from "@/lib/activities";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { queryKeys } from "@/lib/queryKeys";
import {
  createActivitySchedule,
  deleteActivitySchedule,
  fetchActivitySchedules,
  fetchActivitySchedulesPage,
  updateActivitySchedule,
} from "@/lib/activitySchedules";
import { useServerTableData } from "@/hooks/useServerTableData";
import ActivityScheduleAddForm from "./ActivityScheduleAddForm";
import ActivityScheduleDeleteConfirm from "./ActivityScheduleDeleteConfirm";
import ActivityScheduleDetailsView from "./ActivityScheduleDetailsView";
import ActivityScheduleEditForm from "./ActivityScheduleEditForm";
import {
  createEmptyActivityScheduleDraft,
  type ActivityOption,
  type ActivitySchedule,
  type ActivityScheduleDraft,
} from "./data";

function mapActivityToOption(activity: Awaited<ReturnType<typeof fetchActivities>>[number]): ActivityOption {
  return {
    id: activity.id,
    title: activity.title,
    label: activity.label,
    category: activity.category,
    basePrice: activity.basePrice,
    pricingType: activity.pricingType,
    defaultCapacity: activity.defaultCapacity,
    location: activity.location,
  };
}

function mapScheduleToDraft(schedule: ActivitySchedule): ActivityScheduleDraft {
  return {
    id: schedule.id,
    activityId: schedule.activityId,
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    capacity: schedule.capacity,
    availableSeats: schedule.availableSeats,
    priceOverride: schedule.priceOverride,
    status: schedule.status,
    notes: schedule.notes,
  };
}

function ActivitySchedulesTableClient() {
  const queryClient = useQueryClient();
  const activitiesQuery = useQuery({
    queryKey: queryKeys.activities.list,
    queryFn: fetchActivities,
    staleTime: 45_000,
  });
  const {
    setTableQuery,
    pageItems: schedules,
    overviewItems: allSchedules,
    totalEntries: totalSchedules,
    isLoading: schedulesLoading,
  } = useServerTableData<ActivitySchedule>({
    queryKeyBase: queryKeys.activitySchedules.all,
    initialPageSize: 6,
    fetchPage: (query) =>
      fetchActivitySchedulesPage({
        page: query.page,
        limit: query.pageSize,
        search: query.search || undefined,
        status: typeof query.filters.status === "string" ? query.filters.status : undefined,
        sort: query.sort?.key === "date"
          ? query.sort.direction === "asc"
            ? "date_asc"
            : "date_desc"
          : query.sort?.key === "createdAt"
            ? query.sort.direction === "asc"
              ? "oldest"
              : "newest"
            : undefined,
      }),
    fetchOverview: fetchActivitySchedules,
    staleTime: 20_000,
  });
  const activities = useMemo(
    () => (activitiesQuery.data ?? []).map(mapActivityToOption),
    [activitiesQuery.data]
  );
  const isLoading = activitiesQuery.isLoading || schedulesLoading;
  const [creatingDraft, setCreatingDraft] = useState<ActivityScheduleDraft | null>(null);
  const [viewingScheduleId, setViewingScheduleId] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<ActivityScheduleDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shouldOpenAddModal, setShouldOpenAddModal] = useState(false);

  useEffect(() => {
    if (!shouldOpenAddModal || isLoading) {
      setCreatingDraft(null);
      return;
    }

    const defaultDraft = createEmptyActivityScheduleDraft();
    const firstActivity = activities[0];

    if (firstActivity) {
      defaultDraft.activityId = firstActivity.id;
      defaultDraft.capacity = firstActivity.defaultCapacity;
      defaultDraft.availableSeats = firstActivity.defaultCapacity;
    }

    setCreatingDraft((current) => current ?? defaultDraft);
  }, [activities, isLoading, shouldOpenAddModal]);

  useEffect(() => {
    const openAddModal = () => {
      setShouldOpenAddModal(true);
    };

    window.addEventListener(DASHBOARD_MODAL_EVENTS.activitySchedulesAdd, openAddModal);

    return () => {
      window.removeEventListener(DASHBOARD_MODAL_EVENTS.activitySchedulesAdd, openAddModal);
    };
  }, []);

  const viewingSchedule = useMemo(
    () => schedules.find((schedule) => schedule.id === viewingScheduleId) ?? null,
    [schedules, viewingScheduleId]
  );

  const editingSchedule = useMemo(
    () => schedules.find((schedule) => schedule.id === editingScheduleId) ?? null,
    [schedules, editingScheduleId]
  );

  const deletingSchedule = useMemo(
    () => schedules.find((schedule) => schedule.id === deletingScheduleId) ?? null,
    [schedules, deletingScheduleId]
  );

  const overviewItems = useMemo(() => {
    const totalSchedulesAll = allSchedules.length;
    const upcomingSchedules = allSchedules.filter((schedule) => schedule.status === "scheduled").length;
    const totalOpenSeats = allSchedules.reduce((sum, schedule) => sum + schedule.availableSeats, 0);
    const averagePrice = totalSchedulesAll > 0
      ? Math.round(allSchedules.reduce((sum, schedule) => sum + schedule.resolvedPrice, 0) / totalSchedulesAll)
      : 0;

    return [
      {
        key: "schedules",
        label: "Sessions listed",
        value: totalSchedulesAll,
        helper: "Total schedules across all pages",
        icon: CalendarClock,
      },
      {
        key: "upcoming",
        label: "Scheduled next",
        value: upcomingSchedules,
        helper: "Sessions still active and awaiting attendance",
        icon: Clock3,
      },
      {
        key: "seats",
        label: "Open seats",
        value: totalOpenSeats,
        helper: "Remaining capacity across the listed sessions",
        icon: Users,
        tone: "secondary" as const,
      },
      {
        key: "price",
        label: "Avg. session price",
        value: `$${averagePrice.toLocaleString()}`,
        helper: "Average resolved selling price per scheduled session",
        icon: CircleDollarSign,
      },
    ];
  }, [allSchedules]);

  const handleCloseViewModal = () => setViewingScheduleId(null);
  const handleCloseAddModal = () => {
    setShouldOpenAddModal(false);
    setCreatingDraft(null);
  };
  const handleCloseEditModal = () => {
    setEditingScheduleId(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingScheduleId(null);

  const actions = [
    {
      key: "view" as const,
      onClick: (schedule: ActivitySchedule) => setViewingScheduleId(schedule.id),
    },
    {
      key: "edit" as const,
      onClick: (schedule: ActivitySchedule) => {
        setEditingScheduleId(schedule.id);
        setEditingDraft(mapScheduleToDraft(schedule));
      },
    },
    {
      key: "delete" as const,
      variant: "danger" as const,
      onClick: (schedule: ActivitySchedule) => setDeletingScheduleId(schedule.id),
    },
  ];

  const handleCreateSchedule = () => {
    if (!creatingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        await createActivitySchedule(creatingDraft);
        await queryClient.invalidateQueries({ queryKey: queryKeys.activitySchedules.all });
        toast.success("Activity schedule created successfully.");
        handleCloseAddModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create activity schedule");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleSaveSchedule = () => {
    if (!editingDraft) return;

    void (async () => {
      setIsSaving(true);
      try {
        await updateActivitySchedule(editingDraft);
        await queryClient.invalidateQueries({ queryKey: queryKeys.activitySchedules.all });
        toast.success("Activity schedule updated successfully.");
        handleCloseEditModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update activity schedule");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleDeleteSchedule = () => {
    if (!deletingSchedule) return;

    void (async () => {
      setIsSaving(true);
      try {
        await deleteActivitySchedule(deletingSchedule.id);
        await queryClient.invalidateQueries({ queryKey: queryKeys.activitySchedules.all });
        toast.success("Activity schedule deleted successfully.");
        handleCloseDeleteModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete activity schedule");
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
        <DynamicTable<ActivitySchedule>
          columns={activityScheduleColumns}
          data={schedules}
          isLoading={isLoading}
          filtersConfig={activityScheduleFilters}
          pageSize={8}
          mode="server"
          totalEntries={totalSchedules}
          onQueryChange={setTableQuery}
          searchPlaceholder="Search schedules..."
          actions={actions}
        />
      </DashboardSectionCard>

      <SharedModal
        isOpen={Boolean(creatingDraft)}
        onClose={handleCloseAddModal}
        title="Add Activity Schedule"
        onSave={handleCreateSchedule}
        saveLabel="Create Schedule"
        isSaving={isSaving}
      >
        {creatingDraft ? (
          <ActivityScheduleAddForm
            schedule={creatingDraft}
            activities={activities}
            onChange={setCreatingDraft}
          />
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(viewingSchedule)}
        onClose={handleCloseViewModal}
        title={viewingSchedule ? `${viewingSchedule.activityTitle} Session` : "Schedule Details"}
      >
        {viewingSchedule ? <ActivityScheduleDetailsView schedule={viewingSchedule} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingSchedule && editingDraft)}
        onClose={handleCloseEditModal}
        title={editingSchedule ? `Edit ${editingSchedule.activityTitle}` : "Edit Activity Schedule"}
        onSave={handleSaveSchedule}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingSchedule && editingDraft ? (
          <ActivityScheduleEditForm
            schedule={editingDraft}
            activities={activities}
            isEditing
            onChange={setEditingDraft}
          />
        ) : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(deletingSchedule)}
        onClose={handleCloseDeleteModal}
        title={deletingSchedule ? `Delete ${deletingSchedule.activityTitle}` : "Delete Activity Schedule"}
        onSave={handleDeleteSchedule}
        saveLabel="Delete Schedule"
        saveVariant="danger"
        isSaving={isSaving}
      >
        {deletingSchedule ? <ActivityScheduleDeleteConfirm schedule={deletingSchedule} /> : null}
      </SharedModal>
    </>
  );
}

export default ActivitySchedulesTableClient;
