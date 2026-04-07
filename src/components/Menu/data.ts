export type MenuCategory = "Desserts" | "Appetizer" | "Restaurant" | "Drinks";

export type MenuIcon =
  | "Utensils"
  | "UtensilsCrossed"
  | "Salad"
  | "CakeSlice"
  | "GlassWater"
  | "Beef"
  | "Cake"
  | "IceCream"
  | "CupSoda"
  | "Coffee"
  | "Pizza"
  | "Soup";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  categoryIcon: MenuIcon;
  available: boolean;
  image: string;
  imageFile?: File | null;
  categoryHeroImg: string;
  categoryHeroImgFile?: File | null;
  createdAt?: string;
  updatedAt?: string;
}

export const menuCategoryOptions: MenuCategory[] = [
  "Appetizer",
  "Restaurant",
  "Desserts",
  "Drinks",
];

export const menuIconOptions: MenuIcon[] = [
  "Salad",
  "UtensilsCrossed",
  "CakeSlice",
  "GlassWater",
  "Utensils",
  "Beef",
  "Cake",
  "IceCream",
  "CupSoda",
  "Coffee",
  "Pizza",
  "Soup",
];

export function createEmptyMenuDraft(): MenuItem {
  return {
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "Restaurant",
    categoryIcon: "Utensils",
    available: true,
    image: "",
    imageFile: null,
    categoryHeroImg: "",
    categoryHeroImgFile: null,
  };
}
