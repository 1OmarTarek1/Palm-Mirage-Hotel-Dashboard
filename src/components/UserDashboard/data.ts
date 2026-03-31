export interface User {
  id: string;
  userName: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  country: string;
  phoneNumber?: string;
  isConfirmed: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyUserDraft(): User {
  return {
    id: "",
    userName: "",
    email: "",
    role: "user",
    gender: "male",
    country: "",
    isConfirmed: false,
  };
}
