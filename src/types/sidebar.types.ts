import { ReactNode } from "react";

export interface NavItem {
  label: string;
  href?: string;
  icon: ReactNode;
  children?: NavItem[];
  roles?: ("Admin" | "Manager" | "User")[];
  hidden?: boolean;
  action?: () => void;
}