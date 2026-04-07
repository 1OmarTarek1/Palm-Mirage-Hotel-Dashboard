import { DashboardManagementPageSkeleton } from "@/components/shared/loading/DashboardSkeleton";

export default function Loading() {
  return (
    <DashboardManagementPageSkeleton
      overviewCount={4}
      tableColumnCount={5}
      tableRowCount={5}
      hasHeaderAction
    />
  );
}
