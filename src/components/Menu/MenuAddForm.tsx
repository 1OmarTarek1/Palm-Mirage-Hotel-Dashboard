"use client";

import type { MenuItem } from "./data";
import MenuEditForm from "./MenuEditForm";

interface MenuAddFormProps {
  item: MenuItem;
  onChange: (item: MenuItem) => void;
}

export default function MenuAddForm({
  item,
  onChange,
}: MenuAddFormProps) {
  return <MenuEditForm item={item} onChange={onChange} />;
}
