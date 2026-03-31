import { fetchUsers } from "@/lib/users";
import { fetchRooms } from "@/lib/rooms";
import { fetchFacilities } from "@/services/facility.service";
import { fetchActivities } from "@/lib/activities";

export const getDashboardData = async () => {
  try {
    // Fetch all 4 datasets in parallel (Restaurant is still placeholder)
    const [users, rooms, facilities, activities] = await Promise.all([
      fetchUsers().catch(() => []),
      fetchRooms().catch(() => []),
      fetchFacilities().catch(() => []),
      fetchActivities().catch(() => []),
    ]);

    // Aggregate Stats
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r: any) => r.isAvailable).length;
    
    const totalUsers = users.length;
    const adminCount = users.filter((u: any) => u.role === "admin").length;
    
    const totalFacilities = facilities.length;
    const totalActivities = activities.length;
    const restaurantCount = 0; // Currently placeholder in the system

    return {
      stats: [
        {
          title: "Total Rooms",
          value: totalRooms,
          iconName: "Bed",
          description: `${availableRooms} Available`,
          color: "primary",
        },
        {
          title: "Total Users",
          value: totalUsers,
          iconName: "Users",
          description: `${adminCount} Admins`,
          color: "secondary",
        },
        {
          title: "Facilities",
          value: totalFacilities,
          iconName: "Building2",
          description: "Active facilities",
          color: "primary",
        },
        {
          title: "Activities",
          value: totalActivities,
          iconName: "Calendar",
          description: "Scheduled programs",
          color: "destructive",
        },
        {
          title: "Restaurant",
          value: "Coming Soon",
          iconName: "Utensils",
          description: "Real data pending",
          color: "muted",
        },
      ],
      charts: {
        occupancy: {
          labels: ["Available", "Occupied"],
          datasets: [
            {
              data: [availableRooms, totalRooms - availableRooms],
              backgroundColor: ["#c6a969", "#374151"],
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 2,
            },
          ],
        },
        userRoles: {
          labels: ["Admin", "Staff"],
          datasets: [
            {
              label: "User Count",
              data: [adminCount, totalUsers - adminCount],
              backgroundColor: "#c6a969",
              borderRadius: 6,
            },
          ],
        },
        trends: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Bookings",
              data: [12, 19, 15, 22, 28, 35, 25],
              fill: true,
              backgroundColor: "rgba(198, 169, 105, 0.1)",
              borderColor: "#c6a969",
              tension: 0.4,
            },
          ],
        },
      },
    };
  } catch (error) {
    console.error("Dashboard data fetching failed:", error);
    throw error;
  }
};
