export interface UserData {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  image?: string | null;
}

export interface NavbarProps {
  user?: UserData | null;
  notificationCount?: number;
  onSignOut?: () => void;
  isAlertsPanelOpen?: boolean;
  onAlertsPanelToggle?: () => void;
}

export type ActiveUser = UserData;
