import type { MenuItem, MenuCategory, MenuIcon } from "@/components/Menu/data";
import { apiRequest, getErrorMessage } from "@/lib/api-client";

interface ApiMenuItem {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  categoryIcon: MenuIcon;
  available?: boolean;
  image?: string;
  categoryHeroImg?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiMenuItem(item: ApiMenuItem): MenuItem {
  return {
    id: item._id ?? item.id ?? "",
    name: item.name,
    description: item.description,
    price: Number(item.price ?? 0),
    category: item.category,
    categoryIcon: item.categoryIcon,
    available: Boolean(item.available ?? true),
    image: item.image ?? "",
    categoryHeroImg: item.categoryHeroImg ?? "",
    createdAt: item.createdAt?.slice(0, 10) ?? "",
    updatedAt: item.updatedAt?.slice(0, 10) ?? "",
  };
}

function buildMenuFormData(item: MenuItem) {
  const formData = new FormData();
  formData.append("name", item.name);
  formData.append("description", item.description);
  formData.append("price", String(item.price));
  formData.append("category", item.category);
  formData.append("categoryIcon", item.categoryIcon || "Utensils");
  formData.append("available", String(item.available));

  if (item.imageFile) {
    formData.append("image", item.imageFile);
  }

  if (item.categoryHeroImgFile) {
    formData.append("categoryHeroImg", item.categoryHeroImgFile);
  }

  return formData;
}

/** Backend paginates get-all-items (default limit 10); dashboard needs the full list for the table. */
const MENU_ADMIN_LIST_LIMIT = 500;

export async function fetchMenuItems() {
  try {
    const qs = new URLSearchParams({
      page: "1",
      limit: String(MENU_ADMIN_LIST_LIMIT),
    });
    const data = await apiRequest<{
      data?: {
        items?: ApiMenuItem[];
        menuItems?: ApiMenuItem[];
      } | ApiMenuItem[];
    }>(`/api/menu?${qs.toString()}`);

    const items = Array.isArray(data?.data)
      ? data.data
      : data?.data?.items ?? data?.data?.menuItems ?? [];

    return Array.isArray(items) ? items.map(mapApiMenuItem) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createMenuItem(item: MenuItem) {
  try {
    await apiRequest("/api/menu", {
      method: "POST",
      body: buildMenuFormData(item),
    });

    return fetchMenuItems();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateMenuItem(item: MenuItem) {
  try {
    const data = await apiRequest<{
      data?: {
        item?: ApiMenuItem;
        menuItem?: ApiMenuItem;
      } | ApiMenuItem;
    }>(`/api/menu/${item.id}`, {
      method: "PATCH",
      body: buildMenuFormData(item),
    });

    const resolvedItem = Array.isArray(data?.data)
      ? data.data[0]
      : (data?.data as { item?: ApiMenuItem; menuItem?: ApiMenuItem } | ApiMenuItem | undefined);

    const apiItem =
      resolvedItem && "item" in resolvedItem
        ? resolvedItem.item
        : resolvedItem && "menuItem" in resolvedItem
          ? resolvedItem.menuItem
          : (resolvedItem as ApiMenuItem | undefined);

    if (!apiItem) {
      throw new Error("Menu item data is missing from the server response.");
    }

    return mapApiMenuItem(apiItem);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteMenuItem(itemId: string) {
  try {
    await apiRequest(`/api/menu/${itemId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
