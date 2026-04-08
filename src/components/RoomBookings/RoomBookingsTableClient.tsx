"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import DynamicTable from "@/components/shared/table/DynamicTable";
import SharedModal from "@/components/shared/modal/SharedModal";
import { roomBookingColumns, roomBookingFilters } from "@/config/tablePresets/roomBookingColumns";
import { fetchRoomBookings, fetchRoomBookingsPage, updateRoomBooking } from "@/lib/room-bookings";
import { useServerTableData } from "@/hooks/useServerTableData";
import { useDashboardAlerts } from "@/components/shared/alerts/dashboard-alerts-context";
import { queryKeys } from "@/lib/queryKeys";
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
  const queryClient = useQueryClient();
  const {
    setTableQuery,
    pageItems: bookings,
    overviewItems: allBookings,
    totalEntries: totalBookings,
    isLoading,
  } = useServerTableData<RoomBooking>({
    queryKeyBase: queryKeys.roomBookings.all,
    initialPageSize: 6,
    fetchPage: (query) =>
      fetchRoomBookingsPage({
        page: query.page,
        limit: query.pageSize,
        search: query.search || undefined,
        status: typeof query.filters.status === "string" ? query.filters.status : undefined,
        paymentStatus:
          typeof query.filters.paymentStatus === "string"
            ? query.filters.paymentStatus
            : undefined,
        sort: "newest",
      }),
    fetchOverview: () => fetchRoomBookings(),
    staleTime: 0,
    gcTime: 120_000,
    // Fallback for demos: keep the table fresh even when realtime events/webhooks are delayed.
    refetchInterval: 10_000,
  });

  const [highlightedBookingIds, setHighlightedBookingIds] = useState<string[]>([]);
  const [viewingBookingId, setViewingBookingId] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<RoomBookingDraft | null>(null);
  const [isSaving, setIsLoadingSaving] = useState(false);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousBookingIdsRef = useRef<string[]>([]);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const nextIds = bookings.map((booking) => booking.id);

    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      previousBookingIdsRef.current = nextIds;
      return;
    }

    const previousIds = previousBookingIdsRef.current;
    if (previousIds.length > 0) {
      const newIds = nextIds.filter((id) => !previousIds.includes(id));
      if (newIds.length > 0) {
        setHighlightedBookingIds(newIds);
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedBookingIds([]);
        }, 4000);
      }
    }

    previousBookingIdsRef.current = nextIds;
  }, [bookings, isLoading]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
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

    const arrivalsToday = allBookings.filter((booking) => isSameDay(booking.checkInDate)).length;
    const departuresToday = allBookings.filter((booking) => isSameDay(booking.checkOutDate)).length;
    const pendingBookings = allBookings.filter((booking) => booking.status === "pending").length;
    const unpaidBookings = allBookings.filter((booking) => booking.paymentStatus === "unpaid").length;
    const checkedInGuests = allBookings.filter((booking) => booking.status === "checked-in").length;
    const noShowBookings = allBookings.filter((booking) => booking.status === "no-show").length;
    const cancelledBookings = allBookings.filter((booking) => booking.status === "cancelled").length;
    const totalRevenue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(allBookings.reduce((sum, booking) => sum + booking.totalPrice, 0));

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
  }, [allBookings]);

  const pageAlerts = useMemo(
    () => ({
      title: "Booking notifications",
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
      await updateRoomBooking(editingDraft);
      await queryClient.invalidateQueries({ queryKey: queryKeys.roomBookings.all });
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
            mode="server"
            totalEntries={totalBookings}
            onQueryChange={setTableQuery}
            searchPlaceholder="Search room bookings..."
            actions={actions}
            highlightedRowKeys={highlightedBookingIds}
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
