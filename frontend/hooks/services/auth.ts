// hooks/services/auth.ts
import { LoginFormData, SignupFormData } from "@/types/common";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (data: LoginFormData) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const signupUser = async (data: SignupFormData) => {
  const response = await axios.post(
    `${API_URL}/auth/signup`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};
