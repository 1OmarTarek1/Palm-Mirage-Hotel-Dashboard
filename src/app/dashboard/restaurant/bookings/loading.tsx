import { DashboardManagementPageSkeleton } from "@/components/shared/loading/DashboardSkeleton";

export default function Loading() {
  return (
    <DashboardManagementPageSkeleton
      overviewCount={4}
      tableColumnCount={6}
      tableRowCount={8}
      hasHeaderAction={false}
    />
  );
}
