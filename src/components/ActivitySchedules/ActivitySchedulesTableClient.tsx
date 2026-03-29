"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { activityScheduleColumns, activityScheduleFilters } from "@/config/tablePresets/activityScheduleColumns";
import { fetchActivities } from "@/lib/activities";
import {
  createActivitySchedule,
  deleteActivitySchedule,
  fetchActivitySchedules,
  updateActivitySchedule,
} from "@/lib/activitySchedules";
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

export interface ActivitySchedulesTableClientHandle {
  openAddModal: () => void;
}

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

const ActivitySchedulesTableClient = forwardRef<ActivitySchedulesTableClientHandle>(
  function ActivitySchedulesTableClient(_, ref) {
    const [activities, setActivities] = useState<ActivityOption[]>([]);
    const [schedules, setSchedules] = useState<ActivitySchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [creatingDraft, setCreatingDraft] = useState<ActivityScheduleDraft | null>(null);
    const [viewingScheduleId, setViewingScheduleId] = useState<string | null>(null);
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
    const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null);
    const [editingDraft, setEditingDraft] = useState<ActivityScheduleDraft | null>(null);

    useImperativeHandle(ref, () => ({
      openAddModal: () => {
        const defaultDraft = createEmptyActivityScheduleDraft();
        const firstActivity = activities[0];

        if (firstActivity) {
          defaultDraft.activityId = firstActivity.id;
          defaultDraft.capacity = firstActivity.defaultCapacity;
          defaultDraft.availableSeats = firstActivity.defaultCapacity;
        }

        setCreatingDraft(defaultDraft);
      },
    }));

    useEffect(() => {
      let isMounted = true;

      const loadData = async () => {
        try {
          setIsLoading(true);
          const [activitiesData, schedulesData] = await Promise.all([
            fetchActivities(),
            fetchActivitySchedules(),
          ]);

          if (!isMounted) return;

          setActivities(activitiesData.map(mapActivityToOption));
          setSchedules(schedulesData);
        } catch (error) {
          if (isMounted) {
            toast.error(error instanceof Error ? error.message : "Failed to load activity schedules");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      loadData();

      return () => {
        isMounted = false;
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

    const handleCloseViewModal = () => setViewingScheduleId(null);
    const handleCloseAddModal = () => setCreatingDraft(null);
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
        try {
          const createdSchedule = await createActivitySchedule(creatingDraft);
          setSchedules((current) => [createdSchedule, ...current]);
          toast.success("Activity schedule created successfully.");
          handleCloseAddModal();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to create activity schedule");
        }
      })();
    };

    const handleSaveSchedule = () => {
      if (!editingDraft) return;

      void (async () => {
        try {
          const updatedSchedule = await updateActivitySchedule(editingDraft);
          setSchedules((current) =>
            current.map((schedule) =>
              schedule.id === updatedSchedule.id ? updatedSchedule : schedule
            )
          );
          toast.success("Activity schedule updated successfully.");
          handleCloseEditModal();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to update activity schedule");
        }
      })();
    };

    const handleDeleteSchedule = () => {
      if (!deletingSchedule) return;

      void (async () => {
        try {
          await deleteActivitySchedule(deletingSchedule.id);
          setSchedules((current) =>
            current.filter((schedule) => schedule.id !== deletingSchedule.id)
          );
          toast.success("Activity schedule deleted successfully.");
          handleCloseDeleteModal();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to delete activity schedule");
        }
      })();
    };

    return (
      <>
        <DynamicTable<ActivitySchedule>
          columns={activityScheduleColumns}
          data={schedules}
          isLoading={isLoading}
          filtersConfig={activityScheduleFilters}
          pageSize={6}
          searchPlaceholder="Search schedules..."
          actions={actions}
        />

        <SharedModal
          isOpen={Boolean(creatingDraft)}
          onClose={handleCloseAddModal}
          title="Add Activity Schedule"
          onSave={handleCreateSchedule}
          saveLabel="Create Schedule"
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
        >
          {deletingSchedule ? <ActivityScheduleDeleteConfirm schedule={deletingSchedule} /> : null}
        </SharedModal>
      </>
    );
  }
);

export default ActivitySchedulesTableClient;
