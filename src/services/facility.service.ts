import axios from "axios";
import { Facility } from "@/types/facility";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const fetchFacilities = async (): Promise<Facility[]> => {
  try {
    const response = await api.get("/facilities");
    const data = response.data.data?.facilities || response.data.facilities || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
};

export const createFacility = async (facility: Omit<Facility, "id" | "createdAt" | "updatedAt">): Promise<Facility[]> => {
  await api.post("/facilities", facility);
  return fetchFacilities();
};

export const updateFacility = async (id: string, facility: Partial<Facility>): Promise<Facility> => {
  const response = await api.patch(`/facilities/${id}`, facility);
  return response.data.data?.facility || response.data.facility || response.data;
};

export const deleteFacility = async (id: string): Promise<void> => {
  await api.delete(`/facilities/${id}`);
};

export const facilityService = {
  fetchFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
};
