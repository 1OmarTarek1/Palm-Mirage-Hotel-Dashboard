"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { activityBookingColumns, activityBookingFilters } from "@/config/tablePresets/activityBookingColumns";
import { fetchActivityBookings, updateActivityBooking } from "@/lib/activityBookings";
import ActivityBookingDetailsView from "./ActivityBookingDetailsView";
import ActivityBookingEditForm from "./ActivityBookingEditForm";
import { type ActivityBooking, type ActivityBookingDraft } from "./data";

export interface ActivityBookingsTableClientHandle {
  refresh: () => void;
}

function mapBookingToDraft(booking: ActivityBooking): ActivityBookingDraft {
  return {
    id: booking.id,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    cancellationReason: booking.cancellationReason,
  };
}

const ActivityBookingsTableClient = forwardRef<ActivityBookingsTableClientHandle>(
  function ActivityBookingsTableClient(_, ref) {
    const [bookings, setBookings] = useState<ActivityBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewingBookingId, setViewingBookingId] = useState<string | null>(null);
    const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
    const [editingDraft, setEditingDraft] = useState<ActivityBookingDraft | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchActivityBookings();
        setBookings(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load activity bookings");
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: () => {
        void loadBookings();
      },
    }));

    useEffect(() => {
      void loadBookings();
    }, []);

    const viewingBooking = useMemo(
      () => bookings.find((booking) => booking.id === viewingBookingId) ?? null,
      [bookings, viewingBookingId]
    );

    const editingBooking = useMemo(
      () => bookings.find((booking) => booking.id === editingBookingId) ?? null,
      [bookings, editingBookingId]
    );

    const actions = [
      {
        key: "view" as const,
        onClick: (booking: ActivityBooking) => setViewingBookingId(booking.id),
      },
      {
        key: "edit" as const,
        onClick: (booking: ActivityBooking) => {
          setEditingBookingId(booking.id);
          setEditingDraft(mapBookingToDraft(booking));
        },
      },
    ];

    const handleCloseViewModal = () => setViewingBookingId(null);
    const handleCloseEditModal = () => {
      setEditingBookingId(null);
      setEditingDraft(null);
    };

    const handleSaveBooking = () => {
      if (!editingDraft) return;

      void (async () => {
        setIsSaving(true);
        try {
          const updatedBooking = await updateActivityBooking(editingDraft);
          setBookings((current) =>
            current.map((booking) =>
              booking.id === updatedBooking.id ? updatedBooking : booking
            )
          );
          toast.success("Activity booking updated successfully.");
          handleCloseEditModal();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to update activity booking");
        } finally {
          setIsSaving(false);
        }
      })();
    };

    return (
      <>
        <DynamicTable<ActivityBooking>
          columns={activityBookingColumns}
          data={bookings}
          isLoading={isLoading}
          filtersConfig={activityBookingFilters}
          pageSize={6}
          searchPlaceholder="Search activity bookings..."
          actions={actions}
        />

        <SharedModal
          isOpen={Boolean(viewingBooking)}
          onClose={handleCloseViewModal}
          title={viewingBooking ? `${viewingBooking.activityTitle} Booking` : "Booking Details"}
        >
          {viewingBooking ? <ActivityBookingDetailsView booking={viewingBooking} /> : null}
        </SharedModal>

        <SharedModal
          isOpen={Boolean(editingBooking && editingDraft)}
          onClose={handleCloseEditModal}
          title={editingBooking ? `Update ${editingBooking.activityTitle}` : "Update Booking"}
          onSave={handleSaveBooking}
          saveLabel="Save Changes"
          isSaving={isSaving}
        >
          {editingBooking && editingDraft ? (
            <ActivityBookingEditForm booking={editingDraft} onChange={setEditingDraft} />
          ) : null}
        </SharedModal>
      </>
    );
  }
);

export default ActivityBookingsTableClient;
