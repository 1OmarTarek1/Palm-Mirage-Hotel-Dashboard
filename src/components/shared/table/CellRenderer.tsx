"use client";

import React, { type ReactNode } from "react";
import { Column } from "./types";
import { CellDisplayMode, CellProps } from "./cells/types";

// Import Cells
import TextCell from "./cells/TextCell";
import ImageCardCell from "./cells/ImageCardCell";
import BadgeCell from "./cells/BadgeCell";
import IconCell from "./cells/IconCell";
import CountCell from "./cells/CountCell";
import DateCell from "./cells/DateCell";
import ActionDropdownCell from "./cells/ActionDropdownCell";

const CellMap: Record<string, React.FC<CellProps>> = {
  text: TextCell,
  "image-card": ImageCardCell,
  badge: BadgeCell,
  icon: IconCell,
  count: CountCell,
  date: DateCell,
  "action-dropdown": ActionDropdownCell,
};

interface CellRendererProps<T> {
  row: T;
  column: Column<T>;
  resolvedValue: ReactNode;
  displayMode?: CellDisplayMode;
}

export default function CellRenderer<T>(props: CellRendererProps<T>) {
  const type = props.column.type || "text";
  const Component = CellMap[type] || TextCell;

  return <Component {...(props as CellProps)} />;
}
