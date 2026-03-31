import type { User } from "@/components/UserDashboard/data";
import { apiRequest, getErrorMessage } from "@/lib/api-client";

interface ApiUser {
  _id?: string;
  id?: string;
  userName?: string;
  email?: string;
  role?: string;
  gender?: string;
  country?: string;
  phoneNumber?: string;
  isConfirmed?: boolean;
  image?: string | { secure_url?: string };
  createdAt?: string;
  updatedAt?: string;
}

function mapApiUser(raw: ApiUser): User {
  const image =
    typeof raw.image === "string"
      ? raw.image
      : raw.image?.secure_url ?? "";

  return {
    id: raw._id ?? raw.id ?? "",
    userName: raw.userName ?? "",
    email: raw.email ?? "",
    role: (raw.role as User["role"]) ?? "user",
    gender: (raw.gender as User["gender"]) ?? "male",
    country: raw.country ?? "",
    phoneNumber: raw.phoneNumber ?? "",
    isConfirmed: Boolean(raw.isConfirmed),
    image,
    createdAt: raw.createdAt?.slice(0, 10) ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractUsers(data: any): User[] {
  // Handle array of users: { data: { users: [...] } }
  if (Array.isArray(data?.data?.users)) {
    return data.data.users.map(mapApiUser);
  }
  // Handle array at root: { users: [...] }
  if (Array.isArray(data?.users)) {
    return data.users.map(mapApiUser);
  }
  // Handle raw array
  if (Array.isArray(data)) {
    return data.map(mapApiUser);
  }
  // Handle single user: { data: { user: {...} } }
  if (data?.data?.user && typeof data.data.user === "object") {
    return [mapApiUser(data.data.user)];
  }
  // Handle single user at root: { user: {...} }
  if (data?.user && typeof data.user === "object") {
    return [mapApiUser(data.user)];
  }
  return [];
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const data = await apiRequest("/api/user");
    return extractUsers(data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createUser(
  user: Omit<User, "id"> & { password?: string; confirmPassword?: string }
): Promise<User> {
  try {
    const data = await apiRequest("/api/user", {
      method: "POST",
      body: {
        userName: user.userName,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
        country: user.country,
        phoneNumber: user.phoneNumber,
      },
    });

    // Try to extract the created user from the response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (data as any)?.data?.user ?? (data as any)?.user ?? data;
    if (raw && typeof raw === "object" && (raw._id || raw.id)) {
      return mapApiUser(raw as ApiUser);
    }

    // Fallback: build user from form data
    return {
      id: crypto.randomUUID(),
      userName: user.userName ?? "",
      email: user.email ?? "",
      role: user.role ?? "user",
      gender: user.gender ?? "male",
      country: user.country ?? "",
      phoneNumber: user.phoneNumber ?? "",
      isConfirmed: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateUser(user: User): Promise<User> {
  try {
    const data = await apiRequest<{ data?: { user?: ApiUser }; user?: ApiUser }>(
      `/api/user/${user.id}`,
      {
        method: "PATCH",
        body: {
          userName: user.userName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          country: user.country,
          phoneNumber: user.phoneNumber,
        },
      }
    );
    const updated = data?.data?.user ?? data?.user;
    if (!updated) {
      throw new Error("User data is missing from the server response.");
    }
    return mapApiUser(updated);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await apiRequest(`/api/user/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
