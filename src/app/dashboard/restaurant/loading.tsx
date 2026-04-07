import { DashboardManagementPageSkeleton } from "@/components/shared/loading/DashboardSkeleton";

export default function Loading() {
  return (
    <DashboardManagementPageSkeleton
      overviewCount={4}
      tableColumnCount={5}
      tableRowCount={8}
      hasHeaderAction
      quickActionCount={2}
      quickActionsClassName="mb-0 md:mb-0"
    />
  );
}
