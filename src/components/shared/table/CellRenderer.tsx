"use client";

import React from "react";
import { Column } from "./types";

// Import Cells
import TextCell from "./cells/TextCell";
import ImageCardCell from "./cells/ImageCardCell";
import BadgeCell from "./cells/BadgeCell";
import IconCell from "./cells/IconCell";
import CountCell from "./cells/CountCell";
import DateCell from "./cells/DateCell";
import ActionDropdownCell from "./cells/ActionDropdownCell";

const CellMap: Record<string, React.FC<any>> = {
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
  resolvedValue: any;
}

export default function CellRenderer<T>(props: CellRendererProps<T>) {
  const type = props.column.type || "text";
  const Component = CellMap[type] || TextCell;

  return <Component {...props} />;
}
