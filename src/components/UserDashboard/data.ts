export interface User {
  id: string;
  userName: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  country: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
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
    password: "",
    confirmPassword: "",
    role: "user",
    gender: "male",
    country: "",
    phoneNumber: "",
    isConfirmed: false,
  };
}
