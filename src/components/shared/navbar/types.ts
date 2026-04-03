export interface UserData {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

export interface NavbarProps {
  user?: UserData | null;
  notificationCount?: number;
  onSignOut?: () => void;
}

export type ActiveUser = UserData & {
  image?: string | null;
};
