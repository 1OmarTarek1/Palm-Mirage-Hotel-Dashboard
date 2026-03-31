export type FacilityStatus = "Available" | "Maintenance" | "Busy" | "Closed";

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  capacity?: number;
  status: FacilityStatus;
  image?: string;
  icon?: string;
  operatingHours?: string;
  createdAt: string;
  updatedAt: string;
}
