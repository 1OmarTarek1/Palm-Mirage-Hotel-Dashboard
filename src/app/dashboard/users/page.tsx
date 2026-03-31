import UserDashboardPageClient from "@/components/UserDashboard/UserDashboardClient";

export const metadata = {
  title: "User Management - Palm Mirage",
  description: "Manage hotel users and administrators.",
};

export default function UsersPage() {
  return <UserDashboardPageClient />;
}
