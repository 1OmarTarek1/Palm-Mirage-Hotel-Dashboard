"use client";

import React, { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { activityColumns, activityFilters } from "@/config/tablePresets/activityColumns";
import { createActivity, deleteActivity, fetchActivities, updateActivity } from "@/lib/activities";
import ActivityAddForm from "./ActivityAddForm";
import { createEmptyActivityDraft, type Activity } from "./data";
import ActivityDeleteConfirm from "./ActivityDeleteConfirm";
import ActivityDetailsView from "./ActivityDetailsView";
import ActivityEditForm from "./ActivityEditForm";

export interface ActivitiesTableClientHandle {
  openAddModal: () => void;
}

const ActivitiesTableClient = forwardRef<ActivitiesTableClientHandle>(function ActivitiesTableClient(_, ref) {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [creatingDraft, setCreatingDraft] = useState<Activity | null>(null);
  const [viewingActivityId, setViewingActivityId] = useState<string | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Activity | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setCreatingDraft(createEmptyActivityDraft());
    },
  }));

  React.useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const data = await fetchActivities();
        if (isMounted) {
          setActivities(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : "Failed to load activities");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
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

  const handleCloseViewModal = () => setViewingActivityId(null);
  const handleCloseAddModal = () => setCreatingDraft(null);
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
        setActivities((currentActivities) =>
          currentActivities.filter((activity) => activity.id !== deletingActivity.id)
        );
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
        const updatedActivity = await updateActivity(editingDraft);
        setActivities((currentActivities) =>
          currentActivities.map((activity) =>
            activity.id === updatedActivity.id ? updatedActivity : activity
          )
        );
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
        const refreshedActivities = await createActivity(creatingDraft);
        setActivities(refreshedActivities);
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
      <DynamicTable<Activity>
        columns={activityColumns}
        data={activities}
        isLoading={isLoading}
        filtersConfig={activityFilters}
        pageSize={5}
        searchPlaceholder="Search experiences..."
        actions={actions}
      />

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
});

export default ActivitiesTableClient;
