"use client";

import React, { useMemo, useState } from "react";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { activityColumns, activityFilters } from "@/config/tablePresets/activityColumns";
import { deleteActivity, fetchActivities, updateActivity } from "@/lib/activities";
import type { Activity } from "./data";
import ActivityDeleteConfirm from "./ActivityDeleteConfirm";
import ActivityDetailsView from "./ActivityDetailsView";
import ActivityEditForm from "./ActivityEditForm";

export default function ActivitiesTableClient() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [viewingActivityId, setViewingActivityId] = useState<string | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Activity | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await fetchActivities();
        if (isMounted) {
          setActivities(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load activities");
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
  const handleCloseEditModal = () => {
    setEditingActivityId(null);
    setEditingDraft(null);
  };
  const handleCloseDeleteModal = () => setDeletingActivityId(null);

  const handleConfirmDeleteActivity = () => {
    if (!deletingActivity) return;

    void (async () => {
      try {
        await deleteActivity(deletingActivity.id);
        setActivities((currentActivities) =>
          currentActivities.filter((activity) => activity.id !== deletingActivity.id)
        );

        if (viewingActivityId === deletingActivity.id) {
          handleCloseViewModal();
        }

        if (editingActivityId === deletingActivity.id) {
          handleCloseEditModal();
        }

        handleCloseDeleteModal();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to delete activity");
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
      try {
        const updatedActivity = await updateActivity(editingDraft);
        setActivities((currentActivities) =>
          currentActivities.map((activity) =>
            activity.id === updatedActivity.id ? updatedActivity : activity
          )
        );
        handleCloseEditModal();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to save activity");
      }
    })();
  };

  return (
    <>
      {errorMessage ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {errorMessage}
        </div>
      ) : null}

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
      >
        {deletingActivity ? <ActivityDeleteConfirm activity={deletingActivity} /> : null}
      </SharedModal>
    </>
  );
}
