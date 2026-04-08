import type { User } from "@/components/UserDashboard/data";
import { apiRequest, getErrorMessage } from "@/lib/api-client";

interface ApiUser {
  _id?: string;
  id?: string;
  userName: string;
  email: string;
  role: User["role"];
  gender: User["gender"];
  country: string;
  phoneNumber?: string;
  isConfirmed?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiUser(user: ApiUser): User {
  return {
    id: user._id ?? user.id ?? "",
    userName: user.userName,
    email: user.email,
    role: user.role ?? "user",
    gender: user.gender ?? "male",
    country: user.country ?? "",
    phoneNumber: user.phoneNumber ?? "",
    isConfirmed: Boolean(user.isConfirmed),
    image: user.image ?? "",
    createdAt: user.createdAt?.slice(0, 10) ?? "",
    updatedAt: user.updatedAt?.slice(0, 10) ?? "",
  };
}

function buildUserPayload(user: User) {
  if (user.imageFile) {
    const formData = new FormData();
    formData.append("userName", user.userName);
    formData.append("email", user.email);
    formData.append("role", user.role);
    formData.append("gender", user.gender);
    formData.append("country", user.country);
    formData.append("phoneNumber", user.phoneNumber ?? "");
    formData.append("isConfirmed", String(user.isConfirmed));
    formData.append("password", user.password ?? "");
    formData.append("image", user.imageFile);

    return formData;
  }

  return {
    userName: user.userName,
    email: user.email,
    role: user.role,
    gender: user.gender,
    country: user.country,
    phoneNumber: user.phoneNumber ?? "",
    isConfirmed: user.isConfirmed,
    image: user.image ?? "",
    password: user.password ?? "",
  };
}

function buildUserUpdatePayload(user: User) {
  return {
    role: user.role,
    isConfirmed: user.isConfirmed,
  };
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const data = await apiRequest<{ data?: { users?: ApiUser[] } }>("/api/users", {
      params: { page: 1, limit: 1000 },
    });
    const users = data?.data?.users ?? [];
    return Array.isArray(users) ? users.map(mapApiUser) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export type UsersListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  gender?: string;
  isConfirmed?: string;
  sort?: "newest" | "oldest" | "userName_asc" | "userName_desc";
};

export async function fetchUsersPage(params: UsersListQuery = {}) {
  try {
    const data = await apiRequest<{
      data?: {
        users?: ApiUser[];
        pagination?: { page?: number; limit?: number; total?: number; totalPages?: number };
      };
    }>("/api/users", { params });
    const users = data?.data?.users ?? [];
    const pg = data?.data?.pagination ?? {};
    return {
      items: Array.isArray(users) ? users.map(mapApiUser) : [],
      pagination: {
        page: Number(pg.page ?? params.page ?? 1),
        limit: Number(pg.limit ?? params.limit ?? 10),
        total: Number(pg.total ?? 0),
        totalPages: Number(pg.totalPages ?? 1),
      },
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createUser(user: User): Promise<User[]> {
  try {
    await apiRequest("/api/users", {
      method: "POST",
      body: buildUserPayload(user),
    });
    return fetchUsers();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateUser(user: User): Promise<User> {
  try {
    const data = await apiRequest<{ data?: { user?: ApiUser } }>(`/api/users/${user.id}`, {
      method: "PATCH",
      body: buildUserUpdatePayload(user),
    });

    const updatedUser = data?.data?.user;
    if (!updatedUser) {
      throw new Error("User data is missing from the server response.");
    }

    return mapApiUser(updatedUser);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await apiRequest(`/api/users/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
