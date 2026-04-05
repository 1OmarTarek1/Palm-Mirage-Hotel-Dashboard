"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import SharedModal from "@/components/shared/modal/SharedModal";
import DynamicTable from "@/components/shared/table/DynamicTable";
import { useDashboardAlerts } from "@/components/shared/alerts/dashboard-alerts-context";
import { useDashboardRealtime } from "@/hooks/useDashboardRealtime";
import { restaurantBookingColumns, restaurantBookingFilters } from "@/config/tablePresets/restaurantBookingColumns";
import { fetchRestaurantBookings, updateRestaurantBooking } from "@/lib/restaurant-bookings";

import RestaurantBookingDetailsView from "./RestaurantBookingDetailsView";
import RestaurantBookingEditForm from "./RestaurantBookingEditForm";
import { buildRestaurantBookingAlerts } from "./RestaurantBookingsAlerts";
import RestaurantBookingsOverview from "./RestaurantBookingsOverview";
import type { RestaurantBooking, RestaurantBookingDraft } from "./data";

function mapBookingToDraft(booking: RestaurantBooking): RestaurantBookingDraft {
  return {
    id: booking.id,
    status: booking.status,
  };
}

export default function RestaurantBookingsTableClient() {
  const [bookings, setBookings] = useState<RestaurantBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingBookingId, setViewingBookingId] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<RestaurantBookingDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadBookings = async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const data = await fetchRestaurantBookings();
      setBookings(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load restaurant bookings");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadBookings();
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  useDashboardRealtime({
    enabled: true,
    onBookingUpdate: (payload) => {
      if (payload?.resource && payload.resource !== "restaurant") {
        return;
      }

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        void loadBookings({ silent: true });
      }, 250);
    },
  });

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

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
    const assignedTables = bookings.filter((booking) => booking.tableNumber !== null).length;
    const totalGuests = bookings.reduce((sum, booking) => sum + booking.guests, 0);
    const unassignedBookings = bookings.filter((booking) => booking.tableNumber === null).length;
    const largePartyBookings = bookings.filter((booking) => booking.guests >= 5).length;
    const completedToday = bookings.filter(
      (booking) => booking.status === "completed" && booking.bookingDate === todayKey
    ).length;

    return {
      totalBookings,
      pendingBookings,
      assignedTables,
      totalGuests,
      unassignedBookings,
      largePartyBookings,
      completedToday,
    };
  }, [bookings]);

  useDashboardAlerts({
    title: "Restaurant notifications",
    description: "Quick attention items for hosts and restaurant operations.",
    alerts: buildRestaurantBookingAlerts({
      pendingBookings: bookingOverview.pendingBookings,
      unassignedBookings: bookingOverview.unassignedBookings,
      largePartyBookings: bookingOverview.largePartyBookings,
      completedToday: bookingOverview.completedToday,
    }),
  });

  const actions = [
    {
      key: "view" as const,
      onClick: (booking: RestaurantBooking) => setViewingBookingId(booking.id),
    },
    {
      key: "edit" as const,
      onClick: (booking: RestaurantBooking) => {
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
        const updatedBooking = await updateRestaurantBooking(editingDraft);
        setBookings((current) =>
          current.map((booking) =>
            booking.id === updatedBooking.id ? updatedBooking : booking
          )
        );
        toast.success("Restaurant booking updated successfully.");
        handleCloseEditModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update restaurant booking");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <>
      <div className="space-y-6">
        <RestaurantBookingsOverview
          totalBookings={bookingOverview.totalBookings}
          pendingBookings={bookingOverview.pendingBookings}
          assignedTables={bookingOverview.assignedTables}
          totalGuests={bookingOverview.totalGuests}
          isLoading={isLoading}
        />

        <DashboardSectionCard>
          <DynamicTable<RestaurantBooking>
            columns={restaurantBookingColumns}
            data={bookings}
            isLoading={isLoading}
            filtersConfig={restaurantBookingFilters}
            pageSize={8}
            searchPlaceholder="Search restaurant bookings..."
            actions={actions}
          />
        </DashboardSectionCard>
      </div>

      <SharedModal
        isOpen={Boolean(viewingBooking)}
        onClose={handleCloseViewModal}
        title={viewingBooking ? `Restaurant Booking for ${viewingBooking.userName}` : "Booking Details"}
      >
        {viewingBooking ? <RestaurantBookingDetailsView booking={viewingBooking} /> : null}
      </SharedModal>

      <SharedModal
        isOpen={Boolean(editingBooking && editingDraft)}
        onClose={handleCloseEditModal}
        title={editingBooking ? `Update ${editingBooking.userName}` : "Update Booking"}
        onSave={handleSaveBooking}
        saveLabel="Save Changes"
        isSaving={isSaving}
      >
        {editingBooking && editingDraft ? (
          <RestaurantBookingEditForm booking={editingDraft} onChange={setEditingDraft} />
        ) : null}
      </SharedModal>
    </>
  );
}
