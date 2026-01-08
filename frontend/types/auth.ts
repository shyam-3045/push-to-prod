// Authentication types

export interface User {
  id: string;
  name: string;
  role: "FARMER" | "RETAILER" | "TRANSPORTER";
}

export interface LoginResponse {
  status: string;
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}