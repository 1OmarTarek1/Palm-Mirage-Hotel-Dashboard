import { fetchActivities } from "@/lib/activities";
import { fetchActivityBookings } from "@/lib/activityBookings";
import { fetchActivitySchedules } from "@/lib/activitySchedules";
import { fetchFacilities } from "@/lib/facilities";
import {
  fetchRoomBookingDashboardMetrics,
  type RoomBookingDashboardMetrics,
} from "@/lib/room-bookings";
import { fetchRooms } from "@/lib/rooms";
import { fetchUsers } from "@/lib/users";

type DashboardStatColor = "primary" | "secondary" | "destructive" | "muted";
type DashboardAlertTone = "critical" | "warning" | "info";

function isSameDay(value: string | undefined, dayKey: string) {
  return Boolean(value) && value?.slice(0, 10) === dayKey;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(Number.isFinite(value) ? value : 0)}%`;
}

function getLastSevenDays(today: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });
}

const emptyRoomMetrics = (weekKeys: string[]): RoomBookingDashboardMetrics => ({
  today: weekKeys[6] ?? "",
  weekKeys,
  arrivalsToday: 0,
  departuresToday: 0,
  pendingRoomBookings: 0,
  unpaidRoomBookings: 0,
  noShowBookings: 0,
  checkedInGuests: 0,
  todayRoomRevenue: 0,
  bookingStatusCounts: {
    pending: 0,
    confirmed: 0,
    checkedIn: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
  },
  roomRevenueByDay: weekKeys.map(() => 0),
  recentRoomBookings: [],
});

export const getDashboardData = async () => {
  try {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const lastSevenDays = getLastSevenDays(today);
    const weekKeys = lastSevenDays.map((d) => d.key);

    const [users, rooms, facilities, activities, roomMetrics, activityBookings, activitySchedules] =
      await Promise.all([
        fetchUsers().catch(() => []),
        fetchRooms().catch(() => []),
        fetchFacilities().catch(() => []),
        fetchActivities().catch(() => []),
        fetchRoomBookingDashboardMetrics({ today: todayKey, weekKeys }).catch(() => null),
        fetchActivityBookings().catch(() => []),
        fetchActivitySchedules().catch(() => []),
      ]);

    const roomBookingMetrics = roomMetrics ?? emptyRoomMetrics(weekKeys);

    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((hotelRoom) => hotelRoom.isAvailable).length;
    const occupiedRooms = Math.max(totalRooms - availableRooms, 0);
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === "admin").length;
    const totalFacilities = facilities.length;
    const totalActivities = activities.length;
    const activeActivities = activities.filter((activity) => activity.isActive).length;

    const arrivalsTodayCount = roomBookingMetrics.arrivalsToday;
    const departuresTodayCount = roomBookingMetrics.departuresToday;
    const pendingRoomBookingsCount = roomBookingMetrics.pendingRoomBookings;
    const unpaidRoomBookingsCount = roomBookingMetrics.unpaidRoomBookings;
    const noShowBookingsCount = roomBookingMetrics.noShowBookings;
    const checkedInGuestsCount = roomBookingMetrics.checkedInGuests;
    const todayRoomRevenue = roomBookingMetrics.todayRoomRevenue;

    const todayActivityBookings = activityBookings.filter((booking) =>
      isSameDay(booking.bookingDate, todayKey)
    );
    const pendingActivityBookings = activityBookings.filter((booking) => booking.status === "pending");
    const unpaidActivityBookings = activityBookings.filter(
      (booking) => booking.paymentStatus === "unpaid"
    );
    const todayActivityRevenue = todayActivityBookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    const todaySchedules = activitySchedules.filter((schedule) => isSameDay(schedule.date, todayKey));
    const nearlyFullSchedules = activitySchedules.filter((schedule) => {
      if (schedule.status !== "scheduled") return false;
      if (schedule.capacity <= 0) return false;
      return schedule.availableSeats / schedule.capacity <= 0.2;
    });

    const alerts: Array<{
      title: string;
      message: string;
      tone: DashboardAlertTone;
    }> = [];

    if (pendingRoomBookingsCount > 0) {
      alerts.push({
        title: "Pending room confirmations",
        message: `${pendingRoomBookingsCount} room bookings are still waiting for confirmation.`,
        tone: "warning",
      });
    }

    if (unpaidRoomBookingsCount + unpaidActivityBookings.length > 0) {
      alerts.push({
        title: "Outstanding payments",
        message: `${unpaidRoomBookingsCount + unpaidActivityBookings.length} bookings still need payment follow-up.`,
        tone: "critical",
      });
    }

    if (noShowBookingsCount > 0) {
      alerts.push({
        title: "No-show guests recorded",
        message: `${noShowBookingsCount} reservations are marked as no-show and may need review.`,
        tone: "info",
      });
    }

    if (nearlyFullSchedules.length > 0) {
      alerts.push({
        title: "Activities close to full capacity",
        message: `${nearlyFullSchedules.length} upcoming schedules are almost fully booked.`,
        tone: "warning",
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        title: "Operations look healthy",
        message: "No critical alerts at the moment. Teams can focus on guest service and upsells.",
        tone: "info",
      });
    }

    const recentRoomBookings = roomBookingMetrics.recentRoomBookings.map((booking) => ({
      id: booking.id,
      guestName: booking.guestName,
      context: `Room ${booking.roomNumber} · ${booking.nights} night${booking.nights === 1 ? "" : "s"}`,
      status: booking.status,
      amount: formatCurrency(booking.totalPrice),
    }));

    const upcomingActivities = [...todaySchedules]
      .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
      .slice(0, 4)
      .map((schedule) => ({
        id: schedule.id,
        title: schedule.activityTitle,
        context: `${schedule.startTime} - ${schedule.endTime} · ${schedule.activityLocation || "On site"}`,
        status:
          schedule.availableSeats === 0
            ? "Full"
            : `${schedule.availableSeats}/${schedule.capacity} seats left`,
      }));

    const bookingStatusCounts = roomBookingMetrics.bookingStatusCounts;

    const trendValues = lastSevenDays.map(({ key }, index) => {
      const roomRevenue = roomBookingMetrics.roomRevenueByDay[index] ?? 0;
      const activityRevenue = activityBookings
        .filter((booking) => isSameDay(booking.createdAt, key))
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      return roomRevenue + activityRevenue;
    });

    const totalRevenueThisWeek = trendValues.reduce((sum, value) => sum + value, 0);

    const stats: Array<{
      title: string;
      value: string | number;
      iconName: "Bed" | "Users" | "Building2" | "Calendar" | "CreditCard" | "ClipboardList";
      description?: string;
      trend?: {
        value: string;
        isUp: boolean;
      };
      color?: DashboardStatColor;
    }> = [
      {
        title: "Live Occupancy",
        value: formatPercent(occupancyRate),
        iconName: "Bed",
        description: `${occupiedRooms}/${totalRooms} rooms occupied`,
        color: "primary",
      },
      {
        title: "Today's Arrivals",
        value: arrivalsTodayCount,
        iconName: "ClipboardList",
        description: `${departuresTodayCount} departures scheduled`,
        color: "secondary",
      },
      {
        title: "Pending Follow-up",
        value: pendingRoomBookingsCount + pendingActivityBookings.length,
        iconName: "Calendar",
        description: `${unpaidRoomBookingsCount + unpaidActivityBookings.length} unpaid bookings`,
        color:
          pendingRoomBookingsCount + pendingActivityBookings.length > 0 ? "destructive" : "muted",
      },
      {
        title: "Today's Revenue",
        value: formatCurrency(todayRoomRevenue + todayActivityRevenue),
        iconName: "CreditCard",
        description: `${formatCurrency(totalRevenueThisWeek)} collected this week`,
        color: "primary",
      },
    ];

    return {
      stats,
      charts: {
        occupancy: {
          labels: ["Occupied", "Available"],
          datasets: [
            {
              data: [occupiedRooms, availableRooms],
              backgroundColor: ["#c6a969", "#d9dee7"],
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 2,
            },
          ],
        },
        bookingStatus: {
          labels: ["Pending", "Confirmed", "Checked-in", "Completed", "Cancelled", "No-show"],
          datasets: [
            {
              label: "Reservations",
              data: [
                bookingStatusCounts.pending,
                bookingStatusCounts.confirmed,
                bookingStatusCounts.checkedIn,
                bookingStatusCounts.completed,
                bookingStatusCounts.cancelled,
                bookingStatusCounts.noShow,
              ],
              backgroundColor: ["#f59e0b", "#c6a969", "#10b981", "#3b82f6", "#ef4444", "#6b7280"],
              borderRadius: 8,
            },
          ],
        },
        trends: {
          labels: lastSevenDays.map((day) => day.label),
          datasets: [
            {
              label: "Revenue",
              data: trendValues,
              fill: true,
              backgroundColor: "rgba(198, 169, 105, 0.12)",
              borderColor: "#c6a969",
              tension: 0.35,
            },
          ],
        },
      },
      operations: [
        {
          label: "Arrivals today",
          value: arrivalsTodayCount,
          helper: "Guests expected to check in",
        },
        {
          label: "Departures today",
          value: departuresTodayCount,
          helper: "Rooms turning over today",
        },
        {
          label: "Checked-in guests",
          value: checkedInGuestsCount,
          helper: "Currently in-house reservations",
        },
        {
          label: "Activity sessions",
          value: todaySchedules.length,
          helper: `${todayActivityBookings.length} activity bookings scheduled`,
        },
      ],
      alerts,
      highlights: {
        users: `${totalUsers} users · ${adminCount} admins`,
        facilities: `${totalFacilities} active facilities`,
        activities: `${activeActivities}/${totalActivities} experiences active`,
        payments: `${unpaidRoomBookingsCount + unpaidActivityBookings.length} unpaid bookings need review`,
      },
      recentRoomBookings,
      upcomingActivities,
      lastUpdated: today.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };
  } catch (error) {
    console.error("Dashboard data fetching failed:", error);
    throw error;
  }
};
