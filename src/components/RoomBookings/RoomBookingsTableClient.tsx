"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { roomBookingColumns, roomBookingFilters } from "@/config/tablePresets/roomBookingColumns";
import { fetchRoomBookings, updateRoomBooking } from "@/lib/room-bookings";
import { useDashboardAlerts } from "@/components/shared/alerts/dashboard-alerts-context";
import type { RoomBooking, RoomBookingDraft } from "./data";
import { buildRoomBookingAlerts } from "./RoomBookingsAlerts";
import RoomBookingDetailsView from "./RoomBookingDetailsView";
import RoomBookingEditForm from "./RoomBookingEditForm";
import RoomBookingsOverview from "./RoomBookingsOverview";

function mapBookingToDraft(booking: RoomBooking): RoomBookingDraft {
  return {
    id: booking.id,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    cancellationReason: booking.cancellationReason,
  };
}

function RoomBookingsTableClient() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingBookingId, setViewingBookingId] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<RoomBookingDraft | null>(null);
  const [isSaving, setIsLoadingSaving] = useState(false);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRoomBookings();
      setBookings(data);
    } catch (error) {
      console.error("RoomBookings load error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load room bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  const viewingBooking = useMemo(
    () => bookings.find((b) => b.id === viewingBookingId) ?? null,
    [bookings, viewingBookingId]
  );

  const editingBooking = useMemo(
    () => bookings.find((b) => b.id === editingBookingId) ?? null,
    [bookings, editingBookingId]
  );

  const bookingOverview = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const isSameDay = (value?: string) => Boolean(value) && value?.slice(0, 10) === todayKey;

    const arrivalsToday = bookings.filter((booking) => isSameDay(booking.checkInDate)).length;
    const departuresToday = bookings.filter((booking) => isSameDay(booking.checkOutDate)).length;
    const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
    const unpaidBookings = bookings.filter((booking) => booking.paymentStatus === "unpaid").length;
    const checkedInGuests = bookings.filter((booking) => booking.status === "checked-in").length;
    const noShowBookings = bookings.filter((booking) => booking.status === "no-show").length;
    const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled").length;
    const totalRevenue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(bookings.reduce((sum, booking) => sum + booking.totalPrice, 0));

    return {
      arrivalsToday,
      departuresToday,
      pendingBookings,
      unpaidBookings,
      checkedInGuests,
      noShowBookings,
      cancelledBookings,
      totalRevenue,
    };
  }, [bookings]);

  const pageAlerts = useMemo(
    () => ({
      title: "Booking Alerts",
      description: "Quick attention items for the reservations and front-office teams.",
      alerts: buildRoomBookingAlerts({
        pendingBookings: bookingOverview.pendingBookings,
        unpaidBookings: bookingOverview.unpaidBookings,
        noShowBookings: bookingOverview.noShowBookings,
        cancelledBookings: bookingOverview.cancelledBookings,
      }),
    }),
    [bookingOverview]
  );

  useDashboardAlerts(pageAlerts);

  const actions = [
    {
      key: "view" as const,
      onClick: (booking: RoomBooking) => setViewingBookingId(booking.id),
    },
    {
      key: "edit" as const,
      onClick: (booking: RoomBooking) => {
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

  const handleSaveBooking = async () => {
    if (!editingDraft) return;
    setIsLoadingSaving(true);
    try {
      const updatedBooking = await updateRoomBooking(editingDraft);
      setBookings((current) =>
        current.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
      );
      toast.success("Room booking updated successfully.");
      handleCloseEditModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update room booking");
    } finally {
      setIsLoadingSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <RoomBookingsOverview
          arrivalsToday={bookingOverview.arrivalsToday}
          departuresToday={bookingOverview.departuresToday}
          pendingBookings={bookingOverview.pendingBookings}
          unpaidBookings={bookingOverview.unpaidBookings}
          checkedInGuests={bookingOverview.checkedInGuests}
          totalRevenue={bookingOverview.totalRevenue}
          isLoading={isLoading}
        />

        <DashboardSectionCard>
          <DynamicTable<RoomBooking>
            columns={roomBookingColumns}
            data={bookings}
            isLoading={isLoading}
            filtersConfig={roomBookingFilters}
            pageSize={6}
            searchPlaceholder="Search room bookings..."
            actions={actions}
          />
        </DashboardSectionCard>
      </div>

      <SharedModal
        isOpen={Boolean(viewingBooking)}
        onClose={handleCloseViewModal}
        title={viewingBooking ? `Booking for Room ${viewingBooking.roomNumber}` : "Booking Details"}
      >
        {viewingBooking ? <RoomBookingDetailsView booking={viewingBooking} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingBooking && editingDraft)}
        onClose={handleCloseEditModal}
        title={editingBooking ? `Update Booking for Room ${editingBooking.roomNumber}` : "Update Booking"}
        onSave={handleSaveBooking}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingBooking && editingDraft ? (
          <RoomBookingEditForm booking={editingDraft} onChange={setEditingDraft} />
        ) : null}
      </SharedModal>
    </>
  );
}

export default RoomBookingsTableClient;
