export type UserRole = "admin" | "member";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  gender?: string;
  passwordHash?: string;
  avatar?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  status: "active" | "inactive";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
