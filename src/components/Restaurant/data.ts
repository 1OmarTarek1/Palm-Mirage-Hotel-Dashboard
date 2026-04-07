export interface RestaurantTable {
  id: string;
  number: number;
  chairs: number;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantTableDraft {
  number: number;
  chairs: number;
}

export function createEmptyRestaurantTableDraft(nextNumber = 1): RestaurantTableDraft {
  return {
    number: nextNumber,
    chairs: 2,
  };
}
