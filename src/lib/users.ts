import axios from "axios";
import type { User } from "@/components/UserDashboard/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get("/user");
  const data = response.data.data?.users || response.data.users || response.data;
  return Array.isArray(data) ? data : [];
};

export const createUser = async (user: Omit<User, "id">): Promise<User[]> => {
  await api.post("/user", user);
  return fetchUsers();
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await api.patch(`/user/${user.id}`, user);
  // Assuming the backend returns { data: { user: {...} } } or similar
  return response.data.data?.user || response.data.user || response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/user/${id}`);
};
