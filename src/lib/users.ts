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

export async function fetchUsers(): Promise<User[]> {
  try {
    const data = await apiRequest<{ data?: { users?: ApiUser[] } }>("/api/users");
    const users = data?.data?.users ?? [];
    return Array.isArray(users) ? users.map(mapApiUser) : [];
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
      body: buildUserPayload(user),
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
