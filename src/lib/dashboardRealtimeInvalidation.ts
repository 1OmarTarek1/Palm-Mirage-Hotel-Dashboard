import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

type BookingResource = "room" | "activity" | "restaurant";

/** Room inventory flags may change when room bookings move */
export function invalidateBookingOperationalQueries(
  queryClient: QueryClient,
  payload?: { resource?: BookingResource },
) {
  const resource = payload?.resource;

  if (!resource || resource === "room") {
    void queryClient.invalidateQueries({ queryKey: queryKeys.roomBookings.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
  }
  if (!resource || resource === "activity") {
    void queryClient.invalidateQueries({ queryKey: queryKeys.activityBookings.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.activitySchedules.all });
  }
  if (!resource || resource === "restaurant") {
    void queryClient.invalidateQueries({ queryKey: queryKeys.restaurantBookings.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.restaurantTables.all });
  }

  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboardHome.all });
}

export function invalidatePaymentOperationalQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.roomBookings.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.activityBookings.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.restaurantBookings.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboardHome.all });
}
