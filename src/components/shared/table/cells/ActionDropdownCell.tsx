import React from "react";
import ActionDropdown from "../ActionDropdown";
import { CellProps } from "./types";
import { RowActionConfig } from "../types";

export default function ActionDropdownCell<T>({
  row,
  column,
  displayMode = "table",
}: CellProps<T>) {
  const config = column.config as
    | {
        actions?: RowActionConfig<T>[];
      }
    | undefined;
  const actions = config?.actions || [];
  const resolvedActions = actions.map((action) => ({
    ...action,
    onClick: () => action.onClick(row),
  }));

  if (resolvedActions.length === 0) return null;

  return (
    <div
      className={`flex items-center ${
        displayMode === "card" ? "justify-end" : "justify-center"
      }`}
    >
      <ActionDropdown actions={resolvedActions} />
    </div>
  );
}
