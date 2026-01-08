"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, saveToken, removeToken, getUserFromToken } from "@/lib/api";
import { AuthContextType, User } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const existingToken = typeof window !== "undefined" 
      ? localStorage.getItem("token") 
      : null;
    
    if (existingToken) {
      setToken(existingToken);
      const userData = getUserFromToken();
      // You might want to fetch full user data from backend
      // For now, we'll just use the token data
      if (userData) {
        // Since we only have id and role from token, we'll need to fetch full user data
        // For now, we'll set a minimal user object
        setUser({
          id: userData.id,
          name: "",
          role: userData.role as "FARMER" | "RETAILER" | "TRANSPORTER",
        });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      saveToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};