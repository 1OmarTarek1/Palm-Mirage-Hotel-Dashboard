import type { RestaurantTable } from "./data";

export default function RestaurantDeleteConfirm({
  table,
}: {
  table: RestaurantTable;
}) {
  return (
    <div className="space-y-3 p-1">
      <p className="font-main text-sm leading-6 text-muted-foreground">
        You are about to delete restaurant table{" "}
        <span className="font-semibold text-foreground">#{table.number}</span>.
      </p>
      <p className="font-main text-sm leading-6 text-muted-foreground">
        This will remove its setup from the dashboard. Make sure there are no active service
        dependencies tied to this table number first.
      </p>
    </div>
  );
}
