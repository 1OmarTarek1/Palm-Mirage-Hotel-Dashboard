import axios from "axios";
import type { MenuItem, MenuCategory, MenuIcon } from "@/components/Menu/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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

function getAccessTokenFromCookies() {
  if (typeof document === "undefined") return null;

  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("accessToken="));

  return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
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

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Request failed";
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

export async function fetchMenuItems() {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/menu`);
    // Adjusting based on common API response structure seen in activities
    return (data?.data?.menuItems || data?.data || []).map(mapApiMenuItem);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createMenuItem(item: MenuItem) {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    await axios.post(`${API_BASE_URL}/menu`, buildMenuFormData(item), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return fetchMenuItems();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateMenuItem(item: MenuItem) {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await axios.patch(
      `${API_BASE_URL}/menu/${item.id}`,
      buildMenuFormData(item),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return mapApiMenuItem(data?.data?.menuItem || data?.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteMenuItem(itemId: string) {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    await axios.delete(`${API_BASE_URL}/menu/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
