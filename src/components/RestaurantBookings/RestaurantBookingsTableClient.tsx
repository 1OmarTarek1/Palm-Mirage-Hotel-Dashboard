"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import SharedModal from "@/components/shared/modal/SharedModal";
import DynamicTable from "@/components/shared/table/DynamicTable";
import type { TableQueryState } from "@/components/shared/table/types";
import { useDashboardAlerts } from "@/components/shared/alerts/dashboard-alerts-context";
import { queryKeys } from "@/lib/queryKeys";
import { restaurantBookingColumns, restaurantBookingFilters } from "@/config/tablePresets/restaurantBookingColumns";
import {
  fetchRestaurantBookings,
  fetchRestaurantBookingsPage,
  updateRestaurantBooking,
} from "@/lib/restaurant-bookings";

import RestaurantBookingDetailsView from "./RestaurantBookingDetailsView";
import RestaurantBookingEditForm from "./RestaurantBookingEditForm";
import { buildRestaurantBookingAlerts } from "./RestaurantBookingsAlerts";
import RestaurantBookingsOverview from "./RestaurantBookingsOverview";
import type { RestaurantBooking, RestaurantBookingDraft } from "./data";

function mapBookingToDraft(booking: RestaurantBooking): RestaurantBookingDraft {
  return {
    id: booking.id,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
  };
}

export default function RestaurantBookingsTableClient() {
  const queryClient = useQueryClient();
  const [tableQuery, setTableQuery] = useState<TableQueryState<RestaurantBooking>>({
    page: 1,
    pageSize: 8,
    search: "",
    filters: {},
    sort: null,
  });
  const { data: bookingsResponse, isLoading } = useQuery({
    queryKey: [...queryKeys.restaurantBookings.list, tableQuery],
    queryFn: () =>
      fetchRestaurantBookingsPage({
        page: tableQuery.page,
        limit: tableQuery.pageSize,
        search: tableQuery.search || undefined,
        status: typeof tableQuery.filters.status === "string" ? tableQuery.filters.status : undefined,
        paymentStatus:
          typeof tableQuery.filters.paymentStatus === "string"
            ? tableQuery.filters.paymentStatus
            : undefined,
      }),
    staleTime: 0,
    gcTime: 120_000,
  });
  const { data: allBookings = [] } = useQuery({
    queryKey: [...queryKeys.restaurantBookings.all, "overview"],
    queryFn: fetchRestaurantBookings,
    staleTime: 0,
    gcTime: 120_000,
  });
  const bookings = bookingsResponse?.items ?? [];
  const totalBookingsCount = bookingsResponse?.pagination.total ?? 0;
  const [viewingBookingId, setViewingBookingId] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<RestaurantBookingDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

    const totalBookings = totalBookingsCount;
    const pendingBookings = allBookings.filter((booking) => booking.status === "pending").length;
    const assignedTables = allBookings.filter((booking) => booking.tableNumber !== null).length;
    const totalGuests = allBookings.reduce((sum, booking) => sum + booking.guests, 0);
    const unassignedBookings = allBookings.filter((booking) => booking.tableNumber === null).length;
    const largePartyBookings = allBookings.filter((booking) => booking.guests >= 5).length;
    const completedToday = allBookings.filter(
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
  }, [allBookings, totalBookingsCount]);

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
        await updateRestaurantBooking(editingDraft);
        await queryClient.invalidateQueries({ queryKey: queryKeys.restaurantBookings.all });
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
            mode="server"
            totalEntries={totalBookingsCount}
            onQueryChange={setTableQuery}
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
