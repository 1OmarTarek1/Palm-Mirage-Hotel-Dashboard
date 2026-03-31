"use client";

import React from "react";
import {
  Waves,
  Utensils,
  Dumbbell,
  Wifi,
  Music,
  Coffee,
  ParkingCircle,
  Briefcase,
  Sparkles,
  Zap,
  Activity,
  Ship,
  Landmark,
  Mountain,
  Palette,
  CloudSun,
  ChefHat,
  Bed,
  Bath,
  Car,
  Tv,
  Phone,
  Home,
  Heart,
  Star,
  Sun,
  Flame,
  Droplets,
  Wind,
  TreePine,
  Flower2,
  Gamepad2,
  Trophy,
  Bike,
  Tent,
  Map,
  Globe,
  Umbrella,
  Scissors,
  ShoppingBag,
  BookOpen,
  Baby,
  Dog,
  Building2,
  Sofa,
  Lamp,
  AirVent,
  Shirt,
  Cigarette,
  Wine,
  Beer,
  IceCream,
  Salad,
  Sandwich,
  Croissant,
  type LucideIcon
} from "lucide-react";

// Direct name-to-icon mapping (case-insensitive lookup via normalize function)
const directMap: Record<string, LucideIcon> = {
  // Exact lucide icon names
  waves: Waves,
  utensils: Utensils,
  dumbbell: Dumbbell,
  wifi: Wifi,
  music: Music,
  coffee: Coffee,
  parkingcircle: ParkingCircle,
  briefcase: Briefcase,
  sparkles: Sparkles,
  zap: Zap,
  activity: Activity,
  ship: Ship,
  landmark: Landmark,
  mountain: Mountain,
  palette: Palette,
  cloudsun: CloudSun,
  chefhat: ChefHat,
  bed: Bed,
  bath: Bath,
  car: Car,
  tv: Tv,
  phone: Phone,
  home: Home,
  heart: Heart,
  star: Star,
  sun: Sun,
  flame: Flame,
  droplets: Droplets,
  wind: Wind,
  treepine: TreePine,
  flower2: Flower2,
  gamepad2: Gamepad2,
  trophy: Trophy,
  bike: Bike,
  tent: Tent,
  map: Map,
  globe: Globe,
  umbrella: Umbrella,
  scissors: Scissors,
  shoppingbag: ShoppingBag,
  bookopen: BookOpen,
  baby: Baby,
  dog: Dog,
  building2: Building2,
  sofa: Sofa,
  lamp: Lamp,
  airvent: AirVent,
  shirt: Shirt,
  cigarette: Cigarette,
  wine: Wine,
  beer: Beer,
  icecream: IceCream,
  salad: Salad,
  sandwich: Sandwich,
  croissant: Croissant,
};

// Keyword-based fuzzy matching: if the name CONTAINS any of these keywords, use the icon
const keywordMap: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ["pool", "swim", "aqua", "water"], icon: Waves },
  { keywords: ["gym", "fitness", "workout", "exercise", "weight"], icon: Dumbbell },
  { keywords: ["wifi", "internet", "network", "broadband"], icon: Wifi },
  { keywords: ["park", "garage", "valet"], icon: ParkingCircle },
  { keywords: ["restaurant", "dining", "dine", "food", "eat", "meal"], icon: Utensils },
  { keywords: ["coffee", "cafe", "espresso", "latte"], icon: Coffee },
  { keywords: ["spa", "massage", "sauna", "steam", "wellness", "relax"], icon: Sparkles },
  { keywords: ["bar", "lounge", "cocktail", "drink"], icon: Wine },
  { keywords: ["breakfast", "brunch", "morning"], icon: Croissant },
  { keywords: ["room", "suite", "bed", "sleep", "accomod"], icon: Bed },
  { keywords: ["bath", "shower", "jacuzzi", "tub", "hot tub"], icon: Bath },
  { keywords: ["housekeep", "clean", "laundry", "maid"], icon: Sparkles },
  { keywords: ["business", "conference", "meeting", "office", "work"], icon: Briefcase },
  { keywords: ["music", "band", "concert", "entertain", "show", "theater"], icon: Music },
  { keywords: ["chef", "kitchen", "cook", "culinary"], icon: ChefHat },
  { keywords: ["garden", "outdoor", "terrace", "patio", "yard", "green"], icon: TreePine },
  { keywords: ["beach", "shore", "coast", "ocean", "sea"], icon: Umbrella },
  { keywords: ["mountain", "hike", "trek", "climb"], icon: Mountain },
  { keywords: ["kid", "child", "play", "game", "arcade"], icon: Gamepad2 },
  { keywords: ["baby", "nursery", "infant", "toddler"], icon: Baby },
  { keywords: ["pet", "dog", "cat", "animal"], icon: Dog },
  { keywords: ["sport", "tennis", "basketball", "football", "soccer", "court"], icon: Trophy },
  { keywords: ["bike", "cycle", "bicycle"], icon: Bike },
  { keywords: ["camp", "tent", "bonfire"], icon: Tent },
  { keywords: ["tour", "trip", "excursion", "shuttle", "transport"], icon: Car },
  { keywords: ["shop", "store", "boutique", "gift", "retail"], icon: ShoppingBag },
  { keywords: ["library", "read", "book"], icon: BookOpen },
  { keywords: ["tv", "television", "screen", "cinema", "movie"], icon: Tv },
  { keywords: ["phone", "call", "concierge", "reception"], icon: Phone },
  { keywords: ["air", "ac", "conditioning", "hvac", "cool"], icon: AirVent },
  { keywords: ["fire", "fireplace", "hearth", "bbq", "grill"], icon: Flame },
  { keywords: ["ice", "frozen", "gelato", "dessert"], icon: IceCream },
  { keywords: ["flower", "floral", "botanical"], icon: Flower2 },
  { keywords: ["art", "gallery", "paint", "craft"], icon: Palette },
  { keywords: ["sun", "solar", "solarium", "tan"], icon: Sun },
  { keywords: ["view", "scenic", "panoram", "observation"], icon: Globe },
  { keywords: ["hair", "salon", "barber", "beauty"], icon: Scissors },
  { keywords: ["lobby", "front desk", "building"], icon: Building2 },
];

/**
 * Resolve an icon name to a LucideIcon component.
 * Strategy: direct match → keyword fuzzy match → fallback to Activity.
 */
export const getIcon = (name: string): LucideIcon => {
  if (!name || name.trim() === "") return Activity;

  const normalized = name.trim().toLowerCase().replace(/[\s_-]+/g, "");

  // 1. Direct match (exact icon name, case-insensitive)
  if (directMap[normalized]) {
    return directMap[normalized];
  }

  // 2. Keyword fuzzy match (check if the name contains any keyword)
  const lowerName = name.trim().toLowerCase();
  for (const entry of keywordMap) {
    for (const keyword of entry.keywords) {
      if (lowerName.includes(keyword)) {
        return entry.icon;
      }
    }
  }

  // 3. Fallback
  return Activity;
};

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const DynamicIcon = ({ name, size = 18, className = "" }: IconProps) => {
  const IconComponent = getIcon(name);
  return <IconComponent size={size} className={className} />;
};

// Re-export for convenience
export { type LucideIcon };
