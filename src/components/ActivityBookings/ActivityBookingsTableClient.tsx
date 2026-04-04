"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { activityBookingColumns, activityBookingFilters } from "@/config/tablePresets/activityBookingColumns";
import { fetchActivityBookings, updateActivityBooking } from "@/lib/activityBookings";
import { useDashboardAlerts } from "@/components/shared/alerts/dashboard-alerts-context";
import { buildActivityBookingAlerts } from "./ActivityBookingsAlerts";
import ActivityBookingDetailsView from "./ActivityBookingDetailsView";
import ActivityBookingEditForm from "./ActivityBookingEditForm";
import ActivityBookingsOverview from "./ActivityBookingsOverview";
import { type ActivityBooking, type ActivityBookingDraft } from "./data";

function mapBookingToDraft(booking: ActivityBooking): ActivityBookingDraft {
  return {
    id: booking.id,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    cancellationReason: booking.cancellationReason,
  };
}

function ActivityBookingsTableClient() {
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

  const bookingOverview = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const isToday = (value?: string) => Boolean(value) && value?.slice(0, 10) === todayKey;

    const sessionsToday = bookings.filter((booking) => isToday(booking.bookingDate)).length;
    const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
    const unpaidBookings = bookings.filter((booking) => booking.paymentStatus === "unpaid").length;
    const confirmedGuests = bookings
      .filter((booking) => booking.status === "confirmed")
      .reduce((sum, booking) => sum + booking.guests, 0);
    const cancelledBookings = bookings.filter((booking) =>
      ["cancelled", "rejected"].includes(booking.status)
    ).length;
    const highAttendanceBookings = bookings.filter((booking) => booking.guests >= 4).length;
    const projectedRevenue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(bookings.reduce((sum, booking) => sum + booking.totalPrice, 0));

    return {
      sessionsToday,
      pendingBookings,
      unpaidBookings,
      confirmedGuests,
      cancelledBookings,
      highAttendanceBookings,
      projectedRevenue,
    };
  }, [bookings]);

  const pageAlerts = useMemo(
    () => ({
      title: "Activity Alerts",
      description: "Quick attention items for the recreation and guest-experience teams.",
      alerts: buildActivityBookingAlerts({
        sessionsToday: bookingOverview.sessionsToday,
        pendingBookings: bookingOverview.pendingBookings,
        unpaidBookings: bookingOverview.unpaidBookings,
        highAttendanceBookings: bookingOverview.highAttendanceBookings,
        cancelledBookings: bookingOverview.cancelledBookings,
      }),
    }),
    [bookingOverview]
  );

  useDashboardAlerts(pageAlerts);

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
      <div className="space-y-6">
        <ActivityBookingsOverview
          sessionsToday={bookingOverview.sessionsToday}
          pendingBookings={bookingOverview.pendingBookings}
          unpaidBookings={bookingOverview.unpaidBookings}
          confirmedGuests={bookingOverview.confirmedGuests}
          cancelledBookings={bookingOverview.cancelledBookings}
          projectedRevenue={bookingOverview.projectedRevenue}
          isLoading={isLoading}
        />

        <DashboardSectionCard>
          <DynamicTable<ActivityBooking>
            columns={activityBookingColumns}
            data={bookings}
            isLoading={isLoading}
            filtersConfig={activityBookingFilters}
            pageSize={6}
            searchPlaceholder="Search activity bookings..."
            actions={actions}
          />
        </DashboardSectionCard>
      </div>

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

export default ActivityBookingsTableClient;
