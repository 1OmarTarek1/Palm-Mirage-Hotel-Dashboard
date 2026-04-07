import { DashboardManagementPageSkeleton } from "@/components/shared/loading/DashboardSkeleton";

export default function Loading() {
  return (
    <DashboardManagementPageSkeleton
      overviewCount={6}
      tableColumnCount={6}
      tableRowCount={6}
      hasHeaderAction={false}
    />
  );
}
