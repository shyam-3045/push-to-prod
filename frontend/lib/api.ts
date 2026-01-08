// API client utilities for connecting to backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface ApiError {
  message: string;
  status?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== "undefined" 
      ? localStorage.getItem("token") 
      : null;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(errorData.message || "An error occurred");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{
      status: string;
      token: string;
      user: {
        id: string;
        name: string;
        role: string;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>("/health");
  }

  // Farmer endpoints
  async getFarmerDashboard() {
    return this.request<{ message: string }>("/farmer/dashboard");
  }

  // Retailer endpoints
  async getRetailerDashboard() {
    return this.request<{ message: string }>("/retailer/dashboard");
  }

  // Transporter endpoints
  async getTransporterDashboard() {
    return this.request<{ message: string }>("/transporter/dashboard");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to save token
export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

// Helper function to get token
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper function to remove token
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

// Helper function to decode token (basic implementation)
export const getUserFromToken = (): { id: string; role: string } | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
};