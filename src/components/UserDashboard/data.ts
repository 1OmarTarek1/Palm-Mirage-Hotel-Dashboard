export interface User {
  id: string;
  userName: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  gender: "male" | "female";
  country: string;
  phoneNumber?: string;
  isConfirmed: boolean;
  image?: string;
  imageFile?: File | null;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyUserDraft(): User {
  return {
    id: "",
    userName: "",
    email: "",
    password: "",
    role: "user",
    gender: "male",
    country: "",
    isConfirmed: false,
  };
}
