/**
 * TanStack Query keys for the Dashboard BFF.
 * - Catalog / reference: staleTime ~45s; invalidate on admin CRUD + targeted realtime.
 * - Operational bookings: staleTime 0; invalidate on mutations + booking/payment sockets.
 */

export const queryKeys = {
  rooms: {
    all: ["dashboard", "rooms"] as const,
    list: ["dashboard", "rooms", "list"] as const,
  },
  menu: {
    all: ["dashboard", "menu"] as const,
    list: ["dashboard", "menu", "list"] as const,
  },
  facilities: {
    all: ["dashboard", "facilities"] as const,
    list: ["dashboard", "facilities", "list"] as const,
  },
  roomAmenities: {
    all: ["dashboard", "room-amenities"] as const,
    list: ["dashboard", "room-amenities", "list"] as const,
  },
  activities: {
    all: ["dashboard", "activities"] as const,
    list: ["dashboard", "activities", "list"] as const,
  },
  activitySchedules: {
    all: ["dashboard", "activity-schedules"] as const,
    list: ["dashboard", "activity-schedules", "list"] as const,
  },
  restaurantTables: {
    all: ["dashboard", "restaurant-tables"] as const,
    list: ["dashboard", "restaurant-tables", "list"] as const,
  },
  users: {
    all: ["dashboard", "users"] as const,
    list: ["dashboard", "users", "list"] as const,
  },
  roomBookings: {
    all: ["dashboard", "bookings", "rooms"] as const,
    list: ["dashboard", "bookings", "rooms", "list"] as const,
  },
  activityBookings: {
    all: ["dashboard", "bookings", "activities"] as const,
    list: ["dashboard", "bookings", "activities", "list"] as const,
  },
  restaurantBookings: {
    all: ["dashboard", "bookings", "restaurant"] as const,
    list: ["dashboard", "bookings", "restaurant", "list"] as const,
  },
  dashboardHome: {
    all: ["dashboard", "home"] as const,
    stats: ["dashboard", "home", "stats"] as const,
  },
} as const;
