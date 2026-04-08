import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

type BookingResource = "room" | "activity" | "restaurant";

function invalidateAndRefetch(queryClient: QueryClient, queryKey: readonly unknown[]) {
  void queryClient.invalidateQueries({ queryKey });
  void queryClient.refetchQueries({ queryKey, type: "active" });
}

/** Room inventory flags may change when room bookings move */
export function invalidateBookingOperationalQueries(
  queryClient: QueryClient,
  payload?: { resource?: BookingResource },
) {
  const resource = payload?.resource;

  if (!resource || resource === "room") {
    invalidateAndRefetch(queryClient, queryKeys.roomBookings.all);
    invalidateAndRefetch(queryClient, queryKeys.rooms.all);
  }
  if (!resource || resource === "activity") {
    invalidateAndRefetch(queryClient, queryKeys.activityBookings.all);
    invalidateAndRefetch(queryClient, queryKeys.activitySchedules.all);
  }
  if (!resource || resource === "restaurant") {
    invalidateAndRefetch(queryClient, queryKeys.restaurantBookings.all);
    invalidateAndRefetch(queryClient, queryKeys.restaurantTables.all);
  }

  invalidateAndRefetch(queryClient, queryKeys.dashboardHome.all);
}

export function invalidatePaymentOperationalQueries(queryClient: QueryClient) {
  invalidateAndRefetch(queryClient, queryKeys.roomBookings.all);
  invalidateAndRefetch(queryClient, queryKeys.activityBookings.all);
  invalidateAndRefetch(queryClient, queryKeys.restaurantBookings.all);
  invalidateAndRefetch(queryClient, queryKeys.dashboardHome.all);
}
